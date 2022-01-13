const Comment = require("../models/Comment");
const House = require("../models/House");

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
            postedBy: userId
        });

        await newComment.save();

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
        }

        const comment = {
            ...newComment._doc
        };

        delete comment.isDeleted;

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
        const likedComment = await Comment.findById(commentId).select("-isDeleted");

        if (!likedComment) {
            return res.status(404).json({
                success: false,
                message: `Found no comment with id ${commentId}`
            });
        }

        if (!likedComment.likedBy.includes(req.userId)) {
            likedComment.likedBy.push(req.userId);
            await likedComment.save();
        }

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
        const unlikedComment = await Comment.findById(commentId).select("-isDeleted");

        if (!unlikedComment) {
            return res.status(404).json({
                success: false,
                message: `Found no comment with id ${commentId}`
            });
        }

        unlikedComment.likedBy.pull(req.userId);
        await unlikedComment.save();

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

        if (commentById.postedBy.toString() !== req.userId) {
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

        editedComment = await Comment.findByIdAndUpdate(editCondition, editedComment, {new: true});

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

        if (commentById.postedBy.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
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
            commentId: deletedComment._id
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