import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { COLORS, SIZES } from "../../constants/theme";
import AppBar from "../../components/Reusable/AppBar";
import ReusableBtn from "../../components/Buttons/ReusableBtn";
import { MaterialIcons } from "@expo/vector-icons";
import { changePassword } from "../../services/api";

const ChangePass = ({ navigation, route }) => {
  const { user, source } = route.params || {};
  const PASSWORD_VISIBLE_DURATION = 800;

  const [formData, setFormData] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  const [errors, setErrors] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  const [showPassword, setShowPassword] = useState({
    oldPass: false,
    newPass: false,
    confirmPass: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const formOpacity = useRef(new Animated.Value(0)).current;
  const timers = useRef({ oldPass: null, newPass: null, confirmPass: null }).current;

  useEffect(() => {
    console.log('Received user in ChangePass:', user);
    Animated.timing(formOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return () => {
      Object.values(timers).forEach(timer => timer && clearTimeout(timer));
    };
  }, []);

  const toggleShowPassword = (field) => {
    if (timers[field]) clearTimeout(timers[field]);

    setShowPassword(prev => ({ ...prev, [field]: true }));

    timers[field] = setTimeout(() => {
      setShowPassword(prev => ({ ...prev, [field]: false }));
    }, PASSWORD_VISIBLE_DURATION);
  };

  const validatePassword = (pass) => {
    if (!pass) return "Vui lòng nhập mật khẩu";
    if (pass.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    if (!/[A-Z]/.test(pass)) return "Mật khẩu phải có ít nhất 1 chữ hoa";
    if (!/[a-z]/.test(pass)) return "Mật khẩu phải có ít nhất 1 chữ thường";
    if (!/[0-9]/.test(pass)) return "Mật khẩu phải có ít nhất 1 số";
    return "";
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { oldPass: "", newPass: "", confirmPass: "" };

    if (!formData.oldPass) {
      newErrors.oldPass = "Vui lòng nhập mật khẩu hiện tại";
      valid = false;
    }

    newErrors.newPass = validatePassword(formData.newPass);
    if (!newErrors.newPass && formData.newPass === formData.oldPass) {
      newErrors.newPass = "Mật khẩu mới phải khác mật khẩu cũ";
      valid = false;
    }

    if (!formData.confirmPass) {
      newErrors.confirmPass = "Vui lòng xác nhận mật khẩu";
      valid = false;
    } else if (formData.confirmPass !== formData.newPass) {
      newErrors.confirmPass = "Mật khẩu xác nhận không khớp";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (!user || (!user.email && !user.phoneNumber)) {
        setErrors(prev => ({ ...prev, oldPass: "Không tìm thấy thông tin người dùng" }));
        return;
      }

      const payload = {
        emailOrPhone: user.email || user.phoneNumber,
        type: user.email ? 'email' : 'phone',
        oldPass: formData.oldPass,
        newPass: formData.newPass,
      };

      console.log('Sending change password request:', payload);
      const response = await changePassword(payload);

      if (response.status) {
        alert('Thay đổi mật khẩu thành công!');
        if (source === 'profile') {
          console.log('Navigating back to Profile');
          navigation.navigate('Profile');
        } else if (source === 'forgotPass') {
          console.log('Navigating to authentication');
          navigation.replace('Bottom', { screen: 'authentication' });
        } else {
          console.log('No source specified, using default navigation');
          navigation.goBack();
        }
      } else {
        setErrors(prev => ({ ...prev, oldPass: response.message }));
      }
    } catch (error) {
      console.error('Lỗi thay đổi mật khẩu:', error);
      setErrors(prev => ({ ...prev, oldPass: 'Có lỗi xảy ra, vui lòng thử lại' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <AppBar
        title="Thay đổi mật khẩu"
        color={COLORS.white}
        top={40}
        left={20}
        right={20}
        onPress={() => navigation.goBack()}
      />

      <Animated.ScrollView
        contentContainerStyle={styles.content}
        style={{ opacity: formOpacity }}
      >
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: user?.profile || 'https://tse4.mm.bing.net/th?id=OIP.H3mY7p5e7n6do7W3UhDRXgHaHa&pid=Api&P=0&h=180',
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.username || 'Người dùng'}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Nhập mật khẩu hiện tại</Text>
          <View style={[styles.inputContainer, errors.oldPass && styles.inputError]}>
            <TextInput
              style={styles.inputText}
              placeholder="Nhập mật khẩu hiện tại"
              placeholderTextColor={COLORS.gray}
              secureTextEntry={!showPassword.oldPass}
              value={formData.oldPass}
              onChangeText={(text) => handleInputChange('oldPass', text)}
            />
            <TouchableOpacity
              onPress={() => toggleShowPassword('oldPass')}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={showPassword.oldPass ? "visibility" : "visibility-off"}
                size={24}
                color={showPassword.oldPass ? COLORS.skyBlue : COLORS.gray}
              />
            </TouchableOpacity>
          </View>
          {errors.oldPass ? <Text style={styles.errorText}>{errors.oldPass}</Text> : null}

          <TouchableOpacity
            style={styles.forgotPass}
            onPress={() => navigation.navigate("ForgotPass")}
          >
            <Text style={styles.forgotbtn}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Mật khẩu mới</Text>
          <View style={[styles.inputContainer, errors.newPass && styles.inputError]}>
            <TextInput
              style={styles.inputText}
              placeholder="Nhập mật khẩu mới"
              placeholderTextColor={COLORS.gray}
              secureTextEntry={!showPassword.newPass}
              value={formData.newPass}
              onChangeText={(text) => handleInputChange('newPass', text)}
            />
            <TouchableOpacity
              onPress={() => toggleShowPassword('newPass')}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={showPassword.newPass ? "visibility" : "visibility-off"}
                size={24}
                color={showPassword.newPass ? COLORS.skyBlue : COLORS.gray}
              />
            </TouchableOpacity>
          </View>
          {errors.newPass ? <Text style={styles.errorText}>{errors.newPass}</Text> : null}

          <Text style={styles.title}>Nhập lại mật khẩu mới</Text>
          <View style={[styles.inputContainer, errors.confirmPass && styles.inputError]}>
            <TextInput
              style={styles.inputText}
              placeholder="Nhập lại mật khẩu mới"
              placeholderTextColor={COLORS.gray}
              secureTextEntry={!showPassword.confirmPass}
              value={formData.confirmPass}
              onChangeText={(text) => handleInputChange('confirmPass', text)}
            />
            <TouchableOpacity
              onPress={() => toggleShowPassword('confirmPass')}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={showPassword.confirmPass ? "visibility" : "visibility-off"}
                size={24}
                color={showPassword.confirmPass ? COLORS.skyBlue : COLORS.gray}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPass ? <Text style={styles.errorText}>{errors.confirmPass}</Text> : null}
        </View>

        <View style={styles.passwordRules}>
          <Text style={styles.rulesTitle}>Mật khẩu phải có:</Text>
          <View style={styles.ruleItem}>
            <MaterialIcons
              name={formData.newPass?.length >= 6 ? "check-circle" : "radio-button-unchecked"}
              size={16}
              color={formData.newPass?.length >= 6 ? COLORS.green : COLORS.gray}
            />
            <Text style={styles.ruleText}>Ít nhất 6 ký tự</Text>
          </View>
          <View style={styles.ruleItem}>
            <MaterialIcons
              name={/[A-Z]/.test(formData.newPass) ? "check-circle" : "radio-button-unchecked"}
              size={16}
              color={/[A-Z]/.test(formData.newPass) ? COLORS.green : COLORS.gray}
            />
            <Text style={styles.ruleText}>1 chữ hoa (A-Z)</Text>
          </View>
          <View style={styles.ruleItem}>
            <MaterialIcons
              name={/[0-9]/.test(formData.newPass) ? "check-circle" : "radio-button-unchecked"}
              size={16}
              color={/[0-9]/.test(formData.newPass) ? COLORS.green : COLORS.gray}
            />
            <Text style={styles.ruleText}>1 số (0-9)</Text>
          </View>
        </View>

        <View style={styles.button}>
          <ReusableBtn
            onPress={handleChangePassword}
            btnText={isSubmitting ? "Đang xử lý..." : "Xác thực"}
            width={100}
            backgroundColor={COLORS.skyBlue}
            borderColor={COLORS.skyBlue}
            borderWidth={0}
            textColor={COLORS.white}
            disabled={isSubmitting}
          />
        </View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 80,
  },
  profileHeader: {
    alignItems: "center",
    marginVertical: 20,
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
    fontWeight: "700",
    color: COLORS.dark,
    marginTop: 10,
  },
  formContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightWhite,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  inputError: {
    borderColor: COLORS.red,
  },
  inputText: {
    flex: 1,
    color: COLORS.dark,
    fontSize: SIZES.medium,
  },
  eyeIcon: {
    padding: 5,
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
  passwordRules: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  rulesTitle: {
    fontSize: SIZES.small,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 10,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ruleText: {
    fontSize: SIZES.small,
    color: COLORS.dark,
    marginLeft: 8,
  },
  button: {
    paddingVertical: 10,
    alignSelf: "center",
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 10,
  },
});

export default ChangePass;