const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const NotificationTypes = db.define("notificationTypes", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    label: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    dataId: {
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

module.exports = NotificationTypes;