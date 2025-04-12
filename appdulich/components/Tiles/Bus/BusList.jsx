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
  TEXT,
} from '../../../constants/theme';
import AppBar from '../../Reusable/AppBar';
import ReusableText from '../../Reusable/ReusableText';

// Hàm tính thời gian di chuyển
const calculateDuration = (departureTime, arrivalTime) => {
  if (!departureTime || !arrivalTime) return 'N/A';
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

const BusList = ({ navigation, route }) => {
  const [buses, setBuses] = useState([]);
  const [returnBuses, setReturnBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState('price');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedReturnBus, setSelectedReturnBus] = useState(null);
  const [isReturnTrip, setIsReturnTrip] = useState(false);
  const [searchParams, setSearchParams] = useState({
    from: 'Hà Nội',
    to: 'Thanh Hóa',
    departureDate: '18/3/2025',
    returnDate: '20/3/2025',
  });

  const { isRoundTrip = true } = route.params || {};

  useEffect(() => {
    const fetchBuses = async () => {
      setIsLoading(true);
      try {
        // Mock dữ liệu chuyến đi
        const mockData = [
          {
            id: '1',
            departureTime: '13:20',
            arrivalTime: '18:00',
            departureCity: 'Hà Nội',
            arrivalCity: 'Thanh Hóa',
            date: '18/3/2025',
            busCompany: 'Xe Đông Lý',
            ticketType: 'Giường nằm',
            price: '200.000 đ',
            logo: 'https://bookvexe.vn/wp-content/uploads/2022/04/nha-xe-dong-ly-2.jpg',
            amenities: ['Wi-Fi','Chăn','Điều hòa','Sạc'],
            seats: 40,
            pickup: 'Bộ Công An',
            dropoff: 'Nông Cống',
            note: ['Không hoàn tiền','Không áp dụng đổi lịch trình']
          },
          {
            id: '2',
            departureTime: '14:00',
            arrivalTime: '18:40',
            departureCity: 'Hà Nội',
            arrivalCity: 'Thanh Hóa',
            date: '18/3/2025',
            busCompany: 'Xe Tiến Phương',
            ticketType: 'Giường nằm',
            price: '220.000 đ',
            logo: 'https://limotrip.vn/wp-content/uploads/2023/06/xe-tien-phuong-1.jpg',
            amenities: ['Wi-Fi','Chăn','Điều hòa','Sạc'],
            seats: 34,
            pickup: 'Bộ Công An',
            dropoff: 'Nông Cống',
            note: ['Không hoàn tiền','Không áp dụng đổi lịch trình']
          },
          {
            id: '3',
            departureTime: '15:00',
            arrivalTime: '19:40',
            departureCity: 'Hà Nội',
            arrivalCity: 'Thanh Hóa',
            date: '19/3/2025',
            busCompany: 'Xe Thương Mai',
            ticketType: 'Giường nằm',
            price: '190.000 đ',
            logo: 'https://carshop.vn/wp-content/uploads/2022/07/images1151040_xekhach.jpg',
            amenities: ['Wi-Fi','Chăn','Điều hòa','Sạc'],
            seats: 44,
            pickup: 'Bộ Công An',
            dropoff: 'Nông Cống',
            note: ['Không hoàn tiền','Không áp dụng đổi lịch trình']
          },
        ];

        // Mock dữ liệu chuyến về
        const mockReturnData = isRoundTrip
          ? [
              {
                id: '4',
                departureTime: '09:00',
                arrivalTime: '13:40',
                departureCity: 'Thanh Hóa',
                arrivalCity: 'Hà Nội',
                date: '20/3/2025',
                busCompany: 'Xe Đông Lý',
                ticketType: 'Giường nằm',
                price: '210.000 đ',
                logo: 'https://bookvexe.vn/wp-content/uploads/2022/04/nha-xe-dong-ly-2.jpg',
                amenities: ['Wi-Fi','Chăn','Điều hòa','Sạc'],
                seats: 40,
                pickup: 'Nông Cống',
                dropoff: 'Bộ Công An',
                note: ['Không hoàn tiền','Không áp dụng đổi lịch trình']
              },
              {
                id: '5',
                departureTime: '10:00',
                arrivalTime: '14:40',
                departureCity: 'Thanh Hóa',
                arrivalCity: 'Hà Nội',
                date: '20/3/2025',
                busCompany: 'Xe Tiên Phượng',
                ticketType: 'Giường nằm',
                price: '230.000 đ',
                logo: 'https://limotrip.vn/wp-content/uploads/2023/06/xe-tien-phuong-1.jpg',
                amenities: ['Wi-Fi','Chăn','Điều hòa','Sạc'],
                seats: 34,
                pickup: 'Nông Cống',
                dropoff: 'Bộ Công An',
                note: ['Không hoàn tiền','Không áp dụng đổi lịch trình']

              },
            ]
          : [];

        // Lọc dữ liệu dựa trên searchParams
        const filteredBuses = mockData.filter(
          (bus) =>
            bus.departureCity === searchParams.from &&
            bus.arrivalCity === searchParams.to &&
            bus.date === searchParams.departureDate &&
            bus.price // Đảm bảo có price
        );

        const filteredReturnBuses = mockReturnData.filter(
          (bus) =>
            bus.departureCity === searchParams.to &&
            bus.arrivalCity === searchParams.from &&
            bus.date === searchParams.returnDate &&
            bus.price // Đảm bảo có price
        );

        setBuses(filteredBuses);
        setReturnBuses(filteredReturnBuses);
      } catch (error) {
        console.error('Error fetching buses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuses();
  }, [searchParams, isRoundTrip]);


  // Hàm hiển thị dịch vụ tương ứng với icons
  const amenityIcons = {
    'Wi-Fi': <Ionicons name="wifi" size={20} color={COLORS.gray} />,
    'Chăn': <MaterialCommunityIcons name="bed-outline" size={20} color={COLORS.gray} />,
    'Điều hòa': <Ionicons name="snow" size={20} color={COLORS.gray} />,
    'Sạc': <FontAwesome5 name="charging-station" size={20} color={COLORS.gray} />,
  };
  const handleSearch = (params) => {
    setSearchParams({
      from: params.from || searchParams.from,
      to: params.to || searchParams.to,
      departureDate: params.departureDate || searchParams.departureDate,
      returnDate: params.returnDate || searchParams.returnDate,
    });
  };

  const timeToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const priceToNumber = (price) => {
    if (!price) return 0;
    return parseFloat(price.replace(/[^\d]/g, '')) || 0;
  };

  const sortBuses = (option, isReturn = false) => {
    const targetBuses = isReturn ? [...returnBuses] : [...buses];
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
    if (isReturn) {
      setReturnBuses(targetBuses);
    } else {
      setBuses(targetBuses);
    }
    setSortOption(option);
    setModalVisible(false);
  };

  const handleSelectBus = (bus, isReturn = false) => {
    if (!bus) {
      console.error('Bus is undefined in handleSelectBus');
      return;
    }

    if (isReturn) {
      if (!selectedBus) {
        console.error('selectedBus is undefined when selecting return bus');
        return;
      }
      setSelectedReturnBus(bus);
      console.log('Navigating to BusDetail with:', {
        departureBus: selectedBus,
        returnBus: bus,
        numberOfPassengers: 2,
      });
      navigation.navigate('BusDetail', {
        departureBus: selectedBus,
        returnBus: bus,
        numberOfPassengers: 2,
      });
    } else {
      setSelectedBus(bus);
      if (isRoundTrip) {
        setIsReturnTrip(true); // Chuyển sang hiển thị chuyến về
      } else {
        console.log('Navigating to BusDetail with:', {
          departureBus: bus,
          numberOfPassengers: 2,
        });
        navigation.navigate('BusDetail', {
          departureBus: bus,
          numberOfPassengers: 2,
        });
      }
    }
  };

  const handleChangeBus = (isReturn = false) => {
    if (isReturn) {
      setSelectedReturnBus(null);
    } else {
      setSelectedBus(null);
      setSelectedReturnBus(null);
      setIsReturnTrip(false);
    }
  };

  const renderBusItem = ({ item }) => {
    if (!item) return null;
    const duration = calculateDuration(item.departureTime, item.arrivalTime);
    const isSelected = isReturnTrip
      ? selectedReturnBus && selectedReturnBus.id === item.id
      : selectedBus && selectedBus.id === item.id;
    return (
      <View style={styles.busItem}>
              <Text style={styles.busCompany}>{item.busCompany || 'N/A'}</Text>
        <View style={styles.mainRow}>

          
          <View style={styles.timeRow}>
            <View>
              <Text style={styles.timeText}>{item.departureTime || 'N/A'}</Text>
              <Text style={styles.cityText}>{item.departureCity || 'N/A'}</Text>
              <Text style={styles.locationText}>Đón: {item.pickup || 'N/A'}</Text>
            </View>
            <View style={styles.durationContainer}>
              <Text style={styles.durationText}>{duration}</Text>
              <Text style={styles.directText}>Trực tiếp</Text>
            </View>
            <View>
              <Text style={styles.timeText}>{item.arrivalTime || 'N/A'}</Text>
              <Text style={styles.cityText}>{item.arrivalCity || 'N/A'}</Text>
              <Text style={styles.locationText}>Trả: {item.dropoff || 'N/A'}</Text>
            </View>
          </View>

        </View>
        <View style={styles.detailsRow}>
          <Image source={{ uri: item.logo}} style={styles.busLogo} />

          <View style={{flexDirection: 'column', flex: 1}}> 
          
          <View style={styles.busInfo}>
      
            <Text style={styles.ticketType}>
              - {item.ticketType || 'N/A'}
            </Text>

            <Text style={styles.ticketType}>
              -  {item.seats || 0} chỗ
            </Text>

          </View>

          <View style={styles.amenities}>
            {item.amenities?.map((amenity, index) => (
              <View key={index} style={{ marginRight: 1, alignItems: 'center' }}>
                {amenityIcons[amenity]}
                <Text style={{ marginRight: 3, fontSize: 8, color: COLORS.gray }}>{amenity}</Text>
              </View>
            ))}
          </View>

          </View>

          <View style={styles.priceButtonContainer}>
            <Text style={styles.priceText}>{item.price || 'N/A'}</Text>
            <TouchableOpacity
              style={[styles.selectButton, isSelected && styles.selectedButton]}
              onPress={() => handleSelectBus(item, isReturnTrip)}
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
    if (!selectedBus && !selectedReturnBus) return null;
    return (
      <View style={styles.selectedCard}>
        {selectedBus && (
          <View style={styles.selectionDetails}>
            <Text style={styles.selectionHeader}>Chuyến đi</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.selectionText}>
                {selectedBus.departureCity || 'N/A'} → {selectedBus.arrivalCity || 'N/A'}
              </Text>
              <Text style={styles.selectionText}>
                {selectedBus.departureTime || 'N/A'} - {selectedBus.arrivalTime || 'N/A'} (
                {calculateDuration(selectedBus.departureTime, selectedBus.arrivalTime)})
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.selectionText}>
                {selectedBus.busCompany || 'N/A'} - {selectedBus.seats || 0} chỗ
              </Text>
              <Text style={styles.selectionText}>{selectedBus.price || 'N/A'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.selectionText}>Đón: {selectedBus.pickup || 'N/A'}</Text>
              <Text style={styles.selectionText}>Trả: {selectedBus.dropoff || 'N/A'}</Text>
            </View>
            <TouchableOpacity onPress={() => handleChangeBus(false)}>
              <Text style={styles.changeButtonText}>Thay đổi chuyến đi</Text>
            </TouchableOpacity>
          </View>
        )}
        {selectedReturnBus && (
          <View style={styles.selectionDetails}>
            <Text style={styles.selectionHeader}>Chuyến về</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.selectionText}>
                {selectedReturnBus.departureCity || 'N/A'} → {selectedReturnBus.arrivalCity || 'N/A'}
              </Text>
              <Text style={styles.selectionText}>
                {selectedReturnBus.departureTime || 'N/A'} - {selectedReturnBus.arrivalTime || 'N/A'} (
                {calculateDuration(selectedReturnBus.departureTime, selectedReturnBus.arrivalTime)})
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.selectionText}>
                {selectedReturnBus.busCompany || 'N/A'} - {selectedReturnBus.seats || 0} chỗ
              </Text>
              <Text style={styles.selectionText}>{selectedReturnBus.price || 'N/A'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.selectionText}>Đón: {selectedReturnBus.pickup || 'N/A'}</Text>
              <Text style={styles.selectionText}>Trả: {selectedReturnBus.dropoff || 'N/A'}</Text>
            </View>
            <TouchableOpacity onPress={() => handleChangeBus(true)}>
              <Text style={styles.changeButtonText}>Thay đổi chuyến về</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const firstBus = buses.length > 0 ? buses[0] : null;
  const routeTitle = firstBus
    ? `${firstBus.departureCity} → ${firstBus.arrivalCity}`
    : 'Chọn chuyến xe';

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
          {searchParams.departureDate}, 2 khách, {isRoundTrip ? 'Khứ hồi' : 'Một chiều'}
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
              onPress={() => sortBuses('price', isReturnTrip)}
            >
              <Text style={styles.modalOptionText}>Giá thấp nhất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => sortBuses('earliestDeparture', isReturnTrip)}
            >
              <Text style={styles.modalOptionText}>Chuyến sớm nhất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => sortBuses('latestDeparture', isReturnTrip)}
            >
              <Text style={styles.modalOptionText}>Chuyến muộn nhất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => sortBuses('earliestArrival', isReturnTrip)}
            >
              <Text style={styles.modalOptionText}>Đến sớm nhất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => sortBuses('latestArrival', isReturnTrip)}
            >
              <Text style={styles.modalOptionText}>Đến muộn nhất</Text>
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
          data={isReturnTrip ? returnBuses : buses}
          renderItem={({ item }) => renderBusItem({ item })}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderSelectedCard}
        />
      )}
    </View>
  );
};

export default BusList;

// Styles giữ nguyên như bạn đã cung cấp
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
    paddingBottom : 25,
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
    fontSize: TEXT.medium - 4,
    color: "green",
    marginTop: 5,
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
    fontSize: TEXT.medium+1,
    color: COLORS.blue,
    marginBottom: 5,
    textAlign: "center",
    fontWeight: '500',
  },
  ticketType: {
    fontSize: TEXT.xxSmall-1,
    color: COLORS.lightRed,
    // borderBottomColor: COLORS.lightRed,
    // borderBottomWidth: 1,
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