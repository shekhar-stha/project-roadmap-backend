const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const ProjectComments = db.define("projectComments", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    commentText: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    commentTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
});

module.exports = ProjectComments;