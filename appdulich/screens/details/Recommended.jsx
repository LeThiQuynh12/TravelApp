import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import AppBar from '../../components/Reusable/AppBar';
import ReusableTile from '../../components/Reusable/ReusableTile';
import PaginatedList from '../../components/PaginatedList';
import { COLORS } from '../../constants/theme';
import { fetchSuggestions } from '../../services/api';  // Đảm bảo gọi đúng hàm fetchSuggestions

const Recommended = ({ navigation }) => {
  // fetchData phân trang
  const fetchData = async (page, limit) => {
    return await fetchSuggestions(page, limit);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <ReusableTile
        item={item}
        onPress={() => navigation.navigate('PlaceDetails', { item })}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBarContainer}>
        <AppBar
          title="Danh sách điểm đến"
          color={COLORS.white}
          color1={COLORS.white}
          icon="search1"
          top={0}
          left={0}
          right={0}
          onPress={() => navigation.goBack()}
          onPress1={() => navigation.navigate('Search')}
        />
      </View>

      <View style={styles.listContainer}>
        <PaginatedList
          fetchData={fetchData}
          renderItem={renderItem}
           keyExtractor={(item, index) => `${item._id}-${index}`}
          limit={10}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ReusableTile item={null} />
            </View>
          }
          // Bổ sung key để tránh lỗi khi đổi numColumns (nếu có)
          key={'flatlist-1'} 
          // Nếu PaginatedList dùng FlatList bên trong, và bạn muốn set numColumns = 1 thì cố định luôn
          numColumns={1}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 10 },
  appBarContainer: { height: 50 },
  listContainer: { flex: 1, paddingTop: 10 },
  itemContainer: { marginBottom: 10 },
});

export default Recommended;
