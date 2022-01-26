const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const LoginHistory = require("../models/LoginHistory");
const House = require("../models/House");

const checkAuthStatus = async (req, res) => {
    const userId = req.userId;
    const username = req.username;

    try {
        const byId = await User.findOne({ _id: userId, username: username }).select("-password");
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
        return res.json({
            success: false,
            errors: errors.array(),
            message: "Invalid credentials."
        });
    }

    const { username, password, staySignedIn } = req.body;

    try {
        const byUsername = await User.findOne({ username: username });

        if (!byUsername) {
            return res.json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const passwordMatch = await bcryptjs.compare(password, byUsername.password);
        if (!passwordMatch) {
            return res.json({
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
            !staySignedIn && { expiresIn: 3600 * 2 });

        const histories = await LoginHistory.find({ user: byUsername._id });

        const newHistory = new LoginHistory(
            {
                user: byUsername._id,
                device: req.device.type,
                loginNo: histories.length + 1
            });

        await newHistory.save();

        return res.json({
            success: true,
            accessToken,
            loginSession: newHistory._id
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const register = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            success: false,
            errors: errors.array()
        });
    }

    const { username, password } = req.body;
    try {
        const byUsername = await User.findOne({ username: username });
        if (byUsername) {
            return res.json({
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

        const newHouse = new House({
            name: "My first house",
            user: newUser._id
        });
        await newHouse.save();
        newUser.houses.push(newHouse._id);

        await newUser.save();

        return res.json({
            success: true,
            accessToken,
            loginSession: newHistory._id
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const checkUsername = async (req, res) => {

    const { username } = req.query;

    try {
        if (username.length < 6) {
            return res.json({
                success: false,
                result: {
                    query: username,
                    message: "Invalid length"
                }
            });
        }

        const byUsername = await User.findOne({ username: username });

        if (byUsername) {
            return res.json({
                success: true,
                result: {
                    query: username,
                    isTaken: true,
                }
            });
        }

        return res.json({
            success: true,
            result: {
                query: username,
                isTaken: false
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = { checkAuthStatus, login, register, checkUsername };