const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const TaskTemplates = db.define("taskTemplates", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    templateName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = TaskTemplates;