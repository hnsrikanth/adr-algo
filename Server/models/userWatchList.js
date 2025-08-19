const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserWatchList = sequelize.define('UserWatchList', {
  id: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true 
  },
  instrumentToken: {
    type: DataTypes.STRING,
    allowNull: false
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  timestamps: true,
});

module.exports = UserWatchList;
