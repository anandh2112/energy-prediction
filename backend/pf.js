const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '18.188.231.51',
  user: 'admin',
  password: '2166',
  database: 'metalware',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

router.get('/pf', async (req, res) => {
  try {
    const { date, currentDateTime, zone: energy_meter_id } = req.query;

    if (!date || !currentDateTime || !energy_meter_id) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Extract date part from currentDateTime (YYYY-MM-DD)
    const currentDate = currentDateTime.split(' ')[0];

    const [rows] = await pool.query(
      `SELECT system_power_factor 
       FROM modbus_data 
       WHERE DATE(timestamp) = ? 
       AND energy_meter_id = ? 
       ORDER BY timestamp DESC 
       LIMIT 1`,
      [currentDate, energy_meter_id]
    );

    if (rows.length === 0) {
      return res.json({ pfValue: 0 }); // Default value if no data found
    }

    // Get absolute value if negative
    const pfValue = Math.abs(parseFloat(rows[0].system_power_factor));

    res.json({ pfValue });
  } catch (error) {
    console.error('Error fetching power factor:', error);
    res.status(500).json({ error: 'Failed to fetch power factor' });
  }
});

module.exports = router;