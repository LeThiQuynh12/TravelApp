import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Linking,
  FlatList,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import NetworkImage from '../../components/Reusable/NetworkImage';
import AppBar from '../../components/Reusable/AppBar';
import { COLORS, SIZES, TEXT } from '../../constants/theme';
import RenderItem from '../../components/Reusable/renderItem';
import ReviewComponent from '../../components/Reusable/ReviewComponent';
import ServicelModal from './ServiceModal';
const PlaceDetails = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params;

  // Default values for missing data
  const mapCoordinates = item.map || { latitude: 10.762622, longitude: 106.660172 };
  const openingHours = item.opening_hours || "08:00 - 17:00 hàng ngày";
  const contact = item.contact || "0123 456 789";
  const website = item.website || "https://example.com";
  const bestTime = item.best_time || "Sáng sớm hoặc chiều muộn";
  const averageVisitTime = item.visit_time || "2-3 giờ";
  const [reviews, setReviews] = useState(item.reviews || []);
  const facilities = item.facilities || [
    "Nhà vệ sinh",
    "Bãi đỗ xe",
    "Quán ăn",
    "Khu vực nghỉ ngơi"
  ];

  // Sample data for food & drinks
  const foodAndDrinks = item.food_drinks || [
    {
      id: 1,
      name: "Co Vietnamese Restaurant & Vegan",
      type: "Nhà hàng",
      cuisine: "Ẩm thực Việt",
      price_range: "$$",
      distance: "0.2km",
      rating: 4.5,
      image: "https://media-cdn.tripadvisor.com/media/photo-i/2e/55/74/9d/dishes-of-co-vietnamese.jpg"
    },
    {
      id: 2,
      name: "Quán cà phê Hồ Gươm ",
      type: "Quán cà phê",
      cuisine: "Cà phê truyền thống",
      price_range: "$",
      distance: "0.5km",
      rating: 4.2,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0K1QkC9fxdB8H1O-v50Ue1w5lRj2iyudGTg&s"
    },
    {
      id: 33,
      name: "LAIKA",
      type: "Quán cà phê",
      cuisine: "Cà phê truyền thống",
      price_range: "$",
      distance: "0.5km",
      rating: 4.2,
      image: "https://static.vinwonders.com/production/cafe-ho-guom-2.jpg"
    }
  ];

  // Sample data for entertainment
  const entertainment = item.entertainment || [
    {
      id: 1,
      name: "Khu vui chơi trẻ em",
      type: "Vui chơi",
      description: "Khu vui chơi với nhiều trò chơi cho trẻ em",
      distance: "0.1km",
      rating: 4.3,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgs_bOu6Xdwe7HR9775D2Ce4I1s5itZJlXLw&s"
    },
    {
      id: 2,
      name: "Công viên giải trí",
      type: "Giải trí",
      description: "Công viên với nhiều trò chơi cảm giác mạnh",
      distance: "0.3km",
      rating: 4.7,
      image: "https://grandworld.vinhomes.vn/wp-content/uploads/2024/03/dia-diem-vui-choi-ha-noi-12.jpg"
    }
  ];

  const services = [
    {
      id: 1,
      name: "Dịch vụ hướng dẫn viên",
      type: "Hướng dẫn",
      description: "Hướng dẫn viên du lịch chuyên nghiệp",
      price: "200.000đ/giờ",
      rating: 4.8,
      reviews: 12,
      guide: [
        "Đặt trước ít nhất 1 ngày",
        "Thanh toán trứơc 50% ",
        "Gặp hướng dẫn viên tại điểm hẹn"
      ],
      contact: "0901 234 567",
      image: "https://cdn.tuoitrethudo.vn/stores/news_dataimages/2023/102023/21/10/thap-rua-vntrip620231021100329.jpg?rt=20231021100332"
    },
    {
      id: 2,
      name: "Cho thuê xe đạp",
      type: "Vận chuyển",
      description: "Dịch vụ cho thuê xe đạp tham quan",
      price: "50.000đ/giờ",
      rating: 4.5,
      reviews: 8,
      policies: [
        "Đặt cọc 200.000đ/xe",
        "Trả muộn phụ thu 20%/giờ",
        "Hư hỏng khấu trừ tiền cọc"
      ],
      contact: "0901 234 568",
      image: "https://image.bnews.vn/MediaUpload/Org/2023/08/16/1-20230816105721.jpg"
    }
  ];

  // Hàm mở modal với dữ liệu chi tiết
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const handleItemPress = (item) => {
    setSelectedService(item);
    setModalVisible(true);
  };

  const handleAddReview = (newReview) => {
    setReviews([newReview, ...reviews]);
  };
  const handleCall = () => {
    Linking.openURL(`tel:${contact}`);
  };

  const handleOpenWebsite = () => {
    Linking.openURL(website);
  };

  const handleOpenMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${mapCoordinates.latitude},${mapCoordinates.longitude}`;
    Linking.openURL(url);
  };


  

  return (
    <View style={styles.container} > 
      <AppBar
        title={item.name}
        color={COLORS.white}
        top={50}
        left={10}
        right={10}
        onPress={() => navigation.goBack()}
      />
    
    <ScrollView style={[styles.contenContainer,{ marginTop: 85 }]} >
      
      <ImageBackground 
        source={{ uri: item.image }} 
        style={styles.headerImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          <Text style={styles.title}>{item.introduction || item.name}</Text>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        {/* Quick Info Bar */}
        <View style={styles.infoBar}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color={COLORS.green} />
            <Text style={styles.infoText}>{openingHours}</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="attach-money" size={20} color={COLORS.green} />
            <Text style={styles.infoText}>{item.ticket_prices || 'Miễn phí'}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call" size={18} color="white" />
            <Text style={styles.actionButtonText}>Gọi điện</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenWebsite}>
            <Ionicons name="globe" size={18} color="white" />
            <Text style={styles.actionButtonText}>Website</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenMap}>
            <Ionicons name="map" size={18} color="white" />
            <Text style={styles.actionButtonText}>Chỉ đường</Text>
          </TouchableOpacity>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color={COLORS.green} />
            <Text style={styles.sectionTitle}>Giới thiệu</Text>
          </View>
          <Text style={styles.sectionText}>{item.description || 'Địa điểm này chưa có mô tả chi tiết.'}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={20} color={COLORS.green} />
            <View>
              <Text style={styles.detailLabel}>Thời gian tham quan</Text>
              <Text style={styles.detailValue}>{averageVisitTime}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="sunny" size={20} color={COLORS.green} />
            <View>
              <Text style={styles.detailLabel}>Thời điểm đẹp nhất</Text>
              <Text style={styles.detailValue}>{bestTime}</Text>
            </View>
          </View>
        </View>

        {/* Food & Drinks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="food-fork-drink" size={24} color={COLORS.green} />
            <Text style={styles.sectionTitle}>Địa điểm ăn uống </Text>
          </View>
          {foodAndDrinks.length > 0 ? (
            <FlatList
              data={foodAndDrinks}
              renderItem={({item})=>(
                <RenderItem
                      item={item}
                      onPress={() => navigation.navigate('FoodDrink', { item })}
                    />                
                )}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <Text style={styles.noDataText}>Không có thông tin về địa điểm ăn uống</Text>
          )}
        </View>

        {/* Entertainment Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="attractions" size={24} color={COLORS.green} />
            <Text style={styles.sectionTitle}>Vui chơi giải trí</Text>
          </View>
          {entertainment.length > 0 ? (
            <FlatList
              data={entertainment}
              renderItem={({item})=>(
                <RenderItem
                      item={item}
                      onPress={() => navigation.navigate('Entertainment', { item })}
                    />                
                )}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              //onPress={navigation.navigate("FoodDrink",{item})}
            />
          ) : (
            <Text style={styles.noDataText}>Không có thông tin về khu vui chơi</Text>
          )}
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="miscellaneous-services" size={24} color={COLORS.green} />
            <Text style={styles.sectionTitle}>Dịch vụ tại chỗ</Text>
          </View>
          {services.length > 0 ? (
            <FlatList
              data={services}
              renderItem={({item})=>(
                <RenderItem 
                item={item} 
                onPress={() => handleItemPress(item)} 
              />              
                )}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              
            />
            
          ) : (
            <Text style={styles.noDataText}>Không có thông tin về dịch vụ</Text>
          )}
        </View>
          {/* Modal hiển thị chi tiết dịch vụ */}
          <ServicelModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            service={selectedService}
           
          />
        {/* Facilities Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={24} color={COLORS.green} />
            <Text style={styles.sectionTitle}>Tiện ích</Text>
          </View>
          <View style={styles.facilitiesContainer}>
            {facilities.map((facility, index) => (
              <View key={index} style={styles.facilityItem}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.green} />
                <Text style={styles.facilityText}>{facility}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Address & Map Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={24} color={COLORS.green} />
            <Text style={styles.sectionTitle}>Địa chỉ</Text>
          </View>
          <Text style={styles.sectionText}>{item.address || 'Không có thông tin địa chỉ'}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: mapCoordinates.latitude,
              longitude: mapCoordinates.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: mapCoordinates.latitude,
                longitude: mapCoordinates.longitude,
              }}
              title={item.name}
              description={item.address}
            />
          </MapView>
          <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
            <Text style={styles.mapButtonText}>Xem trên bản đồ</Text>
          </TouchableOpacity>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="alert-circle" size={24} color={COLORS.green} />
            <Text style={styles.sectionTitle}>Lưu ý</Text>
          </View>
          <Text style={styles.sectionText}>
            {item.notes || '• Mang theo nước uống\n• Mặc trang phục phù hợp\n• Mang theo kem chống nắng vào mùa hè'}
          </Text>
        </View>

        {/* Reviews Section */}
        <ReviewComponent reviews={reviews} onSubmitReview={handleAddReview} />
      </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  headerImage: {
    height: 250,
    justifyContent: 'flex-end',
   
    borderRadius: 20
  },
  headerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontSize: TEXT.large + 6
  },
  content: {
    padding: 15,
    backgroundColor: '#fff',
  },
  infoBar: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  infoText: {
    marginHorizontal: 8,
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.green,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 0.3,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.48,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
    marginTop: 2,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  facilityText: {
    fontSize: 14,
    color: COLORS.green ,
    marginLeft: 5,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  mapButton: {
    backgroundColor: COLORS.green,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  mapButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  ratingSummary: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  averageRating: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  totalReviews: {
    fontSize: 14,
    color: '#666',
  },
  reviewItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  reviewRating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.green,
    marginRight: 3,
  },
  reviewDate: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  noReviews: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
  },
  noReviewsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#616161',
    marginTop: 10,
  },
  noReviewsSubtext: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 5,
    textAlign: 'center',
  },
 
});

export default PlaceDetails;