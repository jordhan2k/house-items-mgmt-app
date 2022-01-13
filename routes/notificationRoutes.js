const { getLastLoginHandler, modifyNotificationHandler, getNotificationsHandler } = require('../controllers/notificationController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = require('express').Router();

/**
 * @route api/v1/notifications
 * @desc Get all notifications
 * @access PRIVATE
 */
router.get("/",
    verifyToken,
    getNotificationsHandler);

/**
 * @route api/v1/notifications/:id/:action
 * @desc Mark a notification as read or delete that notifications
 * @access PRIVATE
 */
router.put("/:id/:action",
    verifyToken,
    modifyNotificationHandler);

/**
 * @route api/v1/notifications/last-login
 * @desc Get last login infomation
 * @access PRIVATE
 */
router.get("/last-login",
    verifyToken,
    getLastLoginHandler);

module.exports = router;