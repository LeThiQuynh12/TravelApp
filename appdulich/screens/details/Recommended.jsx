
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

import { COLORS } from '../../constants/theme';
import AppBar from '../../components/Reusable/AppBar';
import ReusableTile from '../../components/Reusable/ReusableTile';

// React Navigation truyền navigation vào thông qua object props.
const Recommended = ({navigation}) => { 
  const [place, setplace] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const API_URL = "https://67eff56a2a80b06b88966c78.mockapi.io/ct_dia_diem";
  
   // Gọi API khi component được render
   useEffect(() => {
    const fetchplace = async () => {
      try {
        const response = await axios.get(API_URL);
        setplace(response.data); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu :", error);
      } finally {
        setLoading(false); // Dừng loading
      }
    };

    fetchplace();
  }, []);
   

  return (
   <SafeAreaView style={{marginHorizontal: 10 }}>
    <View style={{height: 50}}>
      <AppBar title={"Danh sách điểm đến "} 
      color={COLORS.white} color1={COLORS.white} 
      icon="search1" 
      top = {0} 
      left = {0}
      right = {0} 
      onPress={()=>navigation.goBack()}
      onPress1={()=>navigation.navigate("Search")}
      />
    </View>

    <View style={{paddingTop: 10}}>
     
     <FlatList
     data={place}
     renderItem={({item}) =>(
      <View style={{marginBottom: 10}}>
      <ReusableTile 
      item={item}
      onPress={()=> navigation.navigate('PlaceDetails',{item})}
      
      />
      </View>
    )
    }

/>
    </View>
   </SafeAreaView>
  )
}

export default Recommended

const styles = StyleSheet.create({})