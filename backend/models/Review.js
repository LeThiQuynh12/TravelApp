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
  const Review = mongoose.model('Review');
  const targetId = doc.targetId;
  const targetType = doc.targetType;

  const reviews = await Review.find({ targetType, targetId });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const roundedAvgRating = Math.round(avgRating * 10) / 10; // Làm tròn 1 chữ số thập phân

  if (targetType === 'Hotel') {
    const Hotel = mongoose.model('Hotel');
    await Hotel.findByIdAndUpdate(targetId, {
      rating: roundedAvgRating,
      review: reviews.length,
    });
  } else if (targetType === 'Suggestion') {
    const Suggestion = mongoose.model('Suggestion');
    await Suggestion.findByIdAndUpdate(targetId, {
      rating: roundedAvgRating,
      review: reviews.length,
    });
  }
});



module.exports = mongoose.model('Review', ReviewSchema);