import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { SIZES } from '../../constants/theme';
import { fetchPlaces } from '../../services/api';
import HeightSpacer from '../Reusable/HeightSpacer';
import Country from '../Tiles/Country/Country';
import PaginatedList from '../PaginatedList';

const Places = () => {
  const navigation = useNavigation();
  const limit = 5;

  // Tạo hàm fetchData dùng cho PaginatedList
  // fetchPlaces(page, limit) phải trả về mảng places theo trang
  const fetchData = async (page, limit) => {
    try {
      // Giả sử fetchPlaces hỗ trợ nhận page và limit, nếu không thì cần viết lại API
      const data = await fetchPlaces(page, limit);
      return data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu địa điểm:', error);
      return [];
    }
  };

  return (
    <View>
      <HeightSpacer height={10} />
      <PaginatedList
        fetchData={fetchData}
        limit={limit}
        horizontal
        keyExtractor={item => item._id}
        contentContainerStyle={{ paddingLeft: SIZES.medium }}
        renderItem={({ item }) => (
          <View style={{ marginRight: SIZES.medium }}>
            <Country
              item={item}
              onPress={() => navigation.navigate('CountryDetails', { item })}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Không có địa điểm nào</Text>
        )}
      />
    </View>
  );
};

export default Places;
