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

import {
  COLORS,
  TEXT,
} from '../../../constants/theme';
import AppBar from '../../Reusable/AppBar';
import HeightSpacer from '../../Reusable/HeightSpacer';

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

const AirDetail = ({ navigation, route }) => {
  // Lấy dữ liệu từ route.params (được truyền từ AirList)
  const { departureFlight, returnFlight, numberOfPassengers = 2 } = route.params;

  // Hàm chuyển đổi giá từ chuỗi sang số
  const priceToNumber = (price) => parseFloat(price.replace(/[^\d]/g, ''));

  // Giá cho 1 người (tổng giá của chuyến đi và chuyến về cho 1 người)
  const departurePricePerPerson = priceToNumber(departureFlight.price);
  const returnPricePerPerson = priceToNumber(returnFlight.price);
  const totalPricePerPerson = departurePricePerPerson + returnPricePerPerson;
  const formattedPricePerPerson = totalPricePerPerson.toLocaleString('vi-VN') + ' đ';

  // Giá cho 2 người (nhân đôi giá 1 người)
  const totalPriceForTwoPeople = totalPricePerPerson * 2;
  const formattedPriceForTwoPeople = totalPriceForTwoPeople.toLocaleString('vi-VN') + ' đ';

  // Tổng tiền dựa trên số lượng người
  const totalPrice = totalPricePerPerson * numberOfPassengers;
  const formattedTotalPrice = totalPrice.toLocaleString('vi-VN') + ' đ';

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <AppBar
          title="Thông tin chuyến bay"
          color={COLORS.white}
          top={20}
          left={10}
          right={10}
          onPress={() => navigation.goBack()}
        />
        <HeightSpacer height={64} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Card chuyến đi */}
          <View style={styles.card}>
            <View style={styles.routeRow}>
              <Text style={styles.routeText}>
                {departureFlight.departureName} → {departureFlight.arrivalName}
              </Text>
              <Image
                source={{ uri: departureFlight.logo }}
                style={styles.airlineLogo}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
              <Text style={styles.dateText}>{departureFlight.date}</Text>
              <Text style={styles.flightInfo}>
                {departureFlight.flightNumber} | {departureFlight.ticketType}
              </Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{departureFlight.departureTime}</Text>
              <Text style={styles.arrow}>✈️</Text>
              <Text style={styles.timeText}>{departureFlight.arrivalTime}</Text>
            </View>
            <View style={styles.cityRow}>
              <Text style={styles.cityText}>{departureFlight.departureCity}</Text>
              <Text style={styles.cityText}>{departureFlight.arrivalCity}</Text>
            </View>
            <View style={styles.policyRow}>
              <TouchableOpacity style={styles.policyButton}>
                <Text style={styles.policyButtonText}>Áp dụng đổi lịch bay</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.refundButton}>
                <Text style={styles.refundButtonText}>Không hoàn tiền</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Card chuyến về */}
          <View style={styles.card}>
            <View style={styles.routeRow}>
              <Text style={styles.routeText}>
                {returnFlight.departureName} → {returnFlight.arrivalName}
              </Text>
              <Image
                source={{ uri: returnFlight.logo }}
                style={styles.airlineLogo}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
              <Text style={styles.dateText}>{returnFlight.date}</Text>
              <Text style={styles.flightInfo}>
                {returnFlight.flightNumber} | {returnFlight.ticketType}
              </Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{returnFlight.departureTime}</Text>
              <Text style={styles.arrow}>✈️</Text>
              <Text style={styles.timeText}>{returnFlight.arrivalTime}</Text>
            </View>
            <View style={styles.cityRow}>
              <Text style={styles.cityText}>{returnFlight.departureCity}</Text>
              <Text style={styles.cityText}>{returnFlight.arrivalCity}</Text>
            </View>
            <View style={styles.policyRow}>
              <TouchableOpacity style={styles.policyButton}>
                <Text style={styles.policyButtonText}>Áp dụng đổi lịch bay</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.refundButton}>
                <Text style={styles.refundButtonText}>Không hoàn tiền</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Số lượng người lớn và tổng tiền */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryText}>{numberOfPassengers} người lớn</Text>
            <View style={styles.priceRow}>
              <Text style={styles.summaryText}>Giá 1 người:</Text>
              <Text style={styles.priceText}>{formattedPricePerPerson}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.summaryText}>Giá 2 người:</Text>
              <Text style={styles.priceText}>{formattedPriceForTwoPeople}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.summaryText}>Tổng tiền ({numberOfPassengers} người):</Text>
              <Text style={styles.priceText}>{formattedTotalPrice}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Nút Tiếp tục cố định ở dưới cùng */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.continueButton}
          onPress={()=>navigation.navigate("CustomerInfo")}
          >
            <Text style={styles.continueButtonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AirDetail;

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
    borderColor: "#E6F7FF",
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
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  airlineLogo: {
    width: 100,
    height: 60,
    resizeMode: 'contain',
  },
  dateText: {
    fontSize: TEXT.small,
    color: COLORS.dark,
    marginBottom: 3,
  },
  flightInfo: {
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
    fontSize: TEXT.large - 3,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  arrow: {
    fontSize: TEXT.medium,
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
    backgroundColor: "#f1f1f1",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  policyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  policyButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: "#0D99FF",
    borderWidth: 2,
  },
  policyButtonText: {
    fontSize: TEXT.xSmall - 1,
    color: "#0D99FF",
  },
  refundButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: "#34C759",
    borderWidth: 2,
  },
  refundButtonText: {
    fontSize: TEXT.xSmall - 1,
    color: "#34C759",
  },
  summarySection: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  summaryText: {
    fontSize: TEXT.xsmall,
    color: COLORS.blue,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: COLORS.red,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    // borderTopWidth: 1,
    // borderTopColor: COLORS.lightGrey,
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
});