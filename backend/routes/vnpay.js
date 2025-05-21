const express = require('express');
const router = express.Router();
const vnpayController = require('../controllers/vnpayController'); 

router.post('/createPayment', vnpayController.createPayment);
// Route nhận callback từ VNPay sau thanh toán
router.get('/vnpay-return', vnpayController.vnpayReturn);

module.exports = router;