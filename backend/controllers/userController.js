const User = require("../models/User");

// Controller quản lý người dùng
module.exports = {
    // Xóa người dùng theo ID (lấy từ middleware xác thực)
    deleteUser: async (req, res, next) => {
        try {
            await User.findByIdAndDelete(req.user.id); // Xóa theo ID
            res.status(200).json({
                status: true,
                message: "Xóa thành công người dùng" // ✅ Sửa lại lỗi chính tả: 'succesfully' → 'successfully'
            });
        } catch (error) {
            return next(error); // Đẩy lỗi cho middleware xử lý
        }
    },

    // Lấy thông tin người dùng hiện tại
    getUser: async (req, res, next) => {
        const user_id = req.user.id; // Lấy từ token

        try {
            const user = await User.findById(user_id, {
                password: 0,     // Không trả về mật khẩu
                __v: 0,          // Không trả về version key
                createdAt: 0,    // Không trả thời gian tạo
                updatedAt: 0     // Không trả thời gian cập nhật
            });

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "Người dùng không tồn tại"
                });
            }

            res.status(200).json({
                status: true,
                data: user
            });
        } catch (error) {
            return next(error);
        }
    }
};
