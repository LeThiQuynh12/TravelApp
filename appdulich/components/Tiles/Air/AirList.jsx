import React, {
  useEffect,
  useState,
} from 'react';

import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  COLORS,
  TEXT,
} from '../../../constants/theme';
import { searchFlights } from '../../../services/api';
import AppBar from '../../Reusable/AppBar';
import ReusableText from '../../Reusable/ReusableText';

const calculateFlightDuration = (departureTime, arrivalTime) => {
  const [depHours, depMinutes] = departureTime.split(':').map(Number);
  const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);

  const depTotalMinutes = depHours * 60 + depMinutes;
  const arrTotalMinutes = arrHours * 60 + arrMinutes;

  let diffMinutes = arrTotalMinutes - depTotalMinutes;
  if (diffMinutes < 0) diffMinutes += 24 * 60;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours}h${minutes}`;
};

const AirList = ({ navigation, route }) => {
  const [outboundFlights, setOutboundFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState('price');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOutboundFlight, setSelectedOutboundFlight] = useState(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
  const [currentView, setCurrentView] = useState('outbound'); // 'outbound' or 'return'

  const { searchParams } = route.params || {};
  const {
    departureCity,
    arrivalCity,
    departureDate,
    returnDate,
    isRoundTrip,
    adults = 0,
    children = 0,
    infants = 0,
    departureDisplay,
    destinationDisplay,
  } = searchParams || {};

  useEffect(() => {
    const fetchFlights = async () => {
      if (!departureCity || !arrivalCity || !departureDate) {
        console.log('Missing search parameters:', { departureCity, arrivalCity, departureDate });
        return;
      }
    
      setIsLoading(true);
      try {
        const flightData = await searchFlights({
          departureCity,
          arrivalCity,
          departureDate,
          isRoundTrip: isRoundTrip || false,
          returnDate: isRoundTrip ? returnDate : null,
        });
    
        console.log('Flight data received:', flightData);
    
        if (flightData.status && Array.isArray(flightData.data)) {
          if (isRoundTrip) {
            // Lọc các chuyến đi duy nhất bằng cách sử dụng Set
            const uniqueOutboundFlights = [];
            const seenIds = new Set();
            
            flightData.data.forEach(item => {
              const outbound = item.flights[0];
              if (!seenIds.has(outbound._id)) {
                seenIds.add(outbound._id);
                uniqueOutboundFlights.push(outbound);
              }
            });
            
            setOutboundFlights(uniqueOutboundFlights);
          } else {
            // Đối với chuyến một chiều, chỉ cần lấy tất cả chuyến bay
            const oneWayFlights = flightData.data.map(item => item.flights[0]);
            setOutboundFlights(oneWayFlights);
          }
        } else {
          console.log('No flights found:', flightData.message);
          setOutboundFlights([]);
        }
      } catch (error) {
        console.error('Error fetching flights:', error);
        alert(error.message);
        setOutboundFlights([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, [departureCity, arrivalCity, departureDate, returnDate, isRoundTrip]);

  const fetchReturnFlights = async (selectedOutbound) => {
    if (!isRoundTrip || !returnDate) return;

    setIsLoading(true);
    try {
      const flightData = await searchFlights({
        departureCity: arrivalCity,
        arrivalCity: departureCity,
        departureDate: returnDate,
        isRoundTrip: false,
      });

      if (flightData.status && Array.isArray(flightData.data)) {
        const returns = flightData.data.map(item => item.flights[0]);
        setReturnFlights(returns);
        setCurrentView('return');
      }
    } catch (error) {
      console.error('Error fetching return flights:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const priceToNumber = (price) => {
    return parseFloat(price.replace(/[^\d,.]/g, '').replace(',', '.'));
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const sortFlights = (option, flightsArray) => {
    const sortedFlights = [...flightsArray];
    switch (option) {
      case 'price':
        sortedFlights.sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));
        break;
      case 'latestDeparture':
        sortedFlights.sort((a, b) => timeToMinutes(b.departureTime) - timeToMinutes(a.departureTime));
        break;
      case 'earliestDeparture':
        sortedFlights.sort((a, b) => timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime));
        break;
      case 'earliestArrival':
        sortedFlights.sort((a, b) => timeToMinutes(a.arrivalTime) - timeToMinutes(b.arrivalTime));
        break;
      case 'latestArrival':
        sortedFlights.sort((a, b) => timeToMinutes(b.arrivalTime) - timeToMinutes(a.arrivalTime));
        break;
      default:
        break;
    }
    return sortedFlights;
  };

  const handleSelectOutbound = (flight) => {
    if (isRoundTrip) {
      setSelectedOutboundFlight(flight);
      fetchReturnFlights(flight);
    } else {
      navigation.navigate('AirDetail', {
        departureFlight: flight,
        returnFlight: null,
        adults,
        children,
        infants,
      });
    }
  };

  const handleSelectReturn = (flight) => {
    setSelectedReturnFlight(flight);
    navigation.navigate('AirDetail', {
      departureFlight: selectedOutboundFlight,
      returnFlight: flight,
      adults,
      children,
      infants,
    });
  };

  const handleGoBackToOutbound = () => {
    setCurrentView('outbound');
    setSelectedOutboundFlight(null);
  };

  const renderFlightItem = ({ item }) => {
    const isOutboundView = currentView === 'outbound';
    const isSelected = isOutboundView 
      ? selectedOutboundFlight?._id === item._id
      : selectedReturnFlight?._id === item._id;

    return (
      <View style={styles.flightItem}>
        <View style={styles.mainRow}>
          <View style={styles.timeRow}>
            <View>
              <Text style={styles.timeText}>{item.departureTime}</Text>
              <Text style={styles.cityText}>{isOutboundView ? item.departureCity : item.arrivalCity}</Text>
            </View>
            <View style={styles.durationContainer}>
              <Text style={styles.durationText}>
                {calculateFlightDuration(item.departureTime, item.arrivalTime)}
              </Text>
              <Text style={styles.directText}>Bay thẳng</Text>
            </View>
            <View>
              <Text style={styles.timeText}>{item.arrivalTime}</Text>
              <Text style={styles.cityText}>{isOutboundView ? item.arrivalCity : item.departureCity}</Text>
            </View>
          </View>
          <View style={styles.priceButtonContainer}>
            <Text style={styles.priceText}>{item.price} VNĐ</Text>
            <TouchableOpacity
              style={[styles.selectButton, isSelected && styles.selectedButton]}
              onPress={() => isOutboundView ? handleSelectOutbound(item) : handleSelectReturn(item)}
              disabled={isSelected}
            >
              <Text style={styles.selectButtonText}>
                {isSelected ? 'Đã chọn' : 'Chọn'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.detailsRow}>
          <Image source={{ uri: item.logo }} style={styles.airlineLogo} />
          <View style={styles.airlineInfo}>
            <Text style={styles.airlineText}>{item.airline}</Text>
            <Text style={styles.ticketType}>{item.ticketType}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    const routeTitle = departureDisplay && destinationDisplay
      ? `${departureDisplay} → ${destinationDisplay}`
      : 'Chọn chuyến bay';

    return (
      <>
        <AppBar
          title={routeTitle}
          color={COLORS.white}
          top={50}
          left={10}
          right={10}
          onPress={() => currentView === 'return' ? handleGoBackToOutbound() : navigation.goBack()}
        />
        <View style={styles.header}>
          <Text style={styles.tripInfo}>
            {currentView === 'outbound' ? departureDate : returnDate}, 
            {adults + children + infants || 2} khách, 
            {isRoundTrip ? 'Khứ hồi' : 'Một chiều'}
          </Text>
          {currentView === 'return' && selectedOutboundFlight && (
            <View style={styles.selectedOutboundInfo}>
              <Text style={styles.selectedFlightText}>
                Chuyến đi: {selectedOutboundFlight.departureTime} - {selectedOutboundFlight.arrivalTime}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.textChooise}>
          <ReusableText
            text={currentView === 'outbound' ? "Chọn chuyến đi" : "Chọn chuyến về"}
            family="regular"
            size={TEXT.medium + 2}
            color={COLORS.black}
          />
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="filter" size={24} color={COLORS.dark} />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const currentFlights = currentView === 'outbound' 
    ? sortFlights(sortOption, outboundFlights)
    : sortFlights(sortOption, returnFlights);

  return (
    <View style={styles.container}>
      {renderHeader()}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Sắp xếp theo</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setSortOption('price');
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>Giá thấp nhất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setSortOption('earliestDeparture');
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>Chuyến sớm nhất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setSortOption('latestDeparture');
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>Chuyến muộn nhất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isLoading ? (
        <Text style={styles.loadingText}>Đang tải...</Text>
      ) : currentFlights.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Image
            source={{ uri: 'https://cdni.iconscout.com/illustration/premium/thumb/sorry-item-not-found-3328225-2809510.png' }}
            style={styles.noResultsImage}
          />
          <Text style={styles.noResultsText}>Không tìm thấy chuyến bay</Text>
        </View>
      ) : (
        <FlatList
          data={currentFlights}
          renderItem={renderFlightItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default AirList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 90,
    paddingVertical: 10,
    marginTop: 80,
  },
  tripInfo: {
    fontSize: TEXT.medium,
    color: COLORS.lightBlue,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  flightItem: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeText: {
    fontSize: TEXT.medium-2,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  durationContainer: {
    alignItems: 'center',
    marginHorizontal: 23,
    paddingVertical: 10,
  },
  durationText: {
    fontSize: TEXT.small,
    color: COLORS.gray,
    marginBottom: 5,
  },
  directText: {
    fontSize: TEXT.xSmall - 1,
    color: COLORS.gray,
    borderTopWidth: 1,
    borderTopColor: COLORS.black,
    paddingTop: 5,
  },
  cityText: {
    fontSize: TEXT.medium - 4,
    color: COLORS.gray,
    marginTop: 5,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    textAlign: 'center',
  },
  priceButtonContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  priceText: {
    fontSize: TEXT.medium-1.2,
    fontWeight: 'bold',
    color: COLORS.blue,
    marginBottom: 5,
  },
  selectButton: {
    backgroundColor: COLORS.lightGreen,
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: COLORS.gray,
  },
  selectButtonText: {
    color: COLORS.white,
    fontSize: TEXT.small,
    fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  airlineLogo: {
    width: 74,
    height: 30,
    marginRight: 10,
  },
  airlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  airlineText: {
    fontSize: TEXT.medium,
    color: COLORS.dark,
    marginRight: 10,
  },
  ticketType: {
    fontSize: TEXT.xSmall,
    color: COLORS.lightRed,
    borderBottomColor: COLORS.lightRed,
    borderBottomWidth: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: TEXT.medium,
    color: COLORS.gray,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noResultsImage: {
    width: 450,
    height: 250,
    marginBottom: 200,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: TEXT.medium,
    color: COLORS.gray,
  },
  textChooise: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: TEXT.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 20,
  },
  modalOption: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: TEXT.medium,
    color: COLORS.dark,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: COLORS.lightGrey,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    fontSize: TEXT.medium,
    color: COLORS.dark,
    fontWeight: 'bold',
  },
  selectedCard: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  selectionDetails: {
    marginBottom: 15,
    borderBottomColor: COLORS.lightGrey,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  selectionHeader: {
    fontSize: TEXT.medium + 2,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 10,
  },
  selectionText: {
    fontSize: TEXT.medium,
    color: COLORS.dark,
    marginBottom: 5,
  },
  changeButtonText: {
    color: COLORS.red,
    fontSize: TEXT.medium,
  },
});