const mongoose = require('mongoose');
const { ITEM_COLLECTION, HOUSE_COLLECTION } = require('./modelUtils');
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
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    purchaseDate: {
        type: String,
        required: true
    },
    function: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    warranty: {
        type: Number,
    },
    house: {
        type: mongoose.Types.ObjectId,
        ref: HOUSE_COLLECTION
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


module.exports = mongoose.model(ITEM_COLLECTION, Item);
