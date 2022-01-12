const House = require("../models/House");
const User = require("../models/User");

const getHouseById = async (req, res) => {
    const houseId = req.params.id;
    console.log(houseId);
    try {
        const byId = await House.findById(houseId);

        if (!byId || byId.isDeleted) {
            return res.status(404).json({
                success: false,
                message: `Found no house with id ${houseId}`
            });
        }

        return res.json({
            success: true,
            house: byId,
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
                image: `${req.protocol}://${req.get('host')}${newHouse.image}`
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
    const image = req.file;

    const updateCondition = {
        _id: houseId,
        user: req.userId
    }

    try {
        const byId = await House.findById(houseId);

        let updatedHouse = {
            ...byId._doc,
            name,
            address,
            image: image.destination.substring(1) + image.filename
        }

        updatedHouse = await House.findOneAndUpdate(updateCondition, updatedHouse, { new: true });

        return res.json({
            success: false,
            house: {
                ...updatedHouse._doc,
                image: `${req.protocol}://${req.get('host')}${updatedHouse.image}`
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

        let  deletedHouse = {
            ...byId._doc,
            isDeleted: true
        }

        deletedHouse = await House.findOneAndUpdate(deleteCondition, deletedHouse);

        return res.json({
            success: true,
            message: "You have dropped a house.",
            houseId:  deletedHouse._id
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = { getHouseById, createHouse, updateHouse, deleteHouse };