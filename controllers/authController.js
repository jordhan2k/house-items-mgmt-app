const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const LoginHistory = require("../models/LoginHistory");

const checkAuthStatus = async (req, res) => {
    const userId = req.userId;

    try {
        const byId = await User.find({ _id: userId }).select("-password").populate("houses");

        if (!byId) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            message: "Authenticated",
            user: byId,
            device: req.device.type
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const login = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const { username, password } = req.body;

    try {
        const byUsername = await User.findOne({ username: username });

        if (!byUsername) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const passwordMatch = await bcryptjs.compare(password, byUsername.password);
        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const accessToken = jwt.sign(
            {
                userId: byUsername._id,
                username: byUsername.username
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: 3600 * 2 });

        const newHistory = new LoginHistory(
            {
                user: byUsername._id,
                device: req.device.type,
            });

        await newHistory.save();

        return res.json({
            success: true,
            accessToken
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const register = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const { username, password } = req.body;
    try {
        const byUsername = await User.findOne({ username: username });
        if (byUsername) {
            return res.status(400).json({
                success: false,
                message: "Username is already taken"
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        const accessToken = jwt.sign(
            {
                userId: newUser._id,
                username: newUser.username
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: 3600 * 2 });

        const newHistory = new LoginHistory(
            {
                user: newUser._id,
                device: req.device.type
            });

        await newHistory.save();

        return res.json({
            success: true,
            accessToken
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = { checkAuthStatus, login, register };