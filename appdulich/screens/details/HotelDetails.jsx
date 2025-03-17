import React from 'react';

import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Rating } from 'react-native-stock-star-rating';

import { Feather } from '@expo/vector-icons';

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

  const hotel = {
    "availability": {
        "start": "2023-08-20T07:00:00.000+07:00",
        "end": "2023-08-25T07:00:00.000+07:00"
    },
    "coordinates": {
        "latitude": 21.0333,
        "longitude": 105.800
    },
    "_id": "1",
    "country_id": "cg30",
    "title": "A25-Hotel",
    "imageUrl": "https://tse3.mm.bing.net/th?id=OIP._sxcpWxF_lYHRJZ_lG9krAHaFj&pid=Api&P=0&h=180https://toplist.vn/images/800px/a25-hotel-189592.jpg",
    "rating": 4.8,
    "review": "1000 đánh giá",
    "location": "Cầu Giấy, Hà Nội",
    "description": "Nằm tại vị trí thuận tiện ở Cau Giay District, Hà Nội, A25 Hotel - Hoàng Quốc Việt tọa lạc cách Bảo tàng dân tộc học Việt Nam 15 phút đi bộ, Trung tâm thương mại Vincom Nguyễn Chí Thanh 4.3 km và Chùa Một Cột 4.9 km. Chỗ nghỉ cách Đền Quán Thánh khoảng 5.6 km, Sân vận động Quốc gia Mỹ Đình 5.7 km và Bảo tàng mỹ thuật Việt Nam 5.8 km. \n \n Chỗ nghỉ cung cấp lễ tân 24/24, dịch vụ đưa đón sân bay, phòng giữ hành lý và Wi-Fi miễn phí ở toàn bộ chỗ nghỉ. Khách sạn sẽ cung cấp cho khách các phòng có điều hòa, tủ quần áo, ấm đun nước, minibar, két an toàn, TV và phòng tắm riêng với vòi sen. Tại A25 Hotel - Hoàng Quốc Việt, mỗi phòng đều có ga trải giường và khăn tắm.",
    "contact": "64c5d95adc7efae2a45ec376",
    "price": 400,
    "__v": 1,
    "reviews": [
        {
            "_id": "dg1",
            "review": "Sạch sẽ, thoáng mát, nhân viên nhiệt tình, không có gì để chê nhaanhaa",
            "rating": 4.9,
            "user": {
                "id": "64c5d95adc7efae2a45ec376",
                "username": "Quỳnh Lê Thị",
                "profile": "https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/480327100_2763185244070651_2683696703023659634_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=5mkOgH8j2IIQ7kNvgEZh9Xs&_nc_oc=AdiNzIQNTuGXWfgh61fK4XHtY8FanR8G7sV_X6i8LwbSRrwOukcP2XNwAcaY4OnbXnl-ZklVAR1AqCj_0CPZPdT8&_nc_zt=23&_nc_ht=scontent.fhan14-1.fna&_nc_gid=zxO8l0tKXJfv_71PuTNH8w&oh=00_AYG8UP3OW0OBhqHhrjVOSQ1MxN8iWW7jbjZHGPp94i8XpQ&oe=67DC1FCE"
            },
            "updatedAt": "2023-08-09T20:09:09.200+07:00"
        },
        {
            "_id": "dg2",
            "review": "Xứng đáng để quay lại, 10 điểm không có nhưng",
            "rating": 4.6,
            "user": {
                "id": "64c5d95adc7efae2a45ec376",
                "username": "Lý Nguyễn Thị",
                "profile": "https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-1/479494459_1685681145692964_4224739755962842024_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_ohc=qmUU_ufFkgEQ7kNvgGAp1DM&_nc_oc=Adgzrb3izh4WdTtU25082MbNnIiSylJJhbt4ErJCzS6loNSWANr3zAUbBJYtkI7dvx_AQr2tSO9KZyip4ECWP32f&_nc_zt=24&_nc_ht=scontent.fhan14-4.fna&_nc_gid=JRH7NAsDGiawXcwj3wEu8w&oh=00_AYEyW4bkpAovwVeO2tR0IPFx22-s_6QcFzQaLXeyrBJLCw&oe=67DC140F"
            },
            "updatedAt": "2023-08-09T20:09:09.200+07:00"
        }
    ]
}


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

      <HeightSpacer height={10}/>
      <View style={[styles.container, {paddingTop: 90}]}>
      <ReusableText
                text={"Mô tả"} 
                family={"medium"}
                size={SIZES.large - 2}
                color={COLORS.black}
      />

      <HeightSpacer height={10}/>

            <ReusableText
             style={{ textAlign: "justify" }}  
        text={hotel.description} 
        family={"regular"}
        size={SIZES.small + 1}
        color={COLORS.gray}
      />


      <HeightSpacer height={10}/>

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

    <View style={[rowWithSpace('space-between'), styles.bottom]}>
    <ReusableText
                    text={hotel.location} 
                    family={"regular"}
                    size={SIZES.small+2}
                    color={COLORS.gray}
          />
    </View>


      </View>


      <View style={[rowWithSpace('space-between'), styles.bottom]}>
          <View>
            <ReusableText
              text={`\$ ${hotel.price}`}
              family={"medium"}
              size={SIZES.large}
              color={COLORS.black}
            />
            <HeightSpacer height={5} />
            <ReusableText
              text={"Jan 01- Dec 25"}
              family={"medium"}
              size={SIZES.medium}
              color={COLORS.gray}
            />
          </View>

          <ReusableBtn
          onPress={() => navigation.navigate("HotelSearch")}
          btnText={"Select Room"}
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
    height: 90,
    paddingVertical: 20,
  },

})