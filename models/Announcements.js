const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const Announcements = db.define("announcements", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    seenBy: {
        type: DataTypes.TEXT
    },
});

module.exports = Announcements;