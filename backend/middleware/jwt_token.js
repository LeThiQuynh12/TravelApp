const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ status: false, message: "Token không hợp lệ" });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ status: false, message: "Yêu cầu cung cấp token" });
    }
};

module.exports = verifyToken;