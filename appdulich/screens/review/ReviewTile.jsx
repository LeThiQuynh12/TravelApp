import 'moment/locale/vi'; // Import để hỗ trợ tiếng Việt

import React from 'react';

import moment from 'moment';
import {
  StyleSheet,
  View,
} from 'react-native';

import NetworkImage from '../../components/Reusable/NetworkImage';
import Rating from '../../components/Reusable/Rating';
import { rowWithSpace } from '../../components/Reusable/reusable.style';
import ReusableText from '../../components/Reusable/ReusableText';
import WidthSpacer from '../../components/Reusable/WidthSpacer';
import {
  COLORS,
  SIZES,
} from '../../constants/theme';

moment.locale("vi"); // Đặt ngôn ngữ mặc định là tiếng Việt

const ReviewTile = ({ review }) => {
    return (
      <View style={styles.reviewBorder}>
        <View style={rowWithSpace('space-between')}>
          <View style={rowWithSpace('flex-start')}>
            <NetworkImage
              source={review.user.profile}
              width={54}
              height={54}
              radius={10}
            />


<WidthSpacer width={20} />

<View style={{width: "80%"}}>
  <View style={rowWithSpace("space-between")}>
    <ReusableText
      text={review.user.username}
      family={"medium"}
      size={SIZES.small + 2}
      color={COLORS.black}
    />
    <WidthSpacer width={"0%"}/>
{/* Sao và ngày  */}

<View style={rowWithSpace("space-between")}>
  <Rating rating={review.rating}/>
  <WidthSpacer width={10}/>
  <View>
    {/* <ReusableText
      text={moment(review.updatedAt).format("DD/MM/YYYY HH:mm")} // Hiển thị ngày giờ đầy đủ
      family={"medium"}
      size={SIZES.small + 1}
      color={COLORS.black}
    /> */}
    <ReusableText
      text={moment(review.updatedAt).fromNow()} // Hiển thị kiểu "2 ngày trước"
      family={"medium"}
      size={SIZES.small + 1}
      color={COLORS.gray}
    />
  </View>
</View>


  </View>

  <ReusableText
  text={review.review}
  family={"regular"}
  size={SIZES.small + 2}
  color={COLORS.gray}
/>


</View>

          </View>
        </View>
      </View>
    );
  };


export default ReviewTile

const styles = StyleSheet.create({
    reviewBorder:{
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderColor: COLORS.lightGrey
    }
})