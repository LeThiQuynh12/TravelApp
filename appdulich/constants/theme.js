import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const COLORS = {
  blue: "#4267B2",
  red: "#EB6A58",
  green: "#449282",
  white: "#FBFBFB",
  lightWhite: "#FFFFFF",
  lightBlue: "#6885C1",
  lightRed: "#EB9C9B",
  lightGreen: "#73ADA1",
  black: "#121212",
  dark: "#3D3A45",
  gray: "#8C8C8C",
  lightGrey: "#D1CFD5",
  lightCyan: "#F6FBFF",
};
const SIZES = {
    xSmall: 10,
    small: 12,
    medium: 16,
    large: 20,
    xLarge: 24,
    xxLarge: 44,
    width,  // Kích thước màn hình
    height,
  };
  
  const TEXT = {
    xxSmall: 11,
    xSmall: 13,
    small: 15,
    medium: 15,
    large: 19,
    xLarge: 27,
    xxLarge: 32,
  };
  const SHADOWS = {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 6.4,
      elevation: 8,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.40,
      shadowRadius: 12.8,
      elevation: 16,
    },
  }

export { SHADOWS, SIZES, TEXT };
