const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  service_type: { type: String, enum: ['hotel', 'bus', 'flight'], required: true },
  service_id: { type: String, required: true },
  service_name: { type: String },
  total_amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  transaction_id: { type: String, default: null },
  payment_method: { type: String, default: 'vnpay' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
