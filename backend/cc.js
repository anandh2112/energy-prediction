const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '18.188.231.51',
  user: 'admin',
  password: '2166',
  database: 'metalware',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

router.get('/cc', async (req, res) => {
  try {
    const { startDateTime, endDateTime } = req.query;
    const query = `
    SELECT
  period,
  rate,
  SUM(consumption) AS totalConsumption,
  ROUND(SUM(consumption * rate), 2) AS totalCost
FROM (
  SELECT
    energy_meter_id,
    DATE(timestamp) AS day,
    CASE
      WHEN TIME(timestamp) BETWEEN '00:00:00' AND '02:59:59' THEN '00:00-03:00'
      WHEN TIME(timestamp) BETWEEN '03:00:00' AND '04:59:59' THEN '03:00-05:00'
      WHEN TIME(timestamp) BETWEEN '05:00:00' AND '09:59:59' THEN '05:00-10:00'
      WHEN TIME(timestamp) BETWEEN '10:00:00' AND '18:59:59' THEN '10:00-19:00'
      WHEN TIME(timestamp) BETWEEN '19:00:00' AND '23:59:59' THEN '19:00-23:59'
    END AS period,
    MAX(kVAh) - MIN(kVAh) AS consumption
  FROM modbus_data
  WHERE
    timestamp BETWEEN ? AND ?
    AND energy_meter_id BETWEEN 1 AND 11
    AND TIME(timestamp) BETWEEN '00:00:00' AND '23:59:59'
  GROUP BY energy_meter_id, day, period
) AS daily_data
JOIN (
  SELECT '00:00-03:00' AS period, 8.165 AS rate
  UNION ALL SELECT '03:00-05:00', 7.10
  UNION ALL SELECT '05:00-10:00', 6.035
  UNION ALL SELECT '10:00-19:00', 7.10
  UNION ALL SELECT '19:00-23:59', 8.165
) AS rates USING (period)
GROUP BY period, rate
ORDER BY FIELD(period,
  '00:00-03:00',
  '03:00-05:00',
  '05:00-10:00',
  '10:00-19:00',
  '19:00-23:59'
);
    `;

    const params = Array(5).fill([startDateTime, endDateTime]).flat();

    const [rows] = await pool.query(query, params);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No consumption data available" });
    }

    const totalCost = parseFloat(
      rows.reduce((sum, row) => sum + (row.totalCost || 0), 0).toFixed(2)
    );
    res.status(200).json({
      totalCost,
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error calculating consumption cost:`, error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
});

module.exports = router;