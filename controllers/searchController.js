const House = require("../models/House");
const Item = require("../models/Item");
const User = require("../models/User");


const searchItemsHandler = async (req, res) => {
    const { name, location } = req.query;

    try {
        const items = await Item.find({ "name": { "$regex": name, "$options": "i" }, location: location });

        return res.json({
            success: true,
            items
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const searchHousesHandler = async (req, res) => {
    console.log("Hello housese");
    const { name } = req.query;

    try {
        const houses = await House.find({ "name": { "$regex": name, "$options": "i" } });

        return res.json({
            success: true,
            houses
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const searchUsersHandler = async (req, res) => {
    const { username } = req.query;

    try {
        const users = await User.find({ "username": { "$regex": username, "$options": "i" } }).select("-password -updatedAt");

        return res.json({
            success: true,
            result: {
                keyword: username,
                users,
                found: users.length
            }
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = {
    searchHousesHandler,
    searchItemsHandler,
    searchUsersHandler
};