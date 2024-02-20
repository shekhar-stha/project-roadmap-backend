const route = require("express").Router()
const auth = require("../middleware/auth")
const Announcements = require('../models/Announcements');
const Notifications = require('../models/Notifications');
const Users = require("../models/Users");
require('dotenv').config();


// Assuming you have a route for posting announcements
route.post('/postAnnouncement', auth.verifyAdmin, async (req, res) => {
    try {

        // Create the announcement
        const announcement = await Announcements.create({
            ...req.body,
            createdBy: userData.id,
        });

        // Get the ID of the created announcement
        const announcementId = announcement.id;

        // Get all users
        const users = await Users.findAll();

        // Prepare data for bulkCreate
        const notificationsData = users.map((user) => ({
            notificationType: 'announcement',
            notificationTypeId: announcementId,
            notificationData: `New Announcement: "${announcement.title}"`,
            seen: '0',
            title: announcement.title,
            description: announcement.description,
            belongsTo: user.id,
        }));

        // Bulk create notifications
        await Notifications.bulkCreate(notificationsData);

        res.status(200).json({
            data: announcement.dataValues,
            status: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: error?.message,
            status: false,
        });
    }
});

route.get("/getAnnouncements",auth.verifyUser , async (req, res) => {
    try {
        const data = await Announcements.findAll({
            include: [{
                model: Users,
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp'] }
            }],
            order: [['id', 'DESC']]
        });
        res.status(200).json({ data: data, status: true })
    }
    catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false
        })
    }
})

route.get("/getAnnouncements/:announcementId", async (req, res) => {
    try {
        const data = await Announcements.findOne({
            where: { id: req.params.announcementId },
            include: [{
                model: Users,
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp'] }
            }],
            order: [['id', 'DESC']]
        });
        res.status(200).json({ data: data, status: true })
    }
    catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false
        })
    }
})
module.exports = route;