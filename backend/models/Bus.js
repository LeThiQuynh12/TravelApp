const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  tripId: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    required: true,
    enum: ['outbound', 'return'], // Chỉ cho phép 'outbound' hoặc 'return'
  },
  departureTime: {
    type: String,
    required: true,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  departureCity: {
    type: String,
    required: true,
  },
  arrivalCity: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  busCompany: {
    type: String,
    required: true,
  },
  ticketType: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  amenities: {
    type: [String],
    default: [],
  },
  seats: {
    type: Number,
    required: true,
  },
  pickup: {
    type: String,
    required: true,
  },
  dropoff: {
    type: String,
    required: true,
  },
  note: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);