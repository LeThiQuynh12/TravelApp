// screens/profile/Profile.jsx
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

import AsyncStorage from '@react-native-async-storage/async-storage';

import ReusableBtn from '../../components/Buttons/ReusableBtn';
import AppBar from '../../components/Reusable/AppBar';
import HeightSpacer from '../../components/Reusable/HeightSpacer';
import {
  COLORS,
  SIZES,
  TEXT,
} from '../../constants/theme';
import { getUser } from '../../services/api';

const Profile = ({ navigation, route }) => {
  const { setIsLoggedIn } = route.params || {};
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  // Lấy thông tin người dùng khi màn hình được tải
  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      if (!isMounted.current) return;

      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          // Không có token, chuyển đến tab authentication
          if (setIsLoggedIn) setIsLoggedIn(false);
          setTimeout(() => {
            navigation.navigate('authentication');
          }, 100);
          return;
        }

        setLoading(true);
        const response = await getUser();
        if (isMounted.current) {
          setUser(response.data);
        }
      } catch (err) {
        if (isMounted.current) {
          console.error('Lỗi lấy thông tin người dùng:', err.message);
          if (err.message.includes('token') || err.message.includes('Unauthorized')) {
            // Token không hợp lệ, chuyển đến tab authentication
            await AsyncStorage.removeItem('token');
            if (setIsLoggedIn) setIsLoggedIn(false);
            setTimeout(() => {
              navigation.navigate('authentication');
            }, 100);
          } else {
            setError(err.message);
            alert(err.message);
          }
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    checkAuthAndFetchUser();

    return () => {
      isMounted.current = false;
    };
  }, [navigation, setIsLoggedIn]);

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      // Xóa token khỏi AsyncStorage
      await AsyncStorage.removeItem('token');
      // Cập nhật trạng thái đăng nhập
      if (setIsLoggedIn) {
        setIsLoggedIn(false);
      }
      // Điều hướng về BottomTabNavigation và chọn tab Authentication
      navigation.replace('Bottom', { screen: 'authentication' });
    } catch (error) {
      console.log('Lỗi đăng xuất:', error);
      alert('Đăng xuất thất bại!');
    }
  };
 

  // Hiển thị loading khi đang lấy dữ liệu
  if (loading && !user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.skyBlue} />
      </View>
    );
  }

  // Hiển thị lỗi nếu có
  if (error && !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <ReusableBtn
          onPress={() => navigation.goBack()}
          btnText="Quay lại"
          width={SIZES.width / 1.1}
          backgroundColor={COLORS.red}
          borderColor={COLORS.red}
          borderWidth={0}
          textColor={COLORS.white}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar
        title="Tài khoản"
        color={COLORS.white}
        top={50}
        left={20}
        right={20}
        onPress={() => navigation.goBack()}
      />

      {/* Profile Header Section */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri:
                user?.profile ||
                'https://tse4.mm.bing.net/th?id=OIP.H3mY7p5e7n6do7W3UhDRXgHaHa&pid=Api&P=0&h=180',
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editIcon} activeOpacity={0.8}>
            <Icon name="camera" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{user?.username || 'LÊ THỊ QUỲNH'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'quynhlt@example.com'}</Text>
        </View>
      </View>

      {/* Profile Menu Section */}
      <View style={styles.menuContainer}>
        {/* Personal Info */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('PersonalInfoScreen')}
        >
          <View style={[styles.menuIcon, { backgroundColor: COLORS.lightSkyBlue }]}>
            <Icon name="user" size={20} color={COLORS.skyBlue} />
          </View>
          <Text style={styles.menuText}>Thông tin cá nhân</Text>
          <Icon name="chevron-right" size={18} color={COLORS.lightGray} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Phone Number */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('PhoneNumber')}
        >
          <View style={[styles.menuIcon, { backgroundColor: COLORS.lightMint }]}>
            <Icon name="mobile-screen" size={20} color={COLORS.mint} />
          </View>
          <Text style={styles.menuText}>Số điện thoại</Text>
          <Text style={styles.menuValue}>{user?.phoneNumber || ''}</Text>
          <Icon name="chevron-right" size={18} color={COLORS.lightGray} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Email */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Email')}
        >
          <View style={[styles.menuIcon, { backgroundColor: COLORS.lightPeach }]}>
            <Icon name="envelope" size={18} color={COLORS.peach} />
          </View>
          <Text style={styles.menuText}>Email</Text>
          <Text style={styles.menuValue}>{user?.email || 'quynhlt@example.com'}</Text>
          <Icon name="chevron-right" size={18} color={COLORS.lightGray} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Change Password */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ChangePass', {user,source: 'profile'})}
        >
          <View style={[styles.menuIcon, { backgroundColor: COLORS.lightLavender }]}>
            <Icon name="lock" size={20} color={COLORS.lavender} />
          </View>
          <Text style={styles.menuText}>Đổi mật khẩu</Text>
          <Icon name="chevron-right" size={18} color={COLORS.lightGray} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Bank Account */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Bank')}
        >
          <View style={[styles.menuIcon, { backgroundColor: COLORS.lightPink }]}>
            <Icon name="landmark" size={20} color={COLORS.pink} />
          </View>
          <Text style={styles.menuText}>Liên kết ngân hàng</Text>
          <Icon name="chevron-right" size={18} color={COLORS.lightGray} />
        </TouchableOpacity>

        <View style={styles.divider} />

      
      </View>

      <HeightSpacer height={30} />
      <ReusableBtn
        onPress={handleLogout}
        btnText={'Đăng xuất'}
        width={SIZES.width / 1.1}
        backgroundColor={COLORS.red}
        borderColor={COLORS.red}
        borderWidth={0}
        textColor={COLORS.white}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 25,
    padding: 20,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: COLORS.lightShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: COLORS.skyBlue,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.skyBlue,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    elevation: 3,
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: 20,
  },
  userName: {
    fontSize: TEXT.large,
    fontWeight: '700',
    color: COLORS.darkBlue,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: TEXT.small,
    color: COLORS.softGray,
    fontWeight: '500',
  },
  menuContainer: {
    borderRadius: 16,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: COLORS.lightShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: TEXT.medium,
    fontWeight: '600',
    color: COLORS.darkBlue,
  },
  menuValue: {
    fontSize: TEXT.small,
    color: COLORS.softGray,
    marginRight: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
  errorText: {
    fontSize: TEXT.medium,
    color: COLORS.red,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Profile;