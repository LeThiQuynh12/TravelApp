import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';

import Slides from './Slides';

const Onboarding = () => {
  const slides = [
    {
        id: 1,
        image: { uri: "https://i.pinimg.com/736x/e8/7d/87/e87d8748b8fdd2615c24b306eeca7e78.jpg" },
        title: "Khám phá kỳ quan Việt Nam dễ dàng"
    },
    {
        id: 2,
        image: { uri: "https://i.pinimg.com/474x/06/bb/0e/06bb0e0a9dd8220682edf62a69994612.jpg" },
        title: "Tìm địa điểm hoàn hảo du lịch"
    },
    {
        id: 3,
        image: { uri: "https://i.pinimg.com/736x/c6/90/01/c690013bb075d9724f3d18ad454b7070.jpg" },
        title: "Trải nghiệm khách sạn tuyệt vời"
    },
  ];

  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex === slides.length - 1 ? 0 : prevIndex + 1;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000); // Tự động chuyển sau 3 giây

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        data={slides}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Slides item={item} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />

      {/* Indicator Dots */}
      <View style={styles.dotContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  dotContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  inactiveDot: {
    backgroundColor: 'gray',
  },
});
