import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Text,
  View,
  VirtualizedList,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { SIZES } from '../../constants/theme';
import { fetchPlaces } from '../../services/api';
import HeightSpacer from '../Reusable/HeightSpacer';
import Country from '../Tiles/Country/Country';

const Places = () => {
  const navigation = useNavigation();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API khi component được render
  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const placeList = await fetchPlaces();
        setPlaces(placeList);
      } catch (err) {
        setError(err.message);
        console.error('Lỗi khi lấy dữ liệu địa điểm:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, []);

if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#EB6A58" />
    </View>
  );
}

  if (error) {
    return <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>;
  }

  return (
    <View>
      <HeightSpacer height={10} />
      <VirtualizedList
        data={places}
        horizontal
        keyExtractor={(item) => item._id} // Backend dùng _id thay vì place_id
        showsHorizontalScrollIndicator={false}
        getItemCount={(data) => data.length}
        getItem={(data, index) => data[index]}
        renderItem={({ item }) => (
          <View style={{ marginRight: SIZES.medium }}>
            <Country
              item={item}
              onPress={() => navigation.navigate('CountryDetails', { item })}
            />
          </View>
        )}
      />
    </View>
  );
};

export default Places;