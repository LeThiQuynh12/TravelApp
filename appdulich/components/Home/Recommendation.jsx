import React from 'react';

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
import { rowWithSpace } from '../Reusable/reusable.style.js';
import ReusableText from '../Reusable/ReusableText.jsx';
import ReusableTile from '../Reusable/ReusableTile.jsx';

const Recommendations = () => {
    const navigation = useNavigation();
    const recommendations = [
        {
          _id: "1",
          country_id: "hk30",
          title: "Hồ Hoàn Kiếm",
          imageUrl: "https://toigingiuvedep.vn/wp-content/uploads/2021/07/hinh-anh-ho-guom-ho-con-rua.jpg",
          rating: 4.8,
          review: "5000 đánh giá",
          location: "Hoàn Kiếm, Hà Nội",
        },
        {
          _id: "2",
          country_id: "dd30",
          title: "Văn Miếu - Quốc Tử Giám",
          imageUrl: "https://vov2.vov.vn/sites/default/files/images/dat%20nuoc%201405.jpg",
          rating: 4.7,
          review: "3200 đánh giá",
          location: "Đống Đa, Hà Nội",
        },
        {
          _id: "3",
          country_id: "bd30",
          title: "Lăng Chủ tịch Hồ Chí Minh",
          imageUrl: "https://cdnmedia.baotintuc.vn/Upload/m0xCDRsplmYeHmGctyfDUw/files/2022/05/Lang-3.jpg",
          rating: 4.9,
          review: "4500 đánh giá",
          location: "Ba Đình, Hà Nội",
        },
        {
          _id: "4",
          country_id: "btl30",
          title: "Công viên Hòa Bình",
          imageUrl: "https://nhaphonet.vn/wp-content/uploads/2023/04/cong-vien-hoa-binh-1-1.jpg",
          rating: 4.6,
          review: "3800 đánh giá",
          location: "Bắc Từ Liêm, Hà Nội",
        },
        {
          _id: "5",
          country_id: "bd30",
          title: "Chùa Một Cột",
          imageUrl: "https://mytourcdn.com/upload_images/Image/Location/24_2_2015/9-Du-lich-chua-mot-cot-mytour-1.jpg",
          rating: 4.8,
          review: "4000 đánh giá",
          location: "Ba Đình, Hà Nội",
        },
        {
          _id: "6",
          country_id: "bd30",
          title: "Hoàng Thành Thăng Long",
          imageUrl: "https://static.vinwonders.com/production/hoang-thanh-thang-long-1.jpg",
          rating: 4.7,
          review: "3600 Reviews",
          location: "Ba Đình, Hà Nội",
        },
      ];
      

  return (
    <View style={styles.container}>
      <View style={[rowWithSpace('space-between'), { paddingBottom: 10 }]} >

      <ReusableText
        text={'Gợi ý'}
        family={"medium"}
        size={TEXT.large}
        color={COLORS.black}
    />
    <TouchableOpacity onPress={()=>navigation.navigate("Recommended")}>
    <Feather
    name="list"
    size={20}
    />
    </TouchableOpacity>
    </View>


    <FlatList
    data={recommendations}
    horizontal
    keyExtractor={(item) => item._id}
    contentContainerStyle={{ columnGap: SIZES.medium }}
    showsHorizontalScrollIndicator={false}
    renderItem={({ item }) => (
      <ReusableTile item={item}
       onPress={() => navigation.navigate("PlaceDetails", { id: item._id })}
      />
    )}
    />

    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        paddingTop: 30
    }
})

export default Recommendations