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
import { fetchDangNhap } from '../../services/api';
const Registration = ({navigation}) => {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    user: '',
    email: '',
    password: ''
  });

  const togglePasswordVisibility = () => {
    setShowPassword(true);
    setTimeout(() => {
      setShowPassword(false);
    }, 800);
  };

  // Validate functions
  const validateUser = (username) => {
    if (!username.trim()) return "Vui lòng nhập tên người dùng";
    if (username.length < 3) return "Tên người dùng quá ngắn (tối thiểu 3 ký tự)";
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Vui lòng nhập email";
    if (!emailRegex.test(email)) return "Email không hợp lệ";
    return "";
  };

  const validatePassword = (password) => {
    if (!password.trim()) return "Vui lòng nhập mật khẩu";
    if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    if (!/[A-Z]/.test(password)) return "Cần ít nhất 1 chữ hoa";
    if (!/[a-z]/.test(password)) return "Cần ít nhất 1 chữ thường";
    if (!/[0-9]/.test(password)) return "Cần ít nhất 1 số";
    return "";
  };

  const validateAllInputs = () => {
    const newErrors = {
      user: validateUser(user),
      email: validateEmail(email),
      password: validatePassword(password)
    };
    
    setErrors(newErrors);
    
    return !newErrors.user && !newErrors.email && !newErrors.password;
  };

  const handleInputChange = (field, value) => {
    // Clear error when user types
    if (errors[field]) {
      setErrors({...errors, [field]: ''});
    }
    
    switch (field) {
      case 'user': setUser(value); break;
      case 'email': setEmail(value); break;
      case 'password': setPassword(value); break;
    }
  };

  const handleRegister = async () => {
    if (!validateAllInputs()) return;
  
    try {
      // Gọi API đăng ký
      console.log("Đang gửi yêu cầu đăng ký:", { username: user, email, password });
      const data = await fetchDangKy(user, email, password);
      if (!data.status) {
        throw new Error(data.message || "Đăng ký thất bại!");
      }
      console.log("Dữ liệu trả về:", data);
      alert("Đăng ký thành công!");
  
      // Thêm độ trễ 1 giây để đảm bảo database lưu dữ liệu
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Gọi API đăng nhập
      console.log("Đang đăng nhập với:", { email, password });
      const loginData = await fetchDangNhap(email, password);
      if (!loginData.status) {
        throw new Error(loginData.message || "Đăng nhập thất bại!");
      }
      console.log("Đăng nhập thành công:", loginData);
  
      // Điều hướng đến màn hình Bottom
      navigation.replace('Bottom');
    } catch (error) {
      console.error("Lỗi:", error);
      alert(error.message || "Đăng ký hoặc đăng nhập thất bại!");
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
            <Text style={styles.labelText}>Tên người dùng</Text>
            <View style={[
              styles.inputContainer, 
              errors.user && styles.inputError
            ]}>
              <Icon name="user" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập tên người dùng"
                value={user}
                onChangeText={(text) => handleInputChange('user', text)}
              />
            </View>
            {errors.user ? <Text style={styles.errorText}>{errors.user}</Text> : null}

            <Text style={styles.labelText}>Email</Text>
            <View style={[
              styles.inputContainer, 
              errors.email && styles.inputError
            ]}>
              <Icon name="envelope" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập email"
                value={email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <Text style={styles.labelText}>Password</Text>
            <View style={[
              styles.inputContainer, 
              errors.password && styles.inputError
            ]}>
              <Icon name="lock" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => handleInputChange('password', text)}
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
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: TEXT.small,
    marginTop: -15,
    marginBottom: 15,
    
    width: '80%'
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    width: "80%",
    marginBottom: 15,
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