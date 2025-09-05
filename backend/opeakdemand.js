const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

const pool = mysql.createPool({
  host: '18.188.231.51',
  user: 'admin',
  password: '2166',
  database: 'metalware',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function getPeakDemandForDate(startDateTime, endDateTime) {
  const cutoff = new Date('2025-05-15T00:00:00');
  const start = new Date(startDateTime);

  let query = '';
  let params = [startDateTime, endDateTime];

  if (start > cutoff) {
    query = `
      SELECT
        DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:00') AS minute,
        total_kVA
      FROM modbus_data
      WHERE energy_meter_id = 12
        AND timestamp BETWEEN ? AND ?
      ORDER BY minute
    `;
  } else {
    query = `
    SELECT
      DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:00') AS minute,
      SUM(total_kVA) AS total_kVA
    FROM modbus_data
    WHERE energy_meter_id BETWEEN 1 AND 11
      AND timestamp BETWEEN ? AND ?
    GROUP BY minute
    ORDER BY minute
    `;
  }

  const [rows] = await pool.promise().query(query, params);

  return rows.map(entry => ({
    minute: entry.minute,
    total_kVA: parseFloat(entry.total_kVA).toFixed(1)
  }));
}

router.get('/opeakdemand', async (req, res) => {
  const { startDateTime, endDateTime } = req.query;

  if (!startDateTime || !endDateTime) {
    return res.status(400).json({ error: 'startDateTime and endDateTime are required' });
  }

  try {
    const peakDemandData = await getPeakDemandForDate(startDateTime, endDateTime);
    res.status(200).json({ peakDemandData });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;
