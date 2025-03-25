import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
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
import HotelCard from '../Tiles/Hotels/HotelCard.jsx';

const BestHotels = () => {
    const navigation = useNavigation();
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
    <View style={styles.container}>
      <View style={[rowWithSpace('space-between'), { paddingBottom: 10 }]} >

      <ReusableText
        text={'Khách sạn gần'}
        family={"medium"}
        size={TEXT.large}
        color={COLORS.black}
    />
    <TouchableOpacity onPress={()=>navigation.navigate("HotelList")}>
    <Feather
    name="list"
    size={20}
    />
    </TouchableOpacity>
    </View>

    <FlatList
    data ={hotels} // mang du lieu
    horizontal // theo chieu ngang
    keyExtractor={(item) => item.id}  // id uy nhatidid
    showsHorizontalScrollIndicator={false} // an cuon ngang
    contentContainerStyle={{columnGap: SIZES.medium}} // tạo khoảng cách giữa các phần tử
    renderItem={({item}) => (
       <HotelCard item={item} margin={10} 
       
       onPress={()=>navigation.navigate("HotelDetails", { id: item.id })
       } 
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

export default BestHotels