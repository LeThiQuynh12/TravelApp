import React, {
  useEffect,
  useRef,
} from 'react';

import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const HotelMap = ({ coordinates }) => {
  const mapRef = useRef(null);

  const isArray = Array.isArray(coordinates);
  const locations = isArray ? coordinates : [coordinates];

  useEffect(() => {
    if (locations.length > 1 && mapRef.current) {
      mapRef.current.fitToCoordinates(locations, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [coordinates]);

  return (
    <TouchableOpacity onPress={() => {}}>
      <MapView
        ref={mapRef}
        style={styles.maps}
        region={!isArray ? coordinates : undefined}
      >
        {locations.map((loc, index) => (
          <Marker
            key={index}
            coordinate={loc}
            title={loc.title || `Location ${index + 1}`}
            pinColor={index === 0 ? 'red' : 'blue'}
          />
        ))}
      </MapView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  maps: {
    marginVertical: 15,
    height: 190,
    borderRadius: 12,
  },
});

export default HotelMap;
