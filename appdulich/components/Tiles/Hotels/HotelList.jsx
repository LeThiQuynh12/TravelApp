import React, {
  useEffect,
  useState,
} from 'react';

import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '../../../constants/theme';
import { getHotels } from '../../../services/api.js';
import AppBar from '../../Reusable/AppBar';
import ReusableTile from '../../Reusable/ReusableTile';

const HotelList = ({ navigation }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await getHotels();
        console.log('Dữ liệu khách sạn:', response); // Kiểm tra dữ liệu
        setHotels(response); // Điều chỉnh theo cấu trúc dữ liệu
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu khách sạn:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBarContainer}>
        <AppBar
          title="Danh sách khách sạn gần đây"
          color={COLORS.white}
          color1={COLORS.white}
          icon="search1"
          top={0}
          left={0}
          right={0}
          onPress={() => navigation.goBack()}
          onPress1={() => navigation.navigate('HotelSearch')}
        />
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={hotels}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <ReusableTile
                item={item}
                onPress={() => navigation.navigate('HotelDetails', { hotelId: item._id })}
              />
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    </SafeAreaView>
  );
};

export default HotelList;

const styles = StyleSheet.create({
  container: { marginHorizontal: 10 },
  appBarContainer: { height: 50 },
  listContainer: { paddingTop: 10 },
  itemContainer: { marginBottom: 10 },
});