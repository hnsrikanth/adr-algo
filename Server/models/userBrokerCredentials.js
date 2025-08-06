// models/UserBrokerCredentials.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserBrokerCredentials = sequelize.define('UserBrokerCredentials', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	User: { type: DataTypes.STRING, allowNull: true },
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
		{
            unique: true,
            fields: ["User"], // Composite unique key
        },
    ],
});

module.exports = UserBrokerCredentials;
