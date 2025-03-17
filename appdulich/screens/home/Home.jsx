import React from 'react';

import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={reusable.container}>
      {/* Thêm ScrollView để có thể cuộn */}
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: 100 }} // Tránh bị che khuất nội dung dưới
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn
      >
        <View style={rowWithSpace('space-between')}>
          <ReusableText
            text={'Xin Chào Quỳnh!'}
            family={"regular"}
            size={TEXT.large}
            color={COLORS.black}
          />
          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Search')}>
            <AntDesign name='search1' size={26} />
          </TouchableOpacity>
        </View>

        <HeightSpacer height={15} />

        <View style={[rowWithSpace('space-between'), {paddingBottom: 10}]}>
        <ReusableText
          text={'Các địa điểm'}
          family={"medium"}
          size={TEXT.large}
          color={COLORS.black}
        />

        <TouchableOpacity onPress={()=>navigation.navigate("PlaceList")}>
        <Feather 
        name='list'
        size={20}
        />
        </TouchableOpacity>
        </View>






        <Places />
        <Recommendations />
        <BestHotels />
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
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default Home;
