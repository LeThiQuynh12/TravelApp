const mongoose = require('mongoose');
const Flight = require('../models/Flight');

// Create: Tạo mới chuyến bay (Flight)
exports.createFlight = async (req, res, next) => {
  try {
    const flightsData = Array.isArray(req.body) ? req.body : [req.body];
    const createdFlights = [];

    for (const flightData of flightsData) {
      const {
        departureTime,
        arrivalTime,
        departureCity,
        departureName,
        arrivalCity,
        arrivalName,
        date,
        flightNumber,
        airline,
        ticketType,
        price,
        logo,
        tripId, // tripId không còn bắt buộc
      } = flightData;

      // Kiểm tra các trường bắt buộc (loại bỏ tripId)
      if (
        !departureTime ||
        !arrivalTime ||
        !departureCity ||
        !departureName ||
        !arrivalCity ||
        !arrivalName ||
        !date ||
        !flightNumber ||
        !airline ||
        !ticketType ||
        !price ||
        !logo
      ) {
        return res.status(400).json({
          status: false,
          message: 'Vui lòng cung cấp đầy đủ thông tin (departureTime, arrivalTime, departureCity, departureName, arrivalCity, arrivalName, date, flightNumber, airline, ticketType, price, logo)',
          missingFields: {
            departureTime: !departureTime,
            arrivalTime: !arrivalTime,
            departureCity: !departureCity,
            departureName: !departureName,
            arrivalCity: !arrivalCity,
            arrivalName: !arrivalName,
            date: !date,
            flightNumber: !flightNumber,
            airline: !airline,
            ticketType: !ticketType,
            price: !price,
            logo: !logo,
          },
        });
      }

      // Tạo chuyến bay mới
      const newFlight = new Flight({
        departureTime,
        arrivalTime,
        departureCity,
        departureName,
        arrivalCity,
        arrivalName,
        date,
        flightNumber,
        airline,
        ticketType,
        price,
        logo,
        tripId: tripId || null, // tripId là tùy chọn, mặc định là null
      });

      const savedFlight = await newFlight.save();
      createdFlights.push(savedFlight);
    }

    res.status(201).json({
      status: true,
      message: `Tạo thành công ${createdFlights.length} chuyến bay`,
      data: createdFlights,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy danh sách tất cả chuyến bay
exports.getAllFlights = async (req, res, next) => {
  try {
    const flights = await Flight.find().lean();

    // Trả về tất cả chuyến bay mà không nhóm theo tripId
    res.status(200).json({
      status: true,
      data: flights,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy thông tin chuyến bay theo ID
exports.getFlightById = async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id).lean();

    if (!flight) {
      return res.status(404).json({
        status: false,
        message: 'Chuyến bay không tồn tại',
      });
    }

    res.status(200).json({
      status: true,
      data: flight,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy chuyến bay theo tripId (giữ lại để tương thích với dữ liệu cũ)
exports.getFlightsByTripId = async (req, res, next) => {
  try {
    const tripId = req.params.tripId;
    const flights = await Flight.find({ tripId }).lean();

    if (!flights || flights.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy chuyến bay cho tripId này',
      });
    }

    res.status(200).json({
      status: true,
      data: {
        tripId,
        flights,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Update: Cập nhật thông tin chuyến bay
exports.updateFlight = async (req, res, next) => {
  try {
    const {
      departureTime,
      arrivalTime,
      departureCity,
      departureName,
      arrivalCity,
      arrivalName,
      date,
      flightNumber,
      airline,
      ticketType,
      price,
      logo,
      tripId,
    } = req.body;

    const updateData = {};
    if (departureTime !== undefined) updateData.departureTime = departureTime;
    if (arrivalTime !== undefined) updateData.arrivalTime = arrivalTime;
    if (departureCity !== undefined) updateData.departureCity = departureCity;
    if (departureName !== undefined) updateData.departureName = departureName;
    if (arrivalCity !== undefined) updateData.arrivalCity = arrivalCity;
    if (arrivalName !== undefined) updateData.arrivalName = arrivalName;
    if (date !== undefined) updateData.date = date;
    if (flightNumber !== undefined) updateData.flightNumber = flightNumber;
    if (airline !== undefined) updateData.airline = airline;
    if (ticketType !== undefined) updateData.ticketType = ticketType;
    if (price !== undefined) updateData.price = price;
    if (logo !== undefined) updateData.logo = logo;
    if (tripId !== undefined) updateData.tripId = tripId;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng cung cấp ít nhất một trường để cập nhật',
      });
    }

    const updatedFlight = await Flight.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedFlight) {
      return res.status(404).json({
        status: false,
        message: 'Chuyến bay không tồn tại',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Cập nhật chuyến bay thành công',
      data: updatedFlight,
    });
  } catch (error) {
    return next(error);
  }
};

// Delete: Xóa chuyến bay
exports.deleteFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({
        status: false,
        message: 'Chuyến bay không tồn tại',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Xóa chuyến bay thành công',
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Tìm kiếm chuyến bay theo tiêu chí

exports.searchFlights = async (req, res, next) => {
  try {
    const { departureCity, arrivalCity, outboundDate, isRoundTrip, returnDate } = req.query;

    if (!departureCity || !arrivalCity || !outboundDate) {
      return res.status(400).json({
        status: false,
        message: 'Missing required parameters: departureCity, arrivalCity, and outboundDate are required',
      });
    }

    // Validate date format (assuming DD/MM/YYYY)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(outboundDate)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid outboundDate format. Use DD/MM/YYYY',
      });
    }
    if (isRoundTrip === 'true' && (!returnDate || !dateRegex.test(returnDate))) {
      return res.status(400).json({
        status: false,
        message: 'Invalid or missing returnDate for round trip. Use DD/MM/YYYY',
      });
    }

    const outboundFlights = await Flight.find({
      departureCity,
      arrivalCity,
      date: outboundDate,
    }).lean();

    if (!outboundFlights.length) {
      return res.status(200).json({
        status: true,
        data: [],
        message: `No flights found from ${departureCity} to ${arrivalCity} on ${outboundDate}`,
      });
    }

    if (isRoundTrip !== 'true') {
      return res.status(200).json({
        status: true,
        data: outboundFlights.map(flight => ({ flights: [flight] })),
      });
    }

    const returnFlights = await Flight.find({
      departureCity: arrivalCity,
      arrivalCity: departureCity,
      date: returnDate,
    }).lean();

    if (!returnFlights.length) {
      return res.status(200).json({
        status: true,
        data: [],
        message: `No return flights found from ${arrivalCity} to ${departureCity} on ${returnDate}`,
      });
    }

    const groupedFlights = outboundFlights.flatMap(outbound =>
      returnFlights.map(returnFlight => ({
        flights: [outbound, returnFlight],
      }))
    );

    res.status(200).json({
      status: true,
      data: groupedFlights,
    });
  } catch (error) {
    console.error('Search flights error:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error while searching flights',
      error: error.message,
    });
  }
};

// Read: Lấy danh sách các thành phố duy nhất từ Flight
exports.getCities = async (req, res, next) => {
  try {
    const cities = await Flight.aggregate([
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