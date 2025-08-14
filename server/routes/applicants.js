const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/profile', async (req, res) => {
  try {
    const applicantId = 1; 
    const [rows] = await db.execute('SELECT id, name, email FROM applicants WHERE id = ?', [applicantId]);
    if (rows.length === 0) return res.status(404).json({ msg: 'Profile not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;