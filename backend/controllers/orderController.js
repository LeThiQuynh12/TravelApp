const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { total_amount, service_id, service_type, service_name, user_id, fullName, phoneNumber, email, paymentMethod, status } = req.body;

    if (!total_amount || !service_id || !service_type || !user_id || !paymentMethod) {
      return res.status(400).json({ status: 'error', message: 'Thiếu trường bắt buộc' });
    }

    const amount = Number(total_amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ status: 'error', message: 'Số tiền không hợp lệ' });
    }

    const orderId = 'ORD' + Date.now();

    // Tạo đơn hàng mới
    const order = new Order({
      order_id: orderId,
      total_amount: amount,
      service_id,
      service_type,
      service_name: service_name || 'Đặt phòng khách sạn',
      user_id,
      customer_name: fullName || '',
      customer_phone: phoneNumber || '',
      customer_email: email || '',
      payment_method: paymentMethod, // ví dụ: 'MB Bank' hoặc 'MoMo'
      status: status || 'paid', // trạng thái mặc định 'paid' hoặc có thể truyền vào
      created_at: new Date(),
      updated_at: new Date(),
    });

    await order.save();

    return res.json({ status: 'success', data: order });
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    return res.status(500).json({ status: 'error', message: 'Lỗi máy chủ: ' + error.message });
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
// Bổ sung controller lấy đơn hàng theo order_id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ order_id: req.params.id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết đơn hàng', error: err.message });
  }
};

// Bổ sung controller xóa đơn hàng theo order_id
exports.deleteOrderById = async (req, res) => {
  try {
    const result = await Order.deleteOne({ order_id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng để xóa' });
    }
    res.json({ success: true, message: 'Đã xóa đơn hàng' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi xóa đơn hàng', error: err.message });
  }
};