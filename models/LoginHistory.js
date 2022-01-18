const mongoose = require('mongoose');
const { LOGIN_HISTORY_COLLECTION, USER_COLLECTION } = require('./modelUtils');
const Schema = mongoose.Schema;

const LoginHistory = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: USER_COLLECTION
    },
    device: {
        type: String,
    },
    loginAt: {
        type: Date,
        default: Date.now()
    },
    loginNo: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model(LOGIN_HISTORY_COLLECTION, LoginHistory);
