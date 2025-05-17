const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

//  Tạo đơn hàng mới
router.post('/orders', async (req, res) => {
  try {
    const data = req.body;
    const order = new Order({
      order_id: 'ORD' + Date.now(),
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await order.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi tạo đơn hàng', error: err.message });
  }
});

//  Lấy đơn hàng theo user
router.get('/orders', async (req, res) => {
  try {
    const { user_id } = req.query;
    const orders = await Order.find({ user_id }).sort({ created_at: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy đơn hàng', error: err.message });
  }
});
// Lấy chi tiết đơn hàng theo ID
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ order_id: req.params.id });
    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết đơn hàng', error: err.message });
  }
});

// Xóa đơn hàng theo ID
router.delete('/orders/:id', async (req, res) => {
  try {
    const result = await Order.deleteOne({ order_id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng để xóa' });
    }
    res.json({ success: true, message: 'Đã xóa đơn hàng' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi xóa đơn hàng', error: err.message });
  }
});

// Cập nhật trạng thái đơn hàng khi thanh toán (callback từ VNPAY)
router.get('/orders/vnpay-return', async (req, res) => {
  try {
    const { vnp_TxnRef, vnp_TransactionNo, vnp_ResponseCode } = req.query;
    const status = vnp_ResponseCode === '00' ? 'paid' : 'failed';

    const order = await Order.findOneAndUpdate(
      { order_id: vnp_TxnRef },
      {
        $set: {
          status: status,
          transaction_id: vnp_TransactionNo,
          updated_at: new Date()
        }
      },
      { new: true }
    );

    if (!order) return res.status(404).send('Không tìm thấy đơn hàng');

    res.send(` Đơn hàng ${order.order_id} đã cập nhật trạng thái: ${status}`);
  } catch (err) {
    res.status(500).send('Lỗi xử lý callback thanh toán');
  }
});

module.exports = router;
