const mongoose = require('mongoose');
const Place = require('../models/Place');

// Create: Tạo mới địa điểm
exports.createPlace = async (req, res, next) => {
  try {
    const placesData = Array.isArray(req.body) ? req.body : [req.body];
    const createdPlaces = [];

    for (const placeData of placesData) {
      const { name, image, description, location, nearbyProvinces, highlights, suggestions } = placeData;

      // Kiểm tra các trường bắt buộc
      if (!name || !description || !location || !location.lat || !location.lng) {
        return res.status(400).json({
          status: false,
          message: 'Vui lòng cung cấp đầy đủ thông tin (name, description, location.lat, location.lng)',
          missingFields: {
            name: !name,
            description: !description,
            location: !location,
            'location.lat': !location?.lat,
            'location.lng': !location?.lng,
          },
        });
      }

      // Kiểm tra các địa điểm lân cận (nearbyProvinces) có tồn tại không
      if (nearbyProvinces && Array.isArray(nearbyProvinces)) {
        const invalidIds = nearbyProvinces.filter(
          (id) => !mongoose.Types.ObjectId.isValid(id)
        );
        if (invalidIds.length > 0) {
          return res.status(400).json({
            status: false,
            message: `Các ID trong nearbyProvinces không hợp lệ: ${invalidIds.join(', ')}`,
          });
        }

        const nearbyPlaces = await Place.find({ _id: { $in: nearbyProvinces } });
        if (nearbyPlaces.length !== nearbyProvinces.length) {
          return res.status(400).json({
            status: false,
            message: 'Một hoặc nhiều địa điểm lân cận (nearbyProvinces) không tồn tại',
          });
        }
      }

      // Kiểm tra highlights có tồn tại không
      if (highlights && Array.isArray(highlights)) {
        const invalidIds = highlights.filter(
          (id) => !mongoose.Types.ObjectId.isValid(id)
        );
        if (invalidIds.length > 0) {
          return res.status(400).json({
            status: false,
            message: `Các ID trong highlights không hợp lệ: ${invalidIds.join(', ')}`,
          });
        }

        const highlightSuggestions = await mongoose.model('Suggestion').find({ _id: { $in: highlights } });
        if (highlightSuggestions.length !== highlights.length) {
          return res.status(400).json({
            status: false,
            message: 'Một hoặc nhiều gợi ý trong highlights không tồn tại',
          });
        }
      }

      // Kiểm tra suggestions có tồn tại không
      if (suggestions && Array.isArray(suggestions)) {
        const invalidIds = suggestions.filter(
          (id) => !mongoose.Types.ObjectId.isValid(id)
        );
        if (invalidIds.length > 0) {
          return res.status(400).json({
            status: false,
            message: `Các ID trong suggestions không hợp lệ: ${invalidIds.join(', ')}`,
          });
        }

        const suggestionItems = await mongoose.model('Suggestion').find({ _id: { $in: suggestions } });
        if (suggestionItems.length !== suggestions.length) {
          return res.status(400).json({
            status: false,
            message: 'Một hoặc nhiều gợi ý trong suggestions không tồn tại',
          });
        }
      }

      // Tạo địa điểm mới
      const newPlace = new Place({
        name,
        image: image || 'https://via.placeholder.com/150',
        description,
        location: {
          lat: location.lat,
          lng: location.lng,
        },
        nearbyProvinces: nearbyProvinces || [],
        highlights: highlights || [],
        suggestions: suggestions || [],
      });

      const savedPlace = await newPlace.save();
      createdPlaces.push(savedPlace);
    }

    res.status(201).json({
      status: true,
      message: `Tạo thành công ${createdPlaces.length} địa điểm`,
      data: createdPlaces,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy danh sách tất cả địa điểm
exports.getAllPlaces = async (req, res, next) => {
  try {
    const places = await Place.find()
      .populate('nearbyProvinces', 'name image location')
      .populate('highlights') // Lấy toàn bộ thông tin của Suggestion trong highlights
      .populate('suggestions') // Lấy toàn bộ thông tin của Suggestion trong suggestions
      .lean();

    // Truy vấn danh sách review cho từng suggestion trong highlights và suggestions
    for (let place of places) {
      // Xử lý highlights
      if (place.highlights && Array.isArray(place.highlights)) {
        for (let suggestion of place.highlights) {
          const reviews = await mongoose.model('Review').find(
            { targetType: 'Suggestion', targetId: suggestion._id },
            'user review rating createdAt'
          ).populate('user', 'name');
          suggestion.reviews = reviews; // Thêm danh sách review vào suggestion
        }
      }

      // Xử lý suggestions
      if (place.suggestions && Array.isArray(place.suggestions)) {
        for (let suggestion of place.suggestions) {
          const reviews = await mongoose.model('Review').find(
            { targetType: 'Suggestion', targetId: suggestion._id },
            'user review rating createdAt'
          ).populate('user', 'name');
          suggestion.reviews = reviews; // Thêm danh sách review vào suggestion
        }
      }
    }

    res.status(200).json({
      status: true,
      data: places,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy thông tin địa điểm theo ID
exports.getPlaceById = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate('nearbyProvinces', 'name image location')
      .populate('highlights') // Lấy toàn bộ thông tin của Suggestion trong highlights
      .populate('suggestions') // Lấy toàn bộ thông tin của Suggestion trong suggestions
      .lean();

    if (!place) {
      return res.status(404).json({
        status: false,
        message: 'Địa điểm không tồn tại',
      });
    }

    // Truy vấn danh sách review cho từng suggestion trong highlights và suggestions
    // Xử lý highlights
    if (place.highlights && Array.isArray(place.highlights)) {
      for (let suggestion of place.highlights) {
        const reviews = await mongoose.model('Review').find(
          { targetType: 'Suggestion', targetId: suggestion._id },
          'user review rating createdAt'
        ).populate('user', 'name');
        suggestion.reviews = reviews; // Thêm danh sách review vào suggestion
      }
    }

    // Xử lý suggestions
    if (place.suggestions && Array.isArray(place.suggestions)) {
      for (let suggestion of place.suggestions) {
        const reviews = await mongoose.model('Review').find(
          { targetType: 'Suggestion', targetId: suggestion._id },
          'user review rating createdAt'
        ).populate('user', 'name');
        suggestion.reviews = reviews; // Thêm danh sách review vào suggestion
      }
    }

    res.status(200).json({
      status: true,
      data: place,
    });
  } catch (error) {
    return next(error);
  }
};

// Update: Cập nhật thông tin địa điểm
exports.updatePlace = async (req, res, next) => {
  try {
    const { name, image, description, location, nearbyProvinces, highlights, suggestions } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;
    if (location) {
      updateData.location = {
        lat: location.lat,
        lng: location.lng,
      };
    }
    if (nearbyProvinces !== undefined) {
      if (Array.isArray(nearbyProvinces)) {
        const invalidIds = nearbyProvinces.filter(
          (id) => !mongoose.Types.ObjectId.isValid(id)
        );
        if (invalidIds.length > 0) {
          return res.status(400).json({
            status: false,
            message: `Các ID trong nearbyProvinces không hợp lệ: ${invalidIds.join(', ')}`,
          });
        }

        const nearbyPlaces = await Place.find({ _id: { $in: nearbyProvinces } });
        if (nearbyPlaces.length !== nearbyProvinces.length) {
          return res.status(400).json({
            status: false,
            message: 'Một hoặc nhiều địa điểm lân cận (nearbyProvinces) không tồn tại',
          });
        }
        updateData.nearbyProvinces = nearbyProvinces;
      } else {
        updateData.nearbyProvinces = [];
      }
    }
    if (highlights !== undefined) {
      if (Array.isArray(highlights)) {
        const invalidIds = highlights.filter(
          (id) => !mongoose.Types.ObjectId.isValid(id)
        );
        if (invalidIds.length > 0) {
          return res.status(400).json({
            status: false,
            message: `Các ID trong highlights không hợp lệ: ${invalidIds.join(', ')}`,
          });
        }

        const highlightSuggestions = await mongoose.model('Suggestion').find({ _id: { $in: highlights } });
        if (highlightSuggestions.length !== highlights.length) {
          return res.status(400).json({
            status: false,
            message: 'Một hoặc nhiều gợi ý trong highlights không tồn tại',
          });
        }
        updateData.highlights = highlights;
      } else {
        updateData.highlights = [];
      }
    }
    if (suggestions !== undefined) {
      if (Array.isArray(suggestions)) {
        const invalidIds = suggestions.filter(
          (id) => !mongoose.Types.ObjectId.isValid(id)
        );
        if (invalidIds.length > 0) {
          return res.status(400).json({
            status: false,
            message: `Các ID trong suggestions không hợp lệ: ${invalidIds.join(', ')}`,
          });
        }

        const suggestionItems = await mongoose.model('Suggestion').find({ _id: { $in: suggestions } });
        if (suggestionItems.length !== suggestions.length) {
          return res.status(400).json({
            status: false,
            message: 'Một hoặc nhiều gợi ý trong suggestions không tồn tại',
          });
        }
        updateData.suggestions = suggestions;
      } else {
        updateData.suggestions = [];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng cung cấp ít nhất một trường để cập nhật',
      });
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('nearbyProvinces', 'name image location')
      .populate('highlights') // Lấy toàn bộ thông tin của Suggestion trong highlights
      .populate('suggestions') // Lấy toàn bộ thông tin của Suggestion trong suggestions
      .lean();

    if (!updatedPlace) {
      return res.status(404).json({
        status: false,
        message: 'Địa điểm không tồn tại',
      });
    }

    // Truy vấn danh sách review cho từng suggestion trong highlights và suggestions
    // Xử lý highlights
    if (updatedPlace.highlights && Array.isArray(updatedPlace.highlights)) {
      for (let suggestion of updatedPlace.highlights) {
        const reviews = await mongoose.model('Review').find(
          { targetType: 'Suggestion', targetId: suggestion._id },
          'user review rating createdAt'
        ).populate('user', 'name');
        suggestion.reviews = reviews; // Thêm danh sách review vào suggestion
      }
    }

    // Xử lý suggestions
    if (updatedPlace.suggestions && Array.isArray(updatedPlace.suggestions)) {
      for (let suggestion of updatedPlace.suggestions) {
        const reviews = await mongoose.model('Review').find(
          { targetType: 'Suggestion', targetId: suggestion._id },
          'user review rating createdAt'
        ).populate('user', 'name');
        suggestion.reviews = reviews; // Thêm danh sách review vào suggestion
      }
    }

    res.status(200).json({
      status: true,
      message: 'Cập nhật địa điểm thành công',
      data: updatedPlace,
    });
  } catch (error) {
    return next(error);
  }
};

// Delete: Xóa địa điểm
exports.deletePlace = async (req, res, next) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) {
      return res.status(404).json({
        status: false,
        message: 'Địa điểm không tồn tại',
      });
    }

    // Cập nhật các địa điểm khác có tham chiếu đến địa điểm này trong nearbyProvinces
    await Place.updateMany(
      { nearbyProvinces: place._id },
      { $pull: { nearbyProvinces: place._id } }
    );

    // Xóa các Suggestion liên quan đến Place này
    const suggestions = await mongoose.model('Suggestion').find({ id_dia_diem: place._id });
    const suggestionIds = suggestions.map((s) => s._id);
    await mongoose.model('Suggestion').deleteMany({ id_dia_diem: place._id });

    // Xóa các Review liên quan đến các Suggestion bị xóa
    await mongoose.model('Review').deleteMany({
      targetType: 'Suggestion',
      targetId: { $in: suggestionIds },
    });

    res.status(200).json({
      status: true,
      message: 'Xóa địa điểm thành công',
    });
  } catch (error) {
    return next(error);
  }
};