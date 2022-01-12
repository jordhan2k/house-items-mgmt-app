const mongoose = require('mongoose');
const { USER_COLLECTION, LOGIN_HISTORY_COLLECTION, HOUSE_COLLECTION } = require('./modelUtils');
const Schema = mongoose.Schema;

const User = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            unique: true,
            required: true
        },
        houses: [{
            type: mongoose.Types.ObjectId,
            ref: HOUSE_COLLECTION
        }]
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model(USER_COLLECTION, User)