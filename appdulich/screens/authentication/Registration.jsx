import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

const Registration = () => {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State để hiển thị/ẩn mật khẩu

  const togglePasswordVisibility = () => {
    setShowPassword(true); // Hiển thị mật khẩu ngay khi nhấn vào mắt
    // Sau 5 giây, ẩn mật khẩu
    setTimeout(() => {
      setShowPassword(false); 
    }, 800); 
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, width: "100%" }} // Đảm bảo phần này chiếm hết chiều rộng
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            {/* Tên người dùng */}
            <Text style={styles.labelText}> Tên người dùng </Text>
            <View style={styles.inputContainer}>
              <Icon name="user" size={25} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập tên người dùng"
                value={user}
                onChangeText={setUser}
              />
            </View>

            {/* Email */}
            <Text style={styles.labelText}> Email </Text>
            <View style={styles.inputContainer}>
              <Icon name="envelope" size={25} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập email"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <Text style={styles.labelText}>Password</Text>
            <View style={styles.inputContainer}>
              <Icon name="lock" size={25} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Icon
                  name={showPassword ? "eye" : "eye-slash"} // Thay đổi biểu tượng dựa vào trạng thái
                  size={25}
                  color="#777"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Nút Đăng ký */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>TẠO TÀI KHOẢN</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Đảm bảo có thể cuộn khi bàn phím hiện
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 20,
    flexDirection: "column",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
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
    fontSize: 16,
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
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 10,
    color: "#777",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Registration;
