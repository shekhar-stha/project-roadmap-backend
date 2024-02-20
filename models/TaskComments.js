const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const TaskComments = db.define("taskComments", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    commentText: {
        type: DataTypes.TEXT,
    },
    commentTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
});

module.exports = TaskComments;