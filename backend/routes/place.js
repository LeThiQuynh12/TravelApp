const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');

// Create place
router.post('/places', placeController.createPlace);

// Get all places
router.get('/places', placeController.getAllPlaces);

// Get place by ID
router.get('/places/:id', placeController.getPlaceById);

// Update place
router.put('/places/:id', placeController.updatePlace);

// Delete place
router.delete('/places/:id', placeController.deletePlace);

module.exports = router;