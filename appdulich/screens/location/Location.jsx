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
  showsUserLocation={true}  // Hiển thị chấm xanh vị trí người dùng
  followsUserLocation={true} // Bản đồ tự động theo dõi vị trí người dùng
  initialRegion={
    location || {
      latitude: 21.0285, // Hà Nội (dự phòng)
      longitude: 105.8542,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
  }
  style={styles.mapStyle}
>
{location && (
  <Marker 
    coordinate={location} 
    title="Vị trí của bạn"
    description="Bạn đang ở đây"
    pinColor="red" // Chấm màu xanh
  />
)}

</MapView>

  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
});
