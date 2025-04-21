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

  // Lấy tất cả đánh giá cho targetId và targetType
  const reviews = await Review.find({ targetType, targetId });

  // Xử lý trường hợp không có đánh giá
  let roundedAvgRating = 0;
  let reviewCount = reviews.length;

  if (reviewCount > 0) {
    // Tính trung bình đánh giá
    const avgRating = reviews.reduce((sum, r) => {
      // Kiểm tra rating hợp lệ (giả sử rating từ 0-5)
      const rating = Number(r.rating);
      return isNaN(rating) || rating < 0 || rating > 5 ? sum : sum + rating;
    }, 0) / reviewCount;

    // Làm tròn đến 1 chữ số thập phân
    roundedAvgRating = Math.round(avgRating * 10) / 10;
  }

  // Cập nhật vào Hotel hoặc Suggestion
  if (targetType === 'Hotel') {
    const Hotel = mongoose.model('Hotel');
    await Hotel.findByIdAndUpdate(targetId, {
      rating: roundedAvgRating,
      review: reviewCount,
    });
  } else if (targetType === 'Suggestion') {
    const Suggestion = mongoose.model('Suggestion');
    await Suggestion.findByIdAndUpdate(targetId, {
      rating: roundedAvgRating,
      review: reviewCount,
    });
  }
});



module.exports = mongoose.model('Review', ReviewSchema);