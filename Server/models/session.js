const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Session = sequelize.define('Session', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }, // <-- add unique here
    data: { type: DataTypes.JSON, allowNull: true }
}, {
	timestamps: true
});

module.exports = Session;