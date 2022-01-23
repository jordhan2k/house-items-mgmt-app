const { validationResult } = require("express-validator");
const House = require("../models/House");
const Item = require("../models/Item");

const getItemById = async (req, res) => {
    const itemId = req.params.id;

    try {
        const itemById = await Item.findById(itemId).select("-isDeleted");

        if (!itemById || itemById.isDeleted) {
            return res.json({
                success: false,
                message: `Found no item with id ${itemId}`
            })
        }

        return res.json({
            success: true,
            item: itemById
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

const createItem = async (req, res) => {
    const errors = validationResult(req);
    const houseId = req.body.house;
    console.log(req.file);

    if (!errors.isEmpty()) {
        res.json({
            success: false,
            errors: errors.array()
        })
    }

    try {
        const targetedHouse = await House.findById(houseId);

        if (!targetedHouse) {
            return res.json({
                success: false,
                message: `Found no house with id ${houseId}`
            });
        }

        if (targetedHouse.user.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: `You have no permission to this house`
            })
        }

        const newItem = new Item({
            ...req.body,
            user: req.userId,
            image: req.file.destination.substring(1) + req.file.filename
        });

        await newItem.save();

        targetedHouse.items.push(newItem._id);
        await targetedHouse.save();

        const item = {
            ...newItem._doc,
            imagePrefix: `${req.protocol}://${req.get('host')}`
        };

        delete item.isDeleted;

        return res.json({
            success: true,
            message: "Item added",
            item
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const updateItem = async (req, res) => {
    const errors = validationResult(req);
    const itemId = req.params.id;
    const imageFile = req.file;

    if (!errors.isEmpty()) {
        res.json({
            success: false,
            errors: errors.array()
        })
    }

    try {
        const itemById = await Item.findById(itemId).select("-isDeleted");

        if (!itemById) {
            return res.json({
                success: false,
                message: `Found no item with id ${itemId}`
            })
        }

        if (itemById.user.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "You have no permission on this item"
            })
        }

        let updatedItem = {
            ...itemById._doc,
            ...req.body,
            image: imageFile ? (imageFile.destination.substring(1) + imageFile.filename) : req.body.image
        }

        const updateCondition = {
            _id: itemId,
            user: req.userId,
            house: req.body.house
        }

        updatedItem = await Item.findOneAndUpdate(updateCondition, updatedItem, { new: true }).select("-isDeleted");

        const item = {
            ...updatedItem._doc,
            imagePrefix: `${req.protocol}://${req.get('host')}`
        }

        return res.json({
            success: true,
            message: "Item updated",
            item
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const deleteItem = async (req, res) => {
    const itemId = req.params.id;
    const userId = req.userId;

    try {
        const itemById = await Item.findById(itemId);

        if (!itemById) {
            return res.json({
                success: false,
                message: `Found no item with id ${itemId}`
            })
        }

        if (itemById.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You have no permission on this item"
            })
        }

        const deleteCondition = {
            _id: itemId,
            user: userId,
            house: req.body.house
        }

        let deletedItem = {
            ...itemById._doc,
            isDeleted: true
        }

        deletedItem = await Item.findByIdAndUpdate(deleteCondition, deletedItem);

        return res.json({
            success: true,
            message: "You have dropped an item.",
            itemId: deletedItem._id
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = { getItemById, createItem, updateItem, deleteItem };