// controllers/busController.js
const mongoose = require('mongoose');
const Bus = require('../models/Bus');

// Create: Tạo mới xe khách (Bus)
exports.createBus = async (req, res, next) => {
  try {
    const busesData = Array.isArray(req.body) ? req.body : [req.body];
    const createdBuses = [];

    for (const busData of busesData) {
      const {
        tripId,
        direction,
        departureTime,
        arrivalTime,
        departureCity,
        arrivalCity,
        date,
        busCompany,
        ticketType,
        price,
        logo,
        amenities,
        seats,
        pickup,
        dropoff,
        note,
      } = busData;

      // Kiểm tra các trường bắt buộc
      if (
        !tripId ||
        !direction ||
        !departureTime ||
        !arrivalTime ||
        !departureCity ||
        !arrivalCity ||
        !date ||
        !busCompany ||
        !ticketType ||
        !price ||
        !logo ||
        !seats ||
        !pickup ||
        !dropoff
      ) {
        return res.status(400).json({
          status: false,
          message: 'Vui lòng cung cấp đầy đủ thông tin (tripId, direction, departureTime, arrivalTime, departureCity, arrivalCity, date, busCompany, ticketType, price, logo, seats, pickup, dropoff)',
          missingFields: {
            tripId: !tripId,
            direction: !direction,
            departureTime: !departureTime,
            arrivalTime: !arrivalTime,
            departureCity: !departureCity,
            arrivalCity: !arrivalCity,
            date: !date,
            busCompany: !busCompany,
            ticketType: !ticketType,
            price: !price,
            logo: !logo,
            seats: !seats,
            pickup: !pickup,
            dropoff: !dropoff,
          },
        });
      }

      // Tạo xe khách mới
      const newBus = new Bus({
        tripId,
        direction,
        departureTime,
        arrivalTime,
        departureCity,
        arrivalCity,
        date,
        busCompany,
        ticketType,
        price,
        logo,
        amenities: amenities || [],
        seats,
        pickup,
        dropoff,
        note: note || [],
      });

      const savedBus = await newBus.save();
      createdBuses.push(savedBus);
    }

    res.status(201).json({
      status: true,
      message: `Tạo thành công ${createdBuses.length} xe khách`,
      data: createdBuses,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy danh sách tất cả xe khách
exports.getAllBuses = async (req, res, next) => {
  try {
    const buses = await Bus.find().lean();

    // Nhóm các xe khách theo tripId
    const groupedBuses = {};
    buses.forEach((bus) => {
      if (!groupedBuses[bus.tripId]) {
        groupedBuses[bus.tripId] = {
          tripId: bus.tripId,
          outbound: null,
          return: null,
        };
      }
      if (bus.direction === 'outbound') {
        groupedBuses[bus.tripId].outbound = bus;
      } else if (bus.direction === 'return') {
        groupedBuses[bus.tripId].return = bus;
      }
    });

    const result = Object.values(groupedBuses);

    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy thông tin xe khách theo ID
exports.getBusById = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id).lean();

    if (!bus) {
      return res.status(404).json({
        status: false,
        message: 'Xe khách không tồn tại',
      });
    }

    res.status(200).json({
      status: true,
      data: bus,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy xe khách theo tripId
exports.getBusesByTripId = async (req, res, next) => {
  try {
    const tripId = req.params.tripId;
    const buses = await Bus.find({ tripId }).lean();

    if (!buses || buses.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy xe khách cho tripId này',
      });
    }

    const result = {
      tripId,
      outbound: buses.find((b) => b.direction === 'outbound') || null,
      return: buses.find((b) => b.direction === 'return') || null,
    };

    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy danh sách tất cả xe khách chiều đi (outbound)
exports.getOutboundBuses = async (req, res, next) => {
  try {
    const outboundBuses = await Bus.find({ direction: 'outbound' }).lean();

    res.status(200).json({
      status: true,
      data: outboundBuses,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy danh sách tất cả xe khách chiều về (return)
exports.getReturnBuses = async (req, res, next) => {
  try {
    const returnBuses = await Bus.find({ direction: 'return' }).lean();

    res.status(200).json({
      status: true,
      data: returnBuses,
    });
  } catch (error) {
    return next(error);
  }
};

// Update: Cập nhật thông tin xe khách
exports.updateBus = async (req, res, next) => {
  try {
    const {
      tripId,
      direction,
      departureTime,
      arrivalTime,
      departureCity,
      arrivalCity,
      date,
      busCompany,
      ticketType,
      price,
      logo,
      amenities,
      seats,
      pickup,
      dropoff,
      note,
    } = req.body;

    const updateData = {};
    if (tripId !== undefined) updateData.tripId = tripId;
    if (direction !== undefined) updateData.direction = direction;
    if (departureTime !== undefined) updateData.departureTime = departureTime;
    if (arrivalTime !== undefined) updateData.arrivalTime = arrivalTime;
    if (departureCity !== undefined) updateData.departureCity = departureCity;
    if (arrivalCity !== undefined) updateData.arrivalCity = arrivalCity;
    if (date !== undefined) updateData.date = date;
    if (busCompany !== undefined) updateData.busCompany = busCompany;
    if (ticketType !== undefined) updateData.ticketType = ticketType;
    if (price !== undefined) updateData.price = price;
    if (logo !== undefined) updateData.logo = logo;
    if (amenities !== undefined) updateData.amenities = amenities;
    if (seats !== undefined) updateData.seats = seats;
    if (pickup !== undefined) updateData.pickup = pickup;
    if (dropoff !== undefined) updateData.dropoff = dropoff;
    if (note !== undefined) updateData.note = note;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng cung cấp ít nhất một trường để cập nhật',
      });
    }

    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedBus) {
      return res.status(404).json({
        status: false,
        message: 'Xe khách không tồn tại',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Cập nhật xe khách thành công',
      data: updatedBus,
    });
  } catch (error) {
    return next(error);
  }
};

// Delete: Xóa xe khách
exports.deleteBus = async (req, res, next) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) {
      return res.status(404).json({
        status: false,
        message: 'Xe khách không tồn tại',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Xóa xe khách thành công',
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Tìm kiếm xe khách theo tiêu chí
exports.searchBuses = async (req, res, next) => {
  try {
    const { departureCity, arrivalCity, outboundDate, isRoundTrip, returnDate } = req.query;

    // Kiểm tra các trường bắt buộc
    if (!departureCity || !arrivalCity || !outboundDate) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng cung cấp departureCity, arrivalCity và outboundDate',
      });
    }

    // Nếu chọn khứ hồi nhưng không có ngày về
    if (isRoundTrip === 'true' && !returnDate) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng cung cấp returnDate khi chọn khứ hồi',
      });
    }

    // Tìm các xe khách chiều đi
    const outboundBuses = await Bus.find({
      departureCity,
      arrivalCity,
      date: outboundDate,
      direction: 'outbound',
    }).lean();

    // Nếu không tìm thấy xe khách chiều đi
    if (!outboundBuses || outboundBuses.length === 0) {
      return res.status(404).json({
        status: false,
        message: `Không tìm thấy xe khách từ ${departureCity} đến ${arrivalCity} vào ngày ${outboundDate}`,
      });
    }

    // Nhóm các xe khách theo tripId
    const groupedBuses = {};

    // Thêm các xe khách chiều đi
    outboundBuses.forEach((bus) => {
      groupedBuses[bus.tripId] = {
        tripId: bus.tripId,
        outbound: bus,
        return: null,
      };
    });

    // Nếu chọn khứ hồi, tìm các xe khách chiều về
    if (isRoundTrip === 'true') {
      const returnBuses = await Bus.find({
        departureCity: arrivalCity,
        arrivalCity: departureCity,
        date: returnDate,
        direction: 'return',
      }).lean();

      // Ghép các xe khách chiều về với chiều đi theo tripId
      returnBuses.forEach((bus) => {
        if (groupedBuses[bus.tripId]) {
          groupedBuses[bus.tripId].return = bus;
        }
      });

      // Lọc bỏ các tripId không có chuyến về (nếu khứ hồi)
      const result = Object.values(groupedBuses).filter((bus) => bus.return !== null);

      if (result.length === 0) {
        return res.status(404).json({
          status: false,
          message: `Không tìm thấy xe khách khứ hồi từ ${arrivalCity} về ${departureCity} vào ngày ${returnDate}`,
        });
      }

      return res.status(200).json({
        status: true,
        data: result,
      });
    }

    // Nếu không chọn khứ hồi, trả về tất cả các chuyến đi
    const result = Object.values(groupedBuses);

    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy danh sách các thành phố duy nhất từ Bus
exports.getCities = async (req, res, next) => {
  try {
    // Sử dụng distinct để lấy danh sách departureCity duy nhất
    const cities = await Bus.distinct('departureCity');

    if (!cities || cities.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy thành phố nào',
      });
    }

    // Chuyển thành định dạng { departureCity } và sắp xếp
    const formattedCities = cities
      .map((city) => ({ departureCity: city }))
      .sort((a, b) => a.departureCity.localeCompare(b.departureCity));

    res.status(200).json({
      status: true,
      message: 'Lấy danh sách thành phố thành công',
      data: formattedCities,
    });
  } catch (error) {
    return next(error);
  }
};