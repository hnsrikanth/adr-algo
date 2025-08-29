require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');
const cors = require('cors');
const http = require("http");
const bodyParser = require("body-parser");
const path = require('path');

const registerRoutes = require('./commonRoutes');
const marketStart = require('./marketData/marketStart');
const { setupTicker } = require('./marketData/ticker');

const app = express();
const server = http.createServer(app);

// const { calculateAdrFromHistoric, getAdrValues } = require('./marketData/adrData');

// Serve static files from the 'public' directory
// app.use(express.static('public'));
app.use('/charts', express.static(path.join(__dirname, 'charts')));

// Enable CORS for all routes
app.use(cors());

// Enable CORS
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all routes
registerRoutes(app);

// Setup ticker
setupTicker(server);

//ROHIT : marketStart will only run once. If the entry is already present in the DB, it won't add it again.
// I have added this code as pseudo code, please re write properly.
// setupMarketStartTasks();

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});