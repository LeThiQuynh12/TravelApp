import React, {
  useEffect,
  useState,
} from 'react';

import {
  Animated,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';

import AppBar from '../../components/Reusable/AppBar';
import HeightSpacer from '../../components/Reusable/HeightSpacer';
import { COLORS } from '../../constants/theme';

// Dữ liệu câu hỏi và câu trả lời
const faqData = [
  {
    question: 'Có thể đăng nhập bằng cách nào ?',
    answer: '• Đăng ký tài khoản với tên tài khoản, email, mật khẩu\n• Đăng nhập',
  },
  {
    question: 'Tại sao truy cập tạp địa điểm lại hoi quyền ?',
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
    question: 'Cách đặt xe khách ?',
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
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  // Xử lý tìm kiếm
  useEffect(() => {
    const filtered = faqData.filter((item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFaq(filtered);
  }, [searchQuery]);

  // Xử lý mở/đóng câu trả lời với loading
  const toggleExpand = (index) => {
    if (expanded[index]) {
      setExpanded((prev) => ({ ...prev, [index]: false }));
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
    }, 500);
  };

  // Xử lý chia sẻ câu hỏi
  const handleShare = async (question, answer) => {
    try {
      await Share.share({
        message: `${question}\n\n${answer}`,
        title: 'Chia sẻ câu hỏi từ LuxGo',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  // Điều hướng đến màn hình Support
  const handleSupportPress = () => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('Support');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
    

      <AppBar
          title="Câu hỏi thường gặp"
          color={COLORS.white}
          top={50}
          left={10}
          right={10}
          onPress={() => navigation.goBack()}
        />
    

      <HeightSpacer height={50} />



      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredFaq.length === 0 ? (
          <Text style={styles.noResultsText}>Không tìm thấy câu hỏi nào.</Text>
        ) : (
          filteredFaq.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.questionContainer}
                onPress={() => toggleExpand(index)}
              >
                <Text style={styles.questionText}>{item.question}</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => handleShare(item.question, item.answer)}
                    style={styles.shareButton}
                  >
                    <Ionicons name="share-outline" size={20} color={COLORS.blue} />
                  </TouchableOpacity>
                  <Ionicons
                    name={expanded[index] ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={COLORS.black}
                  />
                </View>
              </TouchableOpacity>
              {loadingStates[index] && (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Đang tải câu trả lời...</Text>
                </View>
              )}
              {expanded[index] && !loadingStates[index] && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                  <Text style={styles.timeText}>
                    Trả lời lúc: {answerTimes[index] || 'Vừa xong'}
                  </Text>
                </View>
              )}
            </View>
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
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 40,
    backgroundColor: COLORS.blue, // Thay thế LinearGradient bằng màu nền đơn giản
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    paddingVertical: 10,
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  faqItem: {
    marginBottom: 15,
    borderRadius: 10,
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
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    marginRight: 10,
  },
  loadingContainer: {
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.grey,
    fontStyle: 'italic',
  },
  answerContainer: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
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
  noResultsText: {
    fontSize: 16,
    color: COLORS.grey,
    textAlign: 'center',
    marginTop: 20,
  },
  
});