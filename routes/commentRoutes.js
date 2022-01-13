const { likeCommentHandler, unlikeCommentHandler, deleteCommentHandler, editCommentHandler, getCommentRepliesHandler, replyCommentHandler, addCommentHandler } = require('../controllers/commentController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = require('express').Router();

/**
 * @route PUT api/v1/comments/:id/like
 * @desc Like a comment
 * @access PRIVATE
 */
router.put("/:id/like",
    verifyToken,
    likeCommentHandler);

/**
 * @route PUT api/v1/comments/:id/unlike
 * @desc Unlike a comment
 * @access PRIVATE
 */
router.put("/:id/unlike",
    verifyToken,
    unlikeCommentHandler);

/**
 * @route PUT api/v1/comments/:id/delete
 * @desc Mark a comment as deleted
 * @access PRIVATE
 */
router.put("/:id/delete",
    verifyToken,
    deleteCommentHandler);

/**
 * @route PUT api/v1/comments/:id
 * @desc Edit a comment
 * @access PRIVATE
 */
router.put("/:id",
    verifyToken,
    editCommentHandler);

/**
 * @route GET api/v1/comments/:id/replies
 * @desc Get all replies of a comment
 * @access PUBLIC
 */
router.get("/:id/replies", getCommentRepliesHandler);

/**
 * @route POST api/v1/comments/:id/reply
 * @desc Reply to a comment
 * @access PRIVATE
 */
router.post("/",
    verifyToken,
    addCommentHandler);

module.exports = router;