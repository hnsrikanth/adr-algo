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
const { setupAdrSocket } = require("./socket/adrSocket");

const app = express();
const server = http.createServer(app);

// const { calculateAdrFromHistoric, getAdrValues } = require('./marketData/adrData');

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
// setupTicker(server);

// Setup ADR WebSocket
setupAdrSocket(server);

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});