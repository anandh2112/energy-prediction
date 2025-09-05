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

async function getTotalConsumptionForZone(startDateTime,endDateTime,zone) {  
  const [rows] = await pool.promise().query(
    `
    SELECT
      DATE_FORMAT(timestamp, '%Y-%m-%d %H:00:00') AS hour,
      energy_meter_id,
      ROUND(
        MAX(CASE WHEN kWh > 0 THEN kWh ELSE NULL END) - MIN(CASE WHEN kWh > 0 THEN kWh ELSE NULL END),
        1
      ) AS kWh_difference    FROM modbus_data
    WHERE timestamp BETWEEN ? AND ?
      AND energy_meter_id = ?
    GROUP BY energy_meter_id, hour
    `,
    [startDateTime, endDateTime, zone]
  );

  return rows;
}

router.get('/zconsumption', async (req, res) => {
  const { startDateTime, endDateTime, zone } = req.query;

  if (!startDateTime || !endDateTime || !zone)  {
    return res.status(400).json({ error: 'startDateTime, endDateTime, and zone are required' });
  }

  try {
    const consumptionData = await getTotalConsumptionForZone(startDateTime, endDateTime, zone);
    res.status(200).json({ consumptionData });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;