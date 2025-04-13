const User = require("../models/User"); // Import model User từ thư mục models

const CryptoJS = require("crypto-js"); // Dùng để mã hóa/giải mã mật khẩu
const jwt = require("jsonwebtoken"); // Thư viện tạo JWT token cho đăng nhập

module.exports = {
    //  API tạo người dùng mới
    createUser: async (req, res, next) => {
        try {
            //  Kiểm tra email đã tồn tại chưa trong hệ thống
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({
                    status: false,
                    message: "Email đã được sử dụng", // Báo lỗi nếu trùng email
                });
            }

            //  Tạo mới user, mã hóa mật khẩu bằng AES
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: CryptoJS.AES.encrypt(
                    req.body.password,
                    process.env.SECRET // Khóa bí mật để mã hóa
                ).toString(),
                // Nếu có avatar riêng thì truyền lên, còn không sẽ dùng default từ schema
            });

            //  Lưu user vào MongoDB
            await newUser.save();

            //  Trả về kết quả khi tạo user thành công
            res.status(201).json({
                status: true,
                message: "Tạo tài khoản thành công",
            });
        } catch (error) {
            return next(error); // Gửi lỗi cho middleware xử lý lỗi chung
        }
    },

    //  API đăng nhập
    loginUser: async (req, res, next) => {
        try {
            //  Tìm user theo email
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "Tài khoản không tồn tại", // Không tìm thấy user
                });
            }

            //  Giải mã password từ database
            const decryptedPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.SECRET
            );

            //  Lấy chuỗi mật khẩu sau khi giải mã
            const decryptedString = decryptedPassword.toString(CryptoJS.enc.Utf8);

            //  So sánh với password người dùng nhập
            if (decryptedString !== req.body.password) {
                return res.status(401).json({
                    status: false,
                    message: "Mật khẩu không đúng",
                });
            }

            //  Nếu đúng mật khẩu → tạo token chứa id user
            const userToken = jwt.sign(
                {
                    id: user._id, // Payload là id user
                },
                process.env.JWT_SECRET, // Khóa bí mật ký token
                { expiresIn: "21d" } // Token có hiệu lực trong 21 ngày
            );

            const user_id = user._id;

            // Trả về token và id user khi đăng nhập thành công
            res.status(200).json({
                status: true,
                id: user_id,
                token: userToken,
            });
        } catch (error) {
            return next(error); // Gửi lỗi cho middleware xử lý lỗi
        }
    },
};
