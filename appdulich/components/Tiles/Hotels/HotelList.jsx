import React from 'react';

import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import { COLORS } from '../../../constants/theme';
import AppBar from '../../Reusable/AppBar';
import ReusableTile from '../../Reusable/ReusableTile';

// React Navigation truyền navigation vào thông qua object props.
const HotelList = ({navigation}) => { 
   const hotels = [
        {
            "_id": "1",
            "country_id": "cg30",
            "title": "A25-Hotel",
            "imageUrl": "https://tse3.mm.bing.net/th?id=OIP._sxcpWxF_lYHRJZ_lG9krAHaFj&pid=Api&P=0&h=180https://toplist.vn/images/800px/a25-hotel-189592.jpg",
            "rating": 4.8,
            "review": "1000 đánh giá",
            "location": "Cầu Giấy, Hà Nội"
        },
        {
            "_id": "2",
            "country_id": "cg30",
            "title": "Vũ Linh",
            "imageUrl": "https://media-cdn.tripadvisor.com/media/photo-s/19/86/73/bb/phong-vip.jpg",
            "rating": 4.5,
            "review": "780 đánh giá",
            "location": "Cầu Giấy, Hà Nội"
        },
        {
            "_id": "3",
            "country_id": "cg30",
            "title": "Granda Legend",
            "imageUrl": "https://n.oneday.com.vn/im/vBWfOSyoMem.jpg",
            "rating": 4.6,
            "review": "1023 đánh giá",
            "location": "Cầu Giấy, Hà Nội"
        },
        {
            "_id": "4",
            "country_id": "cg30",
            "title": "Blue Pearl",
            "imageUrl": "https://www.thebluepearlkataphuket.com/images/556.jpg",
            "rating": 4.7,
            "review": "854 đánh giá",
            "location": "Cầu Giấy, Hà Nội"
        },
        {
            "_id": "5",
            "country_id": "cg30",
            "title": "Pho Nang Motel",
            "imageUrl": "https://media.mia.vn/uploads/blog-du-lich/bali-motel-vung-tau-thien-duong-nghi-duong-tinh-te-va-tien-nghi-giua-pho-bien-22-1650038633.jpg",
            "rating": 4.3,
            "review": "600 đánh giá",
            "location": "Cầu Giấy, Hà Nội"
        }
    ];
  return (
   <SafeAreaView style={{marginHorizontal: 10 }}>
    <View style={{height: 50}}>
      <AppBar title={"Danh sách khách sạn gần đây"} 
      color={COLORS.white} color1={COLORS.white} 
      icon="search1" 
      top = {10} 
      left = {0}
      right = {0} 
      onPress={()=>navigation.goBack()}
      onPress1={()=>navigation.navigate("HotelSearch")}
      />
    </View>

    <View style={{paddingTop: 20}}>
     
     <FlatList
     data={hotels}
     renderItem={({item}) =>(
      <View style={{marginBottom: 10}}>
      <ReusableTile 
      item={item}
      onPress={()=> navigation.navigation('HotelDetails', item._id)}
      
      />
      </View>
    )
    }

/>
    </View>
   </SafeAreaView>
  )
}

export default HotelList

const styles = StyleSheet.create({})