const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { order_id, amount } = req.body;

    const order = new Order({
      order_id: order_id || 'ORD' + Date.now(),
      amount,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    });

    await order.save();

    const payment_url = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_OrderInfo=Thanh+toan+don+hang+${order.order_id}&vnp_Amount=${amount * 100}&vnp_TxnRef=${order.order_id}`;

    res.json({
      status: 'success',
      payment_url,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const { user_id } = req.query;
    const orders = await Order.find({ user_id }).sort({ created_at: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy đơn hàng', error: err.message });
  }
};
