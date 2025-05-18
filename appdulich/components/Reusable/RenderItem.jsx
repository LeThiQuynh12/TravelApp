import React from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  COLORS,
  TEXT,
} from '../../constants/theme';
import NetworkImage from './NetworkImage';

const RenderItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.itemCard} onPress={onPress}>
      <View style={styles.itemImage}> 
        <NetworkImage 
        source={{ uri: item.image }} 
        width={"90%"}
        height={120}
        radius={20}
        resizeMode="cover"
      />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.itemFooter}>
          <Text style={styles.itemDistance}>{item.distance || item.price}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.itemRating}>{item.rating || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles=StyleSheet.create(
    {
        itemCard: {
            width: 200,
            backgroundColor: COLORS.lightWhite,
            borderRadius: 20,
            marginRight: 15,
            overflow: 'hidden',
            borderWidth: 1,
            flexDirection: 'column',
            marginVertical: 8,
            paddingTop: 15,
            justifyContent:'space-between'
          },
          itemImage: {
            alignItems: 'center',
            justifyContent: 'center',
           
          },
          itemInfo: {
            padding: 10,
          },
          itemName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 5,
          },
          itemMeta: {
            marginBottom: 5,
          },
          itemType: {
            fontSize: 12,
            color: COLORS.green,
            fontWeight: '500',
          },
          itemCuisine: {
            fontSize: 12,
            color: '#666',
          },
          itemDescription: {
            fontSize: 12,
            color: '#666',
            marginBottom: 5,
            lineHeight: 16,
          },
          itemFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            
          },
          itemDistance: {
            fontSize: TEXT.medium,
            color: '#2196F3',
          },
          itemPrice: {
            fontSize: 12,
            color: '#F44336',
            fontWeight: 'bold',
          },
          itemRating: {
            fontSize: 12,
            color: COLORS.green,
            fontWeight: 'bold',
            marginLeft: 3,
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
    }
)
export default RenderItem