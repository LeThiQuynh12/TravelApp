import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import AppBar from '../../components/Reusable/AppBar';
import { MaterialIcons } from '@expo/vector-icons';

const Payment = ({ navigation }) => {
    
  const linkedAccounts = [
    {
      id: '1',
      bankCode: 'MB',
      accountNumber: '*2271',
      accountName: 'Nguyễn Văn A'
    }
  ];

  const handleUnlink = (accountId) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn hủy liên kết tài khoản này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đồng ý', 
          onPress: () => {
            // Xử lý hủy liên kết ở đây
            Alert.alert('Thành công', 'Hủy liên kết thành công');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="Thanh toán"
        color={COLORS.white}
        top={50}
        left={20}
        right={20}
        onPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Tài khoản đã liên kết</Text>
        
        {linkedAccounts.map(account => (
          <View key={account.id} style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <Text style={styles.bankCode}>{account.bankCode}</Text>
              <Text style={styles.accountNumber}>{account.accountNumber}</Text>
            </View>
            
            <Text style={styles.accountName}>
              {account.accountName.replace(/.(?=.{3})/g, '*')}
            </Text>
            
            <TouchableOpacity 
              style={styles.unlinkButton}
              onPress={() => handleUnlink(account.id)}
            >
              <Text style={styles.unlinkButtonText}>Hủy liên kết</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddBank')}
        >
          <MaterialIcons name="add" size={24} color={COLORS.primary} />
          <Text style={styles.addButtonText}>Thêm tài khoản ngân hàng</Text>
        </TouchableOpacity>
        
        <View style={styles.verifySection}>
          <Text style={styles.verifyTitle}>Xác Thực</Text>
          <Text style={styles.verifyText}>Vui lòng xác thực OTP khi thực hiện giao dịch</Text>
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
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 20,
  },
  accountCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bankCode: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginRight: 10,
  },
  accountNumber: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  accountName: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    marginBottom: 15,
  },
  unlinkButton: {
    alignSelf: 'flex-end',
  },
  unlinkButtonText: {
    color: COLORS.error,
    fontSize: SIZES.small,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    marginVertical: 20,
    justifyContent: 'center',
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    marginLeft: 10,
  },
  verifySection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: COLORS.lightPrimary,
    borderRadius: 8,
  },
  verifyTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 5,
  },
  verifyText: {
    fontSize: SIZES.small,
    color: COLORS.dark,
  },
});

export default Payment;