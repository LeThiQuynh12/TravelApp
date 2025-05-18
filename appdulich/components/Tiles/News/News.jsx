import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { COLORS } from '../../../constants/theme';
import AppBar from '../../Reusable/AppBar';
import HeightSpacer from '../../Reusable/HeightSpacer';

const ReviewsListScreen = ({ navigation, route }) => {

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
        <AppBar
          top={10}
          left={0}
          right={20}
          title={"Cẩm nang du lịch"}
          color={COLORS.white}
          color1={COLORS.white}
          onPress={() => navigation.goBack()}
          icon={'search1'}
        />

        <HeightSpacer height={60}/>

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
    marginHorizontal: 20
  },
});