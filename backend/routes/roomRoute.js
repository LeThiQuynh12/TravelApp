const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Create room
router.post('/rooms', roomController.createRoom);

// Get all rooms or filter by hotelid
router.get('/rooms', roomController.getRooms);

// Get room by ID
router.get('/rooms/:id', roomController.getRoomById);

// Update room
router.put('/rooms/:id', roomController.updateRoom);

// Delete room
router.delete('/rooms/:id', roomController.deleteRoom);

router.get('/hotel-by-room/:id',roomController.getHotelByRoomId);

module.exports = router;