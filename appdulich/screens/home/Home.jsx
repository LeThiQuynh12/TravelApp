// screens/home/Home.jsx
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';

import {
  Feather,
  Ionicons,
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BestHotels from '../../components/Home/BestHotels.jsx';
import Places from '../../components/Home/Places.jsx';
import Recommendations from '../../components/Home/Recommendation.jsx';
import HeightSpacer from '../../components/Reusable/HeightSpacer.jsx';
import reusable, {
  rowWithSpace,
} from '../../components/Reusable/reusable.style';
import ReusableText from '../../components/Reusable/ReusableText.jsx';
import {
  COLORS,
  TEXT,
} from '../../constants/theme.js';
import { getUser } from '../../services/api'; // Import hàm getUser

const { width } = Dimensions.get('window');
const slides = [
  {
    img: { uri: 'https://cdn-icons-png.flaticon.com/128/1728/1728563.png' },
    title: 'Giá chỉ có trên điện thoại',
    detail: 'Ưu đãi cho các chỗ nghỉ nhất định khi đặt ứng dụng',
  },
  {
    img: { uri: 'https://cdn-icons-png.flaticon.com/128/3762/3762131.png' },
    title: 'Du lịch VN chỉ 1 cú nhấp',
    detail: 'Khám phá kỳ quan Việt Nam',
  },
  {
    img: { uri: 'https://cdn-icons-png.flaticon.com/128/1019/1019607.png' },
    title: 'Thanh toán linh hoạt',
    detail: 'Nhiều lựa chọn khi thanh toán online',
  },
  {
    img: { uri: 'https://cdn-icons-png.flaticon.com/128/1019/1019607.png' },
    title: 'Di chuyển dễ dàng hơn',
    detail: 'Dễ dàng tìm xe, tàu hoặc máy bay với giá ưu đãi nhất',
  },
  {
    img: { uri: 'https://cdn-icons-png.flaticon.com/128/1041/1041916.png' },
    title: 'Hỗ trợ chat',
    detail: 'Tư vấn nhanh chóng, hỗ trợ 24/7',
  },
  {
    img: { uri: 'https://cdn-icons-png.flaticon.com/128/12431/12431983.png' },
    title: 'Tham quan vui chơi',
    detail: 'Tận hưởng chuyến đi với những hoạt động thú vị',
  },
];

const Home = ({ navigation, route }) => {
  const { setIsLoggedIn } = route.params || {};
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin người dùng khi màn hình được tải
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          // Không có token, đặt tên mặc định hoặc điều hướng đến Authentication
          setUser({ username: 'Khách' });
          if (setIsLoggedIn) setIsLoggedIn(false);
          navigation.navigate('authentication');
          return;
        }

        const response = await getUser();
        setUser(response.data);
      } catch (err) {
        console.error('Lỗi lấy thông tin người dùng:', err.message);
        setUser({ username: 'Khách' }); // Tên mặc định nếu lỗi
        if (err.message.includes('token') || err.message.includes('Unauthorized')) {
          await AsyncStorage.removeItem('token');
          if (setIsLoggedIn) setIsLoggedIn(false);
          navigation.navigate('authentication');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigation, setIsLoggedIn]);

  // Tự động chuyển slide
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000); // Chuyển slide mỗi 3 giây

    return () => clearInterval(interval); // Cleanup interval khi component unmount
  }, [currentIndex]);

  return (
    <SafeAreaView style={reusable.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            <Ionicons name="moon-outline" size={25} color="orange" />
            <ReusableText
              text={` Xin Chào ${user?.username || 'Khách'}!`}
              family="regular"
              size={TEXT.large}
              color={COLORS.black}
            />
          </View>

          <View style={styles.logo}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1585/1585600.png' }}
              style={{ width: 22, height: 22 }}
            />
            <Text style={{ color: 'orange', fontWeight: '800', fontSize: 8.5 }}>LuxGo</Text>
          </View>
        </View>

        <HeightSpacer height={15} />

        <View style={[rowWithSpace('space-between'), { paddingBottom: 10 }]}>
          <ReusableText
            text="Các địa điểm"
            family="medium"
            size={TEXT.large}
            color={COLORS.black}
          />
          <TouchableOpacity onPress={() => navigation.navigate('PlaceList')}>
            <Feather name="list" size={20} />
          </TouchableOpacity>
        </View>

        <Places />
        <Recommendations />
        <BestHotels />

        <HeightSpacer height={15} />
        <ReusableText
          text="Vì sao lại chọn LuxGo ?"
          family="medium"
          size={TEXT.large}
          color={COLORS.black}
        />

        {/* Slider */}
        <FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image source={item.img} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.detail}>{item.detail}</Text>
            </View>
          )}
        />

        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
        <HeightSpacer height={15} />
        <ReusableText
          text="Thước phim cảnh đẹp Việt Nam"
          family="medium"
          size={TEXT.large}
          color={COLORS.black}
        />
        <HeightSpacer height={10} />
        <YoutubePlayer height={200} play={false} videoId="Au6LqK1UH8g" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 60,
    height: 60,
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
    borderRadius: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: 'orange',
  },
  slide: {
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: width * 0.05, // Canh giữa
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginVertical: 20,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  title: {
    fontSize: TEXT.medium,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 10,
  },
  detail: {
    fontSize: TEXT.small,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 5,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.green,
  },
});

export default Home;