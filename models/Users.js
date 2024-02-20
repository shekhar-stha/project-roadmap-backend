const { DataTypes } = require("sequelize")
const db = require("../db/conn")

const Users = db.define("users", {
    id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        autoIncrement: true,
        primaryKey: true
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false,
        unique: [true, "please choose different email"]
    },
    username:{
        type: DataTypes.STRING,
        allowNull:false,
        unique: [true, "please choose different username"]
    },
    fullName:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    userType:{
        type: DataTypes.ENUM('admin','supportAssistant','developer', 'superadmin')
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false
    },
    confirmPassword:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    loginLast:{
        type: DataTypes.STRING,
    },
    photo:{
        type: DataTypes.STRING,
    },
    loginIp:{
        type: DataTypes.STRING,
    },
});

module.exports = Users;