import React from 'react';

import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons
  from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  COLORS,
  TEXT,
} from '../../../constants/theme';
import AppBar from '../../Reusable/AppBar';
import HeightSpacer from '../../Reusable/HeightSpacer';

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

const BusDetail = ({ navigation, route }) => {
  const { departureBus, returnBus, numberOfSeats = 1 } = route.params || {};

  console.log('BusDetail params:', { departureBus, returnBus, numberOfSeats });

  // Hàm chuyển đổi giá từ string sang số
  const priceToNumber = (price) => {
    if (!price || typeof price !== 'string') {
      console.warn('Invalid price:', price);
      return 0;
    }
    return parseFloat(price.replace(/[^\d]/g, '')) || 0;
  };

  // Tính giá vé cho chuyến đi và chuyến về dựa trên số ghế
  const departurePrice = departureBus && departureBus.price ? priceToNumber(departureBus.price) * numberOfSeats : 0;
  const returnPrice = returnBus && returnBus.price ? priceToNumber(returnBus.price) * numberOfSeats : 0;

  // Tổng giá
  const totalPrice = departurePrice + returnPrice;
  const formattedTotalPrice = totalPrice.toLocaleString('vi-VN') + ' đ';

  const amenityIcons = {
    'Wi-Fi': <Ionicons name="wifi" size={20} color={COLORS.gray} />,
    Chăn: <MaterialCommunityIcons name="bed-outline" size={20} color={COLORS.gray} />,
    'Điều hòa': <Ionicons name="snow" size={20} color={COLORS.gray} />,
    Sạc: <FontAwesome5 name="charging-station" size={20} color={COLORS.gray} />,
  };

  const renderBusCard = (bus, isDeparture) => (
    <View style={styles.card}>
      <View style={styles.routeRow}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.routeText}>
            {bus.departureCity || 'N/A'} → {bus.arrivalCity || 'N/A'}
          </Text>
          <Text style={styles.busCompany}>{bus.busCompany || 'N/A'}</Text>
        </View>
        <Image
          source={{ uri: bus.logo || 'https://example.com/placeholder.png' }}
          style={styles.busLogo}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
        <Text style={styles.dateText}>{bus.date || 'N/A'}</Text>
        <Text style={styles.busInfo}>
          {bus.ticketType || 'N/A'} | {bus.seats || 0} chỗ
        </Text>
      </View>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{bus.departureTime || 'N/A'}</Text>
        <Ionicons name="return-up-forward" size={30} color={COLORS.blue} />
        <Text style={styles.timeText}>{bus.arrivalTime || 'N/A'}</Text>
      </View>
      <View style={styles.cityRow}>
        <Text style={styles.cityText}>Đón: {bus.pickup || 'N/A'}</Text>
        <Text style={styles.cityText}>Trả: {bus.dropoff || 'N/A'}</Text>
      </View>
      <View style={styles.policyContainer}>
        <View style={styles.amenities}>
          {bus.amenities?.map((amenity, index) => (
            <View key={index} style={styles.amenityItem}>
              {amenityIcons[amenity]}
              <Text style={styles.amenityLabel}>{amenity}</Text>
            </View>
          ))}
        </View>
        {bus.note?.length > 0 && (
          <View style={styles.noteContainer}>
            {bus.note.map((note, index) => (
              <Text key={index} style={styles.noteText}>• {note}</Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <AppBar
          title="Thông tin chuyến xe"
          color={COLORS.white}
          top={20}
          left={10}
          right={10}
          onPress={() => navigation.goBack()}
        />
        <HeightSpacer height={64} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {departureBus ? (
            renderBusCard(departureBus, true)
          ) : (
            <Text style={styles.errorText}>Không có thông tin chuyến đi</Text>
          )}
          {returnBus && renderBusCard(returnBus, false)}
          <View style={styles.summarySection}>
            <Text style={styles.summaryText}>{numberOfSeats} ghế ngồi</Text>
            {departureBus && (
              <View style={styles.priceRow}>
                <Text style={styles.summaryText}>Giá chuyến đi:</Text>
                <Text style={styles.priceText}>
                  {(priceToNumber(departureBus.price) * numberOfSeats).toLocaleString('vi-VN')} đ
                </Text>
              </View>
            )}
            {returnBus && (
              <View style={styles.priceRow}>
                <Text style={styles.summaryText}>Giá chuyến về:</Text>
                <Text style={styles.priceText}>
                  {(priceToNumber(returnBus.price) * numberOfSeats).toLocaleString('vi-VN')} đ
                </Text>
              </View>
            )}
            <View style={styles.priceRow}>
              <Text style={styles.summaryText}>Tổng tiền ({numberOfSeats} ghế):</Text>
              <Text style={styles.priceText}>{formattedTotalPrice}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('CustomerInfo')}
          >
            <Text style={styles.continueButtonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BusDetail;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.lightCyan,
    borderRadius: 15,
    paddingHorizontal: 17,
    paddingVertical: 8,
    marginHorizontal: 15,
    marginBottom: 15,
    borderColor: '#E6F7FF',
    borderWidth: 7,
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  routeText: {
    fontSize: TEXT.large - 2,
    fontWeight: '500',
    color: COLORS.blue,
  },
  busLogo: {
    width: 120,
    height: 68,
    borderRadius: 20,
  },
  dateText: {
    fontSize: TEXT.small,
    color: COLORS.dark,
    marginBottom: 3,
  },
  busInfo: {
    fontSize: TEXT.small - 1,
    color: COLORS.gray,
    marginBottom: 5,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
    paddingBottom: 5,
  },
  timeText: {
    fontSize: TEXT.large - 2,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  cityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  cityText: {
    fontSize: TEXT.xxSmall,
    color: COLORS.gray,
    backgroundColor: '#f1f1f1',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  policyContainer: {
    marginTop: 5,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityItem: {
    alignItems: 'center',
    marginRight: 10,
  },
  amenityLabel: {
    fontSize: TEXT.xSmall - 1,
    color: COLORS.gray,
    marginTop: 2,
  },
  noteContainer: {
    marginTop: 10,
  },
  noteText: {
    fontSize: TEXT.xSmall,
    color: COLORS.gray,
    marginTop: 2,
  },
  summarySection: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  summaryText: {
    fontSize: TEXT.xsmall,
    color: COLORS.blue,
    fontWeight: '400',
    marginBottom: 3,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    marginVertical: 18,
    paddingVertical: 2,
  },
  priceText: {
    fontSize: TEXT.medium,
    fontWeight: '500',
    color: COLORS.red,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  continueButton: {
    backgroundColor: COLORS.green,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: TEXT.medium,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: TEXT.medium,
    color: COLORS.red,
    textAlign: 'center',
    marginVertical: 20,
  },
  busCompany: {
    fontSize: TEXT.medium,
    color: 'green',
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    textAlign: 'center',
    paddingVertical: 5,
  },
});