const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const ProjectAssignees = db.define("projectAssignees", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
});

module.exports = ProjectAssignees;