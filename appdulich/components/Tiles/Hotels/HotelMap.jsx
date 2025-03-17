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
            >
            </Marker>
        </MapView>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
    maps:{
        marginVertical: 10,
        height: 120,
        borderRadius: 12,
    }
})
export default HotelMap