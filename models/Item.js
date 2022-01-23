const mongoose = require('mongoose');
const { ITEM_COLLECTION, HOUSE_COLLECTION, USER_COLLECTION } = require('./modelUtils');
const Schema = mongoose.Schema;

const Item = new Schema({
    name: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    expireDate: {
        type: Date,
        required: true
    },
    purchaseDate: {
        type: Date,
    },
    location: {
        type: String,
        required: true
    },
    itemCode: {
        type: String,
    },
    itemFunction: {
        type: String,
        required: true
    },
    price: {
        type: Number,
    },
    house: {
        type: mongoose.Types.ObjectId,
        ref: HOUSE_COLLECTION
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: USER_COLLECTION
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});


module.exports = mongoose.model(ITEM_COLLECTION, Item);
