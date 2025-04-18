const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      required: true,
      enum: ['Hotel', 'Suggestion'], // Loại đối tượng được đánh giá
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'targetType', // Tham chiếu động dựa trên targetType
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

// Hook để cập nhật rating và review trong Hotel hoặc Suggestion
ReviewSchema.post('save', async function (doc) {
  if (doc.targetType === 'Hotel') {
    const Hotel = mongoose.model('Hotel');
    const reviews = await mongoose.model('Review').find({ targetType: 'Hotel', targetId: doc.targetId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Hotel.findByIdAndUpdate(doc.targetId, {
      rating: avgRating,
      review: reviews.length,
    });
  } else if (doc.targetType === 'Suggestion') {
    const Suggestion = mongoose.model('Suggestion');
    const reviews = await mongoose.model('Review').find({ targetType: 'Suggestion', targetId: doc.targetId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Suggestion.findByIdAndUpdate(doc.targetId, {
      rating: avgRating,
      review: reviews.length,
    });
  }
});

module.exports = mongoose.model('Review', ReviewSchema);