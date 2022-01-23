const Comment = require("../models/Comment");
const House = require("../models/House");
const User = require("../models/User");

const getHouseById = async (req, res) => {
    const houseId = req.params.id;
    console.log(houseId);
    try {
        const byId = await House.findById(houseId).select("-isDeleted").populate("items");

        if (!byId || byId.isDeleted) {
            return res.status(404).json({
                success: false,
                message: `Found no house with id ${houseId}`
            });
        }

        return res.json({
            success: true,
            house: byId,
            imagePrefix: `${req.protocol}://${req.get('host')}`
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

const createHouse = async (req, res) => {
    const { name, address } = req.body;
    const image = req.file;

    try {
        const newHouse = new House({
            name,
            address,
            image: image.destination.substring(1) + image.filename,
            user: req.userId
        });
        await newHouse.save();

        const userById = await User.findById(req.userId);
        userById.houses.push(newHouse._id);
        await userById.save();

        return res.json({
            success: true,
            message: "A new house added!",
            house: {
                ...newHouse._doc,
                image: newHouse.image,
                imagePrefix: `${req.protocol}://${req.get('host')}`
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const updateHouse = async (req, res) => {
    const houseId = req.params.id;
    const { name, address } = req.body;
    const imageFile = req.file;

    const updateCondition = {
        _id: houseId,
        user: req.userId
    }

    try {
        const byId = await House.findById(houseId);

        if (!byId) {
            return res.json({
                success: false,
                message: `Found no house with id ${houseId}`
            });
        }

        let updatedHouse = {
            ...byId._doc,
            name,
            address,
            image: imageFile ? (imageFile.destination.substring(1) + imageFile.filename) : req.body.image
        }

        updatedHouse = await House.findOneAndUpdate(updateCondition, updatedHouse, { new: true });

        return res.json({
            success: false,
            message: "House updated",
            house: {
                ...updatedHouse._doc,
                image: updatedHouse.image,
                imagePrefix: `${req.protocol}://${req.get('host')}`
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const deleteHouse = async (req, res) => {
    const houseId = req.params.id;

    const deleteCondition = {
        _id: houseId,
        user: req.userId
    }

    try {
        const byId = await House.findById(houseId);

        let deletedHouse = {
            ...byId._doc,
            isDeleted: true
        }

        deletedHouse = await House.findOneAndUpdate(deleteCondition, deletedHouse);

        return res.json({
            success: true,
            message: "You have dropped a house.",
            houseId: deletedHouse._id
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const getHouseItems = async (req, res) => {
    try {

    } catch (error) {

    }
}

const getHouseComments = async (req, res) => {
    const houseId = req.params.id;

    try {
        const houseById = await House.findById(houseId);
        if (!houseById || houseById.isDeleted) {
            return res.json({
                success: false,
                message: `Found no house with id ${houseId}`
            })
        }
        const criteria = ({
            about: houseById,
            level: 1
        });

        const commentsByHouseId = await Comment.find(criteria).sort({ "createdAt": -1 }).populate("replies");

        return res.json({
            success: true,
            house: houseId,
            comments: commentsByHouseId.filter(cmt => !cmt.isDeleted)
        })
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    getHouseById,
    createHouse,
    updateHouse,
    deleteHouse,
    getHouseItems,
    getHouseComments
};