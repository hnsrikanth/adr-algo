// config/db.js
const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false,
});

// Test and Sync DB (optional here, can be handled in app.js)
const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite DB connected.');

    await sequelize.sync({ alter: true });
    console.log('Tables synced with SQLite database.');
  } catch (err) {
    console.error('DB Init Error:', err);
  }
};

initDB();

module.exports = sequelize; // ✅ Export the Sequelize instance directly
