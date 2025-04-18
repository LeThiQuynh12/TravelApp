const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true },
    profile: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/128/3033/3033143.png',
    },
    phoneNumber: {
      type: String,
      match: /^(\+84|0)[1-9][0-9]{8}$/, // Định dạng số điện thoại VN
    },
    dateBirth: { type: Date },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    address: { type: String },
  },
  { timestamps: true } // Tự động thêm createdAt, updatedAt
);



module.exports = mongoose.model('User', UserSchema);