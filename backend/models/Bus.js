const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
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
  departureName: {
    type: String,
    required: true,
  },
  arrivalCity: {
    type: String,
    required: true,
  },
  arrivalName: {
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