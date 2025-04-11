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
  const [searchParams, setSearchParams] = useState({
    from: 'HAN',
    to: 'SGN',
    departureDate: '18/3/2025',
    returnDate: '20/3/2025',
  });

  useEffect(() => {
    const fetchFlights = async () => {
      setIsLoading(true);
      try {
        // Mock dữ liệu chuyến bay đi
        const mockData = [
          {
            id: '1',
            departureTime: '14:55',
            arrivalTime: '17:00',
            departureCity: 'HAN',
            departureName: 'Hà Nội',
            arrivalCity: 'SGN',
            arrivalName: 'Hồ Chí Minh',
            date: '18/3/2025',
            flightNumber: 'VJ123', // Thêm trường flightNumber
            airline: 'Vietjet Air',
            ticketType: 'Eco',
            price: '4.367.000 đ',
            logo: 'https://logos-world.net/wp-content/uploads/2023/01/VietJet-Air-Logo.png',
          },
          {
            id: '2',
            departureTime: '15:30',
            arrivalTime: '17:35',
            departureCity: 'HAN',
            departureName: 'Hà Nội',
            arrivalCity: 'SGN',
            arrivalName: 'Hồ Chí Minh',
            date: '18/3/2025',
            flightNumber: 'QH456', // Thêm trường flightNumber
            airline: 'Bamboo Airways',
            ticketType: 'Premium',
            price: '5.200.000 đ',
            logo: 'https://i.pinimg.com/originals/50/83/11/50831158220262d4079756c5a16365a2.png',
          },
          {
            id: '3',
            departureTime: '16:00',
            arrivalTime: '18:05',
            departureCity: 'HAN',
            departureName: 'Hà Nội',
            arrivalCity: 'SGN',
            arrivalName: 'Hồ Chí Minh',
            date: '19/3/2025',
            flightNumber: 'VN789', // Thêm trường flightNumber
            airline: 'Vietnam Airlines',
            ticketType: 'Eco',
            price: '3.900.000 đ',
            logo: 'http://pluspng.com/img-png/vietnam-airlines-logo-vector-png-vietnam-airlines-logo-renewed-company-logo-2250.png',
          },
          {
            id: '4',
            departureTime: '16:30',
            arrivalTime: '18:35',
            departureCity: 'HAN',
            departureName: 'Hà Nội',
            arrivalCity: 'SGN',
            arrivalName: 'Hồ Chí Minh',
            date: '19/3/2025',
            flightNumber: 'VJ234', // Thêm trường flightNumber
            airline: 'Vietjet Air',
            ticketType: 'Eco',
            price: '4.100.000 đ',
            logo: 'https://logos-world.net/wp-content/uploads/2023/01/VietJet-Air-Logo.png',
          },
        ];

        // Mock dữ liệu chuyến bay khứ hồi
        const mockReturnData = [
          {
            id: '5',
            departureTime: '08:00',
            arrivalTime: '10:05',
            departureCity: 'SGN',
            departureName: 'Hồ Chí Minh',
            arrivalCity: 'HAN',
            arrivalName: 'Hà Nội',
            date: '20/3/2025',
            flightNumber: 'VJ567', // Thêm trường flightNumber
            airline: 'Vietjet Air',
            ticketType: 'Eco',
            price: '4.200.000 đ',
            logo: 'https://logos-world.net/wp-content/uploads/2023/01/VietJet-Air-Logo.png',
          },
          {
            id: '6',
            departureTime: '09:30',
            arrivalTime: '11:35',
            departureCity: 'SGN',
            departureName: 'Hồ Chí Minh',
            arrivalCity: 'HAN',
            arrivalName: 'Hà Nội',
            date: '20/3/2025',
            flightNumber: 'QH678', // Thêm trường flightNumber
            airline: 'Bamboo Airways',
            ticketType: 'Premium',
            price: '5.500.000 đ',
            logo: 'https://i.pinimg.com/originals/50/83/11/50831158220262d4079756c5a16365a2.png',
          },
          {
            id: '7',
            departureTime: '10:00',
            arrivalTime: '12:05',
            departureCity: 'SGN',
            departureName: 'Hồ Chí Minh',
            arrivalCity: 'HAN',
            arrivalName: 'Hà Nội',
            date: '21/3/2025',
            flightNumber: 'VN890', // Thêm trường flightNumber
            airline: 'Vietnam Airlines',
            ticketType: 'Eco',
            price: '3.800.000 đ',
            logo: 'http://pluspng.com/img-png/vietnam-airlines-logo-vector-png-vietnam-airlines-logo-renewed-company-logo-2250.png',
          },
          {
            id: '8',
            departureTime: '11:30',
            arrivalTime: '13:35',
            departureCity: 'SGN',
            departureName: 'Hồ Chí Minh',
            arrivalCity: 'HAN',
            arrivalName: 'Hà Nội',
            date: '21/3/2025',
            flightNumber: 'VJ345', // Thêm trường flightNumber
            airline: 'Vietjet Air',
            ticketType: 'Eco',
            price: '4.000.000 đ',
            logo: 'https://logos-world.net/wp-content/uploads/2023/01/VietJet-Air-Logo.png',
          },
        ];

        // Lọc dữ liệu dựa trên searchParams
        const filteredFlights = mockData.filter(
          (flight) =>
            flight.departureCity === searchParams.from &&
            flight.arrivalCity === searchParams.to &&
            flight.date === searchParams.departureDate
        );

        const filteredReturnFlights = mockReturnData.filter(
          (flight) =>
            flight.departureCity === searchParams.to &&
            flight.arrivalCity === searchParams.from &&
            flight.date === searchParams.returnDate
        );

        setFlights(filteredFlights);
        setReturnFlights(filteredReturnFlights);
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, [searchParams]);

  // Hàm để cập nhật searchParams (sẽ được gọi từ nút tìm kiếm)
  const handleSearch = (params) => {
    setSearchParams({
      from: params.from || searchParams.from,
      to: params.to || searchParams.to,
      departureDate: params.departureDate || searchParams.departureDate,
      returnDate: params.returnDate || searchParams.returnDate,
    });
  };

  // Hàm chuyển đổi thời gian sang phút để so sánh
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Hàm chuyển đổi giá sang số để so sánh
  const priceToNumber = (price) => {
    return parseFloat(price.replace(/[^\d]/g, '')); // Loại bỏ ký tự không phải số
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
      setSelectedReturnFlight(flight);
      // Điều hướng sang màn hình AirDetail
      navigation.navigate('AirDetail', {
        departureFlight: selectedFlight,
        returnFlight: flight,
      });
    } else {
      setSelectedFlight(flight);
      setIsReturnTrip(true); // Chuyển sang danh sách chuyến về
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

  // Lấy departureName và arrivalName từ chuyến bay đầu tiên để hiển thị tiêu đề
  const firstFlight = flights.length > 0 ? flights[0] : null;
  const routeTitle = firstFlight
    ? `${firstFlight.departureName} → ${firstFlight.arrivalName}`
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
          {searchParams.departureDate}, 2 khách, Khứ hồi
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

      {/* Modal sắp xếp */}
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