import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS, SIZES } from '../../../constants/theme';
import AppBar from '../../Reusable/AppBar';
import Rating from '../../Reusable/Rating';

const PlaceList = ({ navigation }) => {
  const [place, setPlace] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = 'https://67eff56a2a80b06b88966c78.mockapi.io/dia_diem';

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(API_URL);
        setPlace(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tileContainer}
      onPress={() => navigation.navigate('CountryDetails', { item })}
    >
      <View style={styles.row}>
        {/* Ảnh */}
        <Image
          source={{ uri: item.image }}
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

  return (
    <SafeAreaView style={{ marginHorizontal: 10 }}>
      <View style={{ height: 50 }}>
        <AppBar
          title={'Danh sách địa điểm '}
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
          data={place}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default PlaceList;

const styles = StyleSheet.create({
  tileContainer: {
    padding: 10,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: "center",
  
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
