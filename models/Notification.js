const mongoose = require('mongoose');
const { NOTIFICATION_COLLECTION, USER_COLLECTION } = require('./modelUtils');
const Schema = mongoose.Schema;

const Notification = new Schema({
    content: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: USER_COLLECTION
    }
}, {
    timestamps: true
});


module.exports = mongoose.model(NOTIFICATION_COLLECTION, Notification);