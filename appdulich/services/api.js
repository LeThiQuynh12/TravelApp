// services/api.js
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo instance Axios với cấu hình mặc định
const api = axios.create({
  baseURL: 'http://172.20.10.3:5003/api', // Địa chỉ backend của bạn
  // baseURL: 'http://172.20.10.4:5003/api', // Địa chỉ backend
  baseURL: 'http://192.168.1.14:5003/api',
  
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

// Hàm lấy danh sách khách sạn
export const getHotels = async () => {
  try {
    const response = await api.get('/hotels');
    console.log('Danh sách khách sạn từ backend:', response.data);
    return response.data.data; // Trả về mảng hotels từ response
  } catch (error) {
    console.log('Lỗi khi lấy danh sách khách sạn:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Lấy danh sách khách sạn thất bại!');
  }
};

// Hàm lấy chi tiết khách sạn theo ID
export const getHotelById = async (id) => {
  try {
    const response = await api.get(`/hotels/${id}`);
    console.log('Chi tiết khách sạn từ backend:', response.data);
    return response.data.data; // Trả về object hotel từ response
  } catch (error) {
    console.log('Lỗi khi lấy chi tiết khách sạn:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Lấy chi tiết khách sạn thất bại!');
  }
};

// Hàm lấy danh sách phòng thep hotelId
export const getRooms = async (hotelid) => {
  try {
    const response = await api.get('/rooms', {
      params: { hotelid }, // Truyền hotelid như query parameter
    });
    return response.data.data; // Trả về danh sách phòng từ response
  } catch (error) {
    console.log('Lỗi lấy danh sách phòng:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Lấy danh sách phòng thất bại!');
  }
};