import React, { useState } from 'react';

import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  FontAwesome,
  Ionicons,
} from '@expo/vector-icons';

import {
  COLORS,
  TEXT,
} from '../../constants/theme';

const ReviewComponent = ({ reviews = [], onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleReviewSubmit = () => {
    if (rating === 0 || comment.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng chọn số sao và nhập nội dung đánh giá.');
      return;
    }

    const newReview = {
      rating,
      review: comment,
      createdAt: new Date().toISOString(),
      user: { name: 'Bạn' }, // có thể thay bằng user thực tế
    };

    onSubmitReview(newReview);
    setRating(0);
    setComment('');
  };

  const renderStarInput = () => (
    <View style={styles.starInput}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={30}
            color="#FFD700"
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <ScrollView >
        
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="star" size={24} color={COLORS.green} />
        <Text style={styles.sectionTitle}>Đánh giá ({reviews.length})</Text>
      </View>

      {reviews.length > 0 ? (
        <>
          <View style={styles.ratingSummary}>
            <Text style={styles.averageRating}>{averageRating}</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.round(averageRating) ? "star" : "star-outline"}
                  size={20}
                  color="#FFD700"
                />
              ))}
            </View>
          </View>

          <FlatList
            data={reviews}
            keyExtractor={(_, i) => i.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.userInfo}>
                    <FontAwesome name="user-circle" size={32} color={COLORS.green} />
                    <Text style={styles.reviewUser}>
                      {item.user?.name || 'Khách hàng ẩn danh'}
                    </Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.reviewRating}>{item.rating}</Text>
                    <Ionicons name="star" size={16} color="#FFD700" />
                  </View>
                </View>
                <Text style={styles.reviewDate}>
                  {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </Text>
                <Text style={styles.reviewComment}>{item.review}</Text>
              </View>
            )}
          />
        </>
      ) : (
        <View style={styles.noReviews}>
          <Ionicons name="sad-outline" size={40} color="#9E9E9E" />
          <Text style={styles.noReviewsText}>Chưa có đánh giá nào</Text>
          <Text style={styles.noReviewsSubtext}>Hãy là người đầu tiên đánh giá địa điểm này</Text>
        </View>
      )}

      {/* Form đánh giá */}
      <View style={styles.reviewForm}>
        <Text style={styles.sectionTitle}>Viết đánh giá của bạn</Text>
        {renderStarInput()}
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Cảm nhận của bạn..."
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
          <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default ReviewComponent

const styles=StyleSheet.create(
    {
        section: {
            marginVertical: 15,
          },
          sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          },
          sectionTitle: {
            fontSize: TEXT.large-2,
            fontWeight: 'bold',
            color: '#333',
            marginLeft: 8,
            marginVertical: 15,
          },
          sectionText: {
            fontSize: 16,
            color: '#555',
            lineHeight: 24,
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
          reviewForm: 
          { 
            marginTop: 16 
        },
          starInput:
           { 
            flexDirection: 'row',
            justifyContent: 'center', 
            marginVertical: 8 },
          textInput: 
          { 
            borderWidth: 1, 
            borderColor: '#ccc', 
            borderRadius: 8, 
            padding: 8, 
            minHeight: 60 },
          submitButton: 
          { 
            backgroundColor: COLORS.green, 
            padding: 10, borderRadius: 8, 
            marginTop: 8 },
          submitButtonText: { 
            color: '#fff', 
            textAlign: 'center', 
            fontWeight: 'bold' 
        }         
    }
)
