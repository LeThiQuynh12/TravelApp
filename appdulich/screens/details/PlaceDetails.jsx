import React, { useState } from 'react';

import {
  FlatList,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

import AppBar from '../../components/Reusable/AppBar';
import { COLORS, SIZES, TEXT } from '../../constants/theme';
import RenderItem from '../../components/Reusable/RenderItem.jsx';
import ReviewComponent from '../../components/Reusable/ReviewComponent';
import {
  COLORS,
  TEXT,
} from '../../constants/theme';
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
      image: "https://media-cdn.tripadvisor.com/media/photo-i/2e/55/74/9d/dishes-of-co-vietnamese.jpg",
      description: "Nhà hàng phục vụ món chay và món Việt hiện đại, không gian yên tĩnh và gần Hồ Gươm.",
      contact: "0123456789",
      latitude: 21.029449,
      longitude: 105.852456
      image: "https://media-cdn.tripadvisor.com/media/photo-i/2e/55/74/9d/dishes-of-co-vietnamese.jpg",
      description: "Nhà hàng phục vụ món chay và món Việt hiện đại, không gian yên tĩnh và gần Hồ Gươm.",
      contact: "0123456789",
      latitude: 21.029449,
      longitude: 105.852456
    },
    {
      id: 2,
      name: "Quán cà phê Hồ Gươm",
      name: "Quán cà phê Hồ Gươm",
      type: "Quán cà phê",
      cuisine: "Cà phê truyền thống",
      price_range: "$",
      distance: "0.5km",
      rating: 4.2,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0K1QkC9fxdB8H1O-v50Ue1w5lRj2iyudGTg&s",
      description: "Quán cà phê nhìn thẳng ra Hồ Gươm, lý tưởng cho buổi sáng yên bình.",
      contact: "0987654321",
      latitude: 21.028511,
      longitude: 105.854444
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0K1QkC9fxdB8H1O-v50Ue1w5lRj2iyudGTg&s",
      description: "Quán cà phê nhìn thẳng ra Hồ Gươm, lý tưởng cho buổi sáng yên bình.",
      contact: "0987654321",
      latitude: 21.028511,
      longitude: 105.854444
    },
    {
      id: 33,
      name: "LAIKA",
      type: "Quán cà phê",
      cuisine: "Cà phê truyền thống",
      price_range: "$",
      distance: "0.5km",
      rating: 4.2,
      image: "https://static.vinwonders.com/production/cafe-ho-guom-2.jpg",
      description: "LAIKA là chuỗi cà phê nổi bật với thiết kế trẻ trung, nhiều tầng và view đẹp.",
      contact: "0909999999",
      latitude: 21.030302,
      longitude: 105.853210
    },
    {
      id: 4,
      name: "Bún Chả Hương Liên",
      type: "Nhà hàng",
      cuisine: "Ẩm thực Bắc",
      price_range: "$",
      distance: "1.1km",
      rating: 4.6,
      image: "https://cdn.tgdd.vn/Files/2021/10/05/1387760/bun-cha-ha-noi-mon-ngon-dan-da-lam-me-bao-thuc-khach-202110051408313804.jpg",
      description: "Nổi tiếng sau khi Tổng thống Obama đến ăn. Món bún chả đậm vị truyền thống.",
      contact: "02439723763",
      latitude: 21.018792,
      longitude: 105.845487
    },
    {
      id: 5,
      name: "Giảng Cafe",
      type: "Quán cà phê",
      cuisine: "Cà phê trứng",
      price_range: "$",
      distance: "0.9km",
      rating: 4.8,
      image: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/08/cafe-trung-giang.jpg",
      description: "Nơi khai sinh ra cà phê trứng. Không gian cổ điển và yên tĩnh giữa lòng phố cổ.",
      contact: "02438282698",
      latitude: 21.032342,
      longitude: 105.850672
      image: "https://static.vinwonders.com/production/cafe-ho-guom-2.jpg",
      description: "LAIKA là chuỗi cà phê nổi bật với thiết kế trẻ trung, nhiều tầng và view đẹp.",
      contact: "0909999999",
      latitude: 21.030302,
      longitude: 105.853210
    },
    {
      id: 4,
      name: "Bún Chả Hương Liên",
      type: "Nhà hàng",
      cuisine: "Ẩm thực Bắc",
      price_range: "$",
      distance: "1.1km",
      rating: 4.6,
      image: "https://cdn.tgdd.vn/Files/2021/10/05/1387760/bun-cha-ha-noi-mon-ngon-dan-da-lam-me-bao-thuc-khach-202110051408313804.jpg",
      description: "Nổi tiếng sau khi Tổng thống Obama đến ăn. Món bún chả đậm vị truyền thống.",
      contact: "02439723763",
      latitude: 21.018792,
      longitude: 105.845487
    },
    {
      id: 5,
      name: "Giảng Cafe",
      type: "Quán cà phê",
      cuisine: "Cà phê trứng",
      price_range: "$",
      distance: "0.9km",
      rating: 4.8,
      image: "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/08/cafe-trung-giang.jpg",
      description: "Nơi khai sinh ra cà phê trứng. Không gian cổ điển và yên tĩnh giữa lòng phố cổ.",
      contact: "02438282698",
      latitude: 21.032342,
      longitude: 105.850672
    }
  ];
  
  

  // Sample data for entertainment
  const entertainment = item.entertainment || [
    {
      id: 1,
      name: "Khu vui chơi trẻ em",
      type: "Vui chơi",
      description: "Khu vui chơi với nhiều trò chơi cho trẻ em, không gian trong nhà và ngoài trời an toàn, thân thiện.",
      description: "Khu vui chơi với nhiều trò chơi cho trẻ em, không gian trong nhà và ngoài trời an toàn, thân thiện.",
      distance: "0.1km",
      rating: 4.3,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgs_bOu6Xdwe7HR9775D2Ce4I1s5itZJlXLw&s",
      contact: "0901234567",
      latitude: 21.028234,
      longitude: 105.852321,
      reviews: [
        {
          name: "LanNguyen",
          rating: 5,
          review: "Không gian sạch sẽ, an toàn cho bé. Nhân viên thân thiện.",
          reviewDate: "2025-04-10"
        },
        {
          name: "HoangPham",
          rating: 4,
          review: "Giá hơi cao một chút nhưng chất lượng tốt.",
          reviewDate: "2025-04-05"
        }
      ]
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgs_bOu6Xdwe7HR9775D2Ce4I1s5itZJlXLw&s",
      contact: "0901234567",
      latitude: 21.028234,
      longitude: 105.852321,
      reviews: [
        {
          name: "LanNguyen",
          rating: 5,
          review: "Không gian sạch sẽ, an toàn cho bé. Nhân viên thân thiện.",
          reviewDate: "2025-04-10"
        },
        {
          name: "HoangPham",
          rating: 4,
          review: "Giá hơi cao một chút nhưng chất lượng tốt.",
          reviewDate: "2025-04-05"
        }
      ]
    },
    {
      id: 2,
      name: "Công viên giải trí",
      type: "Giải trí",
      description: "Công viên với nhiều trò chơi cảm giác mạnh như tàu lượn siêu tốc, nhà ma, và đu quay khổng lồ.",
      description: "Công viên với nhiều trò chơi cảm giác mạnh như tàu lượn siêu tốc, nhà ma, và đu quay khổng lồ.",
      distance: "0.3km",
      rating: 4.7,
      image: "https://grandworld.vinhomes.vn/wp-content/uploads/2024/03/dia-diem-vui-choi-ha-noi-12.jpg",
      contact: "0912345678",
      latitude: 21.030899,
      longitude: 105.855000,
      reviews: [
        {
          name: "TuanLe",
          rating: 5,
          review: "Rất vui, đặc biệt là tàu lượn. Hợp cho nhóm bạn.",
          createdAt: "2025-03-28"
        },
        {
          name: "MaiAnh",
          rating: 4.5,
          review: "Trò chơi phong phú, nhân viên hướng dẫn nhiệt tình.",
          createdAt: "2025-04-01"
        }
      ]
    },
    {
      id: 3,
      name: "Rạp chiếu phim CGV Vincom",
      type: "Rạp chiếu phim",
      description: "Cụm rạp chiếu phim hiện đại với hệ thống âm thanh Dolby và phòng chiếu 4DX.",
      distance: "0.6km",
      rating: 4.5,
      image: "https://cinestar.com.vn/pictures/Cinestar/03-2023/phong-chieu-cgv-1.jpg",
      contact: "02437898888",
      latitude: 21.027821,
      longitude: 105.849871,
      reviews: [
        {
          name: "MinhTran",
          rating: 4,
          review: "Phòng chiếu đẹp, nhưng giá hơi cao vào cuối tuần.",
          createdAt: "2025-04-12"
        },
        {
          name: "BaoNguyen",
          rating: 5,
          review: "Mình thích không gian ở đây, âm thanh cực đã!",
          createdAt: "2025-04-08"
        }
      ]
    },
    {
      id: 4,
      name: "Phố đi bộ Hồ Gươm",
      type: "Giải trí",
      description: "Không gian mở với các hoạt động biểu diễn đường phố, trò chơi dân gian và ẩm thực vỉa hè.",
      distance: "0.2km",
      rating: 4.8,
      image: "https://cdn.tuoitre.vn/thumb_w/730/471584752817336320/2023/10/13/pho-di-bo-ho-guom-16971636634822018572363.jpg",
      contact: "0988112233",
      latitude: 21.029987,
      longitude: 105.853001,
      reviews: [
        {
          name: "NgocAnh",
          rating: 5,
          review: "Cuối tuần dạo phố, nghe nhạc sống rất chill!",
          createdAt: "2025-04-07"
        },
        {
          name: "HuyHoang",
          rating: 4.5,
          review: "Vui nhưng hơi đông người.",
          createdAt: "2025-04-06"
        }
      ]
    }
  ];
  
      image: "https://grandworld.vinhomes.vn/wp-content/uploads/2024/03/dia-diem-vui-choi-ha-noi-12.jpg",
      contact: "0912345678",
      latitude: 21.030899,
      longitude: 105.855000,
      reviews: [
        {
          name: "TuanLe",
          rating: 5,
          review: "Rất vui, đặc biệt là tàu lượn. Hợp cho nhóm bạn.",
          createdAt: "2025-03-28"
        },
        {
          name: "MaiAnh",
          rating: 4.5,
          review: "Trò chơi phong phú, nhân viên hướng dẫn nhiệt tình.",
          createdAt: "2025-04-01"
        }
      ]
    },
    {
      id: 3,
      name: "Rạp chiếu phim CGV Vincom",
      type: "Rạp chiếu phim",
      description: "Cụm rạp chiếu phim hiện đại với hệ thống âm thanh Dolby và phòng chiếu 4DX.",
      distance: "0.6km",
      rating: 4.5,
      image: "https://cinestar.com.vn/pictures/Cinestar/03-2023/phong-chieu-cgv-1.jpg",
      contact: "02437898888",
      latitude: 21.027821,
      longitude: 105.849871,
      reviews: [
        {
          name: "MinhTran",
          rating: 4,
          review: "Phòng chiếu đẹp, nhưng giá hơi cao vào cuối tuần.",
          createdAt: "2025-04-12"
        },
        {
          name: "BaoNguyen",
          rating: 5,
          review: "Mình thích không gian ở đây, âm thanh cực đã!",
          createdAt: "2025-04-08"
        }
      ]
    },
    {
      id: 4,
      name: "Phố đi bộ Hồ Gươm",
      type: "Giải trí",
      description: "Không gian mở với các hoạt động biểu diễn đường phố, trò chơi dân gian và ẩm thực vỉa hè.",
      distance: "0.2km",
      rating: 4.8,
      image: "https://cdn.tuoitre.vn/thumb_w/730/471584752817336320/2023/10/13/pho-di-bo-ho-guom-16971636634822018572363.jpg",
      contact: "0988112233",
      latitude: 21.029987,
      longitude: 105.853001,
      reviews: [
        {
          name: "NgocAnh",
          rating: 5,
          review: "Cuối tuần dạo phố, nghe nhạc sống rất chill!",
          createdAt: "2025-04-07"
        },
        {
          name: "HuyHoang",
          rating: 4.5,
          review: "Vui nhưng hơi đông người.",
          createdAt: "2025-04-06"
        }
      ]
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
                      onPress={() => navigation.navigate('FoodDrink', { item })}
                      onPress={() => navigation.navigate('FoodDrink', { item })}
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
    fontSize: TEXT.large-1,
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
  
  
 
});

export default PlaceDetails;