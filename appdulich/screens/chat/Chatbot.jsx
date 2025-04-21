import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../constants/theme';
import AskQuestion from './AskQuestion';

const faqData = [
  {
    question: 'Làm thế nào để đặt vé máy bay?',
    answer:
      'Để đặt vé máy bay:\n1. Truy cập ứng dụng LuxGo hoặc website.\n2. Nhập điểm đi, điểm đến, ngày đi/về.\n3. Chọn chuyến bay phù hợp.\n4. Điền thông tin hành khách và thanh toán.\nMẹo: Đặt sớm để có giá tốt!',
  },
  {
    question: 'Cách tìm khách sạn giá rẻ?',
    answer:
      'Để tìm khách sạn giá rẻ:\n1. Sử dụng bộ lọc giá trên LuxGo.\n2. Chọn khu vực gần trung tâm hoặc điểm du lịch.\n3. Xem đánh giá từ khách trước.\n4. Đặt phòng sớm hoặc vào mùa thấp điểm để tiết kiệm.',
  },
  {
    question: 'Lịch tàu hỏa Sài Gòn - Đà Nẵng?',
    answer:
      'Tàu hỏa Sài Gòn - Đà Nẵng có các khung giờ chính:\n- SE1: 22:20 (đêm).\n- SE3: 20:00.\n- SE7: 06:00 (sáng).\nThời gian di chuyển khoảng 16-18 tiếng. Kiểm tra trên LuxGo để đặt vé!',
  },
  {
    question: 'Cách đặt xe khách Hà Nội - Sapa?',
    answer:
      'Để đặt xe khách Hà Nội - Sapa:\n1. Vào mục "Xe khách" trên LuxGo.\n2. Chọn ngày giờ khởi hành.\n3. Xem các nhà xe (Limousine, giường nằm).\n4. Điền thông tin và thanh toán.\nGiá vé từ 300.000 - 600.000 VND.',
  },
  {
    question: 'Hủy đặt phòng khách sạn được không?',
    answer:
      'Tùy chính sách khách sạn:\n- Miễn phí hủy nếu trong 24-48h trước check-in (xem chi tiết khi đặt).\n- Liên hệ LuxGo qua hotline +84 912 345 678 để hỗ trợ.\nKiểm tra email xác nhận để biết điều kiện hủy.',
  },
  {
    question: 'Vé máy bay có hoàn tiền không?',
    answer:
      'Vé máy bay có thể hoàn tiền tùy hãng và loại vé:\n- Vé khuyến mãi: Thường không hoàn.\n- Vé linh hoạt: Hoàn với phí từ 10-20%.\nLiên hệ LuxGo hoặc hãng bay qua email support@luxgo.com để kiểm tra.',
  },
  {
    question: 'Có tour du lịch nào ở Đà Lạt không?',
    answer:
      'LuxGo cung cấp nhiều tour Đà Lạt:\n- Tour 3 ngày 2 đêm: Tham quan Datanla, Langbiang, giá từ 2.500.000 VND.\n- Tour 1 ngày: Cồng Chiêng, hồ Tuyền Lâm, giá từ 800.000 VND.\nXem chi tiết trên ứng dụng!',
  },
];

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      text: 'Chào bạn! Tôi là chatbot du lịch LuxGo. Hỏi tôi về vé máy bay, khách sạn, xe khách, tàu hỏa, hoặc bất kỳ vấn đề du lịch nào nhé!',
      sender: 'bot',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [question, setQuestion] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const scrollViewRef = useRef(null);
  const messageAnims = useRef([new Animated.Value(0)]).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });

      messages.forEach((_, index) => {
        Animated.timing(messageAnims[index], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    messageAnims.push(new Animated.Value(0));

    const query = inputText.toLowerCase();
    const matchedFaq = faqData.find(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        query.includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' '))
    );

    const botMessage = matchedFaq
      ? {
          id: (Date.now() + 1).toString(),
          text: matchedFaq.answer,
          sender: 'bot',
        }
      : {
          id: (Date.now() + 1).toString(),
          text: 'Xin lỗi, tôi chưa có câu trả lời cho câu hỏi này. Bạn muốn gửi câu hỏi để được hỗ trợ không?',
          sender: 'bot',
          showAskQuestion: true,
        };

    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
      messageAnims.push(new Animated.Value(0));
    }, 500);

    setInputText('');
  };

  const handleSubmit = () => {
    if (question.trim()) {
      setIsSubmitted(true);
      setQuestion('');
      setTimeout(() => {
        setIsSubmitted(false);
        setIsModalVisible(false);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: 'Cảm ơn bạn đã gửi câu hỏi! Chúng tôi sẽ phản hồi qua email hoặc hotline sớm nhất.',
            sender: 'bot',
          },
        ]);
        messageAnims.push(new Animated.Value(0));
      }, 3000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chatbot Du Lịch LuxGo</Text>
      </View>

      <KeyboardAvoidingView
         style={{ flex: 1 }}
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
         keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message, index) => (
            <Animated.View
              key={message.id}
              style={[
                styles.messageContainer,
                message.sender === 'user' ? styles.userMessage : styles.botMessage,
                {
                  opacity: messageAnims[index],
                  transform: [
                    {
                      translateY: messageAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
              {message.showAskQuestion && (
                <TouchableOpacity
                  style={styles.askQuestionButton}
                  onPress={() => setIsModalVisible(true)}
                >
                  <Text style={styles.askQuestionText}>Gửi câu hỏi</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          ))}
        </ScrollView>
      

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập câu hỏi của bạn..."
          placeholderTextColor={COLORS.grey}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
      <AskQuestion
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        question={question}
        setQuestion={setQuestion}
        onSubmit={handleSubmit}
        isSubmitted={isSubmitted}
      />
    </SafeAreaView>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
  },
  header: {
    padding: 15,
    backgroundColor: COLORS.blue,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.blue,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
  },
  messageText: {
    fontSize: 16,
    color: COLORS.black,
    lineHeight: 22,
  },
  askQuestionButton: {
    marginTop: 10,
    backgroundColor: COLORS.blue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
  askQuestionText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
    color: COLORS.black,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 20,
    padding: 10,
  },
});
