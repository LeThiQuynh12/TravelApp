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

import {
  COLORS,
  SIZES,
  TEXT,
} from '../../constants/theme';
import { fetchDangNhap } from '../../services/api';

const Signin = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setIsLoggedIn } = route.params || {}; // Nhận setIsLoggedIn từ route
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const togglePasswordVisibility = () => {
    setShowPassword(true);
    setTimeout(() => {
      setShowPassword(false);
    }, 800);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validateInputs = () => {
    const newErrors = {
      email: '',
      password: '',
    };
    let isValid = true;

    // Kiểm tra email
    if (!isValidEmail(email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ!';
      isValid = false;
    }

    // Kiểm tra password
    if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự!';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const handleLogin = async () => {
    const isValid = validateInputs();

    if (!isValid) {
      return; // Dừng lại nếu có lỗi
    }

    try {
      const data = await fetchDangNhap(email, password);
      await AsyncStorage.setItem('token', data.token);
      if (setIsLoggedIn) {
        setIsLoggedIn(true);
      }
      alert("Đăng nhập thành công!");
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
            <View style={[styles.inputContainer, errors.email && styles.inputError]}>
              <Icon name="envelope" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: '' }); // Xóa lỗi khi nhập
                }}
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <Text style={styles.labelText}>Password</Text>
            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
              <Icon name="lock" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: '' }); // Xóa lỗi khi nhập
                }}
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
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <TouchableOpacity
              style={styles.forgotPass}
              onPress={() => navigation.navigate("ForgotPass")}
            >
              <Text style={styles.forgotbtn}>Quên mật khẩu?</Text>
            </TouchableOpacity>
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
  inputError: {
    borderColor: COLORS.red,
  },
  errorText: {
    color: COLORS.red,
    fontSize: SIZES.small,
    marginBottom: 10,
    alignSelf: 'flex-start',
   
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
  forgotPass: {
    alignItems: "flex-end",
    marginBottom: 15,
  },
  forgotbtn: {
    color: COLORS.skyBlue,
    fontSize: SIZES.small,
    textDecorationLine: "underline",
  },
  buttonText: {
    color: "#fff",
    fontSize: TEXT.medium,
    fontWeight: "bold",
  },
});

export default Signin;