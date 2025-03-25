import React from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { SIZES } from '../../constants/theme';

const ReusableBtn = ({ onPress, btnText, textColor, width, backgroundColor, borderWidth, borderColor, height }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.btnStyle(width, backgroundColor, borderWidth, borderColor, height)}
    >
      <Text style={styles.btnText(textColor)}>{btnText}</Text>
    </TouchableOpacity>
  );
};



const styles = StyleSheet.create({
    btnText: (textColor) => ({
        fontFamily: "medium",
        fontSize: SIZES.medium,
        color: textColor,
    }),
    btnStyle: (width, backgroundColor, borderWidth, borderColor, height) => ({
      width: width,
      backgroundColor: backgroundColor,
      alignItems: "center",
      justifyContent: "center",
      height: height || 45,  // Mặc định là 45 nếu không truyền height
      borderRadius: SIZES.small,
      borderColor: borderColor,
      borderWidth: borderWidth,
    }),
});
export default ReusableBtn;
