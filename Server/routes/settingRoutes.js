const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const fs = require('fs');
const path = require('path');

// POST: Save strategy.json as a session
router.post('/strategy', async (req, res) => {
  try {
    const strategyPath = path.join(__dirname, '../strategy.json');

    // ✅ Use Angular payload instead of old file
    const strategyJson = req.body.data;
    const name = req.body.name || 'DefaultSession';

    // ✅ Save latest JSON to file
    fs.writeFileSync(strategyPath, JSON.stringify(strategyJson, null, 2));

    // ✅ Save in DB
    const session = await Session.create({
      name,
      data: strategyJson
    });

    res.status(201).json(session);
  } catch (err) {
    console.error('Error saving strategy:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Retrieve all sessions
// router.get('/strategy', async (req, res) => {
//   try {
//     const sessions = await Session.findAll();
//     res.json(sessions);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.get('/strategy', async (req, res) => {
  try {
    // Fetch the latest record(s) sorted by updatedAt
    const sessions = await Session.findAll({
      order: [['updatedAt', 'DESC']], // latest first
      limit: 1 // only the last record (remove limit if you want all)
    });

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ error: 'No strategy found' });
    }

    res.json(sessions); // return in array format
  } catch (err) {
    console.error('Error in GET /strategy:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;