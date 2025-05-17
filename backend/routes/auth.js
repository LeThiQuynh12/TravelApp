const route = require("express").Router();
const authController = require("../controllers/authController");

route.post('/register', authController.createUser); // Đăng ký tài khoản mới
route.post('/login', authController.loginUser); // Đăng nhập tài khoản
// Kiểm tra email/số điện thoại tồn tại
route.post('/check-user', authController.checkUserExists);

// Reset mật khẩu
route.post('/reset-password', authController.resetPassword);
route.post('/change-password', authController.changePassword);
route.post('/change-email', authController.changeEmail);
module.exports = route; // Xuất router để sử dụng trong server.js