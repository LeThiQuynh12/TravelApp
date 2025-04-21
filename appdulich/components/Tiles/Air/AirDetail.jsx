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
  SIZES,
  TEXT,
} from '../../../constants/theme';
import { getFlightById } from '../../../services/api';
import AppBar from '../../Reusable/AppBar';
import HeightSpacer from '../../Reusable/HeightSpacer';

// Hàm tính thời gian bay
const calculateFlightDuration = (departureTime, arrivalTime) => {
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

const AirDetail = ({ navigation, route }) => {
  const { 
    departureFlight: departureFlightParam, 
    returnFlight: returnFlightParam,
    adults = 0,
    children = 0,
    infants = 0
  } = route.params || {};

  const [departureFlight, setDepartureFlight] = useState(departureFlightParam);
  const [returnFlight, setReturnFlight] = useState(returnFlightParam);
  const [isLoadingDeparture, setIsLoadingDeparture] = useState(true);
  const [isLoadingReturn, setIsLoadingReturn] = useState(!!returnFlightParam);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        if (!departureFlight || !departureFlight._id) {
          setIsLoadingDeparture(true);
          const departureData = await getFlightById(departureFlightParam._id);
          setDepartureFlight(departureData);
        }

        if (returnFlightParam && (!returnFlight || !returnFlight._id)) {
          setIsLoadingReturn(true);
          const returnData = await getFlightById(returnFlightParam._id);
          setReturnFlight(returnData);
        }
      } catch (err) {
        console.error('Error fetching flight details:', err);
        setError('Không thể tải thông tin chuyến bay. Vui lòng thử lại.');
      } finally {
        setIsLoadingDeparture(false);
        setIsLoadingReturn(false);
      }
    };

    fetchFlightDetails();
  }, [departureFlightParam, returnFlightParam]);

  const priceToNumber = (price) => {
    if (!price) return 0;
    try {
      return parseFloat(price.replace(/[^\d,.]/g, '').replace(',', '.'));
    } catch {
      return 0;
    }
  };

  const calculateTotalPrice = () => {
    if (!departureFlight || !departureFlight.price) return { totalPrice: 0, breakdown: {} };

    const departurePrice = priceToNumber(departureFlight.price);
    const returnPrice = returnFlight && returnFlight.price ? priceToNumber(returnFlight.price) : 0;

    const adultPrice = departurePrice + returnPrice;
    const childPrice = adultPrice * 0.75;
    const infantPrice = adultPrice * 0.5;

    const totalAdultPrice = adultPrice * adults;
    const totalChildPrice = childPrice * children;
    const totalInfantPrice = infantPrice * infants;
    const totalPrice = totalAdultPrice + totalChildPrice + totalInfantPrice;

    return {
      totalPrice,
      breakdown: {
        adult: { count: adults, unitPrice: adultPrice, total: totalAdultPrice },
        child: { count: children, unitPrice: childPrice, total: totalChildPrice },
        infant: { count: infants, unitPrice: infantPrice, total: totalInfantPrice },
      }
    };
  };

  const { totalPrice, breakdown } = calculateTotalPrice();
  const formattedTotalPrice = totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const renderFlightCard = (flight, isReturn = false, isLoading = false) => {
    if (isLoading) {
      return (
        <View style={[styles.card, styles.loadingCard]}>
          <Text style={styles.loadingText}>Đang tải thông tin chuyến bay...</Text>
        </View>
      );
    }

    if (!flight) return null;

    return (
      <View style={styles.card}>
        <View style={styles.routeRow}>
          <Text style={styles.routeText}>
            {flight.departureName || flight.departureCity} → {flight.arrivalName || flight.arrivalCity}
          </Text>
          <Image source={{ uri: flight.logo }} style={styles.airlineLogo} />
        </View>
        <View style={styles.flightInfoRow}>
          <Text style={styles.dateText}>{flight.date || 'N/A'}</Text>
          <Text style={styles.flightInfo}>
            {flight.flightNumber || 'N/A'} | {flight.ticketType || 'N/A'}
          </Text>
        </View>
        <View style={styles.timeRow}>
          <View style={styles.timeCityContainer}>
            <Text style={styles.timeText}>{flight.departureTime || 'N/A'}</Text>
            <Text style={styles.cityText}>{flight.departureCity || 'N/A'}</Text>
          </View>
          <View style={styles.durationContainer}>
            <Ionicons 
              name={isReturn ? "return-down-back" : "return-up-forward"} 
              size={40} 
              color={COLORS.lightSkyBlue} 
            />
            <Text style={styles.durationText}>
              {calculateFlightDuration(flight.departureTime, flight.arrivalTime)}
            </Text>
          </View>
          <View style={styles.timeCityContainer}>
            <Text style={styles.timeText}>{flight.arrivalTime || 'N/A'}</Text>
            <Text style={styles.cityText}>{flight.arrivalCity || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.policyRow}>
          <TouchableOpacity style={styles.policyButton}>
            <Text style={styles.policyButtonText}>
              {flight.changePolicy ? 'Áp dụng đổi lịch bay' : 'Không đổi lịch'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.refundButton}>
            <Text style={styles.refundButtonText}>
              {flight.refundPolicy ? 'Hoàn tiền theo điều kiện' : 'Không hoàn tiền'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoadingDeparture || isLoadingReturn) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <AppBar
          title="Thông tin chuyến bay"
          color={COLORS.white}
          top={20}
          left={10}
          right={10}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải thông tin chuyến bay...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <AppBar
          title="Thông tin chuyến bay"
          color={COLORS.white}
          top={20}
          left={10}
          right={10}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setIsLoadingDeparture(true);
              setIsLoadingReturn(!!returnFlightParam);
            }}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (adults === 0 && children === 0 && infants === 0) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <AppBar
          title="Thông tin chuyến bay"
          color={COLORS.white}
          top={20}
          left={10}
          right={10}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Vui lòng chọn số lượng khách!</Text>
        </View>
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
          <Text style={styles.sectionTitle}>
          {returnFlight ? 'Chuyến khứ hồi' : 'Chuyến một chiều'}
          </Text>

          {renderFlightCard(departureFlight, false, isLoadingDeparture)}
          {returnFlightParam && renderFlightCard(returnFlight, true, isLoadingReturn)}

          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Tóm tắt giá vé</Text>
            <View style={styles.summaryDivider} />
            {breakdown.adult.count > 0 && (
              <View style={styles.passengerRow}>
                <Text style={styles.summaryText}>
                  Người lớn ({breakdown.adult.count} x {breakdown.adult.unitPrice.toLocaleString('vi-VN')} đ)
                </Text>
                <Text style={styles.priceText}>
                  {breakdown.adult.total.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            )}
            {breakdown.child.count > 0 && (
              <View style={styles.passengerRow}>
                <Text style={styles.summaryText}>
                  Trẻ em ({breakdown.child.count} x {breakdown.child.unitPrice.toLocaleString('vi-VN')} đ)
                </Text>
                <Text style={styles.priceText}>
                  {breakdown.child.total.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            )}
            {breakdown.infant.count > 0 && (
              <View style={styles.passengerRow}>
                <Text style={styles.summaryText}>
                  Em bé ({breakdown.infant.count} x {breakdown.infant.unitPrice.toLocaleString('vi-VN')} đ)
                </Text>
                <Text style={styles.priceText}>
                  {breakdown.infant.total.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TỔNG TIỀN:</Text>
              <Text style={styles.totalPrice}>{formattedTotalPrice}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('CustomerInfo', {
              departureFlight,
              returnFlight,
              adults,
              children,
              infants,
              totalPrice
            })}
          >
            <Text style={styles.continueButtonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.medium,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: TEXT.large-3,
    fontWeight: 'bold',
    color: COLORS.blue,
    marginBottom: SIZES.medium,
    paddingHorizontal: SIZES.medium,
    textAlign: "center"
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 1,
  },
  loadingCard: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  routeText: {
    fontSize: TEXT.medium+1,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  airlineLogo: {
    width: 90,
    height: 50,
    resizeMode: 'contain',
  },
  flightInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  dateText: {
    fontSize: TEXT.small,
    color: COLORS.gray,
  },
  flightInfo: {
    fontSize: TEXT.small,
    color: COLORS.gray,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SIZES.small,
  },
  timeCityContainer: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: TEXT.medium+1,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  cityText: {
    fontSize: TEXT.small,
    color: COLORS.gray,
    backgroundColor: COLORS.lightGray,
    paddingVertical: SIZES.xSmall,
    paddingHorizontal: SIZES.small,
    borderRadius: SIZES.small,
    marginTop: SIZES.xSmall,
  },
  durationContainer: {
    alignItems: 'center',
  },
  durationText: {
    fontSize: TEXT.small,
    color: COLORS.gray,
    marginTop: SIZES.xSmall,
  },
  policyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.small,
  },
  policyButton: {
    padding: SIZES.small,
    borderRadius: SIZES.small,
    borderColor: COLORS.pink,
    borderWidth: 2,
  },
  policyButtonText: {
    fontSize: TEXT.xSmall,
    color: COLORS.pink,
    fontWeight: '600',
  },
  refundButton: {
    padding: SIZES.xSmall,
    borderRadius: SIZES.small,
    borderColor: COLORS.mint,
    borderWidth: 2,
  },
  refundButtonText: {
    fontSize: TEXT.xSmall,
    color: COLORS.mint,
    fontWeight: '600',
  },
  summarySection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    marginTop: SIZES.medium,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: TEXT.large-2,
    fontWeight: 'bold',
    color: COLORS.blue,
    marginBottom: SIZES.small,
    textAlign: 'center',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.small,
  },
  passengerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SIZES.xSmall,
  },
  summaryText: {
    fontSize: TEXT.medium,
    color: COLORS.dark,
    fontWeight: '500',
  },
  priceText: {
    fontSize: TEXT.medium,
    fontWeight: 'bold',
    color: COLORS.red,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.medium,
    paddingTop: SIZES.small,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  totalLabel: {
    fontSize: TEXT.large-3,
    fontWeight: 'bold',
    color: COLORS.blue,
  },
  totalPrice: {
    fontSize: TEXT.large-3,
    fontWeight: 'bold',
    color: COLORS.red,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  continueButton: {
    backgroundColor: COLORS.red,
    padding: SIZES.medium,
    borderRadius: SIZES.medium,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: TEXT.medium,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  errorText: {
    fontSize: TEXT.medium,
    color: COLORS.red,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  retryButton: {
    backgroundColor: COLORS.blue,
    padding: SIZES.medium,
    borderRadius: SIZES.medium,
  },
  retryButtonText: {
    fontSize: TEXT.medium,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: TEXT.medium,
    color: COLORS.gray,
    textAlign: 'center',
  }
});

export default AirDetail;