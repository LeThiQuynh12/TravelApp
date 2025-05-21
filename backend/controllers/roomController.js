const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

// Create: Tạo mới phòng (hỗ trợ cả mảng)
exports.createRoom = async (req, res, next) => {
  try {
    // Nếu req.body là mảng, xử lý hàng loạt; nếu không, chuyển thành mảng 1 phần tử
    const roomsData = Array.isArray(req.body) ? req.body : [req.body];
    const createdRooms = [];

    for (const roomData of roomsData) {
      const { hotelid, name, capacity, bed, size, facilities, oldPrice, newPrice, images } = roomData;

      // Kiểm tra các trường bắt buộc
      if (!hotelid || !name || !capacity || !bed || !size || !facilities || !oldPrice || !newPrice || !images) {
        return res.status(400).json({
          status: false,
          message: 'Vui lòng cung cấp đầy đủ thông tin (hotelid, name, capacity, bed, size, facilities, oldPrice, newPrice, images)',
          missingFields: {
            hotelid: !hotelid,
            name: !name,
            capacity: !capacity,
            bed: !bed,
            size: !size,
            facilities: !facilities,
            oldPrice: !oldPrice,
            newPrice: !newPrice,
            images: !images,
          },
        });
      }

      // Kiểm tra khách sạn tồn tại
      const hotelExists = await Hotel.findById(hotelid);
      if (!hotelExists) {
        return res.status(404).json({
          status: false,
          message: 'Khách sạn không tồn tại',
        });
      }

      // Kiểm tra images là mảng và có ít nhất 1 hình ảnh
      if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({
          status: false,
          message: 'Images phải là một mảng và có ít nhất 1 hình ảnh',
        });
      }

      // Tạo phòng mới
      const newRoom = new Room({
        hotelid,
        name,
        capacity,
        bed,
        size,
        facilities,
        oldPrice,
        newPrice,
        images,
      });

      const savedRoom = await newRoom.save();
      createdRooms.push(savedRoom);
    }

    res.status(201).json({
      status: true,
      message: `Tạo thành công ${createdRooms.length} phòng`,
      data: createdRooms,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy danh sách phòng
exports.getRooms = async (req, res, next) => {
  try {
    const { hotelid } = req.query; // Lọc phòng theo khách sạn nếu có query

    const query = {};
    if (hotelid) query.hotelid = hotelid;

    const rooms = await Room.find(query).populate('hotelid');

    res.status(200).json({
      status: true,
      data: rooms,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy thông tin phòng theo ID
exports.getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotelid');
    if (!room) {
      return res.status(404).json({
        status: false,
        message: 'Phòng không tồn tại',
      });
    }

    res.status(200).json({
      status: true,
      data: room,
    });
  } catch (error) {
    return next(error);
  }
};

// Update: Cập nhật thông tin phòng
exports.updateRoom = async (req, res, next) => {
  try {
    const { name, capacity, bed, size, facilities, oldPrice, newPrice, images } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (capacity !== undefined) updateData.capacity = capacity;
    if (bed !== undefined) updateData.bed = bed;
    if (size !== undefined) updateData.size = size;
    if (facilities !== undefined) updateData.facilities = facilities;
    if (oldPrice !== undefined) updateData.oldPrice = oldPrice;
    if (newPrice !== undefined) updateData.newPrice = newPrice;
    if (images !== undefined) {
      if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({
          status: false,
          message: 'Images phải là một mảng và có ít nhất 1 hình ảnh',
        });
      }
      updateData.images = images;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng cung cấp ít nhất một trường để cập nhật',
      });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('hotelid');

    if (!updatedRoom) {
      return res.status(404).json({
        status: false,
        message: 'Phòng không tồn tại',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Cập nhật phòng thành công',
      data: updatedRoom,
    });
  } catch (error) {
    return next(error);
  }
};

// Delete: Xóa phòng
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({
        status: false,
        message: 'Phòng không tồn tại',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Xóa phòng thành công',
    });
  } catch (error) {
    return next(error);
  }
};

exports.getHotelByRoomId = async (req, res, next) => {
  try {
    const roomId = req.params.id;

    // Tìm phòng theo ID và populate thông tin khách sạn
    const room = await Room.findById(roomId).populate('hotelid');
    if (!room) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy phòng với ID này',
      });
    }

    const hotel = room.hotelid;
    if (!hotel) {
      return res.status(404).json({
        status: false,
        message: 'Phòng không liên kết với khách sạn nào',
      });
    }

    res.status(200).json({
      status: true,
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};