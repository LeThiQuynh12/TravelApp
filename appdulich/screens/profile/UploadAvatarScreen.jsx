import React, { useState, useEffect } from 'react';
import { View, Button, Image, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { updateProfileImage } from '../../services/api';

export default function UploadAvatarScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // Xin quyền truy cập thư viện ảnh khi component mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Quyền bị từ chối', 'Ứng dụng cần quyền truy cập thư viện ảnh để chọn ảnh.');
      }
    })();
  }, []);

  const handleChoosePhoto = async () => {
    // Mở thư viện ảnh, người dùng chọn
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // Đối với SDK mới, result.canceled = false thì có result.assets
      const selectedUri = result.assets[0].uri;
      setImageUri(selectedUri);
    }
  };

  const handleUpload = async () => {
    if (!imageUri) {
      Alert.alert('Lỗi', 'Vui lòng chọn ảnh trước khi tải lên');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Lỗi', 'Bạn chưa đăng nhập');
        setLoading(false);
        return;
      }

      // Tạo file object đúng định dạng upload
      const file = {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      };

      const res = await updateProfileImage(file, token);

      Alert.alert('Thành công', res.message || 'Ảnh đại diện đã được cập nhật');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật ảnh đại diện');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.avatar} />
      )}

      <Button title="Chọn ảnh" onPress={handleChoosePhoto} />

      {loading ? (
        <ActivityIndicator size="large" color="#008080" style={{ marginTop: 15 }} />
      ) : (
        <Button title="Cập nhật ảnh đại diện" onPress={handleUpload} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
});
