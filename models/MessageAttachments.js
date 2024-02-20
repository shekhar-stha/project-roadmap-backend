const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const MessageAttachments = db.define("messageAttachments", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = MessageAttachments;