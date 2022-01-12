const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
        return res.status(401).json({
            success: false,
            message: "Access token not found!"
        });
    }
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid token"
        });
    }
}

module.exports = {verifyToken};