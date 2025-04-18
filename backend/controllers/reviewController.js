const Review = require('../models/Review');
const Hotel = require('../models/Hotel');
const Suggestion = require('../models/Suggestion'); // Giả sử bạn có model Suggestion

// Create: Tạo mới đánh giá
exports.createReview = async (req, res, next) => {
  try {
    const { targetType, targetId, user, review, rating } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!targetType || !targetId || !user || !review || !rating) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin (targetType, targetId, user, review, rating)',
      });
    }

    // Kiểm tra targetType hợp lệ
    if (!['Hotel', 'Suggestion'].includes(targetType)) {
      return res.status(400).json({
        status: false,
        message: 'targetType phải là Hotel hoặc Suggestion',
      });
    }

    // Kiểm tra rating trong phạm vi 1-5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: false,
        message: 'Đánh giá phải nằm trong khoảng từ 1 đến 5',
      });
    }

    // Tạo đánh giá mới
    const newReview = new Review({
      targetType,
      targetId,
      user,
      review,
      rating,
    });

    const savedReview = await newReview.save();

    res.status(201).json({
      status: true,
      message: 'Tạo đánh giá thành công',
      data: savedReview,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy danh sách đánh giá theo targetType và targetId
exports.getReviews = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.query;

    // Nếu không có targetType hoặc targetId, trả về tất cả đánh giá
    const query = {};
    if (targetType) query.targetType = targetType;
    if (targetId) query.targetId = targetId;

    const reviews = await Review.find(query).populate('user');

    res.status(200).json({
      status: true,
      data: reviews,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy chi tiết đánh giá theo ID
exports.getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate('user');
    if (!review) {
      return res.status(404).json({
        status: false,
        message: 'Đánh giá không tồn tại',
      });
    }

    res.status(200).json({
      status: true,
      data: review,
    });
  } catch (error) {
    return next(error);
  }
};

// Update: Cập nhật đánh giá
exports.updateReview = async (req, res, next) => {
  try {
    const { review, rating } = req.body;

    const updateData = {};
    if (review !== undefined) updateData.review = review;
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          status: false,
          message: 'Đánh giá phải nằm trong khoảng từ 1 đến 5',
        });
      }
      updateData.rating = rating;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng cung cấp ít nhất một trường để cập nhật',
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('user');

    if (!updatedReview) {
      return res.status(404).json({
        status: false,
        message: 'Đánh giá không tồn tại',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Cập nhật đánh giá thành công',
      data: updatedReview,
    });
  } catch (error) {
    return next(error);
  }
};

// Delete: Xóa đánh giá
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({
        status: false,
        message: 'Đánh giá không tồn tại',
      });
    }

    // Cập nhật lại rating và review count trong Hotel hoặc Suggestion
    if (review.targetType === 'Hotel') {
      const reviews = await Review.find({ targetType: 'Hotel', targetId: review.targetId });
      const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
      await Hotel.findByIdAndUpdate(review.targetId, {
        rating: avgRating,
        review: reviews.length,
      });
    } else if (review.targetType === 'Suggestion') {
      const reviews = await Review.find({ targetType: 'Suggestion', targetId: review.targetId });
      const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
      await Suggestion.findByIdAndUpdate(review.targetId, {
        rating: avgRating,
        review: reviews.length,
      });
    }

    res.status(200).json({
      status: true,
      message: 'Xóa đánh giá thành công',
    });
  } catch (error) {
    return next(error);
  }
};


// Create: Tạo nhiều đánh giá cùng lúc
exports.createMultipleReviews = async (req, res, next) => {
  try {
    const reviews = req.body; // Mong đợi một mảng các review

    // Kiểm tra xem dữ liệu đầu vào có phải là mảng không
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng cung cấp một mảng các đánh giá hợp lệ',
      });
    }

    const savedReviews = [];
    const errors = [];

    // Duyệt qua từng review trong mảng
    for (const reviewData of reviews) {
      const { targetType, targetId, user, review, rating } = reviewData;

      // Kiểm tra các trường bắt buộc
      if (!targetType || !targetId || !user || !review || !rating) {
        errors.push({
          reviewData,
          message: 'Vui lòng cung cấp đầy đủ thông tin (targetType, targetId, user, review, rating)',
        });
        continue;
      }

      // Kiểm tra targetType hợp lệ
      if (!['Hotel', 'Suggestion'].includes(targetType)) {
        errors.push({
          reviewData,
          message: 'targetType phải là Hotel hoặc Suggestion',
        });
        continue;
      }

      // Kiểm tra rating trong phạm vi 1-5
      if (rating < 1 || rating > 5) {
        errors.push({
          reviewData,
          message: 'Đánh giá phải nằm trong khoảng từ 1 đến 5',
        });
        continue;
      }

      // Tạo đánh giá mới
      const newReview = new Review({
        targetType,
        targetId,
        user,
        review,
        rating,
      });

      const savedReview = await newReview.save();
      savedReviews.push(savedReview);
    }

    // Nếu có lỗi, trả về thông tin lỗi cùng với các đánh giá đã lưu
    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Một số đánh giá không thể tạo',
        data: savedReviews,
        errors,
      });
    }

    // Trả về phản hồi thành công
    res.status(201).json({
      status: true,
      message: 'Tạo các đánh giá thành công',
      data: savedReviews,
    });
  } catch (error) {
    return next(error);
  }
};