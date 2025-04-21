// screens/PersonalInfoScreen.jsx
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

import ReusableBtn from '../../components/Buttons/ReusableBtn';
import AppBar from '../../components/Reusable/AppBar';
import {
  COLORS,
  SIZES,
} from '../../constants/theme';
import {
  getUser,
  updateUser,
} from '../../services/api';

const PersonalInfoScreen = ({ navigation, route }) => {
  const { setIsLoggedIn } = route.params || {};
  const [userData, setUserData] = useState({
    username: '',
    birthDate: '',
    gender: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const isMounted = useRef(true);

  // Lấy thông tin người dùng từ backend
  useEffect(() => {
    const fetchUser = async () => {
      if (!isMounted.current) return;

      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          if (setIsLoggedIn) setIsLoggedIn(false);
          setTimeout(() => {
            navigation.navigate('authentication');
          }, 100);
          return;
        }

        setLoading(true);
        const response = await getUser();
        if (isMounted.current) {
          const { username, birthDate, gender, address } = response.data;
          setUserData({
            username: username || 'LÊ THỊ QUỲNH',
            birthDate: formatDateFromBackend(birthDate) || '12/12/2004',
            gender: gender || 'Nữ',
            address: address || 'Nông Cống, Thanh Hóa',
          });
        }
      } catch (err) {
        if (isMounted.current) {
          console.error('Lỗi lấy thông tin người dùng:', err.message);
          if (err.message.includes('token') || err.message.includes('Unauthorized')) {
            await AsyncStorage.removeItem('token');
            if (setIsLoggedIn) setIsLoggedIn(false);
            setTimeout(() => {
              navigation.navigate('authentication');
            }, 100);
          } else {
            setError(err.message);
            Alert.alert('Lỗi', err.message);
          }
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted.current = false;
    };
  }, [navigation, setIsLoggedIn]);

  // Định dạng ngày từ backend (YYYY-MM-DD -> DD/MM/YYYY)
  const formatDateFromBackend = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Định dạng ngày gửi lên backend (DD/MM/YYYY -> YYYY-MM-DD)
  const formatDateToBackend = (dateStr) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleEdit = (field, value) => {
    setCurrentField(field);
    setCurrentValue(value);

    if (field === 'birthDate') {
      const [day, month, year] = value.split('/');
      setSelectedDate(new Date(year, month - 1, day));
    }

    setEditModalVisible(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let updatedData = {};

      if (currentField === 'birthDate') {
        const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}/${(
          selectedDate.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}/${selectedDate.getFullYear()}`;
        updatedData = { [currentField]: formatDateToBackend(formattedDate) };
        setUserData((prev) => ({
          ...prev,
          [currentField]: formattedDate,
        }));
      } else {
        updatedData = { [currentField]: currentValue };
        setUserData((prev) => ({
          ...prev,
          [currentField]: currentValue,
        }));
      }

      // Gọi API updateUser
      await updateUser(updatedData);
      Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
      setEditModalVisible(false);
    } catch (err) {
      console.error('Lỗi cập nhật thông tin:', err.message);
      Alert.alert('Lỗi', err.message || 'Cập nhật thông tin thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      if (Platform.OS === 'android') {
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}/${date.getFullYear()}`;
        setCurrentValue(formattedDate);
      }
    }
  };

  const formatDate = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Hiển thị loading khi đang lấy dữ liệu
  if (loading && !userData.username) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.skyBlue} />
      </View>
    );
  }

  // Hiển thị lỗi nếu có
  if (error && !userData.username) {
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
        title="Thông tin cá nhân"
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
              uri:
                'https://tse4.mm.bing.net/th?id=OIP.H3mY7p5e7n6do7W3UhDRXgHaHa&pid=Api&P=0&h=180',
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{userData.username.toUpperCase()}</Text>
        </View>

        <View style={styles.card}>
          <InfoField
            label="Họ và tên"
            value={userData.username}
            icon="edit"
            onPress={() => handleEdit('username', userData.username)}
          />
          <InfoField
            label="Ngày sinh"
            value={userData.birthDate}
            icon="edit"
            onPress={() => handleEdit('birthDate', userData.birthDate)}
          />
          <InfoField
            label="Giới tính"
            value={userData.gender}
            icon="edit"
            onPress={() => handleEdit('gender', userData.gender)}
          />
          <InfoField
            label="Địa chỉ"
            value={userData.address}
            icon="edit"
            onPress={() => handleEdit('address', userData.address)}
          />
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa {getFieldLabel(currentField)}</Text>

            {currentField === 'birthDate' ? (
              <>
                {Platform.OS === 'ios' ? (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="spinner"
                    onChange={onChangeDate}
                    style={styles.datePickerIOS}
                    textColor={COLORS.black}
                    themeVariant="light"
                  />
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.dateInput}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              <TextInput
                style={styles.modalInput}
                value={currentValue}
                onChangeText={setCurrentValue}
                placeholder={`Nhập ${getFieldLabel(currentField)}`}
              />
            )}

            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.saveModalButton, loading && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.buttonText}>Lưu</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const InfoField = ({ label, value, icon, onPress }) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Text style={styles.value}>{value}</Text>
        <TouchableOpacity onPress={onPress}>
          <MaterialIcons name={icon} size={22} color={COLORS.red} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getFieldLabel = (field) => {
  switch (field) {
    case 'username':
      return 'họ và tên';
    case 'birthDate':
      return 'ngày sinh';
    case 'gender':
      return 'giới tính';
    case 'address':
      return 'địa chỉ';
    default:
      return '';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  content: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 30,
    paddingTop: 70,
    paddingHorizontal: 10,
  },
  profileHeader: {
    alignItems: 'center',
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
    fontWeight: 'bold',
    paddingTop: 20,
    color: COLORS.black,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.lightShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    paddingBottom: 10,
  },
  value: {
    color: COLORS.black,
    fontSize: SIZES.medium,
    fontWeight: '500',
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.dark,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: SIZES.medium,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 10,
    padding: 15,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.lightWhite,
  },
  saveModalButton: {
    backgroundColor: COLORS.mint,
  },
  buttonDisabled: {
    backgroundColor: COLORS.gray,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: SIZES.medium,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: COLORS.blue,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  dateText: {
    fontSize: SIZES.medium,
    color: COLORS.lightBlue,
  },
  errorText: {
    fontSize: SIZES.medium,
    color: COLORS.red,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default PersonalInfoScreen;