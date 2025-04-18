const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema(
  {
    country_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    review: {
      type: String, // Thay đổi từ Number sang String
      default: '0 đánh giá',
    },
    location: {
      type: String,
      required: true,
    },
    availability: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    description: {
      type: String,
      required: true,
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hotel', HotelSchema);