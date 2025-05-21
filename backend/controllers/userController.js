const User = require('../models/User');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
  const { profile, phoneNumber, dateBirth, gender, address, email } = req.body;

  try {
    // Tìm user hiện tại
    const currentUser = await User.findById(user_id);
    if (!currentUser) {
      return res.status(404).json({
        status: false,
        message: 'Người dùng không tồn tại',
      });
    }

    // Nếu có cập nhật email và email mới khác email cũ
    if (email && email !== currentUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          status: false,
          message: 'Email đã tồn tại trong hệ thống',
        });
      }
    }

    // Tạo object chứa các trường cần cập nhật
    const updateData = {};
    if (profile) updateData.profile = profile;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (dateBirth) updateData.dateBirth = new Date(dateBirth);
    if (gender) updateData.gender = gender;
    if (address) updateData.address = address;
    if (email) updateData.email = email;

    // Tiến hành cập nhật
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -__v -createdAt -updatedAt');

    return res.status(200).json({
      status: true,
      message: 'Cập nhật thông tin thành công',
      data: updatedUser,
    });

  } catch (error) {
    console.error('Lỗi khi cập nhật:', error);
    return next(error); // hoặc trả về lỗi chi tiết hơn nếu muốn
  }
},

// đổi ảnh đại diện 
updateProfileImage: async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng tải lên ảnh đại diện',
      });
    }

    const filePath = req.file.path;

    // Upload ảnh lên Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'avatars',
    });

    // Xóa file local sau khi upload lên cloud
    fs.unlinkSync(filePath);

    const profileImageUrl = result.secure_url;

    // Cập nhật URL mới vào MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profile: profileImageUrl },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: 'Người dùng không tồn tại',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Cập nhật ảnh đại diện thành công',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật ảnh đại diện:', error);
    return next(error);
  }
},
};