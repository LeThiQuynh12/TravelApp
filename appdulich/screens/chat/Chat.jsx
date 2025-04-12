import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { COLORS } from '../../constants/theme';

// Dữ liệu giả lập
const mockFlights = [
  { id: 'f1', time: '7:00', price: '1.200.000 đ', duration: '2h', baggage: '20kg' },
  { id: 'f2', time: '9:00', price: '1.500.000 đ', duration: '2h', baggage: '20kg' },
  { id: 'f3', time: '13:00', price: '1.000.000 đ', duration: '2h', baggage: '15kg' },
];

const mockBuses = [
  { id: 'b1', time: '8:00', price: '350.000 đ', type: 'Giường nằm', station: 'Bến xe Miền Tây' },
  { id: 'b2', time: '10:00', price: '400.000 đ', type: 'Ghế ngồi', station: 'Bến xe Miền Tây' },
];

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  // Khởi tạo tin nhắn
  useEffect(() => {
    console.log('Initializing messages');
    setMessages([
      {
        _id: 'welcome-1',
        text: 'Chào bạn! Tôi là trợ lý du lịch thông minh. Bạn muốn đặt vé máy bay, xe khách hay tìm khách sạn? Ví dụ: "Tôi muốn bay từ TP.HCM ra Hà Nội ngày mai"',
        createdAt: new Date(),
        user: { _id: 2, name: 'TravelBot' },
      },
    ]);
  }, []);

  // Cuộn xuống tin nhắn mới
  useEffect(() => {
    console.log('Messages updated:', messages);
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Hàm gửi tin nhắn
  const onSend = useCallback(() => {
    if (!inputText.trim()) return;
    const newMessage = {
      _id: `${Date.now()}-${Math.random()}`,
      text: inputText,
      createdAt: new Date(),
      user: { _id: 1 },
    };
    console.log('Sending message:', newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    handleUserMessage(inputText);
  }, [inputText]);

  // Hàm xử lý tin nhắn
  const handleUserMessage = (text) => {
    setIsTyping(true);
    const lowerText = text.toLowerCase();

    setTimeout(() => {
      let response;

      if (lowerText.includes('bay') || lowerText.includes('máy bay')) {
        response = {
          _id: `${Date.now()}-${Math.random()}`,
          text: `Có ${mockFlights.length} chuyến bay từ TP.HCM ra Hà Nội vào ngày mai:\n` +
            mockFlights.map((flight) => `- ${flight.time}: ${flight.price}, hành lý ${flight.baggage}`).join('\n') +
            '\nBạn muốn chọn chuyến nào?',
          createdAt: new Date(),
          user: { _id: 2, name: 'TravelBot' },
          quickReplies: mockFlights.map((flight) => ({
            title: `${flight.time} - ${flight.price}`,
            value: flight.id,
          })),
        };
      } else if (lowerText.includes('xe') || lowerText.includes('đà lạt')) {
        response = {
          _id: `${Date.now()}-${Math.random()}`,
          text: `Có ${mockBuses.length} chuyến xe từ Sài Gòn đi Đà Lạt:\n` +
            mockBuses.map((bus) => `- ${bus.time}: ${bus.price}, ${bus.type}, ${bus.station}`).join('\n') +
            '\nBạn muốn chọn chuyến nào?',
          createdAt: new Date(),
          user: { _id: 2, name: 'TravelBot' },
          quickReplies: mockBuses.map((bus) => ({
            title: `${bus.time} - ${bus.price}`,
            value: bus.id,
          })),
        };
      } else if (lowerText.includes('khách sạn') || lowerText.includes('phòng')) {
        response = {
          _id: `${Date.now()}-${Math.random()}`,
          text: 'Bạn muốn đặt khách sạn ở đâu? Tôi có thể gợi ý các khách sạn gần sân bay hoặc trung tâm thành phố!',
          createdAt: new Date(),
          user: { _id: 2, name: 'TravelBot' },
        };
      } else {
        response = {
          _id: `${Date.now()}-${Math.random()}`,
          text: 'Xin lỗi, tôi chưa hiểu rõ yêu cầu. Bạn có thể nói rõ hơn không? Ví dụ: "Đặt vé máy bay từ TP.HCM ra Hà Nội" hoặc "Tìm xe đi Đà Lạt".',
          createdAt: new Date(),
          user: { _id: 2, name: 'TravelBot' },
        };
      }

      console.log('Bot response:', response);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);

      if (response.quickReplies) {
        setTimeout(() => {
          const suggestion = {
            _id: `${Date.now()}-${Math.random()}`,
            text: 'Bạn có muốn đặt thêm khách sạn hoặc xe đưa đón không?',
            createdAt: new Date(),
            user: { _id: 2, name: 'TravelBot' },
            quickReplies: [
              { title: 'Đặt khách sạn', value: 'hotel' },
              { title: 'Xe đưa đón', value: 'transport' },
              { title: 'Không, cảm ơn', value: 'none' },
            ],
          };
          setMessages((prev) => [...prev, suggestion]);
        }, 2000);
      }
    }, 1000);
  };

  // Xử lý quick reply
  const onQuickReply = (value) => {
    let response;

    if (value.startsWith('f')) {
      const flight = mockFlights.find((f) => f.id === value);
      response = {
        _id: `${Date.now()}-${Math.random()}`,
        text: `Bạn đã chọn chuyến bay lúc ${flight.time}. Tổng giá: ${flight.price}. Bạn muốn thanh toán ngay qua MoMo hay lưu lịch trình?`,
        createdAt: new Date(),
        user: { _id: 2, name: 'TravelBot' },
        quickReplies: [
          { title: 'Thanh toán qua MoMo', value: 'pay' },
          { title: 'Lưu lịch trình', value: 'save' },
        ],
      };
    } else if (value.startsWith('b')) {
      const bus = mockBuses.find((b) => b.id === value);
      response = {
        _id: `${Date.now()}-${Math.random()}`,
        text: `Bạn đã chọn chuyến xe lúc ${bus.time}. Tổng giá: ${bus.price}. Bạn muốn chọn ghế hay thanh toán ngay?`,
        createdAt: new Date(),
        user: { _id: 2, name: 'TravelBot' },
        quickReplies: [
          { title: 'Chọn ghế', value: 'seat' },
          { title: 'Thanh toán', value: 'pay' },
        ],
      };
    } else if (value === 'hotel') {
      response = {
        _id: `${Date.now()}-${Math.random()}`,
        text: 'Tôi đã tìm thấy một số khách sạn gần điểm đến của bạn. Bạn muốn khách sạn 3 sao hay 5 sao?',
        createdAt: new Date(),
        user: { _id: 2, name: 'TravelBot' },
      };
    } else if (value === 'pay') {
      response = {
        _id: `${Date.now()}-${Math.random()}`,
        text: 'Đang chuyển hướng đến MoMo để thanh toán... Bạn sẽ nhận được mã QR và xác nhận ngay sau khi hoàn tất!',
        createdAt: new Date(),
        user: { _id: 2, name: 'TravelBot' },
      };
      setTimeout(() => {
        const confirmation = {
          _id: `${Date.now()}-${Math.random()}`,
          text: 'Đặt vé thành công! Lịch trình đã được gửi qua chat. Bạn muốn thêm vào lịch điện thoại không?',
          createdAt: new Date(),
          user: { _id: 2, name: 'TravelBot' },
          quickReplies: [
            { title: 'Thêm vào lịch', value: 'calendar' },
            { title: 'Không cần', value: 'none' },
          ],
        };
        setMessages((prev) => [...prev, confirmation]);
      }, 1500);
    }

    setMessages((prev) => [...prev, response]);
  };

  // Render tin nhắn
  const renderMessage = ({ item }) => {
    console.log('Rendering message:', item);
    const isBot = item.user._id === 2;
    return (
      <View
        style={[
          styles.bubble,
          isBot ? styles.botBubble : styles.userBubble,
        ]}
      >
        <Text style={isBot ? styles.botText : styles.userText}>
          {item.text}
        </Text>
        {item.quickReplies && (
          <View style={styles.quickReplies}>
            {item.quickReplies.map((reply) => (
              <TouchableOpacity
                key={reply.value}
                style={styles.quickReplyButton}
                onPress={() => onQuickReply(reply.value)}
              >
                <Text style={styles.quickReplyText}>{reply.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Nút hỗ trợ
  const renderSupportButton = () => {
    console.log('Rendering support button');
    return (
      <TouchableOpacity
        style={styles.supportButton}
        onPress={() => {
          Alert.alert(
            'Liên hệ hỗ trợ',
            'Bạn muốn liên hệ qua Zalo hay gọi tư vấn viên?',
            [
              { text: 'Zalo', onPress: () => Linking.openURL('https://zalo.me/') },
              { text: 'Gọi', onPress: () => Linking.openURL('tel:+84912345678') },
              { text: 'Hủy', style: 'cancel' },
            ]
          );
        }}
      >
        <Ionicons name="help-circle-outline" size={30} color={COLORS.white} />
      </TouchableOpacity>
    );
  };

  console.log('Rendering Chat component');
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.chatWrapper}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.chatContainer}
            showsVerticalScrollIndicator={false}
          />
          {isTyping && (
            <Text style={styles.typingIndicator}>TravelBot đang nhập...</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Nhập yêu cầu của bạn..."
            onSubmitEditing={onSend}
            returnKeyType="send"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.sendButton} onPress={onSend}>
            <Ionicons name="send" size={24} color={COLORS.green} />
          </TouchableOpacity>
        </View>
        {renderSupportButton()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Tránh dùng COLORS.white để kiểm tra import
  },
  keyboardContainer: {
    flex: 1,
  },
  chatWrapper: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Debug: màu nền để thấy FlatList
  },
  chatContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 120, // Tăng để inputContainer hiển thị
    flexGrow: 1,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    marginVertical: 5,
    backgroundColor: 'yellow', // Debug: màu nổi bật
  },
  botBubble: {
    backgroundColor: '#F0F0F0', // Tránh dùng COLORS.lightGrey để kiểm tra
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#34C759', // Tránh dùng COLORS.green
    alignSelf: 'flex-end',
  },
  botText: {
    color: '#333333', // Tránh dùng COLORS.dark
    fontSize: 16,
  },
  userText: {
    color: '#FFFFFF', // Tránh dùng COLORS.white
    fontSize: 16,
  },
  quickReplies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  quickReplyButton: {
    backgroundColor: '#007AFF', // Tránh dùng COLORS.blue
    borderRadius: 15,
    padding: 8,
    margin: 4,
  },
  quickReplyText: {
    color: '#FFFFFF', // Tránh dùng COLORS.white
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'red', // Debug: màu nổi bật
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: 40, // Tăng để không bị che bởi bottom tab
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 20,
    padding: 12,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  sendButton: {
    padding: 10,
  },
  supportButton: {
    position: 'absolute',
    bottom: 120, // Tăng để không bị che bởi bottom tab
    right: 20,
    backgroundColor: '#007AFF', // Tránh dùng COLORS.blue
    borderRadius: 30,
    padding: 10,
    elevation: 5,
    zIndex: 10,
  },
  typingIndicator: {
    color: '#333333',
    padding: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
});