

const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const AssignedProjects = db.define("assignedProjects", {
    assignedTo: {
        type: DataTypes.INTEGER,
    },
    projectId: {
        type: DataTypes.INTEGER,
    },
}, { timestamps: false });

module.exports = AssignedProjects;