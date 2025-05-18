import React, { useState } from 'react';

import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

import AppBar from '../../components/Reusable/AppBar';
import ReviewComponent from '../../components/Reusable/ReviewComponent';
import { COLORS } from '../../constants/theme';

const FoodDrinkDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params;
  const [reviews, setReviews] = useState(item.reviews || []);
  const handleAddReview = (newReview) => {
    setReviews([newReview, ...reviews]);
  };
  const handleCall = () => {
    if (item.contact) {
      Linking.openURL(`tel:${item.contact}`);
    }
  };

  const handleOpenMap = () => {
    if (item.latitude && item.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <AppBar
        
        color={COLORS.white}
        top={50}
        left={10}
        right={10}
        onPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.typeCuisine}>{item.type} - {item.cuisine}</Text>
          <Text style={styles.info}>
            Giá: {item.price_range} | Đánh giá: {item.rating}⭐ | Cách {item.distance}
          </Text>

          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}

          {/* Contact & Map buttons */}
          <View style={styles.buttonContainer}>
            {item.contact && (
              <TouchableOpacity style={styles.button} onPress={handleCall}>
                <Ionicons name="call" size={18} color="white" />
                <Text style={styles.buttonText}>Gọi điện</Text>
              </TouchableOpacity>
            )}
            {(item.latitude && item.longitude) && (
              <TouchableOpacity style={styles.button} onPress={handleOpenMap}>
                <Ionicons name="map" size={18} color="white" />
                <Text style={styles.buttonText}>Chỉ đường</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Map View nếu có toạ độ */}
          {(item.latitude && item.longitude) && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: item.latitude,
                longitude: item.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                title={item.name}
              />
            </MapView>
          )}
          {/* Reviews Section */}
        <ReviewComponent reviews={reviews} onSubmitReview={handleAddReview} />
        </View>
      </ScrollView>
    </View>
  );
};

export default FoodDrinkDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  typeCuisine: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.green,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    gap: 6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
  },
  map: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});
