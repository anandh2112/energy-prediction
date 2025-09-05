const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const moment = require('moment');

const pool = mysql.createPool({
    host: '18.188.231.51',
    user: 'admin',
    password: '2166',
    database: 'metalware',
    waitForConnections: true,
    connectionLimit: 10
});

async function fetchDGDkWhdiff(startDateTime, endDateTime, DGNo) {
    const query = `SELECT
    DATE_FORMAT(timestamp, '%Y-%m-%d %H:00:00') AS hour,
    MAX(kWh) - MIN(kWh) AS kWh_difference
  FROM modbus_data
  WHERE timestamp BETWEEN ? AND ?
    AND energy_meter_id = ?
  GROUP BY hour
  ORDER BY hour ASC;`;

    return new Promise((resolve, reject) => {
        pool.query(query, [startDateTime, endDateTime, DGNo], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

router.get('/dgdkWhdiff', async (req, res) => {
    const { startDateTime, endDateTime, DGNo } = req.query;

    if (!startDateTime || !endDateTime || !DGNo) {
        return res.status(400).json({ error: "Missing required query parameters" });
    }

    try {
        const results = await fetchDGDkWhdiff(startDateTime, endDateTime, DGNo);
        const formattedData = {
            hrly_kwh_diff: {
                [DGNo]: {}
            }
        };

        results.forEach(({ hour, kWh_difference }) => {
            const istTime = moment.tz(hour, 'Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
            formattedData.hrly_kwh_diff[DGNo][istTime] = Math.round(kWh_difference * 10) / 10;
        });

        res.json(formattedData);
    } catch (error) {
        console.error("Error in /dgdokW:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;