import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, ImageBackground, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS,SIZES } from '../../constants/theme';
import AppBar from '../../components/Reusable/AppBar';
import ReviewComponent from '../../components/Reusable/ReviewComponent';

const FoodDrink = ({ navigation, route }) => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: "Nguyễn Văn A",
      rating: 5,
      comment: "Đồ ăn ngon, phục vụ nhiệt tình",
      date: "2023-05-15"
    },
    // ... thêm đánh giá mẫu
  ]);

  const foodDrinks = [
    {
      id: 1,
      name: "Nhà hàng ABC",
      rating: 4.5,
      // ... thêm thông tin khác
    },
    // ... thêm địa điểm
  ];

  const handleSubmitReview = (newReview) => {
    setReviews([...reviews, {
      id: reviews.length + 1,
      userName: "Bạn",
      ...newReview,
      date: new Date().toISOString()
    }]);
  };

  return (
    <View style={styles.container}>
      <AppBar 
        title="Địa điểm ăn uống" 
        onPress={() => navigation.goBack()} 
      />
      
      {/* <ImageBackground
        source={require()}
        style={styles.headerImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          <MaterialCommunityIcons name="food-fork-drink" size={40} color={COLORS.white} />
          <Text style={styles.headerTitle}>Ẩm thực đa dạng</Text>
        </View>
      </ImageBackground> */}

      <ScrollView>
        {/* Danh sách địa điểm */}
        {/* <FlatList
          data={foodDrinks}
          renderItem={({ item }) => (
            <FoodDrinkCard 
              item={item} 
              onPress={() => navigation.navigate('FoodDetail', { item })} 
            />
          )}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        /> */}

        {/* Component đánh giá */}
        <ReviewComponent 
          onSubmit={handleSubmitReview} 
          reviews={reviews} 
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  headerImage: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});

export default FoodDrink;