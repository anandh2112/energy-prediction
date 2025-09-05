const express = require('express');
const router = express.Router();
const pool = require('./db.js');


async function fetchHourlyConsumption(startDateTime, endDateTime) {
  const query = `
  SELECT
  DATE_FORMAT(timestamp, '%Y-%m-%d %H:00:00') AS hour,
  energy_meter_id,
  ROUND(MAX(kWh) - MIN(kWh),1) AS kWh_difference
FROM modbus_data
WHERE timestamp BETWEEN ? AND ?
  AND energy_meter_id BETWEEN 1 AND 11
GROUP BY energy_meter_id, hour
ORDER BY hour ASC;
  `;

  try {
    const [rows] = await pool.query(query, [startDateTime, endDateTime]);
    console.log(rows);

    const hourlyConsumption = rows.reduce((acc, { hour, kWh_difference }) => {
      const diff = parseFloat(kWh_difference || 0);
      acc[hour] = (acc[hour] || 0) + diff;
      return acc;
    }, {});

    Object.keys(hourlyConsumption).forEach(hour => {
      hourlyConsumption[hour] = parseFloat(hourlyConsumption[hour].toFixed(1));
    })
    
console.log(hourlyConsumption);
    return hourlyConsumption;
  } catch (error) {
    throw error;
  }
}

router.get('/hconsumption', async (req, res) => {
  const { startDateTime, endDateTime } = req.query;
  try {
    const consumptionData = await fetchHourlyConsumption(startDateTime, endDateTime);

    res.status(200).json({ consumptionData }); 
  } catch (error) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;