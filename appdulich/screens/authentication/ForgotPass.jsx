import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, TextInput, Modal, TouchableOpacity, Platform } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";
import AppBar from "../../components/Reusable/AppBar";
import ReusableBtn from "../../components/Buttons/ReusableBtn";
import { checkUserExists, resetPassword } from "../../services/api";

const ForgotPass = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [activeTab, setActiveTab] = useState("email");

  const handleInputChange = (text) => {
    setEmailOrPhone(text);
  };

  const isValidInput = () => {
    if (activeTab === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(emailOrPhone);
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      return phoneRegex.test(emailOrPhone);
    }
  };

  const handleVerify = async () => {
    if (!isValidInput()) {
      alert(
        activeTab === "email"
          ? "Vui lòng nhập đúng định dạng email!"
          : "Vui lòng nhập đúng số điện thoại (10 số)!"
      );
      return;
    }

    try {
      const response = await checkUserExists(emailOrPhone, activeTab);
      alert(response.message);
      setIsModalVisible(true); // Mở modal nhập OTP
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const handleConfirmOtp = async () => {
    if (otp === "123456") { // OTP tĩnh
      try {
        const response = await resetPassword(emailOrPhone, activeTab);
        alert(response.message);
        setIsModalVisible(false);
        navigation.navigate('ChangePass');
      } catch (error) {
        alert(error.response?.data?.message || "Có lỗi xảy ra!");
      }
    } else {
      alert("Mã OTP không chính xác!");
    }
  };

  const handleResendOtp = () => {
    alert("OTP đã được gửi lại cho bạn!"); // Hiển thị OTP tĩnh
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="Quên mật khẩu"
        color={COLORS.white}
        top={50}
        left={20}
        right={20}
        onPress={() => navigation.goBack()}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Khôi phục mật khẩu</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập email hoặc số điện thoại đã đăng ký để nhận mã xác thực
        </Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "email" && styles.activeTab]}
            onPress={() => setActiveTab("email")}
          >
            <Text style={[styles.tabText, activeTab === "email" && styles.activeTabText]}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "phone" && styles.activeTab]}
            onPress={() => setActiveTab("phone")}
          >
            <Text style={[styles.tabText, activeTab === "phone" && styles.activeTabText]}>Số điện thoại</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputText}
            placeholder={activeTab === "email" ? "Nhập email của bạn" : "Nhập số điện thoại"}
            keyboardType={activeTab === "email" ? "email-address" : "phone-pad"}
            value={emailOrPhone}
            onChangeText={handleInputChange}
            maxLength={activeTab === "phone" ? 10 : undefined}
          />
        </View>

        <ReusableBtn
          onPress={handleVerify}
          btnText="Gửi mã xác thực"
          width="100%"
          backgroundColor={COLORS.green}
          borderColor={COLORS.lightWhite}
          textColor={COLORS.lightWhite}
          style={styles.button}
        />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác thực OTP</Text>
            <Text style={styles.modalSubtitle}>
              Mã xác thực đã được gửi đến {activeTab === "email" ? "email" : "số điện thoại"} của bạn
            </Text>
            
            <TextInput
              style={styles.otpInput}
              placeholder="Nhập 6 số OTP"
              keyboardType="numeric"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />
            
            <View style={styles.buttonRow}>
              <ReusableBtn
                onPress={() => setIsModalVisible(false)}
                btnText="Hủy"
                width={120}
                backgroundColor={COLORS.green}
                borderColor={COLORS.white}
                textColor={COLORS.white}
              />
              <ReusableBtn
                onPress={handleConfirmOtp}
                btnText="Xác nhận"
                width={120}
                backgroundColor={COLORS.green}
                borderColor={COLORS.lightWhite}
                textColor={COLORS.white}
              />
            </View>
            
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={styles.resendText}>Gửi lại mã OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  content: {
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginBottom: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 5,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.green,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tabText: {
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.gray,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputText: {
    height: 50,
    color: COLORS.dark,
    fontSize: SIZES.medium,
  },
  button: {
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 25,
    textAlign: 'center',
  },
  otpInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginBottom: 25,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  resendText: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    textDecorationLine: 'underline',
  },
});

export default ForgotPass;