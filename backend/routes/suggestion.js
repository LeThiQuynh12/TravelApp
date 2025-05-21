const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestionController');

// Create suggestion
router.post('/suggestions', suggestionController.createSuggestion);

// Get all suggestions
router.get('/suggestions', suggestionController.getAllSuggestions);

// Get suggestion by ID
router.get('/suggestions/:id', suggestionController.getSuggestionById);

// Update suggestion
router.put('/suggestions/:id', suggestionController.updateSuggestion);

// Delete suggestion
router.delete('/suggestions/:id', suggestionController.deleteSuggestion);

module.exports = router; 