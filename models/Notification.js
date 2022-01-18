const mongoose = require('mongoose');
const { NOTIFICATION_COLLECTION, USER_COLLECTION } = require('./modelUtils');
const Schema = mongoose.Schema;

const Notification = new Schema({
    content: {
        type: String,
        required: true
    },
    trigger: {
        type: mongoose.Types.ObjectId,
        ref: USER_COLLECTION
    },
    isRead: {
        type: Boolean,
        default: false
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: USER_COLLECTION
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    loginAt: {
        type: Date,
        default: new Date()
    }
});


module.exports = mongoose.model(NOTIFICATION_COLLECTION, Notification);