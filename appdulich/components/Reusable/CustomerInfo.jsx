import React, { useState } from 'react';

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import {
  COLORS,
  SIZES,
  TEXT,
} from '../../constants/theme';
import AppBar from './AppBar';
import HeightSpacer from './HeightSpacer';
import { getUser,createVnpayPayment,createOrder} from '../../services/api';

const CustomerInfo = ({ navigation, route }) => {
  const { room, departureBus, returnBus, departureFlight, returnFlight, numberOfSeats = 1 } = route?.params || {};


  // State để lưu giá trị input
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);

  // State để lưu thông báo lỗi
  const [errors, setErrors] = useState({
    payment: '',
  });

  // Sample data for linked accounts
  const linkedAccounts = [
    {
      id: 'mb',
      type: 'bank',
      name: 'MB Bank',
      logo: 'https://logo.clearbit.com/mbbank.com.vn',
      number: '*2271',
      holderName: 'Nguyễn Văn A',
      linkedDate: '15/10/2023',
    },
    {
      id: 'momo',
      type: 'ewallet',
      name: 'MoMo',
      logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-1024x1024.png',
      number: '*8781',
      holderName: 'Nguyễn Văn A',
      linkedDate: '20/10/2023',
    },
  ];

  // Hàm validate dữ liệu
  const validateInputs = () => {
    const newErrors = {
      payment: '',
    };
    let isValid = true;

    // Kiểm tra họ và tên
    // if (!fullName.trim()) {
    //   newErrors.fullName = 'Vui lòng nhập họ và tên.';
    //   isValid = false;
    // }

    // // Kiểm tra số điện thoại
    // const phoneRegex = /^[0-9]{10,}$/;
    // if (!phoneRegex.test(phoneNumber)) {
    //   newErrors.phoneNumber = 'Số điện thoại không hợp lệ.';
    //   isValid = false;
    // }

    // // Kiểm tra email
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   newErrors.email = 'Email không hợp lệ.';
    //   isValid = false;
    // }

    // Kiểm tra tài khoản thanh toán
    if (!selectedPayment) {
      newErrors.payment = 'Vui lòng chọn tài khoản thanh toán.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Hàm xử lý khi nhấn nút "Đặt ngay"
  const handleBooking = async () => {
  try {
    const userResponse = await getUser();
    const user = userResponse?.data || userResponse;

    if (!user) {
      Alert.alert('Lỗi', 'Không lấy được thông tin người dùng');
      return;
    }

    // Kiểm tra form (nếu có dùng input người dùng)
    const isValid = validateInputs?.(); // dùng optional chaining nếu không có validateInputs
    if (isValid === false) return;

    // Kiểm tra tài khoản thanh toán
    const paymentAccount = linkedAccounts.find((account) => account.id === selectedPayment);
    if (!paymentAccount) {
      Alert.alert('Lỗi', 'Vui lòng chọn tài khoản thanh toán.');
      return;
    }

    let orderData = null;

    if (room) {
      // 🏨 Đặt phòng khách sạn
      orderData = {
        user_id: user._id || user.id,
        service_id: room._id || room.id,
        service_type: 'hotel',
        service_name: room.name || 'Đặt phòng khách sạn',
        total_amount: room.newPrice || 0,
        status: 'paid',
        payment_method: paymentAccount.name,
      };
    } else if (departureBus) {
     
      const priceToNumber = (price) => parseFloat(String(price).replace(/[^\d]/g, '')) || 0;
      const departurePrice = priceToNumber(departureBus.price) * numberOfSeats;
      const returnPrice = returnBus ? priceToNumber(returnBus.price) * numberOfSeats : 0;

      const total = departurePrice + returnPrice;

      orderData = {
        user_id: user._id || user.id,
        service_id: departureBus._id || departureBus.id,
        service_type: 'bus',
        service_name: `Đặt vé xe khách: ${departureBus.departureCity} → ${departureBus.arrivalCity}`,
        total_amount: total,
        status: 'paid',
        payment_method: paymentAccount.name,
        extra_data: {
          departureBus,
          returnBus,
          numberOfSeats,
        },
      };
    } else if (departureFlight) {
    const flightPrice = (flight) => {
      if (flight.basePrice && flight.taxes) {
        const base = parseFloat(String(flight.basePrice).replace(/[^\d]/g, '')) || 0;
        const taxes = parseFloat(String(flight.taxes).replace(/[^\d]/g, '')) || 0;
        return base + taxes;
      } else if (flight.price) {
        return parseFloat(String(flight.price).replace(/[^\d]/g, '')) || 0;
      }
      return 0;
    };

    const depPrice = flightPrice(departureFlight) * numberOfSeats;
    const retPrice = returnFlight ? flightPrice(returnFlight) * numberOfSeats : 0;
    const total = depPrice + retPrice;

    if (total <= 0) {
      Alert.alert('Lỗi', 'Tổng tiền đặt vé không hợp lệ.');
      return;
    }

    orderData = {
      user_id: user._id || user.id,
      service_id: departureFlight._id || departureFlight.id,
      service_type: 'flight',
      service_name: `Đặt vé máy bay: ${departureFlight.departureCity} → ${departureFlight.arrivalCity}`,
      total_amount: total,
      status: 'paid',
      payment_method: paymentAccount.name,
      extra_data: {
        departureFlight,
        returnFlight,
        numberOfSeats,
      },
    };
  }

    if (!orderData) {
      Alert.alert('Lỗi', 'Không có thông tin dịch vụ để đặt.');
      return;
    }

    console.log('Dữ liệu gửi lên:', JSON.stringify(orderData));

    const res = await createOrder(orderData);

    if (res?.success) {
      Alert.alert('Thành công', 'Đặt dịch vụ thành công!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('BookingDetails', { orderId: res.order.order_id });
          },
        },
      ]);
    } else {
      console.error('Phản hồi lỗi:', res);
      Alert.alert('Lỗi', 'Không thể tạo đơn hàng.');
    }
  } catch (error) {
    console.error('Lỗi tạo đơn hàng:', error);
    Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi khi đặt dịch vụ.');
  }
};

  // thanh toán vnpay 
  const handleVnpayPayment = async () => {
  try {
    // Lấy user từ API, response có dạng { status: true, data: user }
    const userResponse = await getUser();
    const user = userResponse?.data || userResponse; // nếu getUser chưa chỉnh sửa thì phải lấy data từ userResponse.data

    if (!user) {
      Alert.alert('Lỗi', 'Không lấy được thông tin người dùng');
      return;
    }

    // Lấy thông tin phòng từ param
    const { room } = route.params;

    const data = {
      user_id: user._id || user.id,
      service_id: room._id || room.id,
      service_type: 'hotel',
      service_name: room.name || 'Đặt phòng khách sạn',
      total_amount: room.newPrice || 0, // hoặc số tiền bạn muốn thanh toán
    };

    console.log('Gửi dữ liệu tạo thanh toán VNPay:', JSON.stringify(data));

    const res = await createVnpayPayment(data);

    if (res?.payment_url) {
      Linking.openURL(res.payment_url);
    } else {
      Alert.alert('Lỗi', 'Không nhận được link thanh toán VNPay!');
    }
  } catch (error) {
    console.error('Lỗi thanh toán VNPay:', error);
    Alert.alert('Lỗi', error.message || 'Không thể thực hiện thanh toán!');
  }
};

  return (
    <ScrollView>
      <View style={styles.container}>
        <AppBar
          top={50}
          left={20}
          right={20}
          title={'Điền thông tin'}
          color={COLORS.white}
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 20 }}
        />

        <HeightSpacer height={85} />
        

        <Text style={styles.title}>Thanh toán qua tài khoản đã liên kết</Text>

        {/* Linked accounts section */}
        <View style={styles.accountsContainer}>
          {linkedAccounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              style={[
                styles.bankCard,
                selectedPayment === account.id && styles.selectedAccount,
              ]}
              onPress={() => {
                setSelectedPayment(account.id);
                setErrors({ ...errors, payment: '' }); // Xóa lỗi khi chọn
              }}
              onLongPress={() => navigation.navigate('AccountDetail', { account })}
            >
              <View style={styles.bankInfo}>
                <Image style={styles.bankLogo} source={{ uri: account.logo }} />
                <View>
                  <Text style={styles.bankName}>{account.name}</Text>
                  <Text style={styles.accountHolder}>{account.holderName}</Text>
                </View>
              </View>
              <Text style={styles.cardNumber}>{account.number}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('Bank')}
          >
            <MaterialIcons name="add" size={24} color={COLORS.primary} />
            <Text style={styles.addButtonText}>Thêm tài khoản thanh toán</Text>
          </TouchableOpacity>

          {errors.payment ? <Text style={styles.errorText}>{errors.payment}</Text> : null}
        </View>

        <HeightSpacer height={20} />
        <TouchableOpacity
          style={styles.button}
          onPress={handleBooking}
        >
          <Text style={styles.buttonText}>Đặt ngay</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={handleVnpayPayment}>
            <View style={styles.buttonvnp}>
              <Image style={styles.bankLogo} source={{ uri: 'https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg' }} />
              <Text style={styles.vnpay} > Thanh toán bằng VNPay  </Text>
            </View>
          </TouchableOpacity>
          
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
  },
  infoContainer: {
    marginHorizontal: 10,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 20,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: SIZES.medium - 1,
    color: COLORS.gray,
    fontWeight: 'bold',
  },
  must: {
    color: COLORS.red,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    padding: 16,
    borderRadius: 20,
    marginVertical: 10,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.red,
  },
  errorText: {
    color: COLORS.red,
    fontSize: SIZES.small,
    marginBottom: 10,
    marginLeft: 10,
  },
  title: {
    color: COLORS.blue,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginLeft: 13,
    marginBottom: 10,
  },
  accountsContainer: {
    marginHorizontal: 10,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 20,
    padding: 15,
  },
  bankCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  vnpayCard:{
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  selectedAccount: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightPrimary,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  bankName: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    fontWeight: '500',
  },
  accountHolder: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  cardNumber: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 15,
    borderStyle: 'dashed',
  },
  vnpay:{
    fontSize: SIZES.medium,
    color: COLORS.white,
    alignItems:'center',
    fontWeight: 'bold',
  },
  addButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    marginLeft: 10,
    fontWeight: '500',
  },
  button: {
    backgroundColor: COLORS.green,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginTop: SIZES.medium,
    marginHorizontal: 10,
  },
  buttonvnp: {
    backgroundColor: COLORS.green,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems:'center',
    marginTop: SIZES.medium,
    marginHorizontal: 10,
    flexDirection:'row',
    justifyContent:'center',
    
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: TEXT.medium,
  },
});

export default CustomerInfo;