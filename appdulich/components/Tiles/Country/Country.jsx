import React from 'react';

import {
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import {
  COLORS,
  TEXT,
} from '../../../constants/theme';
import HeightSpacer from '../../Reusable/HeightSpacer';
import NetworkImage from '../../Reusable/NetworkImage';
import ReusableText from '../../Reusable/ReusableText';

const Country = ({ item }) => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity onPress={() => navigation.navigate("CountryDetails", { item })}>
        <View>
          <NetworkImage source={{ uri: item.imageUrl }} width={85} height={85} radius={12} />
          <HeightSpacer height={5} />
          <ReusableText
            text={item.country}
            family={"medium"}
            size={TEXT.medium}
            color={COLORS.black}
            align={"center"}
          />
        </View>
      </TouchableOpacity>
    );
  };
  
  

export default Country