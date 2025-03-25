import React, { useState } from 'react';

import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  COLORS,
  SIZES,
  TEXT,
} from '../../constants/theme';
import AppBar from './AppBar';
import HeightSpacer from './HeightSpacer';

const CustomerInfo = ({ navigation }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const paymentMethods = [
    { id: 'momo', name: 'MoMo', image: {uri: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-1024x1024.png"} },
    { id: 'zalopay', name: 'ZaloPay', image: {uri: "https://cdn.prod.website-files.com/5fb85f262823b4390bcfe076/66965d8419182b6ff385a01f_zalopay_logo_preview.webp"} },
    { id: 'vnpay', name: 'VNPay', image: {uri: "https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png"} },
  ];

  return (
    <View style={styles.container}>
      <AppBar
        top={50}
        left={20}
        right={20}
        title={'Điền thông tin'}
        color={COLORS.white}
        // icon={'search1'}
        // color1={COLORS.white}
        onPress={() => navigation.goBack()}
        // onPress1={() => navigation.navigate('HotelSearch')}
        style={{ marginBottom: 20 }}
      />
      
      <HeightSpacer height={100} />
      <Text style={styles.title}>Thông tin khách hàng</Text>
      <HeightSpacer height={20} />
      
      {/* Thông tin khách hàng */}
      <View style={styles.infoContainer}>
        <Text style={styles.text}>Họ và tên <Text style={styles.must}>(*)</Text></Text>
        <TextInput style={styles.input} />
        
        <Text style={styles.text}>Số điện thoại <Text style={styles.must}>(*)</Text></Text>
        <TextInput style={styles.input} />
        
        <Text style={styles.text}>Email <Text style={styles.must}>(*)</Text></Text>
        <TextInput style={styles.input} />
      </View>
      
      <HeightSpacer height={10} />
      <Text style={styles.title}>Phương thức thanh toán</Text>

      {/* Box hiển thị phương thức thanh toán đã chọn */}
      {selectedPayment && (
        <View style={styles.selectedPaymentBox}>
          <Image source={paymentMethods.find(m => m.id === selectedPayment)?.image} style={styles.paymentIconLarge} />
          <Text style={styles.selectedPaymentText}>{paymentMethods.find(m => m.id === selectedPayment)?.name}</Text>
        </View>
      )}
      
      <HeightSpacer height={20}/>
      <View style={styles.paymentContainer}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[styles.paymentOption, selectedPayment === method.id && styles.selectedPayment]}
            onPress={() => setSelectedPayment(method.id)}
          >
            <Image source={method.image} style={styles.paymentIcon} />
            <Text>{method.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
<HeightSpacer height={20}/>
<TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate("CustomerInfo")}
      >
        <Text style={styles.buttonText}>Đặt ngay</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default CustomerInfo;

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
  },
  title: {
    color: COLORS.blue,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginLeft: 13,
  },
  paymentContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: "#87CEEB",
    padding: 12,
    borderRadius: 10,
    width: '30%',
    justifyContent: 'center',
  },
  paymentIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 5,
  },
  paymentIconLarge: {
    width: 50,
    height: 50,
    marginBottom: 5,
    borderRadius: 8,
  },
  selectedPayment: {
    // backgroundColor: "#ADD8E6",
    borderWidth: 2,
    borderColor: "green",
  },
  selectedPaymentBox: {
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: "#DAA520",

  },
  selectedPaymentText: {
    fontSize: SIZES.medium,
    color: "purple",
    fontWeight: 'bold',
    marginLeft: 20,
  },
  button: {
    backgroundColor: COLORS.green,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: "center",
    marginTop: SIZES.medium,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: TEXT.medium,
  },
});
