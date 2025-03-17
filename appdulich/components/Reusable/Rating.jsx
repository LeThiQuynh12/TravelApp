import {
  StyleSheet,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { rowWithSpace } from './reusable.style';
import ReusableText from './ReusableText';
import WidthSpacer from './WidthSpacer';

const Rating = ({ rating }) => {
  return (
    <View style={rowWithSpace("flex-start")}>  

      <MaterialCommunityIcons name="star" size={20} color="#FD9942" />
      <WidthSpacer width={5} />
      <ReusableText
        text={rating}
        family={"medium"}
        size={15}
        color="#FD9942"
      />
    </View>
  );
};

export default Rating;

const styles = StyleSheet.create({});