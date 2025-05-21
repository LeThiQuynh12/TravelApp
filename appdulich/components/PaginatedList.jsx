import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, View, StyleSheet } from 'react-native';

const PaginatedList = ({
  fetchData,          // Hàm async (page, limit) => []
  renderItem,
  keyExtractor,
  limit = 7,
  horizontal = false,
  numColumns = 1,
  contentContainerStyle,
  ListHeaderComponent,
  ListEmptyComponent,
  ListFooterComponent,
  ...flatListProps
}) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadItems = async () => {
  if (loadingMore || !hasMore) return;

  setLoadingMore(true);
  try {
    const result = await fetchData(page, limit);
    const newItems = Array.isArray(result) ? result : result.data;
    setItems(prev => [...prev, ...newItems]);
    setPage(prev => prev + 1);
    if (newItems.length < limit) setHasMore(false);
  } catch (error) {
    console.error('Lỗi khi phân trang:', error);
  } finally {
    setLoadingMore(false);
    setInitialLoading(false);
  }
};


  useEffect(() => {
    loadItems();
  }, []);

  if (initialLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={loadItems}
      onEndReachedThreshold={0.1}
      horizontal={horizontal}
      numColumns={numColumns}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.loadingMore}>
            <ActivityIndicator size="small" />
          </View>
        ) : ListFooterComponent || null
      }
      {...flatListProps}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMore: {
    paddingVertical: 10,
    alignItems: 'center',
  },
});

export default PaginatedList;
