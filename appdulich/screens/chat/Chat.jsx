import React, { useEffect, useState, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';

import AskQuestion from './AskQuestion';

// Dữ liệu câu hỏi và câu trả lời
const faqData = [
  {
    question: 'Có thể đăng nhập bằng cách nào?',
    answer: 'Đăng ký tài khoản với tên tài khoản, email, mật khẩu\nĐăng nhập',
  },
  {
    question: 'Tại sao truy cập tạp địa điểm lại hỏi quyền?',
    answer: 'Ứng dụng cần quyền truy cập vị trí để gợi ý các địa điểm gần bạn hoặc hỗ trợ tìm đường.',
  },
  {
    question: 'Cách đặt vé máy bay?',
    answer: 'Bạn có thể đặt vé máy bay bằng cách:\n1. Chọn điểm đi và điểm đến.\n2. Chọn ngày đi và ngày về (nếu có).\n3. Xem danh sách chuyến bay và chọn chuyến phù hợp.\n4. Nhập thông tin hành khách và thanh toán.',
  },
  {
    question: 'Cách đặt phòng khách sạn?',
    answer: 'Để đặt phòng khách sạn:\n1. Chọn điểm đến và ngày nhận/trả phòng.\n2. Xem danh sách khách sạn và chọn phòng.\n3. Nhập thông tin và thanh toán.',
  },
  {
    question: 'Cách đặt xe khách?',
    answer: 'Để đặt xe khách:\n1. Chọn điểm đi và điểm đến.\n2. Chọn ngày giờ khởi hành.\n3. Xem danh sách xe và chọn chuyến.\n4. Nhập thông tin hành khách và thanh toán.',
  },
];

const Chat = () => {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaq, setFilteredFaq] = useState(faqData);
  const [loadingStates, setLoadingStates] = useState({});
  const [answerTimes, setAnswerTimes] = useState({});
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [question, setQuestion] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const animatedValues = useRef(faqData.map(() => new Animated.Value(0))).current;
  const searchScale = useRef(new Animated.Value(1)).current;
  const resultAnims = useRef(faqData.map(() => new Animated.Value(0))).current;

  // Xử lý tìm kiếm với debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtered = faqData.filter((item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFaq(filtered);
      filtered.forEach((_, index) => {
        Animated.timing(resultAnims[index], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Hiệu ứng phóng to khi focus thanh tìm kiếm
  useEffect(() => {
    Animated.spring(searchScale, {
      toValue: isSearchFocused ? 1.05 : 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isSearchFocused]);

  // Xử lý mở/đóng câu trả lời
  const toggleExpand = (index) => {
    if (expanded[index]) {
      Animated.timing(animatedValues[index], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setExpanded((prev) => ({ ...prev, [index]: false }));
      });
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [index]: false }));
      setExpanded((prev) => ({ ...prev, [index]: true }));
      setAnswerTimes((prev) => ({
        ...prev,
        [index]: new Date().toLocaleTimeString(),
      }));
      Animated.spring(animatedValues[index], {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }).start();
    }, 500);
  };

  // Xử lý xóa nội dung tìm kiếm
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredFaq(faqData);
  };

  // Xử lý gửi câu hỏi
  const handleSubmit = () => {
    if (question.trim()) {
      setIsSubmitted(true);
      setQuestion('');
      setTimeout(() => {
        setIsSubmitted(false);
        setIsModalVisible(false); // Đóng modal sau khi gửi
      }, 3000);
    }
  };

  // Đánh dấu từ khóa khớp
  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <Text key={index} style={styles.highlightText}>{part}</Text>
      ) : (
        <Text key={index}>{part}</Text>
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header với thanh tìm kiếm */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Câu hỏi thường gặp</Text>
        <Animated.View style={[styles.searchContainer, { transform: [{ scale: searchScale }] }]}>
          <Ionicons
            name="search"
            size={24}
            color={isSearchFocused ? COLORS.blue : COLORS.grey}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm câu hỏi..."
            placeholderTextColor={COLORS.grey}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={COLORS.grey} />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>

      {/* Modal đặt câu hỏi */}
      <AskQuestion
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        question={question}
        setQuestion={setQuestion}
        onSubmit={handleSubmit}
        isSubmitted={isSubmitted}
      />

      {/* Danh sách FAQ */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredFaq.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>Không tìm thấy câu hỏi nào.</Text>
            <Text style={styles.suggestionText}>Hãy thử từ khóa khác hoặc đặt câu hỏi mới.</Text>
            <TouchableOpacity
              style={styles.supportButton}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={styles.supportButtonText}>Đặt câu hỏi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.popularQuestionsButton}
              onPress={() => setFilteredFaq(faqData)}
            >
              <Text style={styles.popularQuestionsText}>Xem câu hỏi phổ biến</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredFaq.map((item, index) => (
            <Animated.View
              key={index}
              style={[
                styles.faqItem,
                {
                  opacity: resultAnims[index],
                  transform: [
                    {
                      translateY: resultAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                }
                ]}
            >
              <TouchableOpacity
                style={styles.questionContainer}
                onPress={() => toggleExpand(index)}
              >
                <Text style={styles.questionText}>
                  {highlightText(item.question, searchQuery)}
                </Text>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={expanded[index] ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={COLORS.black}
                  />
                </View>
              </TouchableOpacity>
              {loadingStates[index] && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={COLORS.blue} />
                  <Text style={styles.loadingText}>Đang tải câu trả lời...</Text>
                </View>
              )}
              {expanded[index] && !loadingStates[index] && (
                <Animated.View
                  style={
                    [styles.answerContainer,
                    {
                      opacity: animatedValues[index],
                      height: animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 'auto'],
                      }),
                    },]
                  }
                >
                  <Text style={styles.answerText}>{item.answer}</Text>
                  <Text style={styles.timeText}>
                    Trả lời lúc: {answerTimes[index] || 'Vừa xong'}
                  </Text>
                </Animated.View>
              )}
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    backgroundColor: COLORS.blue,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    paddingVertical: 10,
  },
  clearButton: {
    padding: 5,
  },
  scrollContainer: {
    paddingVertical: 15,
    paddingHorizontal:5,
    paddingBottom: 30,
  },
  faqItem: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    flex: 1,
  },
  highlightText: {
    backgroundColor: '#E6F0FA',
    color: COLORS.blue,
    fontWeight: '700',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginTop: 5,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.grey,
    fontStyle: 'italic',
    marginLeft: 10,
  },
  answerContainer: {
    backgroundColor: '#eee',
    padding: 15,
    margin: 10,
    borderRadius: 12,
    marginTop: 5,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  answerText: {
    fontSize: 14,
    color: COLORS.dark,
    lineHeight: 22,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.grey,
    marginTop: 10,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  noResultsContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.grey,
    textAlign: 'center',
    marginBottom: 10,
  },
  suggestionText: {
    fontSize: 14,
    color: COLORS.grey,
    textAlign: 'center',
    marginBottom: 20,
  },
  supportButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 15,
  },
  supportButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
  },
  popularQuestionsButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.blue,
  },
  popularQuestionsText: {
    fontSize: 16,
    color: COLORS.blue,
    fontWeight: '600',
  },
});