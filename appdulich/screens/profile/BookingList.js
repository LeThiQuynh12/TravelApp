import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import AppBar from '../../components/Reusable/AppBar';
import { getUser, fetchOrdersByUser } from '../../services/api';

const BookingList = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        // Lấy thông tin người dùng
        const userResponse = await getUser();
        const user = userResponse?.data || userResponse;
    
        if (!user) {
            Alert.alert('Lỗi', 'Không lấy được thông tin người dùng');
            return;
        }
        
        // Lấy đơn hàng của người dùng
        const userOrders = await fetchOrdersByUser(user._id || user.id);
        setOrders(userOrders);
      } catch (err) {
        console.error('Lỗi khi lấy đơn hàng:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => navigation.navigate('BookingDetails', { orderId: item.order_id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{item.order_id}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'paid' && styles.paidStatus,
          item.status === 'pending' && styles.pendingStatus,
          item.status === 'failed' && styles.failedStatus
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'paid' ? 'Đã thanh toán' : 
             item.status === 'pending' ? 'Chờ xử lý' : 'Thất bại'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.serviceName}>{item.service_name}</Text>
      
      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons name="category" size={16} color={COLORS.gray} />
          <Text style={styles.detailText}>
            {item.service_type === 'hotel' ? 'Khách sạn' : 
             item.service_type === 'bus' ? 'Xe khách' : 'Máy bay'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialIcons name="payment" size={16} color={COLORS.gray} />
          <Text style={styles.detailText}>
            {item.payment_method||'Tiền mặt'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialIcons name="calendar-today" size={16} color={COLORS.gray} />
          <Text style={styles.detailText}>
            {new Date(item.created_at).toLocaleDateString('vi-VN')}
          </Text>
        </View>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>
          {item.total_amount.toLocaleString('vi-VN')}₫
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <AppBar
          top={40}
          left={20}
          right={20}
          title={'Đơn đặt hàng'}
          color={COLORS.white}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={50} color={COLORS.red} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              fetchUserOrders();
            }}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar
        top={40}
        left={20}
        right={20}
        title={'Đơn đặt hàng'}
        color={COLORS.white}
        onPress={() => navigation.goBack()}
      />
      
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="receipt" size={60} color={COLORS.gray} />
          <Text style={styles.emptyText}>Bạn chưa có đơn đặt hàng nào</Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreButtonText}>Khám phá dịch vụ</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.order_id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
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
    padding: 20,
  },
  errorText: {
    fontSize: SIZES.medium,
    color: COLORS.red,
    marginVertical: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginVertical: 10,
  },
  exploreButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 15,
  },
  exploreButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: SIZES.medium,
  },
  listContent: {
    padding: SIZES.medium,
    paddingTop: 80,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  orderId: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paidStatus: {
    backgroundColor: COLORS.lightGreen,
  },
  pendingStatus: {
    backgroundColor: COLORS.lightOrange,
  },
  failedStatus: {
    backgroundColor: COLORS.lightRed,
  },
  statusText: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  serviceName: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.small,
  },
  orderDetails: {
    marginBottom: SIZES.small,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: SIZES.small,
    color: COLORS.dark,
    marginLeft: 5,
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginTop: SIZES.small,
  },
  priceText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default BookingList;