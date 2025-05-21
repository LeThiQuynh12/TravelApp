import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '../../../constants/theme';
import { fetchPlaces } from '../../../services/api';
import AppBar from '../../Reusable/AppBar';
import PaginatedList from '../../PaginatedList';

const PlaceList = ({ navigation }) => {
  const limit = 5;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tileContainer}
      onPress={() => navigation.navigate('CountryDetails', { item })}
    >
      <View style={styles.row}>
        <Image
          source={{ uri: item.image || item.image_url }}
          style={styles.image}
        />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const keyExtractor = (item) => item._id;

  // Adapter cho PaginatedList: luôn trả về mảng item (không cần totalPages)
  const adaptedFetchPlaces = async (page, limit) => {
    const response = await fetchPlaces(page, limit);

    // Nếu API trả về mảng trực tiếp thì dùng luôn
    if (Array.isArray(response)) {
      return response;
    }

    // Nếu API trả về { items: [], totalPages: n }
    if (response && response.items) {
      return response.items;
    }

    // Trường hợp không xác định
    return [];
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: 50 }}>
        <AppBar
          title={'Danh sách địa điểm'}
          color={COLORS.white}
          color1={COLORS.white}
          icon="search1"
          top={0}
          left={0}
          right={0}
          onPress={() => navigation.goBack()}
          onPress1={() => navigation.navigate('Search')}
        />
      </View>

      <PaginatedList
        fetchData={adaptedFetchPlaces}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        limit={limit}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default PlaceList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  tileContainer: {
    padding: 10,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 20,
    fontFamily: 'medium',
    color: COLORS.black,
    marginBottom: 8,
  },
});
