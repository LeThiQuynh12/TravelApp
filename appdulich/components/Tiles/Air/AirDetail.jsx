import React, {
  useEffect,
  useState,
} from 'react';

import {
  Image,
  SafeAreaView,
  ScrollView,
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
import { getFlightById } from '../../../services/api';
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
  const { departureFlight: departureFlightParam, returnFlight: returnFlightParam } = route.params;
  const { adults = 0, children = 0, infants = 0 } = route.params || {};

  // State để lưu dữ liệu chuyến bay từ backend
  const [departureFlight, setDepartureFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API để lấy chi tiết chuyến bay
  useEffect(() => {
    const fetchFlightDetails = async () => {
      setIsLoading(true);
      try {
        const departureFlightData = await getFlightById(departureFlightParam._id);
        setDepartureFlight(departureFlightData);

        if (returnFlightParam) {
          const returnFlightData = await getFlightById(returnFlightParam._id);
          setReturnFlight(returnFlightData);
        }
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết chuyến bay:', err.message);
        setError('Không thể tải thông tin chuyến bay');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlightDetails();
  }, [departureFlightParam, returnFlightParam]);

  // Hàm chuyển đổi giá từ chuỗi sang số
  const priceToNumber = (price) => parseFloat(price.replace(/[^\d]/g, ''));

  // Hàm tính tổng tiền dựa trên số lượng khách và loại khách
  const calculateTotalPrice = () => {
    if (!departureFlight || !departureFlight.price) return { totalPrice: 0, breakdown: {} };

    const departurePrice = priceToNumber(departureFlight.price);
    const returnPrice = returnFlight && returnFlight.price ? priceToNumber(returnFlight.price) : 0;

    // Giá cơ bản cho người lớn (100%), trẻ em (75%), em bé (50%)
    const adultPrice = departurePrice + returnPrice;
    const childPrice = adultPrice * 0.75;
    const infantPrice = adultPrice * 0.5;

    // Tính tổng tiền
    const totalAdultPrice = adultPrice * adults;
    const totalChildPrice = childPrice * children;
    const totalInfantPrice = infantPrice * infants;
    const totalPrice = totalAdultPrice + totalChildPrice + totalInfantPrice;

    // Chi tiết giá cho từng loại khách
    const breakdown = {
      adult: {
        count: adults,
        unitPrice: adultPrice,
        total: totalAdultPrice,
      },
      child: {
        count: children,
        unitPrice: childPrice,
        total: totalChildPrice,
      },
      infant: {
        count: infants,
        unitPrice: infantPrice,
        total: totalInfantPrice,
      },
    };

    return { totalPrice, breakdown };
  };

  const { totalPrice, breakdown } = calculateTotalPrice();
  const formattedTotalPrice = totalPrice.toLocaleString('vi-VN') + ' đ';

  // Hàm render card chuyến bay
  const renderFlightCard = (flight, isReturn = false) => {
    if (!flight) return null;

    return (
      <View style={styles.card}>
        <View style={styles.routeRow}>
          <Text style={styles.routeText}>
            {flight.departureName} → {flight.arrivalName}
          </Text>
          <Image source={{ uri: flight.logo }} style={styles.airlineLogo} />
        </View>
        <View style={{flexDirection: "row", justifyContent:"space-between"}}>
          <Text style={styles.dateText}>{flight.date}</Text>
          <Text style={styles.flightInfo}>
            {flight.flightNumber} | {flight.ticketType}
          </Text>
        </View>
        <View style={styles.timeRow}>
          <View style={styles.timeCityContainer}>
            <Text style={styles.timeText}>{flight.departureTime}</Text>
            <Text style={styles.cityText}>{flight.departureCity}</Text>
          </View>
          <View style={styles.durationContainer}>
             <Ionicons name="return-up-forward" size={40} color={COLORS.lightSkyBlue} />
            <Text style={styles.durationText}>
              {calculateFlightDuration(flight.departureTime, flight.arrivalTime)}
            </Text>
          </View>
          <View style={styles.timeCityContainer}>
            <Text style={styles.timeText}>{flight.arrivalTime}</Text>
            <Text style={styles.cityText}>{flight.arrivalCity}</Text>
          </View>
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
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  // Kiểm tra nếu không có khách nào được chọn
  if (adults === 0 && children === 0 && infants === 0) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <Text style={styles.errorText}>Vui lòng chọn số lượng khách!</Text>
      </SafeAreaView>
    );
  }

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
          {renderFlightCard(departureFlight, false)}

          {/* Card chuyến về */}
          {renderFlightCard(returnFlight, true)}

          {/* Phần tóm tắt giá */}
          <View style={styles.summarySection}>
            <Text style={{fontSize: TEXT.large-3, fontWeight: "bold", color: COLORS.blue, marginBottom: 20}}>----------- TÓM TẮT GIÁ VÉ  ------------</Text>
            {breakdown.adult.count > 0 && (
              <View style={styles.passengerRow}>
                <Text style={styles.summaryText}>
                  Người lớn ({breakdown.adult.count})
                </Text>
                <Text style={styles.priceText}>
                  {breakdown.adult.total.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            )}
            {breakdown.child.count > 0 && (
              <View style={styles.passengerRow}>
                <Text style={styles.summaryText}>
                  Trẻ em ({breakdown.child.count})
                </Text>
                <Text style={styles.priceText}>
                  {breakdown.child.total.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            )}
            {breakdown.infant.count > 0 && (
              <View style={styles.passengerRow}>
                <Text style={styles.summaryText}>
                  Em bé ({breakdown.infant.count})
                </Text>
                <Text style={styles.priceText}>
                  {breakdown.infant.total.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            )}
            <View style={{flexDirection: "row", marginTop: 10, justifyContent: "space-between"}}>
              <Text style={{fontSize: TEXT.medium, fontWeight: "bold", color: COLORS.blue} }>TỔNG TIỀN:</Text>
              <Text style={{fontSize: TEXT.medium+2, fontWeight: "bold", color: COLORS.red}}>{formattedTotalPrice}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Nút Tiếp tục */}
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
    backgroundColor: COLORS.lightWhite,
    borderRadius: 15,
    paddingHorizontal: 17,
    paddingVertical: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    borderColor: COLORS.lightSkyBlue,
    borderWidth: 2,
    paddingBottom: 20,
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
    borderColor: COLORS.pink,
    borderWidth: 2,
  },
  policyButtonText: {
    fontSize: TEXT.xSmall - 1,
    color: COLORS.pink,
    fontWeight: "600"
  },
  refundButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: COLORS.mint,
    borderWidth: 2,
  },
  refundButtonText: {
    fontSize: TEXT.xSmall - 1,
    color: COLORS.mint,
    fontWeight: "600"
  },
  summarySection: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  passengerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  summaryText: {

    fontSize: TEXT.medium,
    color: COLORS.dark,
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
    backgroundColor: COLORS.red,
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