const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

// Tạo xe khách mới
router.post('/', busController.createBus);

// Lấy tất cả xe khách
router.get('/', busController.getAllBuses);

// Tìm kiếm xe khách
router.get('/search', busController.searchBuses);

// Lấy danh sách thành phố
router.get('/cities', busController.getCities);

// Lấy chi tiết xe khách theo ID
router.get('/:id', busController.getBusById);

// Cập nhật xe khách theo ID
router.put('/:id', busController.updateBus);

// Xóa xe khách theo ID
router.delete('/:id', busController.deleteBus);

module.exports = router;