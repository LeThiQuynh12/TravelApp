import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../constants/theme';

const AskQuestion = ({
  visible,
  onClose,
  question,
  setQuestion,
  onSubmit,
  isSubmitted,
}) => {
  const modalAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Hiệu ứng mở/đóng modal
  useEffect(() => {
    Animated.timing(modalAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // Hiệu ứng nhấn nút
  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
  };

  // Xử lý liên hệ
  const handleCall = () => {
    Linking.openURL('tel:+84912345678'); // Thay bằng số hotline thực tế
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@luxgo.com'); // Thay bằng email thực tế
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View
        style={[
          styles.modalContainer,
          {
            opacity: modalAnim,
            transform: [
              {
                translateY: modalAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.grey} />
          </TouchableOpacity>

          <Ionicons name="chatbox-outline" size={60} color={COLORS.blue} style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Gửi câu hỏi của bạn</Text>
          <Text style={styles.cardText}>Nhập câu hỏi để nhận hỗ trợ nhanh chóng!</Text>

          <TextInput
            style={styles.input}
            placeholder="Nhập câu hỏi của bạn..."
            placeholderTextColor={"#aaa"}
            value={question}
            onChangeText={setQuestion}
            multiline
            numberOfLines={4}
          />

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.submitButton, !question.trim() && styles.buttonDisabled]}
              onPress={onSubmit}
              disabled={!question.trim()}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.submitButtonText}>Gửi câu hỏi</Text>
            </TouchableOpacity>
          </Animated.View>

          {isSubmitted && (
            <View style={styles.successMessage}>
              <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.blue} />
              <Text style={styles.successText}>
                Câu hỏi đã được gửi! Chúng tôi sẽ phản hồi sớm.
              </Text>
            </View>
          )}

          <Text style={styles.cardSubTitle}>Liên hệ nhanh</Text>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCall}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="call-outline" size={24} color={COLORS.blue} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Hotline: +84 912 345 678</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleEmail}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="mail-outline" size={24} color={COLORS.blue} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Email: support@luxgo.com</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default AskQuestion;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFF5E6',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  cardIcon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.blue,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardSubTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.blue,
    marginTop: 16,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    color: COLORS.dark,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    padding: 12,
    fontSize: 15,
    color: COLORS.black,
    marginBottom: 16,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButton: {
    backgroundColor: COLORS.blue, // Đổi màu nền thành xanh để nổi bật
    borderRadius: 16, 
    paddingVertical: 15, 
    paddingHorizontal: 32, 
    marginBottom: 16,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  button: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: COLORS.lightGrey,
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  buttonIcon: {
    marginRight: 12,
  },
  submitButtonText: {
    fontSize: 18, // Tăng kích thước chữ
    fontWeight: '600',
    color: COLORS.white, // Chữ trắng để tương phản với nền xanh
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.black,
    textAlign: 'center',
    flex: 1,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    color: COLORS.blue,
    marginLeft: 8,
    flex: 1,
  },
});