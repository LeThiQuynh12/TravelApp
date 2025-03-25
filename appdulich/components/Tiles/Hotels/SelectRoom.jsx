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
import AppBar from '../../Reusable/AppBar';
import HeightSpacer from '../../Reusable/HeightSpacer';

const SelectRoom = ({ route, navigation }) => {

  const hotelId = route.params?.hotelId; // Lay hotelId tu params
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
        try {
            let response = await fetch(`https://67e017447635238f9aac7da4.mockapi.io/api/v1/rooms?hotelid=${hotelId}`);
            if (!response.ok) {  // Kiểm tra nếu response lỗi
                throw new Error(`Lỗi HTTP! Status: ${response.status}`);
            }
            let data = await response.json();  // Chuyển response thành JSON
            setRooms(data);
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu phòng:", error);
        }
    };

    if (hotelId) fetchRooms();  // Chỉ gọi API nếu có hotelId
  }, [hotelId]);  // Chạy lại khi hotelId thay đổi

  const hotel = route.params?.hotel || { title: "Khách sạn LuxGo" };

  return (
    <View style={styles.container}>
      <AppBar
        top={50}
        left={20}
        right={20}
        title={`Phòng của Khách sạn ${hotelId}`}
        color={COLORS.white}
        // icon={"search1"}
        // color1={COLORS.white}
        onPress={() => navigation.goBack()}
        // onPress1={() => navigation.navigate("HotelSearch")}
        style={{ marginBottom: 20 }}
      />
      <HeightSpacer height={80} />
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RoomCard room={item} navigation={navigation} />} // Truyền navigation vào RoomCard
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
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.sliderImage} />
        )}
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
      <TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate("CustomerInfo")}
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
    // backgroundColor: COLORS.lightGrey,
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
    resizeMode: "cover",
  },
  roomTitle: {
    fontSize: TEXT.large,
    fontWeight: "bold",
    color: COLORS.dark,
    marginTop: SIZES.small,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.xSmall,
  },
  roomInfo: {
    fontSize: TEXT.small,
    color: COLORS.gray,
    marginLeft: SIZES.xSmall,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SIZES.small,
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: COLORS.red,
    marginRight: SIZES.small,
  },
  newPrice: {
    fontSize: TEXT.medium,
    fontWeight: "bold",
    color: COLORS.blue,
  },
  button: {
    backgroundColor: COLORS.green,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: "center",
    marginTop: SIZES.medium,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: TEXT.medium,
  },
});
