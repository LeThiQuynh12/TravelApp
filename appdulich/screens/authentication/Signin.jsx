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

import AsyncStorage from '@react-native-async-storage/async-storage';

import { TEXT } from '../../constants/theme';
import { fetchDangNhap } from '../../services/api';

const Signin = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setIsLoggedIn } = route.params || {}; // Nhận setIsLoggedIn từ route

  const togglePasswordVisibility = () => {
    setShowPassword(true);
    setTimeout(() => {
      setShowPassword(false);
    }, 800);
  };

  const handleLogin = async () => {
    if (!email.includes("@")) {
      alert("Vui lòng nhập email hợp lệ!");
      return;
    }
    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      const data = await fetchDangNhap(email, password);
      // Lưu token vào AsyncStorage
      await AsyncStorage.setItem('token', data.token);
      // Cập nhật trạng thái đăng nhập
      if (setIsLoggedIn) {
        setIsLoggedIn(true);
      }
      alert("Đăng nhập thành công!");
      // Điều hướng đến BottomTabNavigation
      navigation.replace('Bottom');
    } catch (error) {
      alert(error.message || "Đăng nhập thất bại!");
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
            <Text style={styles.labelText}>Email</Text>
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

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

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
    marginTop: 28,
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
    fontSize: TEXT.medium,
    fontWeight: "bold",
  },
});

export default Signin;