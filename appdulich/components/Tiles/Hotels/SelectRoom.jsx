import React from 'react';

import {
  FlatList,
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

const mockRooms = [
  {
    id: "1",
    name: "Phòng tiêu chuẩn giường đôi",
    capacity: "Giá cho 2 người lớn",
    bed: "1 giường đôi lớn",
    size: "20 m²",
    facilities:
      "Wifi miễn phí, phòng tắm riêng, điều hòa không khí, TV màn hình phẳng và tầm nhìn xung quanh",
    oldPrice: "300.000 VND",
    newPrice: "250.000 VND",
  },
  {
    id: "2",
    name: "Phòng Superior giường đôi",
    capacity: "Giá cho 2 người lớn",
    bed: "1 giường đôi lớn",
    size: "20 m²",
    facilities:
      "Wifi miễn phí, phòng tắm riêng, điều hòa không khí, TV màn hình phẳng và tầm nhìn xung quanh",
    oldPrice: "300.000 VND",
    newPrice: "250.000 VND",
  },
];

const SelectRoom = ({ navigation, route }) => {
  const hotel = route.params?.hotel || { title: "Khách sạn LuxGo" };

  return (
    <View style={styles.container}>
      <AppBar
        top={50}
        left={20}
        right={20}
        title={hotel.title}
        color={COLORS.white}
        icon={"search1"}
        color1={COLORS.white}
        onPress={() => navigation.goBack()}
        onPress1={() => navigation.navigate("HotelSearch")}
        style={{ marginBottom: 50 }}
      />

      <HeightSpacer height={80} />

      {/* Danh sách phòng */}
      <FlatList
        data={mockRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.roomCard}>
            <Text style={styles.roomTitle}>{item.name}</Text>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={22} color={COLORS.gray} />
              <Text style={styles.roomInfo}>{item.capacity}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="bed-outline" size={22} color={COLORS.gray} />
              <Text style={styles.roomInfo}>{item.bed}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="resize-outline" size={22} color={COLORS.gray} />
              <Text style={styles.roomInfo}>{item.size}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="wifi-outline" size={22} color={COLORS.gray} />
              <Text style={styles.roomInfo}>{item.facilities}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="wallet-outline" size={22} color={COLORS.gray} />
              <Text style={styles.roomInfo}>Giá cho một đêm </Text>
            </View>

            {/* Giá tiền */}
            <View style={styles.priceContainer}>
              <Text style={styles.oldPrice}>{item.oldPrice}</Text>
              <Text style={styles.newPrice}>{item.newPrice}</Text>
            </View>

            {/* Nút chọn phòng */}
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Chọn phòng</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default SelectRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrey,
    padding: SIZES.medium,
  },
  roomCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.large,
    borderRadius: SIZES.medium,
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  roomTitle: {
    fontSize: TEXT.large,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: SIZES.xSmall,
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
