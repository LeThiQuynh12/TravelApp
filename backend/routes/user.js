const route = require("express").Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/jwt_token");

route.delete('/',verifyToken, userController.deleteUser); // Đăng ký tài khoản mới
route.get('/',verifyToken, userController.getUser); // Đăng nhập tài khoản
route.put('/',verifyToken, userController.updateUser);
module.exports = route; // Xuất router để sử dụng trong server.js