// services/api.js
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo instance Axios với cấu hình mặc định
const api = axios.create({
  
  baseURL: 'http://192.168.0.111:5003/api',
  headers: {
    'Content-Type': 'application/json', // Sửa header đúng
  },
  timeout: 2000000, 
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
    //console.log('Phản hồi từ backend:', response.data);
    return response.data; // Trả về dữ liệu từ backend
  } catch (error) {
    console.log('Lỗi đăng nhập:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Đăng nhập không thành công!');
  }

  
};



// Hàm lấy thông tin người dùng
export const getUser = async () => {
  try {
    const response = await api.get('/users');
    console.log('Phản hồi từ backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi lấy thông tin người dùng:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Lấy thông tin người dùng thất bại!');
  }
};

// API kiểm tra người dùng tồn tại
export const checkUserExists = async (emailOrPhone, type) => {
  const response = await api.post('/check-user', { emailOrPhone, type });
  return response.data;
};

// API reset mật khẩu
export const resetPassword = async (emailOrPhone, type) => {
  const response = await api.post('/reset-password', { emailOrPhone, type });
  return response.data;
};

// Hàm cập nhật thông tin người dùng

export const updateUser = async (userData) => {
  try {
    console.log('Đang gửi yêu cầu cập nhật người dùng:', userData);
    const response = await api.put('/users', userData);
    console.log('Phản hồi từ backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi cập nhật người dùng:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Cập nhật thông tin người dùng thất bại!');
  }
};
// đổi ảnh 
export const updateProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('profile', file);

  const response = await api.put('/users/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
     timeout: 30000,
  });

  return response.data;
};

// Hàm xóa người dùng
export const deleteUser = async () => {
  try {
    const response = await api.delete('/users');
    console.log('Phản hồi từ backend:', response.data);
    // Xóa token khỏi AsyncStorage sau khi xóa tài khoản
    await AsyncStorage.removeItem('token');
    return response.data;
  } catch (error) {
    console.error('Lỗi xóa người dùng:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Xóa người dùng thất bại!');
  }
};
// Hàm đổi mật khẩu
export const changePassword = async ({ emailOrPhone, type, oldPass, newPass }) => {
  try {
    console.log('Sending changePassword request:', { emailOrPhone, type, oldPass, newPass });
    const response = await api.post('/change-password', {
      emailOrPhone,
      type,
      oldPass,
      newPass,
    });
    console.log('Change password response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Change password error:', error.response?.data);
    return {
      status: false,
      message: error.response?.data?.message || 'Lỗi kết nối server',
    };
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

// Hàm lấy chi tiết phòng theo roomId
export const getRoomById = async (roomId) => {
  try {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data; // Trả về object response (ví dụ { status: true, data: room })
  } catch (error) {
    console.log('Lỗi lấy chi tiết phòng:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Lấy chi tiết phòng thất bại!');
  }
};



// Hàm lấy danh sách thành phố từ flights
export const getCities = async () => {
  try {
    const response = await api.get('/cities');
    console.log('Danh sách thành phố từ backend:', response.data);
    return response.data.data; // Trả về mảng thành phố
  } catch (error) {
    console.log('Lỗi khi lấy danh sách thành phố:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Lấy danh sách thành phố thất bại!');
  }
};


// Hàm tìm kiếm chuyến bay
// services/api.js
export const searchFlights = async ({ departureCity, arrivalCity, departureDate, isRoundTrip, returnDate }) => {
  try {
    const response = await api.get('/flights/search', { // Use 'api' instead of 'axios'
      params: {
        departureCity,
        arrivalCity,
        outboundDate: departureDate, // Keep naming consistent with backend
        isRoundTrip: isRoundTrip.toString(), // Convert to string as backend expects string
        returnDate,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tìm kiếm chuyến bay');
  }
};


export const getFlightById = async (id) => {
  try {
    const response = await api.get(`/flights/${id}`);
    console.log(`Chi tiết chuyến bay ${id} từ backend:`, response.data);
    return response.data.data; // Trả về object chuyến bay
  } catch (error) {
    console.log('Lỗi khi lấy chi tiết chuyến bay:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Lấy chi tiết chuyến bay thất bại!');
  }
};

// Hàm lấy tất cả chuyến bay (nhóm theo tripId)
export const getAllFlights = async () => {
  try {
    const response = await api.get('/flights');
    console.log('Tất cả chuyến bay từ backend:', response.data);
    return response.data.data; // Trả về mảng chuyến bay đã nhóm theo tripId
  } catch (error) {
    console.log('Lỗi khi lấy tất cả chuyến bay:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Lấy tất cả chuyến bay thất bại!');
  }
};


export const searchBuses = async ({ departureCity, arrivalCity, outboundDate, isRoundTrip, returnDate }) => {
  try {
    const response = await api.get('/bus/search', {
      params: {
        departureCity,
        arrivalCity,
        outboundDate,
        isRoundTrip: isRoundTrip.toString(),
        returnDate: isRoundTrip ? returnDate : undefined,
      },
    });

    if (response.data.status === false) {
      throw new Error(response.data.message || 'Không tìm thấy xe khách');
    }

    return response.data.data || [];
  } catch (error) {
    console.error('Error in searchBuses:', error.message);
    throw new Error(error.response?.data?.message || 'Không thể tìm kiếm xe khách');
  }
};


export const fetchBusCities = async () => {
  try {
    const response = await api.get('/bus/cities');
    return response.data.data || [];
  } catch (error) {
    console.error('Error in fetchBusCities:', error.message);
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách thành phố');
  }
};



// Hàm lấy danh sách địa điểm với phân trang
export const fetchPlaces = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/places', {
      params: { page, limit }
    });
    return response.data.data; 
  } catch (error) {
    console.error('Lỗi khi lấy danh sách địa điểm:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách địa điểm!');
  }
};



// Hàm lấy chi tiết địa điểm theo ID
export const fetchPlaceById = async (id) => {
  try {
    const response = await api.get(`/places/${id}`);
    return response.data.data; // Giả định backend trả về { data: {...} }
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết địa điểm:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể tải chi tiết địa điểm!');
  }
};




// Hàm lấy highlights của một địa điểm
export const fetchPlaceHighlights = async (placeId) => {
  try {
    const response = await api.get(`/places/${placeId}/highlights`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy highlights:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể tải highlights!');
  }
};

// Hàm lấy suggestions của một địa điểm
export const fetchPlaceSuggestions = async (placeId) => {
  try {
    const response = await api.get(`/places/${placeId}/suggestions`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy suggestions:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể tải suggestions!');
  }
};

// Hàm lấy nearbyProvinces của một địa điểm
export const fetchPlaceNearbyProvinces = async (placeId) => {
  try {
    const response = await api.get(`/places/${placeId}/nearby`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy nearbyProvinces:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể tải nearbyProvinces!');
  }
};



// Hàm lấy tất cả suggestions
export const fetchSuggestions = async (page = 1, limit = 1) => {
  try {
    const response = await api.get('/suggestions', {
      params: { page, limit },
    });

    // Trả nguyên response để lấy cả pagination
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy suggestions');
  }
};

// ==== VNPay ====

/**
 * Gửi yêu cầu tạo thanh toán VNPay
 * @param {Object} data - { user_id, service_id, service_type, service_name, total_amount, orderDescription, language, bankCode }
 */
export const createVnpayPayment = async (data) => {
  try {
    const payload = {
      user_id: data.user_id,
      service_id: data.service_id,
      service_type: data.service_type,
      service_name: data.service_name,
      total_amount: data.total_amount,
      orderDescription: data.orderDescription,
      language: data.language,
      bankCode: data.bankCode,
    };
    console.log('Gửi dữ liệu tạo thanh toán VNPay:', payload);
    const response = await api.post('/createPayment', payload);
    return response.data;
  } catch (error) {
    console.error('Lỗi gọi createVnpayPayment:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Tạo thanh toán VNPay thất bại!');
  }
};

/**
 * Xử lý callback từ VNPay sau khi thanh toán thành công hoặc thất bại
 * (nếu bạn gọi từ mobile để check lại kết quả)
 */
export const checkVnpayReturn = async (params) => {
  try {
    const response = await api.get('/vnpay_return', { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi xử lý callback VNPay:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'VNPay callback thất bại!');
  }
};
// Hàm tạo đơn hàng (dùng khi thanh toán bằng bank/momo)
export const createOrder = async (orderData) => {
  try {
    console.log('Đang gửi yêu cầu tạo đơn hàng:', orderData);
    const response = await api.post('/orders', orderData);
    console.log('Phản hồi từ backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể tạo đơn hàng!');
  }
};
// Gọi API lấy chi tiết đơn hàng theo ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data; // { success: true, order }
  } catch (error) {
    console.error('Lỗi getOrderById:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể lấy chi tiết đơn hàng!');
  }
};
// Gọi API xóa đơn hàng theo ID
export const deleteOrderById = async (orderId) => {
  try {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data; // { success: true, message: 'Đã xóa đơn hàng' }
  } catch (error) {
    console.error('Lỗi deleteOrderById:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể xóa đơn hàng!');
  }
};

// Gọi API lấy thông tin khách sạn dựa vào roomId
export const getHotelByRoomId = async (roomId) => {
  try {
    const response = await api.get(`/hotel-by-room/${roomId}`);
    return response.data; // { status: true, data: { ...hotel } }
  } catch (error) {
    console.error('Lỗi getHotelByRoomId:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể lấy thông tin khách sạn từ phòng!');
  }
};
// Gọi API lấy thông tin xe khách theo ID
export const getBusById = async (busId) => {
  try {
    const response = await api.get(`/buses/${busId}`);
    return response.data; // { status: true, data: { ...bus } }
  } catch (error) {
    console.error('Lỗi getBusById:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể lấy thông tin xe khách!');
  }
};

// Hàm lấy đơn hàng theo user_id
export const fetchOrdersByUser = async (user_id) => {
  if (!user_id) throw new Error('Thiếu user_id');
  try {
    const response = await api.get('/orders', {
      params: { user_id },
    });
    return response.data.orders; // Trả về mảng đơn hàng
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lấy đơn hàng không thành công!');
  }
};