const mongoose = require('mongoose');
const Suggestion = require('../models/Suggestion');

// Create: Tạo mới gợi ý (Suggestion)
exports.createSuggestion = async (req, res, next) => {
  try {
    const suggestionsData = Array.isArray(req.body) ? req.body : [req.body];
    const createdSuggestions = [];

    for (const suggestionData of suggestionsData) {
      const {
        id_dia_diem,
        name,
        address,
        image,
        description,
        rating,
        introduction,
        ticket_prices,
        notes,
        map,
      } = suggestionData;

      // Kiểm tra các trường bắt buộc
      if (
        !id_dia_diem ||
        !name ||
        !address ||
        !description ||
        !introduction ||
        !ticket_prices ||
        !map ||
        map.latitude === undefined ||
        map.longitude === undefined
      ) {
        return res.status(400).json({
          status: false,
          message:
            'Vui lòng cung cấp đầy đủ thông tin (id_dia_diem, name, address, description, introduction, ticket_prices, map.latitude, map.longitude)',
          missingFields: {
            id_dia_diem: !id_dia_diem,
            name: !name,
            address: !address,
            description: !description,
            introduction: !introduction,
            ticket_prices: !ticket_prices,
            map: !map,
            'map.latitude': map?.latitude === undefined,
            'map.longitude': map?.longitude === undefined,
          },
        });
      }

      // Kiểm tra Place (id_dia_diem) có tồn tại không
      const place = await mongoose.model('Place').findById(id_dia_diem);
      if (!place) {
        return res.status(400).json({
          status: false,
          message: 'Địa điểm (id_dia_diem) không tồn tại',
        });
      }

      // Tạo gợi ý mới
      const newSuggestion = new Suggestion({
        id_dia_diem,
        name,
        address,
        image: image || 'https://via.placeholder.com/150',
        description,
        rating: rating || 0,
        review: 0, // Số lượng review sẽ được cập nhật bởi hook trong Review
        introduction,
        ticket_prices,
        notes: notes || '',
        map: {
          latitude: map.latitude,
          longitude: map.longitude,
        },
      });

      const savedSuggestion = await newSuggestion.save();
      createdSuggestions.push(savedSuggestion);
    }

    res.status(201).json({
      status: true,
      message: `Tạo thành công ${createdSuggestions.length} gợi ý`,
      data: createdSuggestions,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy danh sách tất cả gợi ý
exports.getAllSuggestions = async (req, res, next) => {
  try {
    const suggestions = await Suggestion.find()
      .populate('id_dia_diem', 'name image')
      .lean();

    // Truy vấn danh sách review cho từng suggestion
    for (let suggestion of suggestions) {
      const reviews = await mongoose.model('Review').find(
        { targetType: 'Suggestion', targetId: suggestion._id },
        'user review rating createdAt'
      ).populate('user', 'name');
      suggestion.reviews = reviews; // Thêm danh sách review vào suggestion
    }

    res.status(200).json({
      status: true,
      data: suggestions,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy thông tin gợi ý theo ID
exports.getSuggestionById = async (req, res, next) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id)
      .populate('id_dia_diem', 'name image')
      .lean();

    if (!suggestion) {
      return res.status(404).json({
        status: false,
        message: 'Gợi ý không tồn tại',
      });
    }

    // Truy vấn danh sách review cho suggestion
    const reviews = await mongoose.model('Review').find(
      { targetType: 'Suggestion', targetId: suggestion._id },
      'user review rating createdAt'
    ).populate('user', 'name');
    suggestion.reviews = reviews;

    res.status(200).json({
      status: true,
      data: suggestion,
    });
  } catch (error) {
    return next(error);
  }
};

// Update: Cập nhật thông tin gợi ý
exports.updateSuggestion = async (req, res, next) => {
  try {
    const {
      id_dia_diem,
      name,
      address,
      image,
      description,
      introduction,
      ticket_prices,
      notes,
      map,
    } = req.body;

    const updateData = {};
    if (id_dia_diem !== undefined) {
      const place = await mongoose.model('Place').findById(id_dia_diem);
      if (!place) {
        return res.status(400).json({
          status: false,
          message: 'Địa điểm (id_dia_diem) không tồn tại',
        });
      }
      updateData.id_dia_diem = id_dia_diem;
    }
    if (name !== undefined) updateData.name = name;
    if (address !== undefined) updateData.address = address;
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;
    if (introduction !== undefined) updateData.introduction = introduction;
    if (ticket_prices !== undefined) updateData.ticket_prices = ticket_prices;
    if (notes !== undefined) updateData.notes = notes;
    if (map) {
      updateData.map = {
        latitude: map.latitude,
        longitude: map.longitude,
      };
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng cung cấp ít nhất một trường để cập nhật',
      });
    }

    const updatedSuggestion = await Suggestion.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('id_dia_diem', 'name image')
      .lean();

    if (!updatedSuggestion) {
      return res.status(404).json({
        status: false,
        message: 'Gợi ý không tồn tại',
      });
    }

    // Truy vấn danh sách review cho suggestion
    const reviews = await mongoose.model('Review').find(
      { targetType: 'Suggestion', targetId: updatedSuggestion._id },
      'user review rating createdAt'
    ).populate('user', 'name');
    updatedSuggestion.reviews = reviews;

    res.status(200).json({
      status: true,
      message: 'Cập nhật gợi ý thành công',
      data: updatedSuggestion,
    });
  } catch (error) {
    return next(error);
  }
};

// Delete: Xóa gợi ý
exports.deleteSuggestion = async (req, res, next) => {
  try {
    const suggestion = await Suggestion.findByIdAndDelete(req.params.id);
    if (!suggestion) {
      return res.status(404).json({
        status: false,
        message: 'Gợi ý không tồn tại',
      });
    }

    // Cập nhật Place để xóa suggestion này khỏi highlights và suggestions
    await mongoose.model('Place').updateMany(
      { highlights: suggestion._id },
      { $pull: { highlights: suggestion._id } }
    );
    await mongoose.model('Place').updateMany(
      { suggestions: suggestion._id },
      { $pull: { suggestions: suggestion._id } }
    );

    // Xóa các review liên quan đến suggestion này
    await mongoose.model('Review').deleteMany({
      targetType: 'Suggestion',
      targetId: suggestion._id,
    });

    res.status(200).json({
      status: true,
      message: 'Xóa gợi ý thành công',
    });
  } catch (error) {
    return next(error);
  }
};