import React from 'react';

import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  COLORS,
  SIZES,
} from '../../constants/theme';
import HeightSpacer from './HeightSpacer';
import NetworkImage from './NetworkImage';
import Rating from './Rating';
import { rowWithSpace } from './reusable.style';
import ReusableText from './ReusableText';
import WidthSpacer from './WidthSpacer';

const ReusableTile = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={rowWithSpace("flex-start")}>  
        {/* Hình ảnh địa điểm */}
        <NetworkImage source={item.image} width={80} height={80} radius={12} />
        <WidthSpacer width={15} />

        <View>
          {/* Tiêu đề */}
          <ReusableText
            text={item.name}
            family={"medium"}
            size={SIZES.medium}
            color={COLORS.black}
          />
          <HeightSpacer height={8} />

          {/* Địa điểm */}
          <ReusableText
            text={item.address}  // item.location chưa được định nghĩa trong dữ liệu
            family={"medium"}
            size={14}
            color={COLORS.gray}
          />

          <HeightSpacer height={8} />

          {/* Xếp hạng và số lượng đánh giá */}
          <View style={rowWithSpace("flex-start")}>  
            <Rating rating={item.rating} />
            <WidthSpacer width={5} />
            <ReusableText
              text={`(${item.review} đánh giá)`}  // Sửa lỗi cú pháp từ (${item.review}) => `(${item.review})`
              family={"medium"}
              size={14}
              color={COLORS.gray}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: COLORS.lightWhite,
      borderRadius: 12,
    },
  })
export default ReusableTile