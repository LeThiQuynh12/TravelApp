import React,{ useState, useEffect } from 'react';
import { View, Text, Image, FlatList, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import AppBar from '../../components/Reusable/AppBar';
import axios from 'axios';
import Places from '../../components/Home/Places.jsx';
import NetworkImage from '../../components/Reusable/NetworkImage.jsx';
import Country from '../../components/Tiles/Country/Country.jsx';

const CountryDetails = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params ;
  const [allProvinces, setAllProvinces] = useState([]);
  const [suggested, setsuggested] = useState([]);
  const [allHighlights, setAllHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL="https://67eff56a2a80b06b88966c78.mockapi.io/dia_diem";
  const API_URL_DETAILS="https://67eff56a2a80b06b88966c78.mockapi.io/ct_dia_diem"

    // Gọi API khi component được render
    useEffect(() => {
      const fetchProvinces = async () => {
        try {
          const response = await axios.get(API_URL);
          setAllProvinces(response.data); // Cập nhật tất cả các tỉnh
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu các tỉnh:', error);
        } finally {
          setLoading(false); // Dừng loading sau khi nhận được dữ liệu
        }
      };
  
      fetchProvinces();
    }, []);
    
    // Gọi API lấy chi tiết địa điểm nổi bật dựa trên highlightIDs
    useEffect(() => {
      const fetchHighlightsDetails = async () => {
        try {
          const response = await axios.get(API_URL_DETAILS);
          setAllHighlights(response.data); // Lưu tất cả dữ liệu địa điểm vào state
        } catch (error) {
          console.error("Lỗi khi lấy chi tiết địa điểm:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchHighlightsDetails();
    }, []);

    if (loading) return <Text>Đang tải dữ liệu...</Text>;

  return (
    <View style={styles.container}>
      <View style={{height: 80}}>
      <AppBar
      top={40}
      left={20}
      right={20}
      title={""}
      color="white"
      icon={"search1"}
      color1="white"
      onPress={()=>navigation.goBack()}
      onPress1={()=>navigation.navigate("PlaceDetails")}
      />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container_1}>
        <NetworkImage source={{ uri: item.image }} height={250} width={"100%"} />

        {/* Title and Description */}
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.description}>
            {item.description }
          </Text>
        </View>

        {/* địa điểm nổi bật  */}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Địa điểm nổi bật</Text>
          <TouchableOpacity>
            <Icon name="ellipsis-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <FlatList
          
          horizontal
          data={item.highlights}
          keyExtractor={(highlightId) => highlightId.toString()} // Dùng `id` làm key
          renderItem={({ item: highlightId }) => {
            // Tìm tỉnh có id tương ứng trong allProvinces
            const highlight = allHighlights.find(p => p.id === highlightId);

            if (!highlight) {
              return null;  // Nếu không tìm thấy tỉnh tương ứng, không render gì
            }
            return (
              <TouchableOpacity
               style={styles.itemContainer}
                onPress={()=>{
                  navigation.navigate("PlaceDetails",{item:highlight});
                }}>
                <Image source={{ uri: highlight.image }} style={styles.itemImage} />
                <Text style={styles.itemTitle}>{highlight.name}</Text>
                {/* <Text style={styles.itemPrice}>Giá vé: {highlight.ticket_prices} đ</Text> */}
              </TouchableOpacity>
            );
          }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />

        {/* Suggestions */}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gợi ý dành cho bạn</Text>
          <TouchableOpacity>
            <Icon name="ellipsis-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={item.suggestions}
          keyExtractor={(highlightId) => highlightId.toString()} // Dùng `id` làm key
          renderItem={({ item: highlightId }) => {
            // Tìm tỉnh có id tương ứng trong allProvinces
            const highlight = allHighlights.find(p => p.id === highlightId);

            if (!highlight) {
              return null;  // Nếu không tìm thấy tỉnh tương ứng, không render gì
            }
            return (
              <TouchableOpacity
                style={styles.suggestedItem}
                onPress={()=>{
                  navigation.navigate("PlaceDetails",{item:highlight});
                }}>
                <Image
                  source={{ uri: highlight.image }}
                  style={styles.suggestedImage}
                />
                <Text style={styles.suggestedTitle}>{highlight.name}</Text>
                <Text style={styles.suggestedLocation}>{highlight.address}</Text>
                <Text style={styles.suggestedRating}>
                  ⭐ {highlight.rating }
                </Text>
              </TouchableOpacity>
            );
          }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />

        {/* Nearby Provinces */}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Các tỉnh lân cận</Text>
        </View>
        <FlatList
          horizontal
          data={item.nearbyProvinces}  // Mảng chứa các id tỉnh lân cận như [2, 3, 4]
          keyExtractor={(provinceId) => provinceId.toString()}  // Sử dụng id của tỉnh làm key
          renderItem={({ item: provinceId }) => {
            // Tìm tỉnh có id tương ứng trong allProvinces
            const province = allProvinces.find(p => p.id === provinceId);

            if (!province) {
              return null;  // Nếu không tìm thấy tỉnh tương ứng, không render gì
            }

            return (
              <TouchableOpacity
              style={styles.nearbyContainer}
              onPress={() => {
                // Khi nhấn vào tỉnh, điều hướng đến CountryDetails và truyền ID của tỉnh lân cận
                navigation.navigate('CountryDetails', { item: province });
              }}
            >
              <Image source={{ uri: province.image }} style={styles.nearbyImage} />
              <Text style={styles.nearbyTitle}>{province.name }</Text>
            </TouchableOpacity>
            );
          }}
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
    paddingBottom: 20
  },
  container_1:{
    padding:10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  
  textContainer: {
    //paddingHorizontal: 15,
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
    //paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  flatListContent: {
    //paddingHorizontal: 15,
  },
  itemContainer: {
    width: 120,
    height:150,
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
    padding:5,
    borderRadius:5
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 5,
    marginTop: 5,
    marginBottom:15
    
  },
  itemPrice: {
    fontSize: 14,
    color: 'red',
    paddingHorizontal: 5,
    
    position:'absolute',
    bottom:5,
    
  },
  suggestedItem: {
    width: 200,
    backgroundColor: '#E7F3FC',
    borderRadius: 10,
    //padding: 10,
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
    padding:5
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
    width:100,
    
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