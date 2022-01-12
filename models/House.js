const mongoose = require('mongoose');
const { HOUSE_COLLECTION, ITEM_COLLECTION, USER_COLLECTION } = require('./modelUtils');
const Schema = mongoose.Schema;

const House = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    address: {
        type: String,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: USER_COLLECTION
    },
    items: [{
        type: mongoose.Types.ObjectId,
        ref: ITEM_COLLECTION
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(HOUSE_COLLECTION, House);