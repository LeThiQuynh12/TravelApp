import React, { useState } from 'react';

import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

import { TEXT } from '../../constants/theme';
import { fetchDangKy } from '../../services/api'; // Import hàm đăng ký

const Registration = () => {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(true);
    setTimeout(() => {
      setShowPassword(false);
    }, 800);
  };

  const handleRegister = async () => {
    // Kiểm tra đầu vào
    if (!user) {
      alert("Vui lòng nhập tên người dùng!");
      return;
    }
    if (!email.includes("@")) {
      alert("Vui lòng nhập email hợp lệ!");
      return;
    }
    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      // Gọi API đăng ký
      const data = await fetchDangKy(user, email, password);
      alert("Đăng ký thành công!");
      console.log("Dữ liệu trả về:", data); // In dữ liệu để kiểm tra
    } catch (error) {
      alert(error.message || "Đăng ký thất bại!");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, width: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          
        >
          <View>
            <Text style={styles.labelText}> Tên người dùng </Text>
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập tên người dùng"
                value={user}
                onChangeText={setUser}
              />
            </View>

            <Text style={styles.labelText}> Email </Text>
            <View style={styles.inputContainer}>
              <Icon name="envelope" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập email"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={styles.labelText}>Password</Text>
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Icon
                  name={showPassword ? "eye" : "eye-slash"}
                  size={20}
                  color="#777"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>TẠO TÀI KHOẢN</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// Styles không thay đổi, giữ nguyên như bạn đã cung cấp
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 20,
    flexDirection: "column",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    width: "80%",
    marginBottom: 20,
    height: 50,
  },
  icon: {
    marginRight: 10,
    color: "#ccc",
  },
  input: {
    flex: 1,
    fontSize: TEXT.medium,
  },
  button: {
    backgroundColor: "#3CA684",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  labelText: {
    fontSize: TEXT.medium,
    fontWeight: "bold",
    paddingBottom: 10,
    color: "#777",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: TEXT.medium - 1,
    fontWeight: "bold",
  },
});

export default Registration;