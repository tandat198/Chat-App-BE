const jwt = require("jsonwebtoken");
const { secretKey } = require('../config')

const authenticate = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) return res.status(500).json({ error: "Token is required" });
    try {
        const decoded = await jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error });
    }
};

module.exports = {
    authenticate
};
