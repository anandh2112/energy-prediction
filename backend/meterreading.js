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

router.get('/meterreading', async (req, res) => {
  try {
    const { startDateTime, endDateTime } = req.query;

    if (!startDateTime || !endDateTime) {
      return res.status(400).json({ error: 'startDateTime and endDateTime are required' });
    }

    const query = `
    SELECT 
    d.energy_meter_id,
    d.min_kVAh,
    d.min_kVAh_timestamp AS startTimestamp,
    d.max_kVAh,
    d.max_kVAh_timestamp AS endTimestamp,
    agg.min_kWh,
    agg.max_kWh
  FROM (
    SELECT 
      energy_meter_id,
      MIN(kVAh) AS min_kVAh,
      MAX(kVAh) AS max_kVAh,
      SUBSTRING_INDEX(GROUP_CONCAT(timestamp ORDER BY kVAh ASC), ',', 1) AS min_kVAh_timestamp,
      SUBSTRING_INDEX(GROUP_CONCAT(timestamp ORDER BY kVAh DESC), ',', 1) AS max_kVAh_timestamp
    FROM modbus_data
    WHERE timestamp BETWEEN ? AND ?
      AND energy_meter_id BETWEEN 1 AND 14
    GROUP BY energy_meter_id
  ) AS d
  JOIN (
    SELECT 
      energy_meter_id,
      MIN(kWh) AS min_kWh,
      MAX(kWh) AS max_kWh
    FROM modbus_data
    WHERE timestamp BETWEEN ? AND ?
      AND energy_meter_id BETWEEN 1 AND 14
    GROUP BY energy_meter_id
  ) AS agg
  ON d.energy_meter_id = agg.energy_meter_id
  ORDER BY d.energy_meter_id;
  `;  

  const [rows] = await pool.promise().query(query, [startDateTime, endDateTime, startDateTime, endDateTime]);

  const data = rows.map(row => ({
    zone: row.energy_meter_id,
    min: {
      kVAh: row.min_kVAh,
      kWh: row.min_kWh,
      timestamp: row.startTimestamp,
    },
    max: {
      kVAh: row.max_kVAh,
      kWh: row.max_kWh,
      timestamp: row.endTimestamp,
    },
  }));

  res.json({ data });
} catch (err) {
  console.error('Error fetching meter readings:', err);
  res.status(500).json({ error: 'Database query failed' });
}
});

module.exports = router;