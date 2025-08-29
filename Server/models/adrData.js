const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AdrData = sequelize.define("adr_data", {
    date: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    market_open: { type: DataTypes.FLOAT, allowNull: true },
    adr_high: { type: DataTypes.FLOAT, allowNull: true },
    adr_low: { type: DataTypes.FLOAT, allowNull: true },
    adr_range: { type: DataTypes.FLOAT, allowNull: true },
    positive_0_25: { type: DataTypes.FLOAT, allowNull: true },
    positive_0_50: { type: DataTypes.FLOAT, allowNull: true },
    positive_0_75: { type: DataTypes.FLOAT, allowNull: true },
    positive_1_00: { type: DataTypes.FLOAT, allowNull: true },
    nagative_0_25: { type: DataTypes.FLOAT, allowNull: true },
    nagative_0_50: { type: DataTypes.FLOAT, allowNull: true },
    nagative_0_75: { type: DataTypes.FLOAT, allowNull: true },
    nagative_1_00: { type: DataTypes.FLOAT, allowNull: true },
}, {
    timestamps: true
});

module.exports = AdrData;
