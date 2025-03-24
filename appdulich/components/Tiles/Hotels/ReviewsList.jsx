import React from 'react';

import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';

import ReviewTile from '../../../screens/review/ReviewTile';

const ReviewsList = ({ reviews }) => {
  
    return (
      <FlatList
        data={reviews}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <ReviewTile review={item} />
          </View>
        )}
      />
    )
  }

export default ReviewsList

const styles = StyleSheet.create({})