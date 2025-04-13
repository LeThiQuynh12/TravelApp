const route = require("express").Router();
const authController = require("../controllers/authController");

route.post('/register', authController.createUser); // Đăng ký tài khoản mới
route.post('/login', authController.loginUser); // Đăng nhập tài khoản

module.exports = route; // Xuất router để sử dụng trong server.js