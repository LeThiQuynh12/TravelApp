const express = require('express');
const router = express.Router();
const vnpayController = require('../controllers/vnpayController'); 

router.post('/createPayment', vnpayController.createPayment);

module.exports = router;