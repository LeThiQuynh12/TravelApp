// components/NearbyLocations.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const NearbyLocations = ({ locations, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Các tỉnh lân cận</Text>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.locationsContainer}
      >
        {locations.map((item) => (
          <TouchableOpacity 
            key={item._id} 
            style={styles.locationItem}
            onPress={() => onPress(item)}
          >
            <Image 
              source={{ uri: item.image }} 
              style={styles.locationImage} 
              resizeMode="cover"
            />
            <Text style={styles.locationName}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 15,
  },
  locationsContainer: {
    paddingBottom: 10,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 30,
    marginRight: 12,
    height: 60,
    paddingRight: 12,
  },
  locationImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  locationName: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    paddingHorizontal: 8,
  },
});

export default NearbyLocations;