import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  COLORS,
  SHADOWS,
  SIZES,
  TEXT,
} from '../../../constants/theme';
import { getRooms } from '../../../services/api.js'; // Import hàm getRooms
import AppBar from '../../Reusable/AppBar';
import HeightSpacer from '../../Reusable/HeightSpacer';

const SelectRoom = ({ route, navigation }) => {
  const hotelId = route.params?.hotelId; // Lấy hotelId từ params
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!hotelId) {
        setError('Không tìm thấy ID khách sạn!');
        setLoading(false);
        return;
      }

      try {
        const data = await getRooms(hotelId); // Gọi API từ backend
        setRooms(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách phòng!');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [hotelId]);



  if (loading) {
    return (
      <View style={styles.container}>
        <AppBar
          top={50}
          left={20}
          right={20}
          title={"Danh sách phòng"}
          color={COLORS.white}
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 20 }}
        />
        <HeightSpacer height={80} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <AppBar
          top={50}
          left={20}
          right={20}
          title={"Danh sách phòng "}
          color={COLORS.white}
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 20 }}
        />
        <HeightSpacer height={80} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar
        top={50}
        left={20}
        right={20}
        title={"Danh sách phòng"}
        color={COLORS.white}
        onPress={() => navigation.goBack()}
        style={{ marginBottom: 20 }}
      />
      <HeightSpacer height={80} />
      <FlatList
        data={rooms}
        keyExtractor={(item) => item._id} // Sử dụng _id từ backend thay vì id
        renderItem={({ item }) => <RoomCard room={item} navigation={navigation} />}
      />
    </View>
  );
};

// Component RoomCard - hiển thị từng phòng
const RoomCard = ({ room, navigation }) => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = prevIndex === room.images.length - 1 ? 0 : prevIndex + 1;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [room.images.length]);

  return (
    <View style={styles.roomCard}>
      {/* Slider ảnh sử dụng FlatList */}
      <FlatList
        ref={flatListRef}
        data={room.images}
        horizontal
        pagingEnabled
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Image source={{ uri: item.uri }} style={styles.sliderImage} />}
      />

      <Text style={styles.roomTitle}>{room.name}</Text>
      <View style={styles.infoRow}>
        <Ionicons name="person-outline" size={22} color={COLORS.gray} />
        <Text style={styles.roomInfo}>{room.capacity}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="bed-outline" size={22} color={COLORS.gray} />
        <Text style={styles.roomInfo}>{room.bed}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="resize-outline" size={22} color={COLORS.gray} />
        <Text style={styles.roomInfo}>{room.size}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="wifi-outline" size={22} color={COLORS.gray} />
        <Text style={styles.roomInfo}>{room.facilities}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="wallet-outline" size={22} color={COLORS.gray} />
        <Text style={styles.roomInfo}>Giá cho một đêm</Text>
      </View>

      {/* Giá tiền */}
      <View style={styles.priceContainer}>
        <Text style={styles.oldPrice}>{room.oldPrice}</Text>
        <Text style={styles.newPrice}>{room.newPrice}</Text>
      </View>

      {/* Nút chọn phòng */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CustomerInfo', { room })} // Truyền roomId sang màn hình tiếp theo
      >
        <Text style={styles.buttonText}>Chọn phòng</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
  },
  roomCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.large,
    borderRadius: SIZES.medium,
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  sliderImage: {
    width: SIZES.width - 50,
    height: 130,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  roomTitle: {
    fontSize: TEXT.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: SIZES.small,
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xSmall,
  },
  roomInfo: {
    fontSize: TEXT.small,
    color: COLORS.gray,
    marginLeft: SIZES.xSmall,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.small,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: COLORS.red,
    marginRight: SIZES.small,
  },
  newPrice: {
    fontSize: TEXT.medium,
    fontWeight: 'bold',
    color: COLORS.blue,
  },
  button: {
    backgroundColor: COLORS.green,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginTop: SIZES.medium,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: TEXT.medium,
  },
  loadingText: {
    fontSize: TEXT.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SIZES.large,
  },
  errorText: {
    fontSize: TEXT.medium,
    color: COLORS.red,
    textAlign: 'center',
    marginTop: SIZES.large,
  },
});