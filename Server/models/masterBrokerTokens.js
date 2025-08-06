// models/UserBrokerCredentials.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MasterBrokerTokens = sequelize.define('MasterBrokerTokens', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	Broker: { type: DataTypes.STRING, allowNull: true },
	RequestToken: { type: DataTypes.STRING, allowNull: true },
	AccessToken: { type: DataTypes.STRING, allowNull: true },
}, {
	timestamps: false,
	indexes: [
        {
            unique: true,
            fields: ["Broker"], // Composite unique key
        },
    ],
});

module.exports = MasterBrokerTokens;
