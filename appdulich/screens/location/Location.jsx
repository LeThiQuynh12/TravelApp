import React, {
  useEffect,
  useState,
} from 'react';

import * as Location from 'expo-location';
import {
  Alert,
  StyleSheet,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const LocationScreen = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      // Yêu cầu quyền truy cập vị trí
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Quyền bị từ chối", "Bạn cần cấp quyền vị trí để xem bản đồ.");
        return;
      }

      // Lấy vị trí hiện tại
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  return (
    <MapView
      initialRegion={
        location || {
          latitude: 21.0285, // Hà Nội (dự phòng nếu chưa lấy được vị trí)
          longitude: 105.8542,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      }
      style={styles.mapStyle}
    >
      {location && <Marker coordinate={location} title="Vị trí của bạn" />}
    </MapView>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
});
