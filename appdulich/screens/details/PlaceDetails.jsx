import React from 'react';

import {
  Text,
  View,
} from 'react-native';

import { useRoute } from '@react-navigation/native';

const PlaceDetails = () => {
  const route = useRoute();
  const id = route.params
  console.log(id);
  return (
    <View>
      <Text>PlaceDetails</Text>
    </View>
  )
}

export default PlaceDetails