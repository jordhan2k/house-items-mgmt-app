const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
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
        const userId = decoded.userId;
        const username = decoded.username;
        const foundUser = await User.findOne({
            _id: userId,
            username: username
        });

        if (!foundUser) {
            return res.status(403).json({
                success: false,
                message: "User does not exist"
            });
        }

        req.userId = decoded.userId;
        req.username = decoded.username;
        next();
    } catch (error) {
        console.log(error)
        return res.status(403).json({
            success: false,
            message: "Invalid token"
        });
    }
}

module.exports = { verifyToken };