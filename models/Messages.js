const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const Messages = db.define("messages", {
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
    messageText: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    readStatus: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
    },
});

module.exports = Messages;