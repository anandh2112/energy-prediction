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

async function getHourlyConsumptionForRange(startDate, endDate) {

  try {
    const [rows] = await pool.promise().query(
      `
      SELECT
        DATE_FORMAT(timestamp, '%Y-%m-%d') AS day,
        HOUR(timestamp) AS hour,
        energy_meter_id,
        MAX(kVAh) - MIN(kVAh) AS kVAh_difference
      FROM modbus_data
      WHERE timestamp BETWEEN ? AND ?
        AND energy_meter_id BETWEEN 1 AND 11
        AND kVAh > 0
      GROUP BY day, hour, energy_meter_id
      HAVING MIN(kVAh) > 0 AND MAX(kVAh) > 0
      ORDER BY day, hour, energy_meter_id;
      `,
      [startDate, endDate]
    );

    const hourlyConsumption = {};

    rows.forEach((entry) => {
      if (!hourlyConsumption[entry.day]) {
        hourlyConsumption[entry.day] = {};
      }
      if (!hourlyConsumption[entry.day][entry.hour]) {
        hourlyConsumption[entry.day][entry.hour] = 0;
      }
      hourlyConsumption[entry.day][entry.hour] += parseFloat(entry.kVAh_difference);
    });

    const result = [];
    for (const day in hourlyConsumption) {
      for (const hour in hourlyConsumption[day]) {
        result.push({
          day,
          hour: parseInt(hour),
          total_consumption: hourlyConsumption[day][hour].toFixed(2)
        });
      }
    }

    console.log('Hourly consumption:', result);
    return result;
  } catch (error) {
    console.error('Database query failed:', error);
    throw error;
  }
}

router.get('/ehconsumption', async (req, res) => {
  const { startDate, endDate } = req.query;
  console.log(startDate, endDate );
    
    try {
      const consumptionData = await getHourlyConsumptionForRange(startDate, endDate);
      return res.status(200).json({ consumptionData });
    } catch (error) {
     throw error;
    }
  }
);

module.exports = router;