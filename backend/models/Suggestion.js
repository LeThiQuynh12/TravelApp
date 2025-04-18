const mongoose = require('mongoose');

const SuggestionSchema = new mongoose.Schema(
  {
    id_dia_diem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    review: {
      type: Number,
      default: 0,
    },
    introduction: {
      type: String,
      required: true,
    },
    ticket_prices: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    map: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Suggestion', SuggestionSchema);