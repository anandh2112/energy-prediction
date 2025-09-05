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

const queryDatabase = (query, params) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

router.get('/mcconspeak', async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const formattedStartOfDay = startOfDay.toISOString().slice(0, 19).replace('T', ' ');
    const formattedCurrentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const consumptionQuery = `
      SELECT energy_meter_id,
             (MAX(kWh) - MIN(kWh)) AS consumption
        FROM energy_data
       WHERE timestamp BETWEEN ? AND ?
         AND energy_meter_id BETWEEN 1 AND 11
    GROUP BY energy_meter_id;
    `;

    const consumptionResults = await queryDatabase(consumptionQuery, [formattedStartOfDay, formattedCurrentDate]);
    const totalConsumption = consumptionResults.reduce((sum, row) => sum + row.consumption, 0);

    const peakDemandQuery = `
      SELECT MAX(total_kVA) AS peak_demand
        FROM (
              SELECT timestamp,
                     SUM(total_kVA) AS total_kVA
                FROM energy_data
               WHERE energy_meter_id BETWEEN 1 AND 11
            GROUP BY timestamp
             ) AS subquery;
    `;

    const peakDemandResults = await queryDatabase(peakDemandQuery);
    const peakDemand = peakDemandResults[0]?.peak_demand || 0;

    res.json({
      consumption: totalConsumption,
      peakDemand: peakDemand,
    });
  } catch (error) {
    console.error('Error fetching consumption and peak demand:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;