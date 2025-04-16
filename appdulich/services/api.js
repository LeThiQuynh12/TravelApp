// services/api.js
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo instance Axios với cấu hình mặc định
const api = axios.create({
  baseURL: 'http://172.20.10.4:5003/api', // Địa chỉ backend của bạn
  headers: {
    'Content-Type': 'application/json', // Sửa header đúng
  },
  timeout: 10000,
});

// Interceptor để tự động thêm token vào header
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Thêm token vào header
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Hàm đăng ký người dùng
export const fetchDangKy = async (user, email, password) => {
  try {
    console.log('Đang gửi yêu cầu đăng ký:', { username: user, email, password });
    const response = await api.post('/register', {
      username: user,
      email: email,
      password: password,
    });
    console.log('Phản hồi từ backend:', response.data);
    return response.data; // Trả về dữ liệu từ backend
  } catch (error) {
    console.log('Lỗi đăng ký:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Đăng ký không thành công!');
  }
};

// Hàm đăng nhập người dùng
export const fetchDangNhap = async (email, password) => {
  try {
    console.log('Đang gửi yêu cầu đăng nhập:', { email, password });
    const response = await api.post('/login', {
      email: email,
      password: password,
    });
    console.log('Phản hồi từ backend:', response.data);
    return response.data; // Trả về dữ liệu từ backend
  } catch (error) {
    console.log('Lỗi đăng nhập:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Đăng nhập không thành công!');
  }

  
};

// Hàm lấy thông tin người dùng
export const getUser = async () => {
  try {
    const response = await api.get('/users'); // Token sẽ tự động được thêm vào header
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lấy thông tin người dùng thất bại!');
  }
};