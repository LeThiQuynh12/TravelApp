const express = require('express');
const app = express();
const port = 5003;

const dotenv = require('dotenv'); // Đọc biến môi trường từ file .env
const mongoose = require('mongoose'); // Kết nối MongoDB
const errorHandler = require('./middleware/errorHanding'); // Middleware xử lý lỗi
const authRoute = require('./routes/auth'); // Router xử lý auth (login/register)
const userRoute = require('./routes/user'); // Router xử lý user (thông tin người dùng)
//  Load biến môi trường từ file .env
dotenv.config();

//  Kết nối MongoDB bằng URI trong .env
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log(" Kết nối cơ sở dữ liệu thành công"))
    .catch((err) => console.log(" Lỗi kết nối DB:", err));

// Cho phép Express parse request body (JSON & form-data)
app.use(express.json({ limit: "10mb" })); // Giới hạn kích thước request body là 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//  Gắn các route từ authRoute với tiền tố '/api'
// Ví dụ: POST /api/register, POST /api/login
app.use('/api/', authRoute);
app.use('/api/users', userRoute); 


// Route mặc định test server
app.get('/', (req, res) => res.send('Hello World!'));


// Middleware xử lý lỗi - đặt CUỐI CÙNG để bắt tất cả lỗi từ các route phía trên
app.use(errorHandler);

//  Khởi chạy server
app.listen(process.env.PORT || port, () =>
    console.log(`Server đang chạy tại http://localhost:${process.env.PORT || port}`)
);
