const Comment = require("../models/Comment");
const House = require("../models/House");
const Notification = require("../models/Notification");

const addCommentHandler = async (req, res) => {
    const { content, about, repliedTo, level } = req.body;
    const userId = req.userId;

    try {
        const houseById = await House.findById(about);

        if (!houseById) {
            return res.status(404).json({
                success: false,
                message: `Found no house with id ${about}`
            });
        }

        const newComment = new Comment({
            content,
            about,
            repliedTo,
            level,
            postedBy: { _id: userId, username: req.username }
        });

        await newComment.save();

        if (level === 1) {
            const notification = new Notification({
                content: `${req.username} commented on your house`,
                trigger: req.userId,
                receiver: houseById.user
            });

            await notification.save();
        }

        if (level === 2) {
            const repliedComment = await Comment.findById(repliedTo);
            if (!repliedComment || repliedComment.isDeleted) {
                return res.status(404).json({
                    success: false,
                    message: `You are replying to an unexisting comment with id ${repliedTo}`
                });
            }
            repliedComment.replies.push(newComment._id);
            repliedComment.save();
            const notification = new Notification({
                content: `${req.username} replied to your comment on house "${repliedComment.about.name}"`,
                trigger: req.userId,
                receiver: repliedComment.postedBy
            });
            await notification.save();
        }
        const comment = await Comment.findById(newComment._id).select("-isDeleted").populate("postedBy", "username");

        return res.json({
            success: true,
            comment
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Internal server error"
        });
    }
}

const likeCommentHandler = async (req, res) => {
    const commentId = req.params.id;

    try {
        let likedComment = await Comment.findById(commentId).select("-isDeleted");
        console.log(likedComment._doc);
        if (!likedComment) {
            return res.status(404).json({
                success: false,
                message: `Found no comment with id ${commentId}`
            });
        }

        if (!likedComment.likedBy.includes(req.userId)) {
            likedComment.likedBy.push(req.userId);
            await likedComment.save();

            const notification = new Notification({
                content: `${req.username} liked your comment on house "${likedComment.about.name}"`,
                trigger: req.userId,
                receiver: likedComment.postedBy
            });

            await notification.save();
        }

        likedComment = await Comment.findById(commentId).populate("replies");

        return res.json({
            success: true,
            comment: {
                ...likedComment._doc
            }
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: "Internal server error"
        });
    }
}

const unlikeCommentHandler = async (req, res) => {
    const commentId = req.params.id;

    try {
        let unlikedComment = await Comment.findById(commentId).select("-isDeleted");

        if (!unlikedComment) {
            return res.status(404).json({
                success: false,
                message: `Found no comment with id ${commentId}`
            });
        }

        unlikedComment.likedBy.pull(req.userId);
        await unlikedComment.save();

        unlikedComment = await Comment.findById(commentId).populate("replies");

        return res.json({
            success: true,
            comment: {
                ...unlikedComment._doc
            }
        })
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Internal server error"
        });
    }
}

const editCommentHandler = async (req, res) => {
    const commentId = req.params.id;

    try {
        const commentById = await Comment.findById(commentId).select("-isDeleted");

        if (commentById.postedBy._id.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: "You have no permission on this comment"
            });
        }

        const editCondition = {
            _id: commentId,
            about: req.body.about,
            postedBy: req.userId
        }

        let editedComment = {
            ...commentById._doc,
            ...req.body
        }

        editedComment = await Comment.findByIdAndUpdate(editCondition, editedComment, { new: true });
        editedComment = await Comment.findById(commentId).populate("replies");

        return res.json({
            success: true,
            message: "Comment deleted",
            comment: {
                ...editedComment._doc
            }
        })

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Internal server error"
        });
    }
}

const deleteCommentHandler = async (req, res) => {
    const commentId = req.params.id;

    try {
        const commentById = await Comment.findById(commentId);

        if (commentById.postedBy._id.toString() !== req.userId) {
            return res.json({
                success: false,
                yourId: req.userId,
                commentBy: commentById.postedBy._id.toString(),
                message: "You have no permission on this comment"
            });
        }

        const deleteCondition = {
            _id: commentId,
            about: req.body.about,
            postedBy: req.userId
        }

        let deletedComment = {
            ...commentById._doc,
            isDeleted: true
        }

        deletedComment = await Comment.findByIdAndUpdate(deleteCondition, deletedComment);

        return res.json({
            success: true,
            message: "Comment deleted",
            commentId: deletedComment._id,
            level: commentById.level
        })

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Internal server error"
        });
    }
}

const getCommentRepliesHandler = async (req, res) => {
}

module.exports = {
    likeCommentHandler,
    unlikeCommentHandler,
    editCommentHandler,
    deleteCommentHandler,
    getCommentRepliesHandler,
    addCommentHandler
};