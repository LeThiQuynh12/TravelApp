import React, { useState } from 'react';

import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Feather } from '@expo/vector-icons';

import HeightSpacer from '../../components/Reusable/HeightSpacer';
import reusable from '../../components/Reusable/reusable.style';
import ReusableTile from '../../components/Reusable/ReusableTile';
import {
  COLORS,
  SIZES,
} from '../../constants/theme';

const Search = ({navigation}) => {
  const [searchKey, setSearchKey] = useState('')
  const [searchResuft, setSearchResulfs] = useState([])
  const search = [
    {
      "id": "1",
      "country_id": "cg30",
      "title": "A28-Hotel",
      "imageUrl": "https://tse3.mm.bing.net/th?id=OIP._sxcpWxF_lYHRJZ_lG9krAHaFj&pid=Api&P=0&h=180https://toplist.vn/images/800px/a25-hotel-189592.jpg",
      "rating": 4.8,
      "review": "1000 đánh giá",
      "location": "Cầu Giấy, Hà Nội",
      "availability": {
        "start": "2023-08-20T07:00:00.000+07:00",
        "end": "2023-08-25T07:00:00.000+07:00"
      },
      "coordinates": {
        "latitude": 21.0333,
        "longitude": 105.8
      },
      "description": "Nằm tại vị trí thuận tiện ở Cau Giay District, Hà Nội, A25 Hotel - Hoàng Quốc Việt tọa lạc cách Bảo tàng dân tộc học Việt Nam 15 phút đi bộ, Trung tâm thương mại Vincom Nguyễn Chí Thanh 4.3 km và Chùa Một Cột 4.9 km. Chỗ nghỉ cách Đền Quán Thánh khoảng 5.6 km, Sân vận động Quốc gia Mỹ Đình 5.7 km và Bảo tàng mỹ thuật Việt Nam 5.8 km. Chỗ nghỉ cung cấp lễ tân 24/24, dịch vụ đưa đón sân bay, phòng giữ hành lý và Wi-Fi miễn phí ở toàn bộ chỗ nghỉ. Khách sạn sẽ cung cấp cho khách các phòng có điều hòa, tủ quần áo, ấm đun nước, minibar, két an toàn, TV và phòng tắm riêng với vòi sen. Tại A25 Hotel - Hoàng Quốc Việt, mỗi phòng đều có ga trải giường và khăn tắm.",
      "contact": "64c5d95adc7efae2a45ec376",
      "price": 400000,
      "reviews": [
        {
          "_id": "dg1",
          "review": "Sạch sẽ, thoáng mát, nhân viên nhiệt tình.",
          "rating": 4.9,
          "user": {
            "id": "64c5d95adc7efae2a45ec376",
            "username": "Quỳnh Lê Thị",
            "profile": "https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-1/480327100_2763185244070651_2683696703023659634_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEOr0pGKv4FRiqEsCVli2RGje9kskhrDeWN72SySGsN5eKMU_N5f9Z1553GOK2ma0mMpQsHHLWceplPf7gE0-Oi&_nc_ohc=ArSAUTNWYYUQ7kNvgHe350l&_nc_oc=Adkp0_2z8oJFFqJq2raS02xZcM6OEGYLZlZ6C5-Mdlj_tQCFCpC7RljIDrIpsUhZd9QxWfMGvlO9kLEBnhfQI4qm&_nc_zt=24&_nc_ht=scontent.fhan14-1.fna&_nc_gid=Yq-Qx0x5BalUe3s5kJnaXQ&oh=00_AYH1sEMLDOHR8TraRNHnL5NfanuWnT6N9_I9bxCqFPRQBQ&oe=67E6F190"
          },
          "updatedAt": "2023-08-09T20:09:09.200+07:00"
        },
        {
          "_id": "dg2",
          "review": "Xứng đáng để quay lại, 10 điểm không có nhưng.",
          "rating": 4.6,
          "user": {
            "id": "64c5d95adc7efae2a45ec376",
            "username": "Lý Nguyễn Thị",
            "profile": "https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-1/479494459_1685681145692964_4224739755962842024_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEoTuBdEEFAIIWHk0-99ErJH3HNB-t14Aofcc0H63XgCnxNqRDIx4lwR9EGoFSqL7sXMzdPqIfEQVikACm6Xwt3&_nc_ohc=wgqfa4htFgMQ7kNvgE6YUL8&_nc_oc=Adlt1km1PNup5ct2xJNJRiYCF-JG7sHMjNicYtiVOlJe_AiQ-CNhgcHnfJvuij-H6vwGM00o2-OKPmbsdAE82GDu&_nc_zt=24&_nc_ht=scontent.fhan14-4.fna&_nc_gid=JxFign6ZzeFZh-x8tf6hpA&oh=00_AYG8D0-DWIDWe7Y9lcT-kkLKaNi-ylCu4UsYuD5lQaimog&oe=67E6D84F"
          },
          "updatedAt": "2023-08-09T20:09:09.200+07:00"
        }
      ]
    },
    {
      "id": "2",
      "country_id": "cg30",
      "title": "Vũ Linh Hotel",
      "imageUrl": "https://media-cdn.tripadvisor.com/media/photo-s/19/86/73/bb/phong-vip.jpg",
      "rating": 4.5,
      "review": "780 đánh giá",
      "location": "Cầu Giấy, Hà Nội",
      "availability": {
        "start": "2023-08-18T07:00:00.000+07:00",
        "end": "2023-08-28T07:00:00.000+07:00"
      },
      "coordinates": {
        "latitude": 21.035,
        "longitude": 105.81
      },
      "description": "Nhìn ra hồ, LaVieVuLinh Ecolodge tọa lạc ở Vũ Linh và có nhà hàng, dịch vụ phòng, quầy bar, khu vườn, hồ bơi ngoài trời mở quanh năm cũng như sân hiên.",
      "contact": "64c5d95adc7efae2a45ec377",
      "price": 450000,
      "reviews": [
        {
          "_id": "dg3",
          "review": "Sạch sẽ, thoáng mát, nhân viên nhiệt tình.",
          "rating": 4.9,
          "user": {
            "id": "64c5d95adc7efae2a45ec376",
            "username": "Quỳnh Lê Thị",
            "profile": "https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-1/480327100_2763185244070651_2683696703023659634_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEOr0pGKv4FRiqEsCVli2RGje9kskhrDeWN72SySGsN5eKMU_N5f9Z1553GOK2ma0mMpQsHHLWceplPf7gE0-Oi&_nc_ohc=ArSAUTNWYYUQ7kNvgHe350l&_nc_oc=Adkp0_2z8oJFFqJq2raS02xZcM6OEGYLZlZ6C5-Mdlj_tQCFCpC7RljIDrIpsUhZd9QxWfMGvlO9kLEBnhfQI4qm&_nc_zt=24&_nc_ht=scontent.fhan14-1.fna&_nc_gid=Yq-Qx0x5BalUe3s5kJnaXQ&oh=00_AYH1sEMLDOHR8TraRNHnL5NfanuWnT6N9_I9bxCqFPRQBQ&oe=67E6F190"
          },
          "updatedAt": "2023-08-09T20:09:09.200+07:00"
        },
        {
          "_id": "dg4",
          "review": "Xứng đáng để quay lại, 10 điểm không có nhưng.",
          "rating": 4.6,
          "user": {
            "id": "64c5d95adc7efae2a45ec376",
            "username": "Lý Nguyễn Thị",
            "profile": "https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-1/479494459_1685681145692964_4224739755962842024_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEoTuBdEEFAIIWHk0-99ErJH3HNB-t14Aofcc0H63XgCnxNqRDIx4lwR9EGoFSqL7sXMzdPqIfEQVikACm6Xwt3&_nc_ohc=wgqfa4htFgMQ7kNvgE6YUL8&_nc_oc=Adlt1km1PNup5ct2xJNJRiYCF-JG7sHMjNicYtiVOlJe_AiQ-CNhgcHnfJvuij-H6vwGM00o2-OKPmbsdAE82GDu&_nc_zt=24&_nc_ht=scontent.fhan14-4.fna&_nc_gid=JxFign6ZzeFZh-x8tf6hpA&oh=00_AYG8D0-DWIDWe7Y9lcT-kkLKaNi-ylCu4UsYuD5lQaimog&oe=67E6D84F"
          },
          "updatedAt": "2023-08-09T20:09:09.200+07:00"
        }
      ]
    },
    {
      "id": "3",
      "country_id": "cg30",
      "title": "Granda Legend Hotel",
      "imageUrl": "https://n.oneday.com.vn/im/vBWfOSyoMem.jpg",
      "rating": 4.6,
      "review": "1023 đánh giá",
      "location": "Cầu Giấy, Hà Nội",
      "availability": {
        "start": "2023-08-22T07:00:00.000+07:00",
        "end": "2023-08-30T07:00:00.000+07:00"
      },
      "coordinates": {
        "latitude": 21.038,
        "longitude": 105.815
      },
      "description": "Granda Legend Apartment nhìn ra thành phố, có Wi-Fi miễn phí và chỗ đậu xe riêng miễn phí, tọa lạc ở Hà Nội, cách Bảo tàng dân tộc học Việt Nam 15 phút đi bộ.",
      "contact": "64c5d95adc7efae2a45ec378",
      "price": 420000,
      "reviews": [
        {
          "_id": "dg6",
          "review": "Sạch sẽ, thoáng mát, nhân viên nhiệt tình.",
          "rating": 4.9,
          "user": {
            "id": "64c5d95adc7efae2a45ec376",
            "username": "Quỳnh Lê Thị",
            "profile": "https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-1/480327100_2763185244070651_2683696703023659634_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEOr0pGKv4FRiqEsCVli2RGje9kskhrDeWN72SySGsN5eKMU_N5f9Z1553GOK2ma0mMpQsHHLWceplPf7gE0-Oi&_nc_ohc=ArSAUTNWYYUQ7kNvgHe350l&_nc_oc=Adkp0_2z8oJFFqJq2raS02xZcM6OEGYLZlZ6C5-Mdlj_tQCFCpC7RljIDrIpsUhZd9QxWfMGvlO9kLEBnhfQI4qm&_nc_zt=24&_nc_ht=scontent.fhan14-1.fna&_nc_gid=Yq-Qx0x5BalUe3s5kJnaXQ&oh=00_AYH1sEMLDOHR8TraRNHnL5NfanuWnT6N9_I9bxCqFPRQBQ&oe=67E6F190"
          },
          "updatedAt": "2023-08-09T20:09:09.200+07:00"
        },
        {
          "_id": "dg7",
          "review": "Xứng đáng để quay lại, 10 điểm không có nhưng.",
          "rating": 4.6,
          "user": {
            "id": "64c5d95adc7efae2a45ec376",
            "username": "Lý Nguyễn Thị",
            "profile": "https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-1/479494459_1685681145692964_4224739755962842024_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEoTuBdEEFAIIWHk0-99ErJH3HNB-t14Aofcc0H63XgCnxNqRDIx4lwR9EGoFSqL7sXMzdPqIfEQVikACm6Xwt3&_nc_ohc=wgqfa4htFgMQ7kNvgE6YUL8&_nc_oc=Adlt1km1PNup5ct2xJNJRiYCF-JG7sHMjNicYtiVOlJe_AiQ-CNhgcHnfJvuij-H6vwGM00o2-OKPmbsdAE82GDu&_nc_zt=24&_nc_ht=scontent.fhan14-4.fna&_nc_gid=JxFign6ZzeFZh-x8tf6hpA&oh=00_AYG8D0-DWIDWe7Y9lcT-kkLKaNi-ylCu4UsYuD5lQaimog&oe=67E6D84F"
          },
          "updatedAt": "2023-08-09T20:09:09.200+07:00"
        }
      ]
    },
    {
      "id": "4",
      "country_id": "cg30",
      "title": "Blue Pearl Hotel",
      "imageUrl": "https://www.thebluepearlkataphuket.com/images/556.jpg",
      "rating": 4.7,
      "review": "854 đánh giá",
      "location": "Cầu Giấy, Hà Nội",
      "availability": {
        "start": "2023-08-21T07:00:00.000+07:00",
        "end": "2023-08-27T07:00:00.000+07:00"
      },
      "coordinates": {
        "latitude": 21.0325,
        "longitude": 105.805
      },
      "description": "Nằm ở Makkah, cách Đền thờ Masjid Al Haram 6 km, BLUE PEARL Hotel cung cấp chỗ nghỉ có khu vườn, chỗ đậu xe riêng miễn phí, phòng chờ chung và sân hiên.",
      "contact": "64c5d95adc7efae2a45ec379",
      "price": 460000,
      "reviews": [
        {
          "_id": "dg8",
          "review": "Sạch sẽ, thoáng mát, nhân viên nhiệt tình.",
          "rating": 4.9,
          "user": {
            "id": "64c5d95adc7efae2a45ec376",
            "username": "Quỳnh Lê Thị",
            "profile": "https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-1/480327100_2763185244070651_2683696703023659634_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEOr0pGKv4FRiqEsCVli2RGje9kskhrDeWN72SySGsN5eKMU_N5f9Z1553GOK2ma0mMpQsHHLWceplPf7gE0-Oi&_nc_ohc=ArSAUTNWYYUQ7kNvgHe350l&_nc_oc=Adkp0_2z8oJFFqJq2raS02xZcM6OEGYLZlZ6C5-Mdlj_tQCFCpC7RljIDrIpsUhZd9QxWfMGvlO9kLEBnhfQI4qm&_nc_zt=24&_nc_ht=scontent.fhan14-1.fna&_nc_gid=Yq-Qx0x5BalUe3s5kJnaXQ&oh=00_AYH1sEMLDOHR8TraRNHnL5NfanuWnT6N9_I9bxCqFPRQBQ&oe=67E6F190"
          },
          "updatedAt": "2023-08-09T20:09:09.200+07:00"
        },
        {
          "_id": "dg9",
          "review": "Xứng đáng để quay lại, 10 điểm không có nhưng.",
          "rating": 4.6,
          "user": {
            "id": "64c5d95adc7efae2a45ec376",
            "username": "Lý Nguyễn Thị",
            "profile": "https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-1/479494459_1685681145692964_4224739755962842024_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEoTuBdEEFAIIWHk0-99ErJH3HNB-t14Aofcc0H63XgCnxNqRDIx4lwR9EGoFSqL7sXMzdPqIfEQVikACm6Xwt3&_nc_ohc=wgqfa4htFgMQ7kNvgE6YUL8&_nc_oc=Adlt1km1PNup5ct2xJNJRiYCF-JG7sHMjNicYtiVOlJe_AiQ-CNhgcHnfJvuij-H6vwGM00o2-OKPmbsdAE82GDu&_nc_zt=24&_nc_ht=scontent.fhan14-4.fna&_nc_gid=JxFign6ZzeFZh-x8tf6hpA&oh=00_AYG8D0-DWIDWe7Y9lcT-kkLKaNi-ylCu4UsYuD5lQaimog&oe=67E6D84F"
          },
          "updatedAt": "2023-08-09T20:09:09.200+07:00"
        }
      ]
    },
    {
      "id": "5",
      "country_id": "cg30",
      "title": "Pho Nang Motel",
      "imageUrl": "https://media.mia.vn/uploads/blog-du-lich/bali-motel-vung-tau-thien-duong-nghi-duong-tinh-te-va-tien-nghi-giua-pho-bien-22-1650038633.jpg",
      "rating": 4.3,
      "review": "600 đánh giá",
      "location": "Cầu Giấy, Hà Nội",
      "availability": {
        "start": "2023-08-19T07:00:00.000+07:00",
        "end": "2023-08-26T07:00:00.000+07:00"
      },
      "coordinates": {
        "latitude": 21.031,
        "longitude": 105.795
      },
      "description": "Pho Nang Motel nằm ở Hà Nội, cách Bảo tàng dân tộc học Việt Nam 1.8 km và Trung tâm thương mại Vincom Nguyễn Chí Thanh 4.9 km. Chỗ đậu xe riêng có thể được sắp xếp với một khoản phụ phí.",
      "contact": "64c5d95adc7efae2a45ec380",
      "price": 350000,
      "reviews": [
        {
          "_id": "dg10",
          "review": "Sạch sẽ, thoáng mát, nhân viên nhiệt tình.",
          "rating": 4.9,
          "user": {
            "id": "64c5d95adc7efae2a45ec376",
            "username": "Quỳnh Lê Thị",
            "profile": "https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-1/480327100_2763185244070651_2683696703023659634_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEOr0pGKv4FRiqEsCVli2RGje9kskhrDeWN72SySGsN5eKMU_N5f9Z1553GOK2ma0mMpQsHHLWceplPf7gE0-Oi&_nc_ohc=ArSAUTNWYYUQ7kNvgHe350l&_nc_oc=Adkp0_2z8oJFFqJq2raS02xZcM6OEGYLZlZ6C5-Mdlj_tQCFCpC7RljIDrIpsUhZd9QxWfMGvlO9kLEBnhfQI4qm&_nc_zt=24&_nc_ht=scontent.fhan14-1.fna&_nc_gid=Yq-Qx0x5BalUe3s5kJnaXQ&oh=00_AYH1sEMLDOHR8TraRNHnL5NfanuWnT6N9_I9bxCqFPRQBQ&oe=67E6F190"
          },
          "updatedAt": "2023-08-09T20:09:09.200+07:00"
        },
        {
          "_id": "dg11",
          "review": "Xứng đáng để quay lại, 10 điểm không có nhưng.",
          "rating": 4.6,
          "user": {
            "id": "64c5d95adc7efae2a45ec376",
            "username": "Lý Nguyễn Thị",
            "profile": "https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-1/479494459_1685681145692964_4224739755962842024_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEoTuBdEEFAIIWHk0-99ErJH3HNB-t14Aofcc0H63XgCnxNqRDIx4lwR9EGoFSqL7sXMzdPqIfEQVikACm6Xwt3&_nc_ohc=wgqfa4htFgMQ7kNvgE6YUL8&_nc_oc=Adlt1km1PNup5ct2xJNJRiYCF-JG7sHMjNicYtiVOlJe_AiQ-CNhgcHnfJvuij-H6vwGM00o2-OKPmbsdAE82GDu&_nc_zt=24&_nc_ht=scontent.fhan14-4.fna&_nc_gid=JxFign6ZzeFZh-x8tf6hpA&oh=00_AYG8D0-DWIDWe7Y9lcT-kkLKaNi-ylCu4UsYuD5lQaimog&oe=67E6D84F"
          },
          "updatedAt": "2023-08-09T20:09:09.200+07:00"
        }
      ]
    }
  ];


  return (
    <SafeAreaView style={[reusable.container]}>
      <View style={[styles.searchContainer]}>
        <View style={[styles.searchWrapper]}>
          <TextInput
            style={[styles.input]}
            value={searchKey}
            onChangeText={setSearchKey}
            placeholder='Where do you want to visit'
          />
        </View>

        <TouchableOpacity style={[styles.searchBtn]}>
          <Feather name='search' size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

          {search.length === 0 ? (
      <View>
        <HeightSpacer height={'20%'} />
        <Image
          source={{uri:"https://tse1.mm.bing.net/th?id=OIP.-RaIoDl0_uGYZ7MKm473XwHaFj&pid=Api&P=0&h=180"}}
          style={styles.searchImage}
        />
      </View>
    ) : (
      <FlatList
        data={search}
        keyExtractor={(item) => item?._id}
        renderItem={({ item }) => (
          <View style={styles.tile}>
            <ReusableTile item={item} 
            onPress={() => {navigation.navigate('PlaceDetails', item._id)}} />
          </View>
        )}
      />
    )}


    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginHorizontal: SIZES.small,
    borderColor: COLORS.blue,
    borderWidth: 1,
    borderRadius: SIZES.medium,
    marginVertical: SIZES.medium,
    height: 50,
  },
  input: {
    fontFamily: 'regular',
    width: "100%",
    height: "100%",
    paddingHorizontal: 50,
  },
  searchWrapper: {
    flex: 1,
    marginRight: SIZES.small,
    borderRadius: SIZES.small,
  },
  searchImage:{
      resizeMode: "contain",
      width: "100%",
      height: SIZES.height/2.2,
      paddingHorizontal: 20,
  },
  searchBtn: {
    width: 50,
    height: "100%",
    borderRadius: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.lightBlue,
  },
  tile: {
    marginHorizontal: 12,
    marginBottom: 10,
  }

})
export default Search