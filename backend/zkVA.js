const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '18.188.231.51',
  user: 'admin',
  password: '2166',
  database: 'metalware',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function getTotalKVAForZonePerMinute(startDateTime, endDateTime, zone) {
  const [rows] = await pool.promise().query(
    `
    SELECT 
      DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:00') AS minute,
      energy_meter_id,
      total_kVA
    FROM modbus_data
    WHERE timestamp BETWEEN ? AND ?
      AND energy_meter_id = ?
    ORDER BY timestamp ASC
    `,
    [startDateTime, endDateTime, zone]
  );

  return rows;
}

router.get('/zkVA', async (req, res) => {
  const { startDateTime, endDateTime, zone } = req.query;

  if (!startDateTime || !endDateTime || !zone) {
    return res.status(400).json({ error: 'startDateTime, endDateTime, and zone are required' });
  }

  try {
    const kvaData = await getTotalKVAForZonePerMinute(startDateTime, endDateTime, zone);
    res.status(200).json({ kvaData });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;
