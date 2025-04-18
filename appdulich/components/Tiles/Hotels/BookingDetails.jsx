import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import AppBar from '../../Reusable/AppBar';
import { COLORS, SIZES, TEXT } from '../../../constants/theme';

const BookingDetails = ({ navigation, route }) => {
  const { bookingDetails } = route.params;
  const paymentMethod = bookingDetails.paymentMethod;
  const room = bookingDetails.room; // Get room details from bookingDetails

  const handleCancelBooking = () => {
    Alert.alert(
      'Hủy đặt phòng',
      'Bạn có chắc chắn muốn hủy đặt phòng này?',
      [
        {
          text: 'Không',
          style: 'cancel',
        },
        {
          text: 'Có',
          onPress: () => {
            // Handle cancellation logic here
            navigation.navigate('Bottom');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <AppBar
        top={40}
        left={20}
        right={20}
        title={'Chi tiết đặt phòng'}
        color={COLORS.white}
        onPress={() => navigation.navigate("Bottom")}
      />
      
      <ScrollView style={styles.content}>
        {/* Booking Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.header}>
            <MaterialIcons name="confirmation-number" size={24} color={COLORS.primary} />
            <Text style={styles.headerText}>Đặt phòng thành công</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.bookingInfo}>
            <Text style={styles.infoLabel}>Mã đặt phòng</Text>
            <Text style={styles.infoValue}>#PH{Math.floor(Math.random() * 10000)}</Text>
            
            <Text style={styles.infoLabel}>Ngày đặt</Text>
            <Text style={styles.infoValue}>{new Date().toLocaleDateString('vi-VN')}</Text>
            
            <Text style={styles.infoLabel}>Trạng thái</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusIndicator} />
              <Text style={[styles.infoValue, {color: COLORS.green}]}>Đã xác nhận</Text>
            </View>
          </View>
        </View>

        {/* Room Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin phòng</Text>
          
          <Image 
            source={{uri: room.images[0]?.uri}} 
            style={styles.roomImage} 
          />
          
          <Text style={styles.roomName}>{room.name}</Text>
          
          <View style={styles.roomDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={18} color={COLORS.gray} />
              <Text style={styles.detailText}>Sức chứa: {room.capacity}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="bed-outline" size={18} color={COLORS.gray} />
              <Text style={styles.detailText}>Loại giường: {room.bed}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="resize-outline" size={18} color={COLORS.gray} />
              <Text style={styles.detailText}>Diện tích: {room.size}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="wifi-outline" size={18} color={COLORS.gray} />
              <Text style={styles.detailText}>Tiện ích: {room.facilities}</Text>
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Giá phòng:</Text>
            {room.oldPrice && (
              <Text style={styles.oldPrice}>{room.oldPrice} VND</Text>
            )}
            <Text style={styles.newPrice}>{room.newPrice} VND</Text>
          </View>
        </View>

        {/* Customer Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin khách hàng</Text>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={20} color={COLORS.gray} />
            <Text style={styles.infoText}>{bookingDetails.fullName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={20} color={COLORS.gray} />
            <Text style={styles.infoText}>{bookingDetails.phoneNumber}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={20} color={COLORS.gray} />
            <Text style={styles.infoText}>{bookingDetails.email}</Text>
          </View>
        </View>

        {/* Payment Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Phương thức thanh toán</Text>
          
          <View style={styles.paymentMethod}>
            <Image 
              source={{uri: paymentMethod.logo}} 
              style={styles.paymentLogo} 
            />
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentName}>{paymentMethod.name}</Text>
              <Text style={styles.paymentNumber}>{paymentMethod.number}</Text>
              <Text style={styles.paymentHolder}>{paymentMethod.holderName}</Text>
            </View>
          </View>
        </View>

        {/* Booking Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Tải vé</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancelBooking}
          >
            <Text style={styles.cancelButtonText}>Hủy đặt phòng</Text>
          </TouchableOpacity>
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
  bookingInfo: {
    marginTop: SIZES.small,
  },
  infoLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: SIZES.small,
  },
  infoValue: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.green,
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
  cardTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.medium,
  },
  roomImage: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
  },
  roomName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.small,
  },
  roomDetails: {
    marginVertical: SIZES.small,
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.medium,
  },
  priceLabel: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginRight: SIZES.small,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: COLORS.red,
    marginRight: SIZES.small,
    fontSize: SIZES.medium,
  },
  newPrice: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  infoText: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    marginLeft: SIZES.small,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.medium,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    color: COLORS.dark,
  },
  paymentNumber: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 2,
  },
  paymentHolder: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.medium,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: SIZES.small,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: SIZES.medium,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.red,
    marginLeft: SIZES.small,
  },
  cancelButtonText: {
    color: COLORS.red,
    fontWeight: 'bold',
    fontSize: SIZES.medium,
  },
});

export default BookingDetails;