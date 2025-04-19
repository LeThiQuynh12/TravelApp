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
  // Kiểm tra email hoặc số điện thoại tồn tại
  checkUserExists: async (req, res, next) => {
    const { emailOrPhone, type } = req.body;

    try {
      const user = await User.findOne(
        type === 'email' ? { email: emailOrPhone } : { phoneNumber: emailOrPhone }
      );

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'Email hoặc số điện thoại không tồn tại!',
        });
      }

      res.status(200).json({
        status: true,
        message: 'Người dùng tồn tại. Vui lòng nhập mã OTP.',
      });
    } catch (error) {
      return next(error);
    }
  },

  // Reset mật khẩu (sau khi xác nhận OTP tĩnh)
  resetPassword: async (req, res, next) => {
    const { emailOrPhone, type } = req.body;

    try {
      const user = await User.findOne(
        type === 'email' ? { email: emailOrPhone } : { phoneNumber: emailOrPhone }
      );

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'Email hoặc số điện thoại không tồn tại!',
        });
      }

      // Tạo mật khẩu mới
      const newPassword = Math.random().toString(36).slice(-8);
      user.password = CryptoJS.AES.encrypt(
        newPassword,
        process.env.SECRET
      ).toString();
      await user.save();

      console.log(`Mật khẩu mới cho ${emailOrPhone}: ${newPassword}`); // In ra console
      res.status(200).json({
        status: true,
        message: `Đã gửi mật khẩu mới đến ${type === 'email' ? 'email' : 'số điện thoại'} của bạn!`,
      });
    } catch (error) {
      return next(error);
    }
  },
};