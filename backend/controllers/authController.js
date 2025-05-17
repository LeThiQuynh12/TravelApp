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
       // Tạo token cho người dùng mới
    const userToken = jwt.sign({ id: newUser._id, email: newUser.email}, process.env.JWT_SECRET, { expiresIn: "21d" });

    // Trả về response với thông tin token và người dùng
    res.status(201).json({
      status: true,
      message: "Tạo tài khoản thành công",
      token: userToken,  // Trả về token
      username: newUser.username,
      email: newUser.email,
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
        username: user.username, 
        email: user.email  
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
        user: {
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          profile: user.profile,
        },
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
  changePassword: async (req, res, next) => {
    const { emailOrPhone, type, oldPass, newPass } = req.body;

    try {
      //console.log('Received changePassword request:', { emailOrPhone, type, oldPass, newPass });

      if (!emailOrPhone || !type || !oldPass || !newPass) {
        console.log('Missing required fields');
        return res.status(400).json({
          status: false,
          message: 'Thiếu thông tin bắt buộc!',
        });
      }

      if (type !== 'email' && type !== 'phone') {
        console.log('Invalid type:', type);
        return res.status(400).json({
          status: false,
          message: 'Loại định danh không hợp lệ! Phải là "email" hoặc "phone".',
        });
      }

      const user = await User.findOne(
        type === 'email' ? { email: emailOrPhone } : { phoneNumber: emailOrPhone }
      );
      if (!user) {
        console.log(`No user found for ${type}: ${emailOrPhone}`);
        return res.status(404).json({
          status: false,
          message: 'Người dùng không tồn tại!',
        });
      }

      const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
      const decryptedString = decryptedPassword.toString(CryptoJS.enc.Utf8);
      if (decryptedString !== oldPass) {
        console.log('Old password does not match');
        return res.status(400).json({
          status: false,
          message: 'Mật khẩu hiện tại không đúng!',
        });
      }

      const encryptedNewPass = CryptoJS.AES.encrypt(newPass, process.env.SECRET).toString();
      user.password = encryptedNewPass;
      await user.save();

      console.log('Password changed successfully for:', emailOrPhone);
      return res.status(200).json({
        status: true,
        message: 'Thay đổi mật khẩu thành công!',
      });
    } catch (error) {
      console.error('Error in changePassword:', error);
      return res.status(500).json({
        status: false,
        message: 'Lỗi server: ' + error.message,
      });
    }
  },
  changeEmail: async (req, res, next) => {
    const { newEmail, oldPassword } = req.body;
    const email = req.user?.email;  // Lấy email từ thông tin user đã xác thực
    console.log("Decoded user from token:", req.user);
    try {
        if (!email || !newEmail || !oldPassword) {
            return res.status(400).json({
                status: false,
                message: 'Thiếu thông tin bắt buộc!',
            });
        }

        // Tìm người dùng theo email hiện tại
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'Người dùng không tồn tại!',
            });
        }

        // Giải mã mật khẩu
        const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET).toString(CryptoJS.enc.Utf8);
        if (decryptedPassword !== oldPassword) {
            return res.status(400).json({
                status: false,
                message: 'Mật khẩu hiện tại không đúng!',
            });
        }

        // Kiểm tra email hợp lệ và chưa tồn tại
        if (!/\S+@\S+\.\S+/.test(newEmail)) {
            return res.status(400).json({
                status: false,
                message: 'Email không hợp lệ!',
            });
        }

        const existingEmail = await User.findOne({ email: newEmail });
        if (existingEmail) {
            return res.status(400).json({
                status: false,
                message: 'Email này đã được sử dụng!',
            });
        }

        // Cập nhật email
        user.email = newEmail;
        await user.save();

        console.log('Đã thay đổi email thành công cho user ID:', user._id);
        return res.status(200).json({
            status: true,
            message: 'Đổi email thành công!',
        });
    } catch (error) {
        console.error('Lỗi trong quá trình thay đổi email:', error);
        return res.status(500).json({
            status: false,
            message: 'Lỗi server: ' + error.message,
        });
    }
}
};