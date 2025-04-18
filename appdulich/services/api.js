// services/api.js
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo instance Axios với cấu hình mặc định
const api = axios.create({

  // baseURL: 'http://172.20.10.4:5003/api', // Địa chỉ backend
  baseURL: 'http://192.168.0.111/api',
  
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
export const searchFlights = async (params) => {
  try {
    const response = await api.get('/flights/search', {
      params: {
        departureCity: params.from,
        arrivalCity: params.to,
        outboundDate: params.departureDate,
        isRoundTrip: params.isRoundTrip,
        returnDate: params.returnDate,
      },
    });
    console.log('Danh sách chuyến bay từ backend:', response.data);
    return response.data.data; // Trả về mảng chuyến bay từ response
  } catch (error) {
    console.log('Lỗi khi tìm kiếm chuyến bay:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Tìm kiếm chuyến bay thất bại!');
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

// Hàm lấy tất cả chuyến bay chiều đi
export const getOutboundFlights = async () => {
  try {
    const response = await api.get('/flights/outbound');
    console.log('Chuyến bay chiều đi từ backend:', response.data);
    return response.data.data; // Trả về mảng chuyến bay chiều đi
  } catch (error) {
    console.log('Lỗi khi lấy chuyến bay chiều đi:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Lấy chuyến bay chiều đi thất bại!');
  }
};



// Hàm lấy tất cả chuyến bay chiều về
export const getReturnFlights = async () => {
  try {
    const response = await api.get('/flights/return');
    console.log('Chuyến bay chiều về từ backend:', response.data);
    return response.data.data; // Trả về mảng chuyến bay chiều về
  } catch (error) {
    console.log('Lỗi khi lấy chuyến bay chiều về:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Lấy chuyến bay chiều về thất bại!');
  }
};



// Hàm lấy chuyến bay theo tripId
export const getFlightsByTripId = async (tripId) => {
  try {
    const response = await api.get(`/flights/trip/${tripId}`);
    console.log(`Chuyến bay theo tripId ${tripId} từ backend:`, response.data);
    return response.data.data; // Trả về object chuyến bay (outbound và return)
  } catch (error) {
    console.log('Lỗi khi lấy chuyến bay theo tripId:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Lấy chuyến bay theo tripId thất bại!');
  }
};



// Hàm lấy chuyến bay theo ID
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


// Hàm lấy danh sachs thành phố xe khách
export const fetchBusCities = async () => {
  try {
    const response = await api.get('/bus/cities');
    return response.data.data.map((item) => item.departureCity).sort();
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thành phố:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách thành phố!');
  }
};


// Hàm tìm kiếm xe khách
export const searchBuses = async (params) => {
  try {
    const queryParams = new URLSearchParams({
      departureCity: params.departureCity || '',
      arrivalCity: params.arrivalCity || '',
      outboundDate: params.outboundDate || '',
      isRoundTrip: params.isRoundTrip.toString(),
    });
    if (params.isRoundTrip && params.returnDate) {
      queryParams.append('returnDate', params.returnDate);
    }
    const response = await api.get(`/bus/search?${queryParams.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm xe khách:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể tìm kiếm xe khách!');
  }
};



// Hàm lấy danh sách địa điểm
export const fetchPlaces = async () => {
  try {
    const response = await api.get('/places');
    return response.data.data; // Giả định backend trả về { data: [...] }
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
export const fetchSuggestions = async () => {
  try {
    const response = await api.get('/suggestions');
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách suggestions:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách suggestions!');
  }
};

