import React from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { useRoute } from '@react-navigation/native';

import NetworkImage from '../../components/Reusable/NetworkImage';

const PlaceDetails = () => {
  const route = useRoute();
  const { item } = route.params;

  // Đảm bảo dữ liệu map hợp lệ
  const mapCoordinates = item.map || { latitude: 0, longitude: 0 };

  return (
    <ScrollView style={styles.container} nestedScrollEnabled={true}>
      <NetworkImage source={{ uri: item.image }} height={250} width={'100%'} />

      <View style={styles.content}>
        <Text style={styles.title}>{item.introduction || item.name}</Text>

        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa chỉ</Text>
          <Text style={styles.sectionText}>{item.address || 'Không có thông tin'}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: mapCoordinates.latitude,
              longitude: mapCoordinates.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: mapCoordinates.latitude,
                longitude: mapCoordinates.longitude,
              }}
              title={item.name}
              description={item.address}
            />
          </MapView>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giới thiệu</Text>
          <Text style={styles.sectionText}>{item.description || 'Không có thông tin'}</Text>
        </View>

        {/* Pricing Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giá vé</Text>
          <Text style={styles.sectionText}>{item.ticket_prices || 'Miễn phí'}</Text>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lưu ý khi tham quan</Text>
          <Text style={styles.sectionText}>{item.notes || 'Không có lưu ý'}</Text>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đánh giá</Text>
          {item.reviews && item.reviews.length > 0 ? (
            item.reviews.map((review, index) => (
              <View key={index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>
                    {review.user?.name || 'Người dùng ẩn danh'}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.reviewRating}>{review.rating}/5 </Text>
                    <Text style={styles.star}>★</Text>
                    <Text style={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.review}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.sectionText}>Chưa có đánh giá</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
    paddingTop: 40,
  },
  content: {
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  map: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
  },
  reviewItem: {
    backgroundColor: '#E6F4EA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRating: {
    fontSize: 14,
    color: '#333',
  },
  star: {
    fontSize: 14,
    color: '#FFD700',
  },
  reviewDate: {
    fontSize: 14,
    color: '#666',
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default PlaceDetails;