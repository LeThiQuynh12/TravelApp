const express = require("express");
const route = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/jwt_token");
const upload = require('../middleware/uploadImage');


route.delete('/', verifyToken, userController.deleteUser);
route.get('/', verifyToken, userController.getUser);
route.put('/', verifyToken, userController.updateUser);

// Thêm route đổi ảnh đại diện
route.put('/profile-image', verifyToken, upload.single('profile'), userController.updateProfileImage);

module.exports = route;
