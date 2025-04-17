import {
  useEffect,
  useState,
} from 'react';

import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import {
  COLORS,
  SIZES,
  TEXT,
} from '../../constants/theme.js';
import { getHotels } from '../../services/api.js'; // Import hàm getHotels
import { rowWithSpace } from '../Reusable/reusable.style.js';
import ReusableText from '../Reusable/ReusableText.jsx';
import HotelCard from '../Tiles/Hotels/HotelCard.jsx';

const BestHotels = () => {
  const navigation = useNavigation();
  const [hotels, setHotels] = useState([]); // State chứa list hotels
  const [loading, setLoading] = useState(true);

  // Gọi API khi component được render
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await getHotels();
        setHotels(response); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu khách sạn:', error.message);
      } finally {
        setLoading(false); // Dừng loading
      }
    };

    fetchHotels();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[rowWithSpace('space-between'), { paddingBottom: 10 }]}>
        <ReusableText
          text={'Khách sạn gần'}
          family={'medium'}
          size={TEXT.large}
          color={COLORS.black}
        />
        <TouchableOpacity onPress={() => navigation.navigate('HotelSearch')}>
          <Feather name="list" size={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={hotels} // mảng dữ liệu
        horizontal // theo chiều ngang
        keyExtractor={(item) => item._id} // Sử dụng _id từ MongoDB thay vì id
        showsHorizontalScrollIndicator={false} // ẩn cuộn ngang
        contentContainerStyle={{ columnGap: SIZES.medium }} // tạo khoảng cách giữa các phần tử
        renderItem={({ item }) => (
          <HotelCard
            item={item}
            margin={10}
            onPress={() =>
              navigation.navigate('HotelDetails', { id: item._id })
            }
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
  },
});

export default BestHotels;