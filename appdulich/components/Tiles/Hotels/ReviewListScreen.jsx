import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { COLORS } from '../../../constants/theme';
import AppBar from '../../Reusable/AppBar';
import HeightSpacer from '../../Reusable/HeightSpacer';
import ReviewsList
  from './ReviewsList'; // Điều chỉnh đường dẫn theo cấu trúc dự án

const ReviewsListScreen = ({ route }) => {
       
  const { reviews } = route.params;

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
        <AppBar
          top={10}
          left={20}
          right={20}
          title={"Đánh giá của khách hàng"}
          color={COLORS.white}
          color1={COLORS.white}
          onPress={() => navigation.goBack()}

        />

        <HeightSpacer height={60}/>
      <ReviewsList reviews={reviews} />
        </ScrollView>

      
    </SafeAreaView>
  );
};

export default ReviewsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 10,
  },
});