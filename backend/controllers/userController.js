const User = require('../models/User');

module.exports = {
  // Xóa người dùng theo ID
  deleteUser: async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.user.id);
      res.status(200).json({
        status: true,
        message: 'Xóa thành công người dùng',
      });
    } catch (error) {
      return next(error);
    }
  },

  // Lấy thông tin người dùng hiện tại
  getUser: async (req, res, next) => {
    const user_id = req.user.id;
    try {
      const user = await User.findById(user_id, {
        password: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'Người dùng không tồn tại',
        });
      }

      res.status(200).json({
        status: true,
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (req, res, next) => {
    const user_id = req.user.id;
    const { profile, phoneNumber, dateBirth, gender, address } = req.body;


    try {
      // Tạo object chứa các trường cần cập nhật
      const updateData = {};
      if (profile) updateData.profile = profile;
      if (phoneNumber) updateData.phoneNumber = phoneNumber;
      if (dateBirth) updateData.dateBirth = new Date(dateBirth);
      if (gender) updateData.gender = gender;
      if (address) updateData.address = address;

      // Cập nhật thông tin người dùng
      const updatedUser = await User.findByIdAndUpdate(
        user_id,
        { $set: updateData },
        { new: true, runValidators: true } // Trả về tài liệu đã cập nhật, chạy kiểm tra schema
      ).select('-password -__v -createdAt -updatedAt');

      if (!updatedUser) {
        return res.status(404).json({
          status: false,
          message: 'Người dùng không tồn tại',
        });
      }

      res.status(200).json({
        status: true,
        message: 'Cập nhật thông tin thành công',
        data: updatedUser,
      });
    } catch (error) {
      return next(error);
    }
  },
};