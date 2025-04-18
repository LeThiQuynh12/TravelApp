import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Image, TextInput, Modal, Button } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";
import AppBar from "../../components/Reusable/AppBar";
import ReusableBtn from "../../components/Buttons/ReusableBtn";

const PhoneNumber = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [otp, setOtp] = useState("");

  const handlePhoneChange = (text) => {
    // Loại bỏ mọi ký tự không phải số
    const cleaned = text.replace(/[^0-9]/g, '');
  
    // Giới hạn tối đa 10 số
    if (cleaned.length <= 10) {
      setPhone(cleaned);
    }
  };
  
  // Hàm kiểm tra hợp lệ khi bấm "Tiếp tục"
  const isValidPhone = (number) => {
    return /^[0-9]{10}$/.test(number);
  };

  const handleVerify = () => {
    if (!isValidPhone(phone)) {
        alert("Vui lòng nhập đúng số điện thoại gồm 10 chữ số!");
        return;
      }
    
    // Giả lập quá trình gửi OTP và hiển thị modal xác thực
    setIsModalVisible(true);
  };

  const handleOtpChange = (text) => {
    setOtp(text);
  };



//Giả sử set OTP đúng 
    const handleConfirmOtp = () => {
        if (otp === "123456") {  // Giả lập OTP thành công
        alert("Đã cập nhật số điện thoại mới!");
        setIsModalVisible(false);
        navigation.navigate('Profile');  
        } else {
        alert("Vui lòng nhập đúng mã OTP!");
        }
  };
  return (
    <View style={styles.container}>
      <AppBar
        title="Đổi số điện thoại"
        color={COLORS.white}
        top={50}
        left={20}
        right={20}
        onPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: "https://tse4.mm.bing.net/th?id=OIP.H3mY7p5e7n6do7W3UhDRXgHaHa&pid=Api&P=0&h=180",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>LÊ THỊ QUỲNH</Text>
        </View>
        <Text style={styles.label}>Nhập số điện thoại mới</Text>
        <Text style={styles.note}>
          Bạn sẽ nhận được mã xác thực OTP từ tin nhắn qua số điện thoại mới
        </Text>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.inputText}
                placeholder="Nhập số điện thoại"
                keyboardType="numeric"
                value={phone}
                onChangeText={handlePhoneChange}
                maxLength={10}
            />
        </View>
        <View style={styles.button}>
          <ReusableBtn
            onPress={handleVerify}
            btnText={"Xác thực"}
            width={100}
            backgroundColor={COLORS.skyBlue}
            borderColor={COLORS.skyBlue}
            borderWidth={0}
            textColor={COLORS.white}
          />
        </View>
      </ScrollView>

      {/* Modal xác thực OTP */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập mã OTP</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Mã OTP"
              keyboardType="numeric"
              maxLength={6}
              value={otp}
              onChangeText={handleOtpChange}
            />
            <View style={styles.buttonRow}>
              <ReusableBtn
                onPress={() => setIsModalVisible(false)}
                btnText={"Hủy"}
                width={80}
                backgroundColor={COLORS.gray}
                borderColor={COLORS.gray}
                borderWidth={0}
                textColor={COLORS.white}
              />
              <ReusableBtn
                onPress={handleConfirmOtp}
                btnText={"Xác nhận"}
                width={100}
                backgroundColor={COLORS.skyBlue}
                borderColor={COLORS.skyBlue}
                borderWidth={0}
                textColor={COLORS.white}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  content: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 30,
    paddingTop: 70,
    paddingHorizontal: 10,
  },
  profileHeader: {
    alignItems: "center",
    marginVertical: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.skyBlue,
  },
  name: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    paddingTop: 20,
    color: COLORS.black,
    textTransform: "uppercase",
  },
  label: {
    fontSize: SIZES.large,
    fontWeight: "bold",
  },
  note: {
    fontSize: SIZES.medium,
    paddingTop: 10,
    color: COLORS.gray,
  },
  inputContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.lightWhite,
    backgroundColor: COLORS.lightWhite,
  },
  inputText: {
    padding: 15,
    color: COLORS.dark,
  },
  button: {
    paddingVertical: 20,
    alignSelf: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000080", // Màu nền bán trong suốt
  },
  modalContent: {
    width: 300,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
});

export default PhoneNumber;
