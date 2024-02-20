const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const PlaylistVideos = db.define("playlistVideos", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    description: {
        type: DataTypes.TEXT,
    },
    videoTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    youtubeEmbededLink: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pdfLink: {
        type: DataTypes.STRING,
    },
});

module.exports = PlaylistVideos;