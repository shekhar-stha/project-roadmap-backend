const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const Projects = db.define("projects", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    projectType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
    },
    githubLink: {
        type: DataTypes.STRING,
    },
    vercelLink: {
        type: DataTypes.STRING,
    },
    niftyLink: {
        type: DataTypes.STRING,
    },
    projectStatus: {
        type: DataTypes.ENUM('unassigned','building','submitted', 'testing', 'completed'),
        allowNull: false,
    },
    creationTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    deadline:{
        type: DataTypes.DATEONLY,
    },
    completionTime: {
        type: DataTypes.DATE,
    },

});

module.exports = Projects;