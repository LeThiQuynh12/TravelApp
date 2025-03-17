import React from 'react';

import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import ReusableBtn from '../../components/Buttons/ReusableBtn.jsx';
import HeightSpacer from '../../components/Reusable/HeightSpacer.jsx';
import ReusableText from '../../components/Reusable/ReusableText.jsx';
import {
  COLORS,
  SIZES,
} from '../../constants/theme.js';

const Slides = ({ item }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.stack}>
        <ReusableText
          text={item.title}
          family={"medium"}
          size={SIZES.xxLarge}
          color={COLORS.white}
        />
        <HeightSpacer height={10} />
        <View style={styles.btnContainer}>
        <ReusableBtn 
          onPress={() => navigation.navigate("Bottom")}
          btnText={"Bắt đầu ngay"}
          width={SIZES.width / 2}
          backgroundColor={COLORS.red}
          borderColor={COLORS.red}
          borderWidth={0}
          textColor={COLORS.white}
        />
        </View>
        <HeightSpacer height={20} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Chiếm toàn bộ màn hình
  },
  image: {
    flex: 1, // Đảm bảo ảnh mở rộng toàn bộ View cha
    width: SIZES.width,
    height: SIZES.height,
    resizeMode: "cover",
  },
  stack: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  btnContainer:{
    marginLeft: -130,
  }
});

export default Slides;
