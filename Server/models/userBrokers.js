const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserBrokers = sequelize.define('UserBrokers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    User: { type: DataTypes.STRING, allowNull: true },
    Broker: { type: DataTypes.STRING, allowNull: true },
    ApiSecret: { type: DataTypes.STRING, allowNull: true },
    ApiKey: { type: DataTypes.STRING, allowNull: true },
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

module.exports = UserBrokers;
