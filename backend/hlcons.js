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

router.get('/hlcons', async (req, res) => {
  const { startDateTime,endDateTime } = req.query;
  try {
    const [rows] = await pool.promise().query(`
    SELECT 
    energy_meter_id,
    ROUND(
      MAX(CASE WHEN kVAh > 0 THEN kVAh ELSE NULL END) - MIN(CASE WHEN kVAh > 0 THEN kVAh ELSE NULL END),
      1
    ) AS kVAh_difference
  FROM modbus_data
  WHERE energy_meter_id BETWEEN 1 AND 11
    AND timestamp BETWEEN ? AND ?
  GROUP BY energy_meter_id
    `, [startDateTime, endDateTime]);


    const consumptionData = rows.map(row => ({
      meter_id: row.energy_meter_id,
      consumption: row.kVAh_difference || 0,
    }));

    const highZone = consumptionData.reduce(
      (prev, current) => (prev.consumption > current.consumption ? prev : current), 
      { meter_id: "N/A", consumption: 0 }
    );

    const validConsumptionData = consumptionData.filter(zone => zone.consumption > 0);
    const lowZone = validConsumptionData.length > 0
      ? validConsumptionData.reduce((prev, current) => (prev.consumption < current.consumption ? prev : current))
      : { meter_id: "N/A", consumption: 0 };

    res.json({ consumptionData, highZone, lowZone });
  } catch (error) {
    console.error('[ERROR] Error fetching consumption data:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
