import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Rating } from 'react-native-stock-star-rating';

import { Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

import ReusableBtn from '../../components/Buttons/ReusableBtn';
import AppBar from '../../components/Reusable/AppBar';
import HeightSpacer from '../../components/Reusable/HeightSpacer';
import NetworkImage from '../../components/Reusable/NetworkImage';
import { rowWithSpace } from '../../components/Reusable/reusable.style';
import ReusableText from '../../components/Reusable/ReusableText';
import HotelMap from '../../components/Tiles/Hotels/HotelMap';
import ReviewsList from '../../components/Tiles/Hotels/ReviewsList';
import {
  COLORS,
  SIZES,
} from '../../constants/theme';

const HotelDetails = ({navigation}) => {
  //  const route = useRoute();
  //   const id = route.params
  //   console.log(id);
  const route = useRoute();
  const { _id } = route.params; // Nhận id từ BestHotels
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
  .get(`https://67e017447635238f9aac7da4.mockapi.io/api/v1/hotels/?_id=${_id}`)
  .then((response) => {
    // console.log("Dữ liệu API nhận được:", response.data); // Debug dữ liệu
    setHotel(response.data[0]); // Lấy phần tử đầu tiên của mảngsetHotel(response.data);
    setLoading(false);
  })
  .catch((error) => console.error("Lỗi khi fetch data:", error));

  }, [_id]);

  if (loading) return <ReusableText text="Đang tải..." size={SIZES.large} />;

//   const hotel = {

//     "availability": {
//         "start": "2023-08-20T07:00:00.000+07:00",
//         "end": "2023-08-25T07:00:00.000+07:00"
//     },
//     "coordinates": {
//         "latitude": 21.0333,
//         "longitude": 105.800
//     },
//     "_id": "1",
//     "country_id": "cg30",
//     "title": "A28-Hotel",
//     "imageUrl": "https://tse3.mm.bing.net/th?id=OIP._sxcpWxF_lYHRJZ_lG9krAHaFj&pid=Api&P=0&h=180https://toplist.vn/images/800px/a25-hotel-189592.jpg",
//     "rating": 4.8,
//     "review": "1000 đánh giá",
//     "location": "A28 Nghĩa Tân, Cầu Giấy, Hà Nội",
//     "description": "Nằm tại vị trí thuận tiện ở Cau Giay District, Hà Nội. Chỗ nghỉ cách Đền Quán Thánh khoảng 5.6 km, Sân vận động Quốc gia Mỹ Đình 5.7 km và Bảo tàng mỹ thuật Việt Nam 5.8 km. Chỗ nghỉ cung cấp lễ tân 24/24, dịch vụ đưa đón sân bay, phòng giữ hành lý và Wi-Fi miễn phí ở toàn bộ chỗ nghỉ. Khách sạn sẽ cung cấp cho khách các phòng có điều hòa, tủ quần áo, ấm đun nước, minibar, két an toàn, TV và phòng tắm riêng với vòi sen. Tại A25 Hotel - Hoàng Quốc Việt, mỗi phòng đều có ga trải giường và khăn tắm.",
//     "contact": "64c5d95adc7efae2a45ec376",
//     "price": 400000,
//     "__v": 1,
//     "reviews": [
//         {
//             "_id": "dg1",
//             "review": "Sạch sẽ, thoáng mát, nhân viên nhiệt tình, không có gì để chê nhaanhaa",
//             "rating": 4.9,
//             "user": {
//                 "id": "64c5d95adc7efae2a45ec376",
//                 "username": "Quỳnh Lê Thị",
//                 "profile": "https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/458610432_2615455392176971_3854684657007353736_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=105&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeEtEupjQQ37aQ6OJThlz4YJN9f65MLCWvU31_rkwsJa9boUcXCXdLx0f5Na9Tg70wbI8jMvyWsWUMwCWIF5T5Eq&_nc_ohc=BI8ubLT2MJwQ7kNvgGY5yN9&_nc_oc=Adndxr6S1aVIImuNux1SAItX5pEOcpx8yxAifEqhHnyEbe1h4IVg_6Ev4ncSOcdEci6IXoxnoDG6cvbCjet3MtsV&_nc_zt=23&_nc_ht=scontent.fhan14-1.fna&_nc_gid=_tQX7UKfV4on5TpMdUuItQ&oh=00_AYGjr0n9vbsIjTKk5ld1TLZb6MD7i67L5QF64BICnKBorQ&oe=67E5B0EF"
//             },
//             "updatedAt": "2023-08-09T20:09:09.200+07:00"
//         },
//         {
//             "_id": "dg2",
//             "review": "Xứng đáng để quay lại, 10 điểm không có nhưng",
//             "rating": 4.6,
//             "user": {
//                 "id": "64c5d95adc7efae2a45ec376",
//                 "username": "Lý Nguyễn Thị",
//                 "profile": "https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-1/479494459_1685681145692964_4224739755962842024_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEoTuBdEEFAIIWHk0-99ErJH3HNB-t14Aofcc0H63XgCnxNqRDIx4lwR9EGoFSqL7sXMzdPqIfEQVikACm6Xwt3&_nc_ohc=wgqfa4htFgMQ7kNvgHWAad0&_nc_oc=AdlU0BVcHMtDxkDhLPhc4me-cXiV6AQpJndfJHPRo2HsBKWJvYQ28bp_Hz3olB8nF6PTm8zP7O7rBubZzo0L-Hh6&_nc_zt=24&_nc_ht=scontent.fhan14-4.fna&_nc_gid=id4UwE1buqjZg-M2Xdq9sA&oh=00_AYFEFpb5YS2UJ3LmbqOA6CoSUq8-SIP5sPYFri2KDY2mQQ&oe=67E5BF0F"
//             },
//             "updatedAt": "2023-08-09T20:09:09.200+07:00"
//         },
//         {
//           "_id": "dg3",
//           "review": "Cũng bình thường, giá rẻ nên đành thế ",
//           "rating": 4.6,
//           "user": {
//               "id": "64c5d95adc7efae2a45ec376",
//               "username": "Trang Lê",
//               "profile": "https://scontent.fhan14-4.fna.fbcdn.net/v/t1.6435-9/83138678_503019183944983_3771054240202489856_n.jpg?stp=dst-jpg_s206x206_tt6&_nc_cat=102&ccb=1-7&_nc_sid=fe5ecc&_nc_eui2=AeH6fEj23S7COBF2Jeut-9NpmNeQOI0hMlWY15A4jSEyVSIP1mSSdkAI3P7bu7IKFeMBcg1gh1-gGoBp1dc4HUja&_nc_ohc=0gbSeP1e7TIQ7kNvgGGnHWT&_nc_oc=Adm9YWnGQngmij3-MBtBI07375ugHMSsW9xZOgGnN90WyfGmueDDZKiWruY1vXgI9G1ap1jyEEx7O3YYel8Qedbn&_nc_zt=23&_nc_ht=scontent.fhan14-4.fna&_nc_gid=lg3FLdbG1K4WvzrjqyMK0Q&oh=00_AYHXIkg4dZcQyIKHGWl-HusPX9jZShWf6LHjJINby-EW4A&oe=68075372"
//           },
//           "updatedAt": "2023-08-09T20:09:09.200+07:00"
//       },
//       {
//         "_id": "dg4",
//         "review": "Xứng đáng để quay lại, 10 điểm không có nhưng",
//         "rating": 4.6,
//         "user": {
//             "id": "64c5d95adc7efae2a45ec376",
//             "username": "Nguyễn Hương",
//             "profile": "https://scontent.fhan14-5.fna.fbcdn.net/v/t39.30808-6/457870801_958567796078167_1680863701865923883_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG3Jfj27eCozSI_VGHw2Asd9dVFFKYL8u311UUUpgvy7YPQMV23uJYT-UnmzrfLyXpUTDhazsj-RYSL-Usz-mKy&_nc_ohc=frFDddTMkA0Q7kNvgFu_PuE&_nc_oc=Adl0wxcVmjw2UXAEGb3EywLRMb7v5gCHKEBohQrF2PlLc2kw7QCcJ7DQW182mJNhDy2clie0k4R-C00HqYRGYM1u&_nc_zt=23&_nc_ht=scontent.fhan14-5.fna&_nc_gid=FyncqtPR53qbDfZu6pi2jA&oh=00_AYGz6LZwYePwb7Cl8CwpvPPMVrKt_LpzqVZyf14D_64AZA&oe=67E5A739"
//         },
//         "updatedAt": "2023-08-09T20:09:09.200+07:00"
//     },
 
//     ]
// }


let coordinates = {
  id: hotel._id,
  title: hotel.title,
  latitude: hotel.coordinates.latitude,
  longitude: hotel.coordinates.longitude,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,

}

  return (
    <ScrollView >
      <View style={{height: 80}}>
      <AppBar
      top={50}
      left={20}
      right={20}
      title={hotel.title}
      color={COLORS.white}
      icon={"search1"}
      color1={COLORS.white}
      onPress={()=>navigation.goBack()}
      onPress1={()=>navigation.navigate("HotelSearch")}
      />
      </View>
      <View>
        
      <View style={styles.container} >
      <NetworkImage
      source={hotel.imageUrl}
      width={"100%"}
      height={220}
      radius={30}
      />

      <View style={styles.titleContainer}>
      <View style={styles.titleColumn}>
      <ReusableText
            text={hotel.title}
            family={"medium"}
            size={SIZES.large}
            color={COLORS.black}
          />
        <HeightSpacer height={7}/>
        <ReusableText
                    text={hotel.location}
                    family={"medium"}
                    size={SIZES.medium}
                    color={COLORS.black}
        />


         <HeightSpacer height={15}/>

         <View style={rowWithSpace('space-between')}>
          <Rating
          maxStars={5}
          stars={hotel.rating}
          bordered={false}
          color={'#FD9942'}
          />
        <ReusableText
          text={`(${hotel.review})`} 
          family={"medium"}
          size={SIZES.medium}
          color={COLORS.gray}
        />
      </View>
      </View>
      </View>
      </View>

      <HeightSpacer height={20}/>
      <View style={[styles.container, {paddingTop: 90}]}>
      <ReusableText
                text={"Mô tả"} 
                family={"medium"}
                size={SIZES.large - 2}
                color={COLORS.black}
      />

      <HeightSpacer height={10}/>

            <ReusableText
             
        text={hotel.description} 
        family={"regular"}
        size={SIZES.small + 1}
        color={COLORS.gray}
        lineHeight={18}
      />


      <HeightSpacer height={20}/>

      <ReusableText
                text={"Vị trí"} 
                family={"medium"}
                size={SIZES.large - 2}
                color={COLORS.black}
      />

    <HeightSpacer height={15}/>

      <ReusableText
                text={hotel.location} 
                family={"regular"}
                size={SIZES.small+1}
                color={COLORS.gray}
      />

      <HotelMap coordinates={coordinates}/>

      <View style={rowWithSpace('space-between')}>
      <ReusableText
                      text={"Đánh giá"} 
                      family={"medium"}
                      size={SIZES.large -2 }
                      color={COLORS.black}
            />
      <TouchableOpacity onPress = {()=>navigation.navigate("ReviewsList")}>
        <Feather name = 'list' size={20}/>
      </TouchableOpacity>

      </View>


      <HeightSpacer height={10}/>
      
      {/* Danh sách đánh giágiá */}

      <ReviewsList reviews={hotel.reviews}/>

    {/* <View style={[rowWithSpace('space-between'), styles.bottom]}>
    {/* <ReusableText
                    text={hotel.location} 
                    family={"regular"}
                    size={SIZES.small+2}
                    color={COLORS.gray}
          />
    </View> */} 


      </View>


      <View style={[rowWithSpace('space-between'), styles.bottom]}>
          <View>
            <ReusableText
              text={`${hotel.price} \VND`}
              family={"medium"}
              size={SIZES.large}
              color={COLORS.black}
            />
            <HeightSpacer height={5} />
            <ReusableText
              text={"01 thg 01 - 25 thg 12"}
              family={"medium"}
              size={SIZES.medium -2}
              color={COLORS.gray}
            />
          </View>

          <ReusableBtn
          onPress={() => navigation.navigate("SelectRoom")}
          btnText={"Chọn phòng"}
          width={(SIZES.width - 50) / 2.2}
          backgroundColor={COLORS.green}
          borderColor={COLORS.green}
          borderWidth={0}
          textColor={COLORS.white}
          />


      </View>
 
      </View>
    </ScrollView>
  )
}

export default HotelDetails

const styles = StyleSheet.create({
  container:{
    paddingTop: 20,
    marginHorizontal: 20,
  },
  titleContainer:{
    margin: 15,
    backgroundColor: COLORS.lightWhite,
    position: "absolute",
    top: 170,
    left: 0,
    right: 0,
    borderRadius: 20,
  },
  titleColumn:{
    padding: 15,
  },
  bottom: {
    paddingHorizontal: 30,
    backgroundColor: COLORS.lightWhite,
    height: 120,
    paddingVertical: 20,
    borderRadius: 30,

  },

})