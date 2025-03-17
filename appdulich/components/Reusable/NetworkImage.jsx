import React from 'react';

import {
  Image,
  StyleSheet,
} from 'react-native';

const NetworkImage = ({ source, width, height, radius }) => {
    return (
      <Image
        source={typeof source === "string" ? { uri: source } : source}
        style={styles.image(width, height, radius)}
      />
    );
  };
  
const styles = StyleSheet.create({
  image: (width, height, radius) => ({
    width: width,
    height: height,
    borderRadius: 10,
    resizeMode: "cover",
  }),
});

export default NetworkImage;
