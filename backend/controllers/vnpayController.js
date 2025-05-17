const crypto = require('crypto');
const Order = require('../models/Order');

exports.createPayment = async (req, res) => {
  try {
    const { total_amount, service_id, service_type,service_name, user_id } = req.body;

    if (!total_amount || !service_id || !service_type || !user_id) {
      return res.status(400).json({ status: 'error', message: 'Thiếu trường bắt buộc' });
    }

    const amount = Number(total_amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ status: 'error', message: 'Số tiền không hợp lệ' });
    }

    const orderId = 'ORD' + Date.now();

    // Lưu đơn hàng vào CSDL
    const order = new Order({
      order_id: orderId,
      total_amount: amount,
      service_id,
      service_type,
      service_name,
      user_id,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    });
    await order.save();

    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: process.env.VNP_TMN_CODE,
      vnp_Amount: amount * 100,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan don hang #${orderId}`,
      vnp_OrderType: 'billpayment',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: process.env.VNP_RETURN_URL,
      vnp_IpAddr: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
      vnp_CreateDate: new Date().toISOString().replace(/[-:TZ]/g, '').slice(0, 14),
    };

    // Tạo chuỗi ký
    const signParams = { ...vnp_Params };
    const sortedKeys = Object.keys(signParams).sort();
    const signData = sortedKeys
      .map((key) => `${key}=${encodeURIComponent(signParams[key]).replace(/%20/g, '+')}`)
      .join('&');

    const secureHash = crypto
      .createHmac('sha512', process.env.VNP_HASH_SECRET.trim())
      .update(signData)
      .digest('hex');

    const query = sortedKeys
      .map((key) => `${key}=${encodeURIComponent(vnp_Params[key]).replace(/%20/g, '+')}`)
      .join('&');

    const paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${query}&vnp_SecureHash=${secureHash}`;

    return res.json({ status: 'success', payment_url: paymentUrl });
  } catch (error) {
    console.error('Lỗi khi tạo thanh toán:', error);
    return res.status(500).json({ status: 'error', message: 'Lỗi máy chủ: ' + error.message });
  }
};



exports.vnpayReturn = async (req, res) => {
  try {
    const vnpParams = { ...req.query };

    // Lấy chữ ký VNPAY gửi kèm
    const vnpSecureHash = vnpParams.vnp_SecureHash;

    // Xóa các trường không dùng để tạo chữ ký
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    // Sắp xếp lại tham số theo key alphabet
    const sortedKeys = Object.keys(vnpParams).sort();

    // Tạo chuỗi dữ liệu để tạo chữ ký, mã hóa giá trị
    const signData = sortedKeys
      .map(key => `${key}=${encodeURIComponent(vnpParams[key]).replace(/%20/g, '+')}`)
      .join('&');

    // Log để debug
    console.log('vnpParams:', vnpParams);
    console.log('signData:', signData);
    console.log('vnp_SecureHash:', vnpSecureHash);

    // Tạo hash HMAC SHA512 với secret key
    const secretKey = process.env.VNP_HASH_SECRET;
    const computedHash = crypto.createHmac('sha512', secretKey).update(signData).digest('hex');

    console.log('computedHash:', computedHash);

    // So sánh hash gửi từ VNPAY với hash tự tính
    if (vnpSecureHash === computedHash) {
      if (vnpParams.vnp_ResponseCode === '00') {
        await Order.updateOne(
          { order_id: vnpParams.vnp_TxnRef },
          {
            $set: {
              status: 'paid',
              vnp_Response: vnpParams,
              updated_at: new Date(),
            },
          }
        );
         return res.redirect(`http://localhost/Luxgo_travel/thanhtoan`);
      } else {
        return res.redirect(`http://localhost/Luxgo_travel/thanhtoan`);
      }
    } else {
      console.error('Chữ ký không hợp lệ:', { vnpSecureHash, computedHash });
      return res.status(400).send('Chữ ký không hợp lệ.');
    }
  } catch (error) {
    console.error('Lỗi xử lý callback VNPAY:', error);
    return res.status(500).send('Lỗi máy chủ.');
  }
};

