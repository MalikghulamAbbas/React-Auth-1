const jwt = require("jsonwebtoken");
const Router = require("express").Router;

const ensureAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ message: "Unauthorized, JWT token is require" });
    }
    try {
        const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

module.exports = ensureAuth;