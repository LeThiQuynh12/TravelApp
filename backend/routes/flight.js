const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

// Create flight
router.post('/flights', flightController.createFlight);

// Get all flights (grouped by tripId)
router.get('/flights', flightController.getAllFlights);

// Get all outbound flights
router.get('/flights/outbound', flightController.getOutboundFlights);

// Get all return flights
router.get('/flights/return', flightController.getReturnFlights);

// Search flights by criteria
router.get('/flights/search', flightController.searchFlights);

// Route mới để lấy danh sách thành phố
router.get('/cities', flightController.getCities);

// Get flights by tripId
router.get('/flights/trip/:tripId', flightController.getFlightsByTripId);

// Get flight by ID
router.get('/flights/:id', flightController.getFlightById);

// Update flight
router.put('/flights/:id', flightController.updateFlight);

// Delete flight
router.delete('/flights/:id', flightController.deleteFlight);

module.exports = router;