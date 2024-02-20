const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const Notifications = db.define("notifications", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    notificationType: {
        type: DataTypes.ENUM('project', 'task', 'announcement'),
        allowNull: false,
    },
    notificationTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    notificationData: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    seen: {
        type: DataTypes.ENUM('0', '1'),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = Notifications;