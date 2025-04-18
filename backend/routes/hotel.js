const route = require('express').Router();
const hotelController = require('../controllers/hotelController');

// Route CRUD cho Hotel
route.post('/', hotelController.createHotel); // Tạo mới khách sạn
route.get('/:id', hotelController.getHotel); // Lấy thông tin khách sạn theo ID
route.get('/', hotelController.getAllHotels); // Lấy danh sách tất cả khách sạn
route.put('/:id', hotelController.updateHotel); // Cập nhật thông tin khách sạn
route.delete('/:id', hotelController.deleteHotel); // Xóa khách sạn

module.exports = route;