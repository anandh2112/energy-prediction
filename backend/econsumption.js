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
  queueLimit: 0
});

async function fetchConsumption(startDateTime,endDateTime) {
  const [rows] = await pool.promise().query(
    `SELECT 
      energy_meter_id,
      MAX(CASE WHEN kVAh > 0 THEN kVAh ELSE NULL END) -
      MIN(CASE WHEN kVAh > 0 THEN kVAh ELSE NULL END) AS kVAh_difference
     FROM modbus_data
     WHERE timestamp BETWEEN ? AND ?
      AND energy_meter_id BETWEEN 1 AND 12
     GROUP BY energy_meter_id`,
     [startDateTime,endDateTime]
  );
  return rows.map(({ energy_meter_id,kVAh_difference})=>({
    energy_meter_id,
    consumption: kVAh_difference !== null ? parseFloat(kVAh_difference).toFixed(1) : 0
  }));
}

router.get('/econsumption', async (req, res) => {
  const { startDateTime, endDateTime } = req.query;

  if (!startDateTime || !endDateTime) {
    return res.status(400).json({
      error: 'Both startDateTime and endDateTime must be provided in the format YYYY-MM-DDTHH:mm',
    });
  }

  try {
    const start = startDateTime;
    const end = endDateTime;

    const consumptionData = await fetchConsumption(start, end);

    res.status(200).json({ consumptionData });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;
