const {Sequelize } = require('sequelize')
require('dotenv').config();


const sequelize = new Sequelize(process.env.DATABSE_NAME, process.env.DATABSE_USERNAME, process.env.DATABSE_PASSWORD, {
    host: process.env.DATABSE_HOST,
    dialect: 'mysql'
  });

sequelize.authenticate().then(()=>{
  console.log('Connection has been established successfully.')
}).catch((err)=>{
  console.log('Unable to connect to the database:', err);
})


sequelize.sync({ force: false }).then(()=>{
  console.log("success db")
}).catch((err)=>{
  console.log(err)
})

module.exports = sequelize;