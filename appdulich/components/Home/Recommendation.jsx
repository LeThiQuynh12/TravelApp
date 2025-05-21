import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { COLORS, TEXT, SIZES } from '../../constants/theme';
import { fetchSuggestions } from '../../services/api';
import PaginatedList from '../PaginatedList';
import ReusableText from '../Reusable/ReusableText';
import ReusableTile from '../Reusable/ReusableTile';
import { rowWithSpace } from '../Reusable/reusable.style';

const Recommendations = () => {
  const navigation = useNavigation();
  
  // Hàm fetchData truyền cho PaginatedList, lấy suggestions theo page, limit
  const fetchData = async (page, limit) => {
    // fetchSuggestions trả về mảng suggestion (đã chỉnh sửa để nhận page, limit)
    return await fetchSuggestions(page, limit);
  };

  // Render từng item suggestion
  const renderItem = ({ item }) => (
    <ReusableTile
      item={item}
      onPress={() => navigation.navigate('PlaceDetails', { item })}
    />
  );

  return (
    <View style={styles.container}>
      <View style={[rowWithSpace('space-between'), { paddingBottom: 10 }]}>
        <ReusableText
          text={'Gợi ý'}
          family={'medium'}
          size={TEXT.large}
          color={COLORS.black}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Recommended')}>
          <Feather name="list" size={20} />
        </TouchableOpacity>
      </View>

      <PaginatedList
        fetchData={fetchData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        horizontal
        limit={2}
        contentContainerStyle={{ columnGap: SIZES.medium }}
        ListEmptyComponent={
          <ReusableText
            text="Không có gợi ý nào."
            family="medium"
            size={TEXT.medium}
            color={COLORS.gray}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
  },
});

export default Recommendations;
