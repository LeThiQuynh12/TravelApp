const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
  {
    hotelid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    capacity: {
      type: String,
      required: true,
    },
    bed: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    facilities: {
      type: String,
      required: true,
    },
    oldPrice: {
      type: String,
      required: true,
    },
    newPrice: {
      type: String,
      required: true,
    },
    images: [
      {
        uri: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', RoomSchema);