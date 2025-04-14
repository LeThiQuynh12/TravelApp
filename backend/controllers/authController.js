// controllers/authController.js
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (req, res, next) => {
    try {
      // Kiểm tra req.body có tồn tại không
      if (!req.body) {
        return res.status(400).json({
          status: false,
          message: "Dữ liệu gửi lên không hợp lệ!",
        });
      }

      // Kiểm tra email đã tồn tại chưa
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: "Email đã được sử dụng",
        });
      }

      // Tạo mới user, mã hóa mật khẩu bằng AES
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.SECRET
        ).toString(),
      });

      // Lưu user vào MongoDB
      await newUser.save();

      res.status(201).json({
        status: true,
        message: "Tạo tài khoản thành công",
      });
    } catch (error) {
      return next(error);
    }
  },

  loginUser: async (req, res, next) => {
    try {
      // Kiểm tra req.body có tồn tại không
      if (!req.body) {
        return res.status(400).json({
          status: false,
          message: "Dữ liệu gửi lên không hợp lệ!",
        });
      }

      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "Tài khoản không tồn tại",
        });
      }

      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET
      );

      const decryptedString = decryptedPassword.toString(CryptoJS.enc.Utf8);

      if (decryptedString !== req.body.password) {
        return res.status(401).json({
          status: false,
          message: "Mật khẩu không đúng",
        });
      }

      const userToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "21d" }
      );

      const user_id = user._id;

      res.status(200).json({
        status: true,
        id: user_id,
        token: userToken,
      });
    } catch (error) {
      return next(error);
    }
  },
};