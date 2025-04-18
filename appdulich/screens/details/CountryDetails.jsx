import React, {
  useEffect,
  useState,
} from 'react';

import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useRoute } from '@react-navigation/native';

import AppBar from '../../components/Reusable/AppBar';
import NetworkImage from '../../components/Reusable/NetworkImage';
import { fetchPlaceById } from '../../services/api';

const CountryDetails = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params;
  const [placeDetails, setPlaceDetails] = useState(item);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API để lấy chi tiết địa điểm
  useEffect(() => {
    const loadPlaceDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPlaceById(item._id);
        setPlaceDetails(data);
      } catch (err) {
        setError(err.message);
        console.error('Lỗi khi lấy chi tiết địa điểm:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlaceDetails();
  }, [item._id]);

  if (loading) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>Đang tải dữ liệu...</Text>;
  }

  if (error) {
    return <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={{ height: 80 }}>
        <AppBar
          top={40}
          left={20}
          right={20}
          title={''}
          color="white"
          icon={'search1'}
          color1="white"
          onPress={() => navigation.goBack()}
          onPress1={() => navigation.navigate('PlaceDetails')}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container_1}>
        <NetworkImage source={{ uri: placeDetails.image || placeDetails.image_url }} height={250} width={'100%'} />

        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{placeDetails.name}</Text>
          <Text style={styles.description}>{placeDetails.description}</Text>
        </View>

        {/* Địa điểm nổi bật */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Địa điểm nổi bật</Text>
          <TouchableOpacity>
            <Icon name="ellipsis-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={placeDetails.highlights}
          keyExtractor={(highlight) => highlight._id}
          renderItem={({ item: highlight }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => navigation.navigate('PlaceDetails', { item: highlight })}
            >
              <Image source={{ uri: highlight.image }} style={styles.itemImage} />
              <Text style={styles.itemTitle}>{highlight.name}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />

        {/* Gợi ý dành cho bạn */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gợi ý dành cho bạn</Text>
          <TouchableOpacity>
            <Icon name="ellipsis-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={placeDetails.suggestions}
          keyExtractor={(suggestion) => suggestion._id}
          renderItem={({ item: suggestion }) => (
            <TouchableOpacity
              style={styles.suggestedItem}
              onPress={() => navigation.navigate('PlaceDetails', { item: suggestion })}
            >
              <Image source={{ uri: suggestion.image }} style={styles.suggestedImage} />
              <Text style={styles.suggestedTitle}>{suggestion.name}</Text>
              <Text style={styles.suggestedLocation}>{suggestion.address}</Text>
              <Text style={styles.suggestedRating}>⭐ {suggestion.rating}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />

        {/* Các tỉnh lân cận */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Các tỉnh lân cận</Text>
        </View>
        <FlatList
          horizontal
          data={placeDetails.nearbyProvinces}
          keyExtractor={(province) => province._id}
          renderItem={({ item: province }) => (
            <TouchableOpacity
              style={styles.nearbyContainer}
              onPress={() => navigation.navigate('CountryDetails', { item: province })}
            >
              <Image source={{ uri: province.image }} style={styles.nearbyImage} />
              <Text style={styles.nearbyTitle}>{province.name}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  container_1: {
    padding: 10,
  },
  textContainer: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  flatListContent: {
    // paddingHorizontal: 15,
  },
  itemContainer: {
    width: 120,
    height: 150,
    backgroundColor: '#E7F3FC',
    borderRadius: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: '100%',
    height: 80,
    padding: 5,
    borderRadius: 5,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 5,
    marginTop: 5,
    marginBottom: 15,
  },
  suggestedItem: {
    width: 200,
    backgroundColor: '#E7F3FC',
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestedImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    padding: 5,
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  suggestedLocation: {
    fontSize: 14,
    color: '#666',
  },
  suggestedRating: {
    fontSize: 14,
    color: '#f39c12',
    marginVertical: 5,
  },
  nearbyContainer: {
    alignItems: 'center',
    width: 100,
  },
  nearbyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  nearbyTitle: {
    fontSize: 14,
    color: '#000',
    marginTop: 5,
  },
});

export default CountryDetails;