const User = require("../models/User");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password -createdAt");
        return res.json({
            success: false,
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const getUserById = async (req, res) => {
    const userId = req.params.userId;
    try {
        const byId = await User.findOne({ _id: userId });

        if (!byId) {
            return res.status(404).json({
                success: false,
                message: `Found no user with id ${userId}`
            });
        }

        return res.json({
            success: true,
            user: byId
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const getUserHouses = async (req, res) => {
    const userId = req.params.userId;

    try {

        const byId = await User.findById(userId).select("-password -updatedAt").populate("houses");
        if (!byId) {
            return res.status(404).json({
                success: false,
                message: `Found no user with id ${userId}`
            });
        }

        return res.json({
            success: true,
            user: {
                _id: byId._id,
                username: byId.username
            },
            houses: byId.houses.filter(house => !house.isDeleted)
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


module.exports = { getAllUsers, getUserById, getUserHouses };