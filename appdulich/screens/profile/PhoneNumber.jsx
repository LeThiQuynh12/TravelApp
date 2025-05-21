import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, Image, TextInput, Modal, Alert } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";
import AppBar from "../../components/Reusable/AppBar";
import ReusableBtn from "../../components/Buttons/ReusableBtn";
import {
  getUser,
  updateUser,
} from '../../services/api';

const PhoneNumber = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUser();
         console.log("Dữ liệu user lấy về:", userData);
        setUser(userData);
        setPhone(userData.phone || ""); // Điền số điện thoại hiện có nếu có
      } catch (error) {
        Alert.alert("Lỗi", "Không lấy được thông tin người dùng");
      }
    }
    fetchUser();
  }, []);

  const handlePhoneChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 10) {
      setPhone(cleaned);
    }
  };

  const isValidPhone = (number) => /^[0-9]{10}$/.test(number);

  const handleVerify = () => {
    if (!isValidPhone(phone)) {
      Alert.alert("Lỗi", "Vui lòng nhập đúng số điện thoại gồm 10 chữ số!");
      return;
    }
    setIsModalVisible(true);
  };

  const handleOtpChange = (text) => {
    setOtp(text);
  };

  const handleConfirmOtp = async () => {
    if (otp === "123456") {
      try {
        // Gọi API cập nhật số điện thoại
        await updateUser({ phoneNumber: phone });

        Alert.alert("Thành công", "Đã cập nhật số điện thoại mới!");
        setIsModalVisible(false);
        navigation.navigate("Profile");
      } catch (error) {
        Alert.alert("Lỗi", error.message || "Cập nhật số điện thoại thất bại!");
      }
    } else {
      Alert.alert("Lỗi", "Vui lòng nhập đúng mã OTP!");
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
              uri: user?.data?.profile || "https://tse4.mm.bing.net/th?id=OIP.H3mY7p5e7n6do7W3UhDRXgHaHa&pid=Api&P=0&h=180",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.data?.username }</Text>
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
    backgroundColor: "#00000080",
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
