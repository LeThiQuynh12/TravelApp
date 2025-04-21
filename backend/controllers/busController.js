const mongoose = require('mongoose');
const Bus = require('../models/Bus');

// Hàm kiểm tra định dạng ngày DD/MM/YYYY
function isValidDateDDMMYYYY(dateStr) {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(dateStr)) return false;
  const [day, month, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
}

// Create: Tạo mới xe khách (Bus)
exports.createBus = async (req, res, next) => {
  try {
    const busesData = Array.isArray(req.body) ? req.body : [req.body];
    const createdBuses = [];

    for (const busData of busesData) {
      const {
        departureTime,
        arrivalTime,
        departureCity,
        departureName,
        arrivalCity,
        arrivalName,
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
        !departureTime ||
        !arrivalTime ||
        !departureCity ||
        !departureName ||
        !arrivalCity ||
        !arrivalName ||
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
          message: 'Vui lòng cung cấp đầy đủ thông tin (departureTime, arrivalTime, departureCity, departureName, arrivalCity, arrivalName, date, busCompany, ticketType, price, logo, seats, pickup, dropoff)',
          missingFields: {
            departureTime: !departureTime,
            arrivalTime: !arrivalTime,
            departureCity: !departureCity,
            departureName: !departureName,
            arrivalCity: !arrivalCity,
            arrivalName: !arrivalName,
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

      // Kiểm tra định dạng ngày
      if (!isValidDateDDMMYYYY(date)) {
        return res.status(400).json({
          status: false,
          message: 'date phải có định dạng DD/MM/YYYY và là ngày hợp lệ',
        });
      }

      // Tạo xe khách mới
      const newBus = new Bus({
        departureTime,
        arrivalTime,
        departureCity,
        departureName,
        arrivalCity,
        arrivalName,
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

    res.status(200).json({
      status: true,
      data: buses,
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

// Update: Cập nhật thông tin xe khách
exports.updateBus = async (req, res, next) => {
  try {
    const {
      departureTime,
      arrivalTime,
      departureCity,
      departureName,
      arrivalCity,
      arrivalName,
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
    if (departureTime !== undefined) updateData.departureTime = departureTime;
    if (arrivalTime !== undefined) updateData.arrivalTime = arrivalTime;
    if (departureCity !== undefined) updateData.departureCity = departureCity;
    if (departureName !== undefined) updateData.departureName = departureName;
    if (arrivalCity !== undefined) updateData.arrivalCity = arrivalCity;
    if (arrivalName !== undefined) updateData.arrivalName = arrivalName;
    if (date !== undefined) {
      if (!isValidDateDDMMYYYY(date)) {
        return res.status(400).json({
          status: false,
          message: 'date phải có định dạng DD/MM/YYYY và là ngày hợp lệ',
        });
      }
      updateData.date = date;
    }
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



exports.searchBuses = async (req, res) => {
  try {
    const { departureCity, arrivalCity, outboundDate, isRoundTrip, returnDate } = req.query;

    // Kiểm tra các trường bắt buộc
    if (!departureCity || !arrivalCity || !outboundDate) {
      return res.status(400).json({
        status: false,
        message: 'Thiếu tham số bắt buộc: departureCity, arrivalCity và outboundDate là bắt buộc',
      });
    }

    // Kiểm tra định dạng ngày (DD/MM/YYYY)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(outboundDate)) {
      return res.status(400).json({
        status: false,
        message: 'Định dạng outboundDate không hợp lệ. Sử dụng DD/MM/YYYY',
      });
    }

    if (isRoundTrip === 'true' && (!returnDate || !dateRegex.test(returnDate))) {
      return res.status(400).json({
        status: false,
        message: 'returnDate không hợp lệ hoặc thiếu cho chuyến khứ hồi. Sử dụng DD/MM/YYYY',
      });
    }

    // Tìm chuyến xe chiều đi
    const outboundBuses = await Bus.find({
      departureCity,
      arrivalCity,
      date: outboundDate,
    }).lean();

    if (!outboundBuses.length) {
      return res.status(200).json({
        status: true,
        data: [],
        message: `Không tìm thấy xe khách từ ${departureCity} đến ${arrivalCity} vào ngày ${outboundDate}`,
      });
    }

    // Nếu là chuyến một chiều
    if (isRoundTrip !== 'true') {
      return res.status(200).json({
        status: true,
        data: outboundBuses.map(bus => ({ buses: [bus] })),
      });
    }

    // Tìm chuyến xe chiều về
    const returnBuses = await Bus.find({
      departureCity: arrivalCity,
      arrivalCity: departureCity,
      date: returnDate,
    }).lean();

    if (!returnBuses.length) {
      return res.status(200).json({
        status: true,
        data: [],
        message: `Không tìm thấy xe khách khứ hồi từ ${arrivalCity} đến ${departureCity} vào ngày ${returnDate}`,
      });
    }

    // Tạo cặp khứ hồi
    const groupedBuses = outboundBuses.flatMap(outbound =>
      returnBuses.map(returnBus => ({
        buses: [outbound, returnBus],
      }))
    );

    return res.status(200).json({
      status: true,
      data: groupedBuses,
    });
  } catch (error) {
    console.error('Lỗi tìm kiếm xe khách:', error);
    return res.status(500).json({
      status: false,
      message: 'Lỗi máy chủ nội bộ khi tìm kiếm xe khách',
      error: error.message,
    });
  }
};

// Read: Lấy danh sách các thành phố duy nhất từ Bus
exports.getCities = async (req, res, next) => {
  try {
    const cities = await Bus.aggregate([
      {
        $group: {
          _id: {
            departureCity: '$departureCity',
            departureName: '$departureName',
          },
        },
      },
      {
        $project: {
          _id: 0,
          departureCity: '$_id.departureCity',
          departureName: '$_id.departureName',
        },
      },
      {
        $sort: {
          departureName: 1,
        },
      },
    ]);

    if (!cities || cities.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy thành phố nào',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Lấy danh sách thành phố thành công',
      data: cities,
    });
  } catch (error) {
    return next(error);
  }
};