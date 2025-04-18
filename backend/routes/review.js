const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Create review
router.post('/reviews', reviewController.createReview);


// Route Multiple
router.post('/multiple', reviewController.createMultipleReviews);

// Get all reviews or filter by targetType and targetId
router.get('/reviews', reviewController.getReviews);

// Get review by ID
router.get('/reviews/:id', reviewController.getReviewById);

// Update review
router.put('/reviews/:id', reviewController.updateReview);

// Delete review
router.delete('/reviews/:id', reviewController.deleteReview);

module.exports = router;