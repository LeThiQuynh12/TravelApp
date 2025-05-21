import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Linking,ActivityIndicator } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import AppBar from '../../Reusable/AppBar';
import { COLORS,SIZES } from '../../../constants/theme';
import { getOrderById,getHotelByRoomId,getRoomById, deleteOrderById,
  getFlightById
 } from '../../../services/api';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import BottomTabNavigation from '../../../navigation/BottomTabNavigation';
const BookingDetails = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotelName, setHotelName] = useState("");
  const [room, setRoom] = useState(null);
  const [departureFlight, setDepartureFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);
  useEffect(() => {
  const fetchOrder = async () => {
    setLoading(true);
    try {
      console.log("orderId:", orderId);
      const res = await getOrderById(orderId);
      if (res?.order) {
        setOrder(res.order);
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy đơn hàng');
        setOrder(null);
      }
    } catch (err) {
      console.log('Lỗi getOrderById:', err);
      Alert.alert('Lỗi', 'Không thể tải thông tin đơn hàng');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    fetchOrder();
  } else {
    setLoading(false);
    setOrder(null);
  }
}, [orderId]);

useEffect(() => {
  const fetchHotelName = async () => {
    if (order?.service_type !== 'hotel') return;
    try {
      const roomId = order?.service_id;
      if (roomId) {
        const res = await getHotelByRoomId(roomId);
        console.log('Hotel API response:', res);
        if (res?.data?.title) {
          setHotelName(res.data.title);
        }
      } else {
        setHotelName(null);
      }
    } catch (error) {
      console.error('Lỗi khi lấy tên khách sạn:', error.message);
      setHotelName(null);
    }
  };

  fetchHotelName();
}, [order]);

useEffect(() => {
    const fetchRoomInfo = async () => {
      if (order?.service_type !== 'hotel') return;
      try {
        const roomId = order?.service_id;
        if (roomId) {
          const res = await getRoomById(roomId);
          if (res?.data) {
            setRoom(res.data);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin phòng:', error.message);
        setRoom(null);
      }
    };

    if (order) {
      fetchRoomInfo();
    }
  }, [order]);
  useEffect(() => {
  const fetchFlightDetails = async () => {
    if (order?.service_type !== 'flight') return;
    try {
      setLoading(true);

      // Lấy ID chuyến đi & chuyến về từ order
      const departureId = order.service_id;
      const returnId = order.transaction_id;

      if (departureId) {
        const data = await getFlightById(departureId);
        setDepartureFlight(data);
      }

      if (returnId) {
        const data = await getFlightById(returnId);
        setReturnFlight(data);
      }

    } catch (error) {
      console.log('Lỗi khi lấy thông tin chuyến bay:', error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchFlightDetails();
}, [order]);
  if (!orderId) {
    return (
      <View style={styles.container}>
        <AppBar
          top={40}
          left={20}
          right={20}
          title={'Chi tiết đơn hàng'}
          color={COLORS.white}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không tìm thấy mã đơn hàng</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <AppBar
          top={40}
          left={20}
          right={20}
          title={'Chi tiết đơn hàng'}
          color={COLORS.white}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text>Đang tải thông tin đơn hàng...</Text>
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <AppBar
          top={40}
          left={20}
          right={20}
          title={'Chi tiết đơn hàng'}
          color={COLORS.white}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không tìm thấy thông tin đơn hàng</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  const handleCancel = async () => {
    try {
      // show loading nếu bạn muốn
      await deleteOrderById(orderId);
      Alert.alert('Thành công', 'Đã hủy đơn hàng thành công', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể hủy đơn hàng, vui lòng thử lại');
    }
  };
  // Hàm hiển thị chi tiết khách sạn
  const renderHotelDetails = () => {
   if (!room) return null;
  
  return (
    <View style={styles.serviceCard}>
      <Text style={styles.cardTitle}>Thông tin đặt phòng</Text>

      <TouchableOpacity
        style={styles.hotelHeader}
        onPress={() => navigation.navigate('HotelDetails', { id: room.hotelid._id })}
      >
        <Text style={styles.hotelName}>{hotelName}</Text>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      <Image
        source={{ uri: room.images?.[0]?.uri || 'https://via.placeholder.com/300' }}
        style={styles.serviceImage}
      />

      <Text style={styles.serviceName}>{room.name || order.service_name}</Text>

      <View style={styles.detailRow}>
        <Ionicons name="person-outline" size={18} color={COLORS.gray} />
        <Text style={styles.detailText}>Số khách: {room.capacity || 1} người</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="bed-outline" size={18} color={COLORS.gray} />
        <Text style={styles.detailText}>Loại giường: {room.bed || 'Giường đôi'}</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="resize-outline" size={18} color={COLORS.gray} />
        <Text style={styles.detailText}>Diện tích: {room.size || '--'} m²</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="pricetag-outline" size={18} color={COLORS.gray} />
        <Text style={styles.detailText}>Giá cũ: {room.oldPrice || '--'}đ</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="pricetag" size={18} color={COLORS.primary} />
        <Text style={styles.detailText}>Giá mới: {room.newPrice || '--'}đ</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="construct-outline" size={18} color={COLORS.gray} />
        <Text style={styles.detailText}>Tiện nghi: {room.facilities || '--'}</Text>
      </View>
    </View>
  );
};

  // Hàm hiển thị chi tiết vé máy bay
  const renderFlightDetails = () => {
    if (loading) {
      return <Text>Đang tải thông tin chuyến bay...</Text>;
    }

    if (!departureFlight) {
      return <Text>Không có thông tin chuyến bay.</Text>;
    }

    return (
      <View style={styles.serviceCard}>
        <Text style={styles.cardTitle}>Thông tin chuyến bay</Text>

        <View style={styles.flightHeader}>
          <Text style={styles.flightType}>Chuyến {returnFlight ? 'đi' : 'một chiều'}</Text>
        </View>

        <View style={styles.flightRoute}>
          <View style={styles.airport}>
            <Text style={styles.airportCode}>{departureFlight.departureAirport}</Text>
            <Text style={styles.airportCity}>{departureFlight.departureCity}</Text>
          </View>

          <View style={styles.flightDuration}>
            <Ionicons name="airplane" size={20} color={COLORS.primary} />
          </View>

          <View style={styles.airport}>
            <Text style={styles.airportCode}>{departureFlight.arrivalAirport}</Text>
            <Text style={styles.airportCity}>{departureFlight.arrivalCity}</Text>
          </View>
        </View>

        <View style={styles.flightInfo}>
          <Text style={styles.flightDate}>{departureFlight.departureDate}</Text>
          <Text style={styles.flightTime}>
            {departureFlight.departureTime} - {departureFlight.arrivalTime}
          </Text>
        </View>

        <View style={styles.flightDetail}>
          <Text style={styles.flightAirline}>{departureFlight.airline}</Text>
          <Text style={styles.flightNumber}>
            {departureFlight.flightNumber} | {departureFlight.ticketType}
          </Text>
        </View>

        <View style={styles.passengerInfo}>
          <Text style={styles.passengerText}>
            Người lớn: {order.extra_data?.numberOfSeats || 1} x {departureFlight.price?.toLocaleString('vi-VN')}đ
          </Text>
        </View>

        {returnFlight && (
          <>
            <View style={styles.divider} />
            <Text style={styles.cardTitle}>Chuyến về</Text>

            <View style={styles.flightRoute}>
              <View style={styles.airport}>
                <Text style={styles.airportCode}>{returnFlight.departureAirport}</Text>
                <Text style={styles.airportCity}>{returnFlight.departureCity}</Text>
              </View>

              <View style={styles.flightDuration}>
                <Ionicons name="airplane" size={20} color={COLORS.primary} />
              </View>

              <View style={styles.airport}>
                <Text style={styles.airportCode}>{returnFlight.arrivalAirport}</Text>
                <Text style={styles.airportCity}>{returnFlight.arrivalCity}</Text>
              </View>
            </View>

            <View style={styles.flightInfo}>
              <Text style={styles.flightDate}>{returnFlight.departureDate}</Text>
              <Text style={styles.flightTime}>
                {returnFlight.departureTime} - {returnFlight.arrivalTime}
              </Text>
            </View>

            <View style={styles.flightDetail}>
              <Text style={styles.flightAirline}>{returnFlight.airline}</Text>
              <Text style={styles.flightNumber}>
                {returnFlight.flightNumber} | {returnFlight.ticketType}
              </Text>
            </View>
          </>
        )}
      </View>
    );
  };

  // Hàm hiển thị thông tin chung
  const renderCommonDetails = () => {
    return (
      <View style={styles.summaryCard}>
        <View style={styles.header}>
          <MaterialIcons name="confirmation-number" size={24} color={COLORS.primary} />
          <Text style={styles.headerText}>Đơn hàng #{order.order_id}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.orderInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày đặt:</Text>
            <Text style={styles.infoValue}>
              {new Date(order.created_at).toLocaleDateString('vi-VN')}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái:</Text>
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusIndicator,
                order.status === 'paid' && {backgroundColor: COLORS.green},
                order.status === 'pending' && {backgroundColor: COLORS.orange},
                order.status === 'failed' && {backgroundColor: COLORS.red}
              ]} />
              <Text style={[
                styles.infoValue,
                order.status === 'paid' && {color: COLORS.green},
                order.status === 'pending' && {color: COLORS.orange},
                order.status === 'failed' && {color: COLORS.red}
              ]}>
                {order.status === 'paid' ? 'Đã thanh toán' : 
                 order.status === 'pending' ? 'Chờ xử lý' : 'Thất bại'}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tổng tiền:</Text>
            <Text style={[styles.infoValue, styles.totalPrice]}>
              {order.total_amount.toLocaleString('vi-VN')}₫
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Hàm hiển thị thông tin thanh toán
  const renderPaymentDetails = () => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Thông tin thanh toán</Text>
        
        <View style={styles.paymentRow}>
          <MaterialIcons name="payment" size={20} color={COLORS.gray} />
          <Text style={styles.infoText}>
            Phương thức: {order.payment_method}
          </Text>
        </View>
        
        {order.transaction_id && (
          <View style={styles.paymentRow}>
            <MaterialIcons name="receipt" size={20} color={COLORS.gray} />
            <Text style={styles.infoText}>Mã giao dịch: {order.transaction_id}</Text>
          </View>
        )}
        
        <View style={styles.paymentRow}>
          <MaterialIcons name="date-range" size={20} color={COLORS.gray} />
          <Text style={styles.infoText}>
            Thời gian đặt: {order.updated_at ? 
              new Date(order.updated_at).toLocaleString('vi-VN') : '--'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppBar
        top={40}
        left={20}
        right={20}
        title={'Chi tiết đơn hàng'}
        color={COLORS.white}
        onPress={() => navigation.navigate("Bottom")}
      />
      
      <ScrollView style={styles.content}>
        {renderCommonDetails()}
        
        {/* Hiển thị theo loại dịch vụ */}
        {order.service_type === 'hotel' && renderHotelDetails()}
        {order.service_type === 'flight' && renderFlightDetails()}
        
        {renderPaymentDetails()}
        
        {/* Nút hành động */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                Alert.alert(
                  'Hủy đơn hàng',
                  'Bạn có chắc chắn muốn hủy đơn hàng này?',
                  [
                    { text: 'Không', style: 'cancel' },
                    { text: 'Có',onPress: handleCancel}
                  ]
                );
              }}
            >
              <MaterialIcons name="cancel" size={18} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Hủy đơn</Text>
            </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.contactButton]}
            onPress={() => Linking.openURL(`tel:19001234`)}
          >
            <Ionicons name="headset-outline" size={18} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Hỗ trợ</Text>
          </TouchableOpacity>
          
          {/* {order.status === 'pending' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                Alert.alert(
                  'Hủy đơn hàng',
                  'Bạn có chắc chắn muốn hủy đơn hàng này?',
                  [
                    { text: 'Không', style: 'cancel' },
                    { text: 'Có',onPress: handleCancel}
                  ]
                );
              }}
            >
              <MaterialIcons name="cancel" size={18} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Hủy đơn</Text>
            </TouchableOpacity>
          )} */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  content: {
    padding: SIZES.medium,
    marginTop: 70,
    marginBottom: 40
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: SIZES.medium,
    color: COLORS.red,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  headerText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: SIZES.small,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGrey,
    marginVertical: SIZES.small,
  },
  orderInfo: {
    marginTop: SIZES.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  infoLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  infoValue: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.medium,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  hotelName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  serviceImage: {
    width: '100%',
    height: 180,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
  },
  serviceName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.small,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  detailText: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    marginLeft: SIZES.small,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  flightType: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  flightRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  airport: {
    alignItems: 'center',
    flex: 1,
  },
  airportCode: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  airportCity: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  flightDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.small,
  },
  flightInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  flightDate: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
  },
  flightTime: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  flightDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  flightAirline: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
  },
  flightNumber: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  passengerInfo: {
    marginTop: SIZES.medium,
    paddingTop: SIZES.small,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
  },
  passengerText: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  infoText: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    marginLeft: SIZES.small,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.medium,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.small,
    borderRadius: SIZES.small,
    marginHorizontal: SIZES.small / 2,
  },
  downloadButton: {
    backgroundColor: COLORS.primary,
  },
  contactButton: {
    backgroundColor: COLORS.blue,
  },
  cancelButton: {
    backgroundColor: COLORS.red,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: SIZES.small,
    marginLeft: SIZES.small / 2,
  },
});

export default BookingDetails;