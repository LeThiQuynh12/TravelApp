import React, {
  useEffect,
  useState,
} from 'react';

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  COLORS,
  TEXT,
} from '../../../constants/theme';
import AppBar from '../../Reusable/AppBar';

// Hàm tính thời gian bay
const calculateFlightDuration = (departureTime, arrivalTime) => {
  const [depHours, depMinutes] = departureTime.split(':').map(Number);
  const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);

  const depTotalMinutes = depHours * 60 + depMinutes;
  const arrTotalMinutes = arrHours * 60 + arrMinutes;

  let diffMinutes = arrTotalMinutes - depTotalMinutes;
  if (diffMinutes < 0) diffMinutes += 24 * 60; // Xử lý trường hợp qua ngày

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours}h${minutes}`;
};

const AirList = ({ navigation }) => {
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFlights = async () => {
      setIsLoading(true);
      try {
        const mockData = [
          {
            id: '1',
            departureTime: '14:55',
            arrivalTime: '17:00',
            departureCity: 'HAN',
            arrivalCity: 'SGN',
            airline: 'Vietjet Air',
            ticketType: 'Eco',
            price: '4.367.000 đ',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Vietjet_Air_logo.svg/1200px-Vietjet_Air_logo.svg.png',
          },
          {
            id: '2',
            departureTime: '15:30',
            arrivalTime: '17:35',
            departureCity: 'HAN',
            arrivalCity: 'SGN',
            airline: 'Bamboo Airways',
            ticketType: 'Premium',
            price: '4.367.000 đ',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bamboo_Airways_logo.svg/1200px-Bamboo_Airways_logo.svg.png',
          },
          {
            id: '3',
            departureTime: '16:00',
            arrivalTime: '18:05',
            departureCity: 'HAN',
            arrivalCity: 'SGN',
            airline: 'Vietnam Airlines',
            ticketType: 'Eco',
            price: '4.367.000 đ',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Vietnam_Airlines_logo.svg/1200px-Vietnam_Airlines_logo.svg.png',
          },
          {
            id: '4',
            departureTime: '16:30',
            arrivalTime: '18:35',
            departureCity: 'HAN',
            arrivalCity: 'SGN',
            airline: 'Vietjet Air',
            ticketType: 'Eco',
            price: '4.367.000 đ',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Vietjet_Air_logo.svg/1200px-Vietjet_Air_logo.svg.png',
          },
        ];
        setFlights(mockData);
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const renderFlightItem = ({ item }) => {
    const duration = calculateFlightDuration(item.departureTime, item.arrivalTime);
    return (
      <View style={styles.flightItem}>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{item.departureTime}</Text>
          <View style={styles.durationContainer}>
            <Text style={styles.durationText}>{duration}</Text>
            <Text style={styles.directText}>Bay thẳng</Text>
          </View>
          <Text style={styles.timeText}>{item.arrivalTime}</Text>
        </View>
        <View style={styles.routeRow}>
          <Text style={styles.cityText}>{item.departureCity}</Text>
          <Text style={styles.cityText}>{item.arrivalCity}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Image source={{ uri: item.logo }} style={styles.airlineLogo} />
          <View style={styles.airlineInfo}>
            <Text style={styles.airlineText}>{item.airline}</Text>
            <Text style={styles.ticketType}>{item.ticketType}</Text>
          </View>
        </View>
        <Text style={styles.priceText}>{item.price}</Text>
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Chọn</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="Hồ Chí Minh → Hà Nội"
        color={COLORS.white}
        top={50}
        left={10}
        right={10}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.header}>
        <Text style={styles.tripInfo}>18 Thg 3, 2 khách, Khứ hồi</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Lựa chọn chuyến đi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Lựa chọn chuyến về</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <Text style={styles.loadingText}>Đang tải...</Text>
      ) : (
        <FlatList
          data={flights}
          renderItem={renderFlightItem}
          keyExtractor={(item) => item.id}
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
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 80, // Để không bị đè lên AppBar
  },
  tripInfo: {
    fontSize: TEXT.medium,
    color: COLORS.gray,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.lightGrey,
  },
  activeTab: {
    borderBottomColor: COLORS.green,
  },
  tabText: {
    fontSize: TEXT.medium,
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.green,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  flightItem: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    position: 'relative', // Để đặt nút "Chọn" bằng position absolute
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: TEXT.xLarge,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  durationContainer: {
    alignItems: 'center',
  },
  durationText: {
    fontSize: TEXT.medium,
    color: COLORS.gray,
  },
  directText: {
    fontSize: TEXT.small,
    color: COLORS.gray,
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  cityText: {
    fontSize: TEXT.medium,
    color: COLORS.gray,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  airlineLogo: {
    width: 30,
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
    fontSize: TEXT.small,
    color: COLORS.gray,
  },
  priceText: {
    fontSize: TEXT.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: 10,
  },
  selectButton: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -15 }], // Căn giữa theo chiều dọc
    backgroundColor: COLORS.green,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  selectButtonText: {
    color: COLORS.white,
    fontSize: TEXT.medium,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: TEXT.medium,
    color: COLORS.gray,
  },
});