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
  AntDesign,
  Feather,
} from '@expo/vector-icons';

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

const { width } = Dimensions.get("window");
const slides = [
  { img: { uri: "https://cdn-icons-png.flaticon.com/128/1728/1728563.png" }, title: "Giá chỉ có trên điện thoại", detail: "Ưu đãi cho các chỗ nghỉ nhất định khi đặt ứng dụng" },
  { img: { uri: "https://cdn-icons-png.flaticon.com/128/3762/3762131.png" }, title: "Du lịch VN chỉ 1 cú nhấp", detail: "Khám phá kỳ quan Việt Nam" },
  { img: { uri: "https://cdn-icons-png.flaticon.com/128/1019/1019607.png" }, title: "Thanh toán linh hoạt", detail: "Nhiều lựa chọn khi thanh toán online" },
  { img: { uri: "https://cdn-icons-png.flaticon.com/128/1019/1019607.png" }, title: "Di chuyển dễ dàng hơn", detail: "Dễ dàng tìm xe, tàu hoặc máy bay với giá ưu đãi nhất" },
  { img: { uri: "https://cdn-icons-png.flaticon.com/128/1041/1041916.png" }, title: "Hỗ trợ chat", detail: "Tư vấn nhanh chóng, hỗ trợ 24/7" },
  { img: { uri: "https://cdn-icons-png.flaticon.com/128/12431/12431983.png" }, title: "Tham quan vui chơi", detail: "Tận hưởng chuyến đi với những hoạt động thú vị" },
];

const Home = ({ navigation }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={rowWithSpace("space-between")}>
          <ReusableText text={"Xin Chào Quỳnh!"} family={"regular"} size={TEXT.large} color={COLORS.black} />
          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate("Search")}>
            <AntDesign name="search1" size={26} />
          </TouchableOpacity>
        </View>

        <HeightSpacer height={15} />

        <View style={[rowWithSpace("space-between"), { paddingBottom: 10 }]}>
          <ReusableText text={"Các địa điểm"} family={"medium"} size={TEXT.large} color={COLORS.black} />
          <TouchableOpacity onPress={() => navigation.navigate("PlaceList")}>
            <Feather name="list" size={20} />
          </TouchableOpacity>
        </View>

        <Places />
        <Recommendations />
        <BestHotels />

        <HeightSpacer height={15} />
        <ReusableText text={"Vì sao lại chọn LuxGo ?"} family={"medium"} size={TEXT.large} color={COLORS.black} />

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
            <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
          ))}
        </View>
        <HeightSpacer height={15} />
        <ReusableText text={"Cảnh đẹp Việt Nam trực tiếp"} family={"medium"} size={TEXT.large} color={COLORS.black} />
        <HeightSpacer height={10} />
        <YoutubePlayer height={200} play={false} videoId="Au6LqK1UH8g" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: COLORS.white,
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  slide: {
    width: width * 0.8,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginHorizontal: width * 0.05, // Canh giữa
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Đổ bóng cho Android
    marginVertical: 20,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  title: {
    fontSize: TEXT.medium,
    fontWeight: "bold",
    color: COLORS.black,
    marginTop: 10,
  },
  detail: {
    fontSize: TEXT.small,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 5,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
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
