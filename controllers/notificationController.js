const LoginHistory = require("../models/LoginHistory");
const Notification = require("../models/Notification")

const READ = "read";
const DELETED = "delete";

const getNotificationsHandler = async (req, res) => {
    try {
        const notifications = await Notification.find({ receiver: req.userId }).sort({ "createdAt": -1 });
        return res.json({
            success: true,
            notifications
        })
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server error"
        })
    }
}


const modifyNotificationHandler = async (req, res) => {
    const notificationId = req.params.id;
    const action = req.params.action;

    try {
        const byId = await Notification.findById(notificationId);

        if (!byId) {
            return res.status(400).json({
                success: false,
                message: `Found no notification with id ${notificationId}`
            })
        }

        let updatedNotification;
        const updateCondition = {
            _id: notificationId,
            user: req.userId,
        }

        if (action === READ) {
            updatedNotification = {
                ...byId._doc,
                isRead: true
            }

        } else if (action === DELETED) {
            updatedNotification = {
                ...byId._doc,
                isDeleted: true
            }
        } else {
            return res.json({
                success: false,
                message: "Action is invalid"
            })
        }

        updatedNotification = await Notification.findOneAndUpdate(updateCondition, updatedNotification, { new: true });

        return res.json({
            success: true,
            action,
            notificationId
        })
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server error"
        })
    }

}

const getLastLoginHandler = async (req, res) => {

    try {
        const lastLogin = await LoginHistory.find({ user: req.userId }).sort({ "loginNo": -1 });

        return res.json({
            success: true,
            userId: req.userId,
            lastLogin: lastLogin[1]
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = {
    getNotificationsHandler,
    modifyNotificationHandler,
    getLastLoginHandler
}