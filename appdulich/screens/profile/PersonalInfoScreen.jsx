import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Modal, Pressable, Platform } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppBar from '../../components/Reusable/AppBar';
import { COLORS, SIZES } from '../../constants/theme';
import ReusableBtn from '../../components/Buttons/ReusableBtn';
const PersonalInfoScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    fullName: 'Lê Thị Quỳnh',
    birthDate: '12/12/2004',
    gender: 'Nữ',
    address: 'Nông Cống, Thanh Hóa'
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2004, 11, 12)); // 12/12/2004

  const handleEdit = (field, value) => {
    setCurrentField(field);
    setCurrentValue(value);
    
    if (field === 'birthDate') {
      // Chuyển đổi từ chuỗi ngày tháng sang Date object
      const [day, month, year] = value.split('/');
      setSelectedDate(new Date(year, month - 1, day));
    }
    
    setEditModalVisible(true);
  };

  const handleSave = () => {
    if (currentField === 'birthDate') {
      // Format ngày tháng thành dd/mm/yyyy
      const formattedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
      setUserData(prev => ({
        ...prev,
        [currentField]: formattedDate
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [currentField]: currentValue
      }));
    }
    setEditModalVisible(false);
  };

  const onChangeDate = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      // Cập nhật giá trị hiển thị ngay lập tức trên Android
      if (Platform.OS === 'android') {
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        setCurrentValue(formattedDate);
      }
    }
  };

  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

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
              uri: "https://tse4.mm.bing.net/th?id=OIP.H3mY7p5e7n6do7W3UhDRXgHaHa&pid=Api&P=0&h=180",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>LÊ THỊ QUỲNH</Text>
        </View>

        <View style={styles.card}>
          <InfoField 
            label="Họ và tên" 
            value={userData.fullName} 
            icon="edit" 
            onPress={() => handleEdit('fullName', userData.fullName)} 
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
                style={[styles.modalButton, styles.saveModalButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Lưu</Text>
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
  switch(field) {
    case 'fullName': return 'họ và tên';
    case 'birthDate': return 'ngày sinh';
    case 'gender': return 'giới tính';
    case 'address': return 'địa chỉ';
    default: return '';
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
    paddingHorizontal: 10
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
  button: {
    paddingVertical: 20,
    alignSelf: "center",
  },
  saveButtonText: {
    color: COLORS.lightWhite,
    fontSize: SIZES.body2,
    fontWeight: 'bold',
  },
  // Modal styles
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
    backgroundColor: COLORS.lightWhite,
  },
  buttonText: {
    color: COLORS.mint,
    fontWeight: 'bold',
    fontSize: SIZES.medium,
  },
  datePicker: {
    width: '100%',
    marginBottom: 20,
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
});

export default PersonalInfoScreen;