import React, {
  useEffect,
  useState,
} from 'react';

import {
  FlatList,
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

const PlaceList = ({ navigation }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tileContainer}
      onPress={() => navigation.navigate('CountryDetails', { item })}
    >
      <View style={styles.row}>
        {/* Ảnh */}
        <Image
          source={{ uri: item.image || item.image_url }}
          style={styles.image}
        />

        {/* Nội dung */}
        <View style={{ marginLeft: 15, flex: 1 }}>
          {/* Tên địa điểm */}
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.statusText}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={[styles.statusText, { color: COLORS.red }]}>{error}</Text>
      </SafeAreaView>
    );
  }

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

      <View style={{ paddingTop: 10 }}>
        <FlatList
          data={places}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
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
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});