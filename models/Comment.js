const mongoose = require('mongoose');
const { COMMENT_COLLECTION, USER_COLLECTION, HOUSE_COLLECTION } = require('./modelUtils');
const Schema = mongoose.Schema;

const Comment = new Schema({
    content: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Types.ObjectId,
        ref: USER_COLLECTION
    },
    about: {
        type: mongoose.Types.ObjectId,
        ref: HOUSE_COLLECTION
    },
    repliedTo: {
        type: mongoose.Types.ObjectId,
        ref: COMMENT_COLLECTION
    },
    likedBy: [{
        type: mongoose.Types.ObjectId,
        ref: USER_COLLECTION
    }],
    replies: [{
        type: mongoose.Types.ObjectId,
        ref: COMMENT_COLLECTION
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    level: {
        type: 1 || 2,
        default: 1
    }

}, { timestamps: true });

module.exports = mongoose.model(COMMENT_COLLECTION, Comment);