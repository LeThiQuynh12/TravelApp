import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import {
  FlatList,
  Image,
  Keyboard,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Feather } from '@expo/vector-icons';

import AppBar from '../../components/Reusable/AppBar';
import HeightSpacer from '../../components/Reusable/HeightSpacer';
import HotelCard from '../../components/Tiles/Hotels/HotelCard';
import {
  COLORS,
  SIZES,
} from '../../constants/theme';

const HotelSearch = ({ navigation }) => {
  const [searchKey, setSearchKey] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const API_URL = 'https://67e017447635238f9aac7da4.mockapi.io/api/v1/hotels/';

  // Gọi API khi component được render
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(API_URL);
        setHotels(response.data);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu khách sạn:', error);
        setError('Không thể tải dữ liệu khách sạn');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Hàm xử lý tìm kiếm ở frontend
  const handleSearch = () => {
    if (!searchKey.trim()) {
      setSearchResults(hotels);
      return;
    }

    const filteredHotels = hotels.filter(hotel =>
      hotel.location.toLowerCase().includes(searchKey.toLowerCase()) ||
      hotel.title.toLowerCase().includes(searchKey.toLowerCase())
    );

    setSearchResults(filteredHotels);
    setError(null);
    Keyboard.dismiss();
  };

  // Hàm xử lý giá dạng "min-max"
  const parsePriceRange = (priceString) => {
    if (!priceString || typeof priceString !== 'string') {
      return { min: 0, max: Infinity };
    }
    const [min, max] = priceString.split('-').map(val => parseFloat(val) || 0);
    return { min, max: max || Infinity };
  };

  // Hàm xử lý lọc
  const handleFilter = () => {
    let filteredHotels = [...hotels];

    const userPriceMin = parseFloat(filterPriceMin) || 0;
    const userPriceMax = parseFloat(filterPriceMax) || Infinity;

    if (userPriceMin || userPriceMax < Infinity) {
      filteredHotels = filteredHotels.filter(hotel => {
        const { min: hotelMin, max: hotelMax } = parsePriceRange(hotel.price);
        return hotelMax >= userPriceMin && hotelMin <= userPriceMax;
      });
    }

    if (filterRating > 0) {
      filteredHotels = filteredHotels.filter(
        hotel => hotel.rating >= filterRating
      );
    }

    if (searchKey.trim()) {
      filteredHotels = filteredHotels.filter(hotel =>
        hotel.location.toLowerCase().includes(searchKey.toLowerCase()) ||
        hotel.title.toLowerCase().includes(searchKey.toLowerCase())
      );
    }

    setSearchResults(filteredHotels);
    setFilterModalVisible(false);
    Keyboard.dismiss();
  };

  // Hàm xóa bộ lọc
  const clearFilter = () => {
    setFilterPriceMin('');
    setFilterPriceMax('');
    setFilterRating(0);
    setSearchResults(hotels);
    setFilterModalVisible(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.appBarContainer}>
          <AppBar
            title="Tìm kiếm khách sạn"
            color={COLORS.white}
            color1={COLORS.white}
            icon="filter"
            top={0}
            left={10}
            right={10}
            onPress={() => navigation.goBack()}
            onPress1={() => setFilterModalVisible(true)}
          />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.input}
              value={searchKey}
              onChangeText={setSearchKey}
              placeholder="Bạn đang muốn ở đâu, tìm kiếm ngay"
            />
          </View>
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Feather name="search" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Modal lọc */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={filterModalVisible}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Lọc khách sạn</Text>

                <Text style={styles.filterLabel}>Khoảng giá (VND)</Text>
                <View style={styles.filterRow}>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Giá tối thiểu"
                    value={filterPriceMin}
                    onChangeText={setFilterPriceMin}
                    keyboardType="numeric"
                  />
                  <Text style={styles.filterSeparator}>-</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Giá tối đa"
                    value={filterPriceMax}
                    onChangeText={setFilterPriceMax}
                    keyboardType="numeric"
                  />
                </View>

                <Text style={styles.filterLabel}>Đánh giá tối thiểu</Text>
                <View style={styles.ratingButtons}>
                  {[3, 3.5, 4, 4.5, 5].map(rating => (
                    <TouchableOpacity
                      key={rating}
                      style={[
                        styles.ratingButton,
                        filterRating === rating && styles.ratingButtonSelected,
                      ]}
                      onPress={() => setFilterRating(rating)}
                    >
                      <Text
                        style={[
                          styles.ratingText,
                          filterRating === rating && styles.ratingTextSelected,
                        ]}
                      >
                        {rating} ⭐
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalButton} onPress={clearFilter}>
                    <Text style={styles.modalButtonText}>Xóa bộ lọc</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={handleFilter}>
                    <Text style={styles.modalButtonText}>Áp dụng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {loading ? (
          <View style={styles.centerContainer}>
            <Text>Loading...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={{ color: 'red' }}>{error}</Text>
          </View>
        ) : searchResults.length === 0 ? (
          <View style={styles.emptyContainer}>
            <HeightSpacer height={'20%'} />
            <Image
              source={{
                uri: 'https://i.pinimg.com/736x/c6/6b/84/c66b8480bea5aa9f5edea08eb77351ca.jpg',
              }}
              style={styles.searchImage}
            />
          </View>
        ) : (
          <FlatList
            data={searchResults}
            numColumns={2}
            ItemSeparatorComponent={() => <View style={{ height: 13 }} />}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <HotelCard
                item={item}
                margin={6}
                onPress={() => navigation.navigate('HotelDetails', { id: item.id })}
              />
            )}
            contentContainerStyle={styles.flatListContent}
          />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Đảm bảo SafeAreaView chiếm toàn bộ màn hình
  },
  appBarContainer: {
    height: 38,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginHorizontal: SIZES.small,
    borderColor: COLORS.blue,
    borderWidth: 1,
    borderRadius: SIZES.medium,
    marginVertical: SIZES.medium,
    height: 50,
  },
  input: {
    fontFamily: 'regular',
    width: '100%',
    height: '100%',
    paddingHorizontal: 50,
  },
  searchWrapper: {
    flex: 1,
    marginRight: SIZES.small,
    borderRadius: SIZES.small,
  },
  searchImage: {
    resizeMode: 'contain',
    width: '100%',
    height: SIZES.height / 2.2,
    paddingHorizontal: 20,
  },
  searchBtn: {
    width: 50,
    height: '100%',
    borderRadius: SIZES.small,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightBlue,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
  },
  flatListContent: {
    paddingHorizontal: 4,
    paddingBottom: SIZES.large * 2, // Thêm padding dưới để kéo hết danh sách
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    width: '90%',
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: SIZES.medium,
  },
  filterLabel: {
    fontSize: SIZES.medium,
    marginTop: SIZES.small,
    marginBottom: SIZES.small / 2,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.small,
    padding: SIZES.small,
    marginRight: SIZES.small,
  },
  filterSeparator: {
    fontSize: SIZES.medium,
    marginHorizontal: SIZES.small,
  },
  ratingButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: SIZES.small,
  },
  ratingButton: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.small,
    padding: SIZES.small,
    margin: SIZES.small / 2,
  },
  ratingButtonSelected: {
    backgroundColor: COLORS.lightBlue,
    borderColor: COLORS.blue,
  },
  ratingText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  ratingTextSelected: {
    color: COLORS.white,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SIZES.medium,
  },
  modalButton: {
    padding: SIZES.small,
    marginLeft: SIZES.small,
  },
  modalButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.blue,
  },
});

export default HotelSearch;