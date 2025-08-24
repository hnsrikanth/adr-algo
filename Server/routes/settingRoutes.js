const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const fs = require('fs');
const path = require('path');

router.post('/strategy', async (req, res) => {
  try {
    const strategyPath = path.join(__dirname, '../strategy.json');

    const strategyJson = req.body.data;
    const name = req.body.name || 'DefaultSession';

    if (!strategyJson || Object.keys(strategyJson).length === 0) {
      return res.status(400).json({ error: "No strategy data provided" });
    }

    // ✅ Save to strategy.json file
    fs.writeFileSync(strategyPath, JSON.stringify(strategyJson, null, 2));

    // ✅ Manual upsert (SQLite safe)
    let session = await Session.findOne({ where: { name } });

    if (session) {
      // update **only data**, not name
      await session.update(
        { data: strategyJson },
        { fields: ['data'] }   // 👈 ensures only "data" is updated
      );

      return res.status(200).json({
        message: "Session updated successfully",
        session,
        created: false
      });
    } else {
      // create new
      session = await Session.create({ name, data: strategyJson });

      return res.status(201).json({
        message: "Session created successfully",
        session,
        created: true
      });
    }
  } catch (err) {
    console.error("Error saving strategy:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/strategy', async(req, res) => {
    try {
        // Fetch the latest record(s) sorted by updatedAt
        const sessions = await Session.findAll({
            order: [
                ['updatedAt', 'DESC']
            ], // latest first
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