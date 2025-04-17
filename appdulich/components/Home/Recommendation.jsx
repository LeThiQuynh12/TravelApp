import React, { useState, useEffect } from 'react';

import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import {
  COLORS,
  SIZES,
  TEXT,
} from '../../constants/theme.js';
import { rowWithSpace } from '../Reusable/reusable.style.js';
import ReusableText from '../Reusable/ReusableText.jsx';
import ReusableTile from '../Reusable/ReusableTile.jsx';

const Recommendations = () => {
   const navigation = useNavigation();
     const [recommendation, setrecommendation] = useState([]); 
     const [loading, setLoading] = useState(true); 

    const API_URL_DETAILS = "https://67eff56a2a80b06b88966c78.mockapi.io/ct_dia_diem";
    useEffect(() => {
      const fetchDetails = async () => {
        try {
          const response = await axios.get(API_URL_DETAILS);
          setrecommendation(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy chi tiết địa điểm:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchDetails();
    }, []);
      

  return (
    <View style={styles.container}>
      <View style={[rowWithSpace('space-between'), { paddingBottom: 10 }]} >

      <ReusableText
        text={'Gợi ý'}
        family={"medium"}
        size={TEXT.large}
        color={COLORS.black}
    />
    <TouchableOpacity onPress={()=>navigation.navigate("Recommended")}>
    <Feather
    name="list"
    size={20}
    />
    </TouchableOpacity>
    </View>


    <FlatList
    data={recommendation}
    horizontal
    keyExtractor={(item) => item.id}
    contentContainerStyle={{ columnGap: SIZES.medium }}
    showsHorizontalScrollIndicator={false}
    renderItem={({ item }) => (
      <ReusableTile item={item}
       onPress={() => navigation.navigate("PlaceDetails", { item })}
      />
    )}
    />

    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        paddingTop: 30
    }
})

export default Recommendations