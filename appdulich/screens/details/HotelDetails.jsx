import React, {
  useEffect,
  useState,
} from 'react';

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
import { getHotelById } from '../../services/api.js'; // Import hàm getHotelById

const HotelDetails = ({ navigation }) => {
  const route = useRoute();
  const { id } = route.params; // Nhận id từ BestHotels
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await getHotelById(id);
        setHotel(response); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error('Lỗi khi fetch chi tiết khách sạn:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  if (loading) return <ReusableText text="Đang tải..." size={SIZES.large} />;

  if (!hotel) return <ReusableText text="Không tìm thấy khách sạn" size={SIZES.large} />;

  let coordinates = {
    id: hotel._id,
    title: hotel.title,
    latitude: hotel.coordinates.latitude,
    longitude: hotel.coordinates.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <ScrollView>
      <View style={{ height: 80 }}>
        <AppBar
          top={50}
          left={20}
          right={20}
          title={hotel.title}
          color={COLORS.white}
          icon={'search1'}
          color1={COLORS.white}
          onPress={() => navigation.goBack()}
          onPress1={() => navigation.navigate('HotelSearch')}
        />
      </View>
      <View>
        <View style={styles.container}>
          <NetworkImage source={hotel.imageUrl} width={'100%'} height={220} radius={30} />

          <View style={styles.titleContainer}>
            <View style={styles.titleColumn}>
              <ReusableText text={hotel.title} family={'medium'} size={SIZES.large} color={COLORS.black} />
              <HeightSpacer height={7} />
              <ReusableText text={hotel.location} family={'medium'} size={SIZES.medium} color={COLORS.black} />

              <HeightSpacer height={15} />

              <View style={rowWithSpace('space-between')}>
                <Rating maxStars={5} stars={hotel.rating} bordered={false} color={'#FD9942'} />
                <ReusableText
                  text={`(${hotel.review})`}
                  family={'medium'}
                  size={SIZES.medium}
                  color={COLORS.gray}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <HeightSpacer height={20} />
      <View style={[styles.container, { paddingTop: 90 }]}>
        <ReusableText text={'Mô tả'} family={'medium'} size={SIZES.large - 2} color={COLORS.black} />

        <HeightSpacer height={10} />

        <ReusableText
          text={hotel.description}
          family={'regular'}
          size={SIZES.small + 1}
          color={COLORS.gray}
          lineHeight={18}
        />

        <HeightSpacer height={20} />

        <ReusableText text={'Vị trí'} family={'medium'} size={SIZES.large - 2} color={COLORS.black} />

        <HeightSpacer height={15} />

        <ReusableText text={hotel.location} family={'regular'} size={SIZES.small + 1} color={COLORS.gray} />

        <HotelMap coordinates={coordinates} />

        <View style={rowWithSpace('space-between')}>
          <ReusableText text={'Đánh giá'} family={'medium'} size={SIZES.large - 2} color={COLORS.black} />
          <TouchableOpacity onPress={() => navigation.navigate('ReviewsList')}>
            <Feather name="list" size={20} />
          </TouchableOpacity>
        </View>

        <HeightSpacer height={10} />

        {/* Danh sách đánh giá */}
        {/* Lưu ý: Backend hiện tại không trả về reviews, cần tích hợp Review nếu có */}
        <ReviewsList reviews={hotel.reviews || []} />
      </View>

      <View style={[rowWithSpace('space-between'), styles.bottom]}>
        <View>
          <ReusableText
            text={`${hotel.price} VND`}
            family={'medium'}
            size={SIZES.large}
            color={COLORS.black}
          />
          <HeightSpacer height={5} />
          <ReusableText
            text={'01 thg 01 - 25 thg 12'}
            family={'medium'}
            size={SIZES.medium - 2}
            color={COLORS.gray}
          />
        </View>

        <ReusableBtn
          onPress={() => navigation.navigate('SelectRoom', { hotelId: hotel._id })}
          btnText={'Chọn phòng'}
          width={(SIZES.width - 50) / 2.2}
          backgroundColor={COLORS.green}
          borderColor={COLORS.green}
          borderWidth={0}
          textColor={COLORS.white}
        />
      </View>
    </ScrollView>
  );
};

export default HotelDetails;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    marginHorizontal: 20,
  },
  titleContainer: {
    margin: 15,
    backgroundColor: COLORS.lightWhite,
    position: 'absolute',
    top: 170,
    left: 0,
    right: 0,
    borderRadius: 20,
  },
  titleColumn: {
    padding: 15,
  },
  bottom: {
    paddingHorizontal: 30,
    backgroundColor: COLORS.lightWhite,
    height: 120,
    paddingVertical: 20,
    borderRadius: 30,
  },
});