const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ADRLogs = sequelize.define('ADRLogs', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	startTime: { type: DataTypes.STRING, allowNull: true },
	type: { type: DataTypes.STRING, allowNull: true },
}, {
	timestamps: false,
});

module.exports = ADRLogs;