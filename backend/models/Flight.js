const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema(
  {
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
    flightNumber: {
      type: String,
      required: true,
      unique: true,
    },
    airline: {
      type: String,
      required: true,
    },
    ticketType: {
      type: String,
      required: true,
      enum: ['Eco', 'Premium', 'Business'],
    },
    price: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    tripId: {
      type: String, // ID để nhóm các chuyến bay thành một chuyến khứ hồi
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flight', FlightSchema);