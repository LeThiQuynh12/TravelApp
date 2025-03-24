import React from 'react';

import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const HotelMap = ({coordinates}) => {
  return (
    <TouchableOpacity onPress={()=>{}}>
        <MapView style={styles.maps} region={coordinates}>
            <Marker
            coordinates={coordinates} title={coordinates.title}
             pinColor="blue"
            >
            </Marker>
        </MapView>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
    maps:{
        marginVertical: 20,
        height: 140,
        borderRadius: 12,
    }
})
export default HotelMap