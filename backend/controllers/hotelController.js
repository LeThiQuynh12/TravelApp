const Hotel = require('../models/Hotel');
const Review = require('../models/Review');

module.exports = {
  // Create: Tạo mới khách sạn (hỗ trợ cả mảng)
  createHotel: async (req, res, next) => {
    try {
      const hotelsData = Array.isArray(req.body) ? req.body : [req.body];
      const createdHotels = [];

      for (const hotelData of hotelsData) {
        const {
          country_id,
          title,
          imageUrl,
          rating,
          review,
          location,
          availability,
          coordinates,
          description,
          contact,
          price,
        } = hotelData;

        if (
          !country_id ||
          !title ||
          !location ||
          !availability ||
          !availability.start ||
          !availability.end ||
          !coordinates ||
          !coordinates.latitude ||
          !coordinates.longitude ||
          !description ||
          !contact ||
          !price
        ) {
          return res.status(400).json({
            status: false,
            message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc (country_id, title, location, availability, coordinates, description, contact, price)',
            missingFields: {
              country_id: !country_id,
              title: !title,
              location: !location,
              availability: !availability,
              'availability.start': !availability?.start,
              'availability.end': !availability?.end,
              coordinates: !coordinates,
              'coordinates.latitude': !coordinates?.latitude,
              'coordinates.longitude': !coordinates?.longitude,
              description: !description,
              contact: !contact,
              price: !price,
            },
          });
        }

        const newHotel = new Hotel({
          country_id,
          title,
          imageUrl: imageUrl || 'https://via.placeholder.com/150',
          rating: rating || 0,
          review: review || 0, // Lưu số lượng đánh giá
          location,
          availability: {
            start: new Date(availability.start),
            end: new Date(availability.end),
          },
          coordinates: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          },
          description,
          contact,
          price: typeof price === 'number' ? price.toString() : price,
        });

        const savedHotel = await newHotel.save();
        createdHotels.push(savedHotel);
      }

      res.status(201).json({
        status: true,
        message: `Tạo thành công ${createdHotels.length} khách sạn`,
        data: createdHotels,
      });
    } catch (error) {
      return next(error);
    }
  },

  // Read: Lấy thông tin khách sạn theo ID
  getHotel: async (req, res, next) => {
    try {
      // Lấy thông tin khách sạn và populate contact
      const hotel = await Hotel.findById(req.params.id).populate('contact');
      if (!hotel) {
        return res.status(404).json({
          status: false,
          message: 'Khách sạn không tồn tại',
        });
      }

      // Lấy danh sách đánh giá của khách sạn
      const reviews = await Review.find({ targetType: 'Hotel', targetId: hotel._id })
        .populate({
          path: 'user',
          select: 'username profile', // Chỉ lấy username và profile của user
        })
        .lean(); // Chuyển đổi thành plain object để dễ xử lý

      // Format lại dữ liệu khách sạn để thêm reviews
      const hotelData = hotel.toObject(); // Chuyển đổi document thành plain object
      hotelData.reviews = reviews.map(review => ({
        _id: review._id,
        review: review.review,
        rating: review.rating,
        user: {
          id: review.user._id,
          username: review.user.username,
          profile: review.user.profile,
        },
        updatedAt: review.updatedAt,
      }));

      res.status(200).json({
        status: true,
        data: hotelData,
      });
    } catch (error) {
      return next(error);
    }
  },

  // Read: Lấy danh sách tất cả khách sạn
  getAllHotels: async (req, res, next) => {
    try {
      // Lấy danh sách khách sạn và populate contact
      const hotels = await Hotel.find().populate('contact').lean();

      // Lấy danh sách đánh giá cho tất cả khách sạn
      const hotelIds = hotels.map(hotel => hotel._id);
      const reviews = await Review.find({ targetType: 'Hotel', targetId: { $in: hotelIds } })
        .populate({
          path: 'user',
          select: 'username profile',
        })
        .lean();

      // Nhóm đánh giá theo targetId
      const reviewsByHotel = reviews.reduce((acc, review) => {
        const hotelId = review.targetId.toString();
        if (!acc[hotelId]) acc[hotelId] = [];
        acc[hotelId].push({
          _id: review._id,
          review: review.review,
          rating: review.rating,
          user: {
            id: review.user._id,
            username: review.user.username,
            profile: review.user.profile,
          },
          updatedAt: review.updatedAt,
        });
        return acc;
      }, {});

      // Thêm reviews vào từng khách sạn
      const hotelsWithReviews = hotels.map(hotel => ({
        ...hotel,
        reviews: reviewsByHotel[hotel._id.toString()] || [],
      }));

      res.status(200).json({
        status: true,
        data: hotelsWithReviews,
      });
    } catch (error) {
      return next(error);
    }
  },

  // Update: Cập nhật thông tin khách sạn
  updateHotel: async (req, res, next) => {
    try {
      const {
        country_id,
        title,
        imageUrl,
        rating,
        review,
        location,
        availability,
        coordinates,
        description,
        contact,
        price,
      } = req.body;

      const updateData = {};
      if (country_id !== undefined) updateData.country_id = country_id;
      if (title !== undefined) updateData.title = title;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (rating !== undefined) updateData.rating = rating;
      if (review !== undefined) updateData.review = review; // Lưu số lượng đánh giá
      if (location !== undefined) updateData.location = location;
      if (availability) {
        updateData.availability = {
          start: availability.start ? new Date(availability.start) : undefined,
          end: availability.end ? new Date(availability.end) : undefined,
        };
      }
      if (coordinates) {
        updateData.coordinates = {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        };
      }
      if (description !== undefined) updateData.description = description;
      if (contact !== undefined) updateData.contact = contact;
      if (price !== undefined) updateData.price = typeof price === 'number' ? price.toString() : price;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          status: false,
          message: 'Vui lòng cung cấp ít nhất một trường để cập nhật',
        });
      }

      const updatedHotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate('contact');

      if (!updatedHotel) {
        return res.status(404).json({
          status: false,
          message: 'Khách sạn không tồn tại',
        });
      }

      // Lấy danh sách đánh giá của khách sạn sau khi cập nhật
      const reviews = await Review.find({ targetType: 'Hotel', targetId: updatedHotel._id })
        .populate({
          path: 'user',
          select: 'username profile',
        })
        .lean();

      const hotelData = updatedHotel.toObject();
      hotelData.reviews = reviews.map(review => ({
        _id: review._id,
        review: review.review,
        rating: review.rating,
        user: {
          id: review.user._id,
          username: review.user.username,
          profile: review.user.profile,
        },
        updatedAt: review.updatedAt,
      }));

      res.status(200).json({
        status: true,
        message: 'Cập nhật khách sạn thành công',
        data: hotelData,
      });
    } catch (error) {
      return next(error);
    }
  },

  // Delete: Xóa khách sạn
  deleteHotel: async (req, res, next) => {
    try {
      const hotel = await Hotel.findByIdAndDelete(req.params.id);
      if (!hotel) {
        return res.status(404).json({
          status: false,
          message: 'Khách sạn không tồn tại',
        });
      }

      // Xóa tất cả đánh giá liên quan đến khách sạn
      await Review.deleteMany({ targetType: 'Hotel', targetId: hotel._id });

      res.status(200).json({
        status: true,
        message: 'Xóa khách sạn thành công',
      });
    } catch (error) {
      return next(error);
    }
  },
};