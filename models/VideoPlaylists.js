const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const VideoPlaylists = db.define("videoPlaylists", {
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
    viewRestriction: {
        type: DataTypes.ENUM('both', 'supportAssitants', 'developers')
    },
});

module.exports = VideoPlaylists;