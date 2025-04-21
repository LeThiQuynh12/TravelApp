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

// Hàm tính thời gian bay
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
  const [flights, setFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState('price');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
  const [isReturnTrip, setIsReturnTrip] = useState(false);

  // Lấy searchParams từ route.params
  const { searchParams } = route.params || {};
  const {
    from,
    to,
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
      if (!from || !to || !departureDate) {
        console.log('Thiếu tham số tìm kiếm:', { from, to, departureDate });
        return;
      }

      setIsLoading(true);
      try {
        const flightData = await searchFlights({
          from,
          to,
          departureDate,
          isRoundTrip,
          returnDate,
        });

        const outboundFlights = [];
        const returnFlightsData = [];

        flightData.forEach((item) => {
          if (item.outbound) {
            outboundFlights.push({
              ...item.outbound,
              id: item.outbound._id,
            });
          }
          if (item.return) {
            returnFlightsData.push({
              ...item.return,
              id: item.return._id,
            });
          }
        });

        setFlights(outboundFlights);
        setReturnFlights(returnFlightsData);
      } catch (error) {
        // console.error('Lỗi khi lấy chuyến bay:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, [from, to, departureDate, returnDate, isRoundTrip]);

  // Hàm chuyển đổi thời gian sang phút để so sánh
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Hàm chuyển đổi giá sang số để so sánh
  const priceToNumber = (price) => {
    return parseFloat(price.replace(/[^\d]/g, ''));
  };

  // Hàm sắp xếp chuyến bay
  const sortFlights = (option, isReturn = false) => {
    const targetFlights = isReturn ? [...returnFlights] : [...flights];
    switch (option) {
      case 'price':
        targetFlights.sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));
        break;
      case 'latestDeparture':
        targetFlights.sort((a, b) => timeToMinutes(b.departureTime) - timeToMinutes(a.departureTime));
        break;
      case 'earliestDeparture':
        targetFlights.sort((a, b) => timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime));
        break;
      case 'earliestArrival':
        targetFlights.sort((a, b) => timeToMinutes(a.arrivalTime) - timeToMinutes(b.arrivalTime));
        break;
      case 'latestArrival':
        targetFlights.sort((a, b) => timeToMinutes(b.arrivalTime) - timeToMinutes(a.arrivalTime));
        break;
      default:
        break;
    }
    if (isReturn) {
      setReturnFlights(targetFlights);
    } else {
      setFlights(targetFlights);
    }
    setSortOption(option);
    setModalVisible(false);
  };

  // Xử lý khi nhấn nút Chọn
  const handleSelectFlight = (flight, isReturn = false) => {
    if (isReturn) {
      // Đang chọn chuyến về (chỉ xảy ra nếu isRoundTrip: true)
      setSelectedReturnFlight(flight);
      navigation.navigate('AirDetail', {
        departureFlight: selectedFlight,
        returnFlight: flight,
        adults,
        children,
        infants,
      });
    } else {
      // Đang chọn chuyến đi
      setSelectedFlight(flight);
      if (isRoundTrip) {
        // Nếu là chuyến khứ hồi, chuyển sang bước chọn chuyến về
        setIsReturnTrip(true);
      } else {
        // Nếu là chuyến một chiều, điều hướng ngay sang AirDetail
        navigation.navigate('AirDetail', {
          departureFlight: flight,
          returnFlight: null, // Không có chuyến về
          adults,
          children,
          infants,
        });
      }
    }
  };

  // Xử lý hủy lựa chọn
  const handleChangeFlight = (isReturn = false) => {
    if (isReturn) {
      setSelectedReturnFlight(null);
    } else {
      setSelectedFlight(null);
      setSelectedReturnFlight(null);
      setIsReturnTrip(false);
    }
  };

  // Nếu isReturn là false thì render chuyến đi
  // Nếu isReturn là true thì render chuyến về
  const renderFlightItem = ({ item, isReturn = false }) => {
    const duration = calculateFlightDuration(item.departureTime, item.arrivalTime);
    const isSelected = isReturn
      ? selectedReturnFlight && selectedReturnFlight.id === item.id
      : selectedFlight && selectedFlight.id === item.id;
    return (
      <View style={styles.flightItem}>
        <View style={styles.mainRow}>
          <View style={styles.timeRow}>
            <View>
              <Text style={styles.timeText}>{item.departureTime}</Text>
              <Text style={styles.cityText}>{item.departureCity}</Text>
            </View>
            <View style={styles.durationContainer}>
              <Text style={styles.durationText}>{duration}</Text>
              <Text style={styles.directText}>Bay thẳng</Text>
            </View>
            <View>
              <Text style={styles.timeText}>{item.arrivalTime}</Text>
              <Text style={styles.cityText}>{item.arrivalCity}</Text>
            </View>
          </View>
          <View style={styles.priceButtonContainer}>
            <Text style={styles.priceText}>{item.price}</Text>
            <TouchableOpacity
              style={[styles.selectButton, isSelected && styles.selectedButton]}
              onPress={() => handleSelectFlight(item, isReturn)}
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

  const renderSelectedCard = () => {
    if (!selectedFlight && !selectedReturnFlight) return null;
    return (
      <View style={styles.selectedCard}>
        {selectedFlight && (
          <View style={styles.selectionDetails}>
            <Text style={styles.selectionHeader}>Chuyến đi</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.selectionText}>
                {selectedFlight.departureName} → {selectedFlight.arrivalName}
              </Text>
              <Text style={styles.selectionText}>
                {selectedFlight.departureTime} - {selectedFlight.arrivalTime} (
                {calculateFlightDuration(selectedFlight.departureTime, selectedFlight.arrivalTime)})
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.selectionText}>{selectedFlight.airline}</Text>
              <Text style={styles.selectionText}>{selectedFlight.price}</Text>
            </View>
            <TouchableOpacity onPress={() => handleChangeFlight(false)}>
              <Text style={styles.changeButtonText}>Thay đổi chuyến đi</Text>
            </TouchableOpacity>
          </View>
        )}
        {selectedReturnFlight && (
          <View style={styles.selectionDetails}>
            <Text style={styles.selectionHeader}>Chuyến về</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.selectionText}>
                {selectedReturnFlight.departureName} → {selectedReturnFlight.arrivalName}
              </Text>
              <Text style={styles.selectionText}>
                {selectedReturnFlight.departureTime} - {selectedReturnFlight.arrivalTime} (
                {calculateFlightDuration(
                  selectedReturnFlight.departureTime,
                  selectedReturnFlight.arrivalTime
                )})
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.selectionText}>{selectedReturnFlight.airline}</Text>
              <Text style={styles.selectionText}>{selectedReturnFlight.price}</Text>
            </View>
            <TouchableOpacity onPress={() => handleChangeFlight(true)}>
              <Text style={styles.changeButtonText}>Thay đổi chuyến về</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const routeTitle = departureDisplay && destinationDisplay
    ? `${departureDisplay} → ${destinationDisplay}`
    : 'Chọn chuyến bay';

  return (
    <View style={styles.container}>
      <AppBar
        title={routeTitle}
        color={COLORS.white}
        top={50}
        left={10}
        right={10}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.header}>
        <Text style={styles.tripInfo}>
          {departureDate}, {adults + children + infants || 2} khách, {isRoundTrip ? 'Khứ hồi' : 'Một chiều'}
        </Text>
      </View>
      <View style={styles.textChooise}>
        <ReusableText
          text={isReturnTrip ? 'Chọn chuyến về' : 'Chọn chuyến đi'}
          family="regular"
          size={TEXT.medium + 2}
          color={COLORS.black}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="filter" size={24} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

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
              onPress={() => sortFlights('price', isReturnTrip)}
            >
              <Text style={styles.modalOptionText}>Giá thấp nhất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => sortFlights('earliestDeparture', isReturnTrip)}
            >
              <Text style={styles.modalOptionText}>Chuyến sớm nhất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => sortFlights('latestDeparture', isReturnTrip)}
            >
              <Text style={styles.modalOptionText}>Chuyến muộn nhất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => sortFlights('earliestArrival', isReturnTrip)}
            >
              <Text style={styles.modalOptionText}>Hạ cánh sớm nhất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => sortFlights('latestArrival', isReturnTrip)}
            >
              <Text style={styles.modalOptionText}>Hạ cánh muộn nhất</Text>
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
      ) : flights.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Image
            source={{ uri: 'https://cdni.iconscout.com/illustration/premium/thumb/sorry-item-not-found-3328225-2809510.png' }}
            style={styles.noResultsImage}
          />
          <Text style={styles.noResultsText}>Không tìm thấy chuyến đi</Text>
        </View>
      ) : isReturnTrip && returnFlights.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Image
            source={{ uri: 'https://cdni.iconscout.com/illustration/premium/thumb/sorry-item-not-found-3328225-2809510.png' }}
            style={styles.noResultsImage}
          />
          <Text style={styles.noResultsText}>Không tìm thấy chuyến về</Text>
        </View>
      ) : (
        <FlatList
          data={isReturnTrip ? returnFlights : flights}
          renderItem={({ item }) => renderFlightItem({ item, isReturn: isReturnTrip })}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderSelectedCard}
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
    fontSize: TEXT.medium,
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
    paddingRight: -15,
    marginBottom: -27,
  },
  priceText: {
    fontSize: TEXT.medium,
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