const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const Tasks = db.define("tasks", {
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
    url: {
        type: DataTypes.STRING,
    },
    completionStatus: {
        type: DataTypes.ENUM("to-do", "in-progress", "completed"),
        allowNull: false,
    },
    deadline: {
        type: DataTypes.DATEONLY,
    },
    completionTime: {
        type: DataTypes.DATE,
    },
});

module.exports = Tasks;