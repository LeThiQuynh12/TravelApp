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
        direction,
        tripId,
      } = flightData;

      // Kiểm tra các trường bắt buộc
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
        !logo ||
        !direction ||
        !tripId
      ) {
        return res.status(400).json({
          status: false,
          message: 'Vui lòng cung cấp đầy đủ thông tin (departureTime, arrivalTime, departureCity, departureName, arrivalCity, arrivalName, date, flightNumber, airline, ticketType, price, logo, direction, tripId)',
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
            direction: !direction,
            tripId: !tripId,
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
        direction,
        tripId,
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

    // Nhóm các chuyến bay theo tripId
    const groupedFlights = {};
    flights.forEach(flight => {
      if (!groupedFlights[flight.tripId]) {
        groupedFlights[flight.tripId] = {
          tripId: flight.tripId,
          outbound: null,
          return: null,
        };
      }
      if (flight.direction === 'outbound') {
        groupedFlights[flight.tripId].outbound = flight;
      } else if (flight.direction === 'return') {
        groupedFlights[flight.tripId].return = flight;
      }
    });

    const result = Object.values(groupedFlights);

    res.status(200).json({
      status: true,
      data: result,
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

// Read: Lấy chuyến bay theo tripId
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

    const result = {
      tripId,
      outbound: flights.find(f => f.direction === 'outbound') || null,
      return: flights.find(f => f.direction === 'return') || null,
    };

    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy danh sách tất cả chuyến bay chiều đi (outbound)
exports.getOutboundFlights = async (req, res, next) => {
  try {
    const outboundFlights = await Flight.find({ direction: 'outbound' }).lean();

    res.status(200).json({
      status: true,
      data: outboundFlights,
    });
  } catch (error) {
    return next(error);
  }
};

// Read: Lấy danh sách tất cả chuyến bay chiều về (return)
exports.getReturnFlights = async (req, res, next) => {
  try {
    const returnFlights = await Flight.find({ direction: 'return' }).lean();

    res.status(200).json({
      status: true,
      data: returnFlights,
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
      direction,
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
    if (direction !== undefined) updateData.direction = direction;
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



// -------------SEARCH ---
// Read: Tìm kiếm chuyến bay theo tiêu chí
exports.searchFlights = async (req, res, next) => {
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

    // Tìm các chuyến bay chiều đi
    const outboundFlights = await Flight.find({
      departureCity,
      arrivalCity,
      date: outboundDate,
      direction: 'outbound',
    }).lean();

    // Nếu không tìm thấy chuyến bay chiều đi
    if (!outboundFlights || outboundFlights.length === 0) {
      return res.status(404).json({
        status: false,
        message: `Không tìm thấy chuyến bay từ ${departureCity} đến ${arrivalCity} vào ngày ${outboundDate}`,
      });
    }

    // Nhóm các chuyến bay theo tripId
    const groupedFlights = {};

    // Thêm các chuyến bay chiều đi
    outboundFlights.forEach(flight => {
      groupedFlights[flight.tripId] = {
        tripId: flight.tripId,
        outbound: flight,
        return: null,
      };
    });

    // Nếu chọn khứ hồi, tìm các chuyến bay chiều về
    if (isRoundTrip === 'true') {
      const returnFlights = await Flight.find({
        departureCity: arrivalCity,
        arrivalCity: departureCity,
        date: returnDate,
        direction: 'return',
      }).lean();

      // Ghép các chuyến bay chiều về với chiều đi theo tripId
      returnFlights.forEach(flight => {
        if (groupedFlights[flight.tripId]) {
          groupedFlights[flight.tripId].return = flight;
        }
      });

      // Lọc bỏ các tripId không có chuyến về (nếu khứ hồi)
      const result = Object.values(groupedFlights).filter(flight => flight.return !== null);

      if (result.length === 0) {
        return res.status(404).json({
          status: false,
          message: `Không tìm thấy chuyến bay khứ hồi từ ${arrivalCity} về ${departureCity} vào ngày ${returnDate}`,
        });
      }

      return res.status(200).json({
        status: true,
        data: result,
      });
    }

    // Nếu không chọn khứ hồi, trả về tất cả các chuyến đi
    const result = Object.values(groupedFlights);

    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};


// Read: Lấy danh sách các thành phố duy nhất từ Flight
exports.getCities = async (req, res, next) => {
  try {
    // Sử dụng aggregation để lấy danh sách các departureCity và departureName duy nhất
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
          departureName: 1, // Sắp xếp theo tên thành phố
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