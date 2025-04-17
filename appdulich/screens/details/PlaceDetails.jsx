import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { useRoute } from '@react-navigation/native';

import NetworkImage from '../../components/Reusable/NetworkImage';

const PlaceDetails = (navigation) => {
  const route = useRoute();
  const id = route.params;
  console.log(id);
  const { item } = route.params;
  const [loading, setLoading] = useState(false);
  const [all, setAll] = useState([]);

  const API_URL_DETAILS = "https://67eff56a2a80b06b88966c78.mockapi.io/ct_dia_diem";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(API_URL_DETAILS);
        setAll(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết địa điểm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  return (
    <ScrollView style={styles.container}nestedScrollEnabled={true}>
      <NetworkImage source={{ uri: item.image }} height={250} width={"100%"} />

      <View style={styles.content}>
        <Text style={styles.title}>{item.introduction}</Text>

        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa chỉ</Text>
          <Text style={styles.sectionText}>{item.address}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: item.map.latitude,
              longitude: item.map.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: item.map.latitude,
                longitude: item.map.longitude,
              }}
              title={item.name}
              description={item.address}
            />
          </MapView>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giới thiệu</Text>
          <Text style={styles.sectionText}>{item.description}</Text>
        </View>

        {/* Pricing Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giá vé</Text>
          <Text style={styles.sectionText}>{item.ticket_prices}</Text>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lưu ý khi tham quan</Text>
          <Text style={styles.sectionText}>{item.notes}</Text>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đánh giá</Text>
          <FlatList
            data={Array.isArray(item.reviewer) ? item.reviewer : [item.reviewer]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>{item.user_name}</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.reviewRating}>{item.user_rating}/5 </Text>
                    <Text style={styles.star}>★</Text>
                    <Text style={styles.reviewDate}>
                      {' '}
                      {new Date(item.date).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{item.comment}</Text>
              </View>
            )}
            scrollEnabled={false} // Chặn scroll riêng cho FlatList
            nestedScrollEnabled={true} // Cho phép cuộn lồng
            contentContainerStyle={styles.flatListContent}
          />
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
    paddingTop: 40
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
  flatListContent: {
    paddingBottom: 10,
  },
});

export default PlaceDetails;
