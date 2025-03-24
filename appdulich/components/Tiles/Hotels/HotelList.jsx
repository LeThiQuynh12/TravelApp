import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
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
  const [hotels, setHotels] = useState([]); // State chua list hotels
  const [loading, setLoading] = useState(true); 
  const API_URL = "https://67e017447635238f9aac7da4.mockapi.io/api/v1/hotels/";
  
   // Gọi API khi component được render
   useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(API_URL);
        setHotels(response.data); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khách sạn:", error);
      } finally {
        setLoading(false); // Dừng loading
      }
    };

    fetchHotels();
  }, []);
   

  return (
   <SafeAreaView style={{marginHorizontal: 10 }}>
    <View style={{height: 50}}>
      <AppBar title={"Danh sách khách sạn gần đây"} 
      color={COLORS.white} color1={COLORS.white} 
      icon="search1" 
      top = {40} 
      left = {0}
      right = {0} 
      onPress={()=>navigation.goBack()}
      onPress1={()=>navigation.navigate("HotelSearch")}
      />
    </View>

    <View style={{paddingTop: 40}}>
     
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