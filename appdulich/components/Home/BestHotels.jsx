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
    keyExtractor={(item) => item._id}  // id uy nhat
    showsHorizontalScrollIndicator={false} // an cuon ngang
    contentContainerStyle={{columnGap: SIZES.medium}} // tạo khoảng cách giữa các phần tử
    renderItem={({item}) => (
       <HotelCard item={item} margin={10} 
       
       onPress={()=>navigation.navigate("HotelDetails", { id: item._id })
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