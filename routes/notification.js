const route = require("express").Router()
const Notifications = require('../models/Notifications')
const auth = require("../middleware/auth")

route.get("/getNotifications", auth.verifyUser, async (req, res) => {
    try {
        const notifications = await Notifications.findAll()
        res.status(200).json({
            data: notifications,
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false,
        });
    }
}
)

route.get("/getIndividualNotifications", auth.verifyUser, async (req, res) => {
    try {
        const notifications = await Notifications.findAll({
            where: { belongsTo: userData.id },
            order: [['time', 'DESC']],
        });

        res.status(200).json({
            data: notifications,
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false,
        });
    }
});


route.patch("/updateSeen/:notificationId",auth.verifyUser, async (req, res) => {
    const { notificationId } = req.params;
    try {
        const notification = await Notifications.findByPk(notificationId);
        
        if (!notification) {
            return res.status(404).json({
                msg: "Notification not found",
                status: false,
            });
        }

        // Update the seen status to '1'
        await notification.update({ seen: '1' });

        res.status(200).json({
            msg: "Notification seen status updated successfully",
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false,
        });
    }
});


module.exports = route;