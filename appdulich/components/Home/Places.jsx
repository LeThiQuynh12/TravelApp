import React, { useState, useEffect } from 'react';

import {
  View,
  VirtualizedList,
} from 'react-native';

import { SIZES } from '../../constants/theme.js';
import HeightSpacer from '../Reusable/HeightSpacer.jsx';
import Country from '../Tiles/Country/Country.jsx';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


const Places = () => {
  const navigation = useNavigation();
  const [place, setPlace] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const API_URL="https://67eff56a2a80b06b88966c78.mockapi.io/dia_diem";

  // Gọi API khi component được render
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(API_URL);
        setPlace(response.data); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu ", error);
      } finally {
        setLoading(false); // Dừng loading
      }
    };

    fetchPlaces();
  }, []);
  return (
    <View> 
      <HeightSpacer height={10} /> 
      {/* chỉ render các phần tử hiển thị trên màn hình thay vì toàn bộ danh sách. */}
      <VirtualizedList               
        data={place} 
        horizontal 
        keyExtractor={(item) => item.place_id} 
        showsHorizontalScrollIndicator={false}
        getItemCount={(data) => data.length} 
        getItem={(data, index) => data[index]} 
        renderItem={({ item, index }) => ( // Render từng item trong danh sách
          <View style={{ marginRight: SIZES.medium }}> 
          
           {/* <Text>{item.country}</Text>         */}
           <Country item={item} />
          </View>
        )}
      />
    </View>
  );
  
  
}

export default Places