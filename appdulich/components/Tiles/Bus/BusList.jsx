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

import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  COLORS,
  SIZES,
  TEXT,
} from '../../../constants/theme';
import { searchBuses } from '../../../services/api';
import AppBar from '../../Reusable/AppBar';
import ReusableText from '../../Reusable/ReusableText';

const calculateDuration = (departureTime, arrivalTime) => {
  if (!departureTime || !arrivalTime) return 'N/A';
  try {
    const [depHours, depMinutes] = departureTime.split(':').map(Number);
    const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);

    const depTotalMinutes = depHours * 60 + depMinutes;
    const arrTotalMinutes = arrHours * 60 + arrMinutes;

    let diffMinutes = arrTotalMinutes - depTotalMinutes;
    if (diffMinutes < 0) diffMinutes += 24 * 60;

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h${minutes > 0 ? `${minutes}m` : ''}`;
  } catch {
    return 'N/A';
  }
};

const BusList = ({ navigation, route }) => {
  const [outboundBuses, setOutboundBuses] = useState([]);
  const [returnBuses, setReturnBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState('price');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOutboundBus, setSelectedOutboundBus] = useState(null);
  const [selectedReturnBus, setSelectedReturnBus] = useState(null);
  const [currentView, setCurrentView] = useState('outbound');
  const [error, setError] = useState(null);

  const { searchParams = {} } = route.params || {};
  const { 
    isRoundTrip = false, 
    numberOfSeats = 1,
    departureCity,
    arrivalCity,
    outboundDate,
    returnDate,
    departureDisplay,
    destinationDisplay
  } = searchParams;

  const amenityIcons = {
    'Wi-Fi': <Ionicons name="wifi" size={20} color={COLORS.gray} />,
    Chăn: <MaterialCommunityIcons name="bed-outline" size={20} color={COLORS.gray} />,
    'Điều hòa': <Ionicons name="snow" size={20} color={COLORS.gray} />,
    Sạc: <FontAwesome5 name="charging-station" size={20} color={COLORS.gray} />,
  };

  useEffect(() => {
    const fetchBuses = async () => {
      if (!departureCity || !arrivalCity || !outboundDate) {
        setError('Thiếu thông tin tìm kiếm');
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await searchBuses({
          departureCity,
          arrivalCity,
          outboundDate,
          isRoundTrip,
          returnDate: isRoundTrip ? returnDate : undefined,
        });

        console.log('API Response:', response); // Log response để debug

        if (!response || !Array.isArray(response)) {
          throw new Error('Dữ liệu trả về không hợp lệ');
        }

        // Xử lý dữ liệu từ backend
        if (isRoundTrip) {
          // Lấy các chuyến đi duy nhất
          const uniqueOutbound = [];
          const seenIds = new Set();
          
          response.forEach(group => {
            const bus = group.buses[0];
            if (bus && !seenIds.has(bus._id)) {
              seenIds.add(bus._id);
              uniqueOutbound.push({
                ...bus,
                id: bus._id,
              });
            }
          });
          
          setOutboundBuses(uniqueOutbound);
        } else {
          // Chuyến một chiều
          const buses = response.map(group => ({
            ...group.buses[0],
            id: group.buses[0]._id,
          }));
          setOutboundBuses(buses);
        }
      } catch (err) {
        console.error('Fetch buses error:', err);
        setError(err.message || 'Lỗi khi tải dữ liệu xe khách');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuses();
  }, [departureCity, arrivalCity, outboundDate, isRoundTrip, returnDate]);

  const fetchReturnBuses = async () => {
    if (!isRoundTrip || !returnDate) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await searchBuses({
        departureCity: arrivalCity,
        arrivalCity: departureCity,
        outboundDate: returnDate,
        isRoundTrip: false,
      });

      if (!response || !Array.isArray(response)) {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }

      const returns = response.map(group => ({
        ...group.buses[0],
        id: group.buses[0]._id,
      }));
      
      setReturnBuses(returns);
      setCurrentView('return');
    } catch (err) {
      console.error('Fetch return buses error:', err);
      setError(err.message || 'Lỗi khi tải chuyến về');
    } finally {
      setIsLoading(false);
    }
  };

  // Các hàm helper và render giữ nguyên như trước
  const timeToMinutes = (time) => {
    if (!time) return 0;
    try {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    } catch {
      return 0;
    }
  };

  const priceToNumber = (price) => {
    if (!price) return 0;
    try {
      return parseFloat(price.replace(/[^\d,.]/g, '').replace(',', '.'));
    } catch {
      return 0;
    }
  };

  const sortBuses = (option) => {
    const targetBuses = currentView === 'outbound' ? [...outboundBuses] : [...returnBuses];
    
    switch (option) {
      case 'price':
        targetBuses.sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));
        break;
      case 'earliestDeparture':
        targetBuses.sort((a, b) => timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime));
        break;
      case 'latestDeparture':
        targetBuses.sort((a, b) => timeToMinutes(b.departureTime) - timeToMinutes(a.departureTime));
        break;
      case 'earliestArrival':
        targetBuses.sort((a, b) => timeToMinutes(a.arrivalTime) - timeToMinutes(b.arrivalTime));
        break;
      case 'latestArrival':
        targetBuses.sort((a, b) => timeToMinutes(b.arrivalTime) - timeToMinutes(a.arrivalTime));
        break;
      default:
        break;
    }

    if (currentView === 'outbound') {
      setOutboundBuses(targetBuses);
    } else {
      setReturnBuses(targetBuses);
    }
    setSortOption(option);
    setModalVisible(false);
  };

  const handleSelectOutbound = (bus) => {
    if (isRoundTrip) {
      setSelectedOutboundBus(bus);
      fetchReturnBuses();
    } else {
      navigation.navigate('BusDetail', {
        departureBus: bus,
        numberOfSeats,
      });
    }
  };

  const handleSelectReturn = (bus) => {
    setSelectedReturnBus(bus);
    navigation.navigate('BusDetail', {
      departureBus: selectedOutboundBus,
      returnBus: bus,
      numberOfSeats,
    });
  };

  const handleGoBackToOutbound = () => {
    setCurrentView('outbound');
  };

  const renderBusItem = ({ item }) => {
    const duration = calculateDuration(item.departureTime, item.arrivalTime);
    const isSelected = currentView === 'outbound'
      ? selectedOutboundBus?.id === item.id
      : selectedReturnBus?.id === item.id;

    return (
      <View style={styles.busItem}>
        <Text style={styles.busCompany}>{item.busCompany || 'N/A'}</Text>
        <View style={styles.mainRow}>
          <View style={styles.timeRow}>
            <View>
              <Text style={styles.timeText}>{item.departureTime || 'N/A'}</Text>
              <Text style={styles.cityText}>
                {currentView === 'outbound' ? item.departureCity : item.arrivalCity}
              </Text>
              <Text style={styles.locationText}>Đón: {item.pickup || 'N/A'}</Text>
            </View>
            <View style={styles.durationContainer}>
              <Text style={styles.durationText}>{duration}</Text>
              <Text style={styles.directText}>Trực tiếp</Text>
            </View>
            <View>
              <Text style={styles.timeText}>{item.arrivalTime || 'N/A'}</Text>
              <Text style={styles.cityText}>
                {currentView === 'outbound' ? item.arrivalCity : item.departureCity}
              </Text>
              <Text style={styles.locationText}>Trả: {item.dropoff || 'N/A'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.detailsRow}>
          <Image source={{ uri: item.logo || 'https://via.placeholder.com/50' }} style={styles.busLogo} />
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <View style={styles.busInfo}>
              <Text style={styles.ticketType}>- {item.ticketType || 'N/A'}</Text>
              <Text style={styles.ticketType}>- {item.seats || 0} chỗ</Text>
            </View>
            <View style={styles.amenities}>
              {item.amenities?.map((amenity, index) => (
                <View key={index} style={{ marginRight: SIZES.xSmall, alignItems: 'center' }}>
                  {amenityIcons[amenity] || <Ionicons name="information-circle" size={20} color={COLORS.gray} />}
                  <Text style={{ fontSize: 7.3, color: COLORS.gray }}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.priceButtonContainer}>
            <Text style={styles.priceText}>
              {item.price ? `${priceToNumber(item.price).toLocaleString('vi-VN')} VNĐ` : 'N/A'}
            </Text>
            <TouchableOpacity
              style={[styles.selectButton, isSelected && styles.selectedButton]}
              onPress={() => currentView === 'outbound' 
                ? handleSelectOutbound(item) 
                : handleSelectReturn(item)}
              disabled={isSelected}
            >
              <Text style={styles.selectButtonText}>
                {isSelected ? 'Đã chọn' : 'Chọn'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderSelectedCard = () => {
    if (!selectedOutboundBus) return null;
    
    return (
      <View style={styles.selectedCard}>
        <View style={styles.selectionDetails}>
          <Text style={styles.selectionHeader}>Chuyến đi</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.selectionText}>
              {selectedOutboundBus.departureCity || 'N/A'} → {selectedOutboundBus.arrivalCity || 'N/A'}
            </Text>
            <Text style={styles.selectionText}>
              {selectedOutboundBus.departureTime || 'N/A'} - {selectedOutboundBus.arrivalTime || 'N/A'} 
              ({calculateDuration(selectedOutboundBus.departureTime, selectedOutboundBus.arrivalTime)})
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.selectionText}>
              {selectedOutboundBus.busCompany || 'N/A'} - {selectedOutboundBus.seats || 0} chỗ
            </Text>
            <Text style={styles.selectionText}>
              {selectedOutboundBus.price ? `${priceToNumber(selectedOutboundBus.price).toLocaleString('vi-VN')} đ` : 'N/A'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => {
            setSelectedOutboundBus(null);
            setCurrentView('outbound');
          }}>
            <Text style={styles.changeButtonText}>Thay đổi chuyến đi</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    const routeTitle = departureDisplay && destinationDisplay
      ? `${departureDisplay} → ${destinationDisplay}`
      : 'Chọn chuyến xe';

    return (
      <>
        <AppBar
          title={routeTitle}
          color={COLORS.white}
          top={50}
          left={SIZES.small}
          right={SIZES.small}
          onPress={() => currentView === 'return' ? handleGoBackToOutbound() : navigation.goBack()}
        />
        <View style={styles.header}>
          <Text style={styles.tripInfo}>
            {currentView === 'outbound' ? outboundDate : returnDate}, 
            {numberOfSeats} ghế, 
            {isRoundTrip ? 'Khứ hồi' : 'Một chiều'}
          </Text>
          {currentView === 'return' && selectedOutboundBus && (
            <View style={styles.selectedOutboundInfo}>
              <Text style={styles.selectedFlightText}>
                Chuyến đi: {selectedOutboundBus.departureTime} - {selectedOutboundBus.arrivalTime}
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

  const currentBuses = currentView === 'outbound' ? outboundBuses : returnBuses;

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
                sortBuses('price');
              }}
            >
              <Text style={styles.modalOptionText}>Giá thấp nhất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setSortOption('earliestDeparture');
                sortBuses('earliestDeparture');
              }}
            >
              <Text style={styles.modalOptionText}>Chuyến sớm nhất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setSortOption('latestDeparture');
                sortBuses('latestDeparture');
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

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => {
            setError(null);
            setIsLoading(true);
            currentView === 'outbound' 
              ? fetchBuses() 
              : fetchReturnBuses();
          }}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải danh sách xe khách...</Text>
        </View>
      ) : currentBuses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {currentView === 'outbound' 
              ? 'Không tìm thấy chuyến đi phù hợp' 
              : 'Không tìm thấy chuyến về phù hợp'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={currentBuses}
          renderItem={renderBusItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderSelectedCard}
        />
      )}
    </View>
  );
};

export default BusList;

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
  busItem: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    paddingBottom: 25,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: TEXT.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 5,
    textAlign: 'center',
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
    marginVertical: 7,
    paddingVertical: 5,
  },
  locationText: {
    fontSize: TEXT.medium - 5.6,
    color: 'green',
    marginTop: 5,
  },
  priceButtonContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: -15,
    marginBottom: -27,
  },
  priceText: {
    fontSize: TEXT.medium-1.4,
    fontWeight: 'bold',
    color: COLORS.blue,
    marginBottom: 7,
  },
  selectButton: {
    backgroundColor: COLORS.lightGreen,
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 50,
    marginBottom: 43,
  },
  selectedButton: {
    backgroundColor: COLORS.gray,
  },
  selectButtonText: {
    color: COLORS.white,
    fontSize: TEXT.small-1,
    fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  busLogo: {
    width: 100,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: COLORS.green,
  },
  busInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  busCompany: {
    fontSize: TEXT.medium + 1,
    color: COLORS.blue,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: '500',
  },
  ticketType: {
    fontSize: TEXT.xxSmall - 1,
    color: COLORS.lightRed,
    marginBottom: 5,
  },
  amenities: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: TEXT.medium,
    color: COLORS.gray,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: TEXT.medium,
    color: COLORS.red,
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