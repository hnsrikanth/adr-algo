const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Session = sequelize.define('Session', {
  name: { type: DataTypes.STRING, allowNull: false }, // e.g., session or strategy name
  data: { type: DataTypes.JSON, allowNull: false }    // stores the whole strategy.json object
});

module.exports = Session;