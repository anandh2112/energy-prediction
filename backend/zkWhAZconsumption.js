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

async function getTotalkWhConsumptionForAllZones(startDateTime,endDateTime) {  
  const [rows] = await pool.promise().query(
    `
    SELECT
      DATE_FORMAT(timestamp, '%Y-%m-%d %H:00:00') AS hour,
      energy_meter_id,
      ROUND(
        MAX(CASE WHEN kWh > 0 THEN kWh ELSE NULL END) - MIN(CASE WHEN kWh > 0 THEN kWh ELSE NULL END),
        1
      ) AS kWh_difference FROM modbus_data
    WHERE timestamp BETWEEN ? AND ?
      AND energy_meter_id BETWEEN 1 AND 11
    GROUP BY energy_meter_id, hour
    `,
    [startDateTime, endDateTime]
  );

  return rows;
}

router.get('/zkWhAZconsumption', async (req, res) => {
  const { startDateTime, endDateTime } = req.query;

  try {
    const consumptionData = await getTotalkWhConsumptionForAllZones(startDateTime, endDateTime);
    res.status(200).json({ consumptionData });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;