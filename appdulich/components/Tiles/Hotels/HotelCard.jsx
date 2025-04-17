import React from 'react';

import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  COLORS,
  SIZES,
} from '../../../constants/theme';
import HeightSpacer from '../../Reusable/HeightSpacer';
import NetworkImage from '../../Reusable/NetworkImage';
import Rating from '../../Reusable/Rating';
import { rowWithSpace } from '../../Reusable/reusable.style';
import ReusableText from '../../Reusable/ReusableText';
import WidthSpacer from '../../Reusable/WidthSpacer';

const HotelCard = ({item, margin, onPress}) => {
  return (
    <TouchableOpacity  style={styles.card(margin)} onPress={onPress}>
        <View>
            <View style={styles.imageContainer} >
            <NetworkImage
                source={item.imageUrl}
                width={'90%'}
                height={'100%'}
                radius={16}
            />
            </View>

            <HeightSpacer height={5}/>

            <View style={{padding:10}}>
            <ReusableText
        text={item.title}
        family={"medium"}
        size={SIZES.medium}
        color={COLORS.black}
    />

        <HeightSpacer height={5}/>

        <ReusableText
                text={item.location}
                family={"medium"}
                size={SIZES.medium}
                color={COLORS.gray}
            />
  <HeightSpacer height={5}/>


 {/* Xếp hạng và số lượng đánh giá */}
 <View style={rowWithSpace("flex-start")}>  
            <Rating rating={item.rating} />
            <WidthSpacer width={5} />
            <ReusableText
              text={`(${item.review})`}  // Sửa lỗi cú pháp từ (${item.review}) => `(${item.review})`
              family={"medium"}
              size={14}
              color={COLORS.gray}
            />
          </View>

            </View>
        </View>
    </TouchableOpacity>
  )
}

export default HotelCard

const styles = StyleSheet.create({
    card: (margin) =>({
        width: SIZES.width/2.14,
        height: 285,
        borderRadius: 16,
        backgroundColor: COLORS.lightWhite,
        margin: margin,
    }),
    imageContainer:{
        alignItems: "center",
        marginTop: 10,
        height: 150,
    }
})