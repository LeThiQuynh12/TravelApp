const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema(
  {
    name: {
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
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    nearbyProvinces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
      },
    ],
    highlights: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Suggestion',
      },
    ],
    suggestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Suggestion',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Place', PlaceSchema);