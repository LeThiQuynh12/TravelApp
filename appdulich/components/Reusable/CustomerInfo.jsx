import React, { useState } from 'react';

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import {
  COLORS,
  SIZES,
  TEXT,
} from '../../constants/theme';
import AppBar from './AppBar';
import HeightSpacer from './HeightSpacer';

const CustomerInfo = ({ navigation }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Sample data for linked accounts
  const linkedAccounts = [
    { 
      id: 'mb', 
      type: 'bank',
      name: 'MB Bank', 
      logo: 'https://logo.clearbit.com/mbbank.com.vn', 
      number: '*2271',
      holderName: 'Nguyễn Văn A',
      linkedDate: '15/10/2023'
    },
    { 
      id: 'momo', 
      type: 'ewallet',
      name: 'MoMo', 
      logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-1024x1024.png', 
      number: '*8781',
      holderName: 'Nguyễn Văn A',
      linkedDate: '20/10/2023'
    }
  ];

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
        <Text style={styles.title}>Thông tin khách hàng</Text>
        
        {/* Customer information section */}
        <View style={styles.infoContainer}>
          <Text style={styles.text}>Họ và tên <Text style={styles.must}>(*)</Text></Text>
          <TextInput style={styles.input} placeholder="Nhập họ và tên" />
          
          <Text style={styles.text}>Số điện thoại <Text style={styles.must}>(*)</Text></Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />
          
          <Text style={styles.text}>Email <Text style={styles.must}>(*)</Text></Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nhập email"
            keyboardType="email-address"
          />
        </View>
        
      
        <Text style={styles.title}>Tài khoản thanh toán</Text>

        {/* Linked accounts section */}
        <View style={styles.accountsContainer}>
          {linkedAccounts.map((account) => (
            <TouchableOpacity 
              key={account.id}
              style={[
                styles.bankCard,
                selectedPayment === account.id && styles.selectedAccount
              ]}
              onPress={() => setSelectedPayment(account.id)}
              onLongPress={() => navigation.navigate('AccountDetail', { account })}
            >
              <View style={styles.bankInfo}>
                <Image 
                  style={styles.bankLogo} 
                  source={{uri: account.logo}} 
                />
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
        </View>
        
        <HeightSpacer height={20}/>
        <TouchableOpacity 
          style={[
            styles.button,
            !selectedPayment && { backgroundColor: COLORS.red }
          ]}
          disabled={!selectedPayment}
          onPress={() => navigation.navigate("Confirmation")}
        >
          <Text style={styles.buttonText}>Đặt ngay</Text>
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
    alignItems: "center",
    marginTop: SIZES.medium,
    marginHorizontal: 10,
  
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: TEXT.medium,
  },
});

export default CustomerInfo;