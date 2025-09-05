const express = require('express');
const router = express.Router();
const pool = require('./db.js');

router.get('/minicard', async (req, res) => {
  const { startDateTime, endDateTime } = req.query;

  if (!startDateTime || !endDateTime) {
    return res.status(400).json({
      error: 'startDateTime and endDateTime are required',
    });
  }

  try {
    const [kwhRow] = await pool.query(`
      SELECT ROUND(SUM(kWh_diff), 1) AS consumption FROM (
        SELECT energy_meter_id, (MAX(kWh) - MIN(kWh)) AS kWh_diff
        FROM modbus_data
        WHERE energy_meter_id BETWEEN 1 AND 11
          AND timestamp BETWEEN ? AND ?
        GROUP BY energy_meter_id
      ) AS sub;
    `, [startDateTime, endDateTime]);

    const [kvahRow] = await pool.query(`
      SELECT ROUND(SUM(kVAh_diff), 1) AS consumption FROM (
        SELECT (MAX(kVAh) - MIN(kVAh)) AS kVAh_diff
        FROM modbus_data
        WHERE energy_meter_id BETWEEN 1 AND 11
          AND timestamp BETWEEN ? AND ?
        GROUP BY energy_meter_id
      ) AS sub;
    `, [startDateTime, endDateTime]);

    const cutoff = new Date('2025-05-15T00:00:00');
    const start = new Date(startDateTime);
    let peakDemand = 0;

    if (start > cutoff) {
      const [peakRow] = await pool.query(`
        SELECT MAX(total_kVA) AS peakDemand
        FROM modbus_data
        WHERE energy_meter_id = 12
          AND timestamp BETWEEN ? AND ?
      `, [startDateTime, endDateTime]);
      peakDemand = peakRow[0]?.peakDemand || 0;
    } else {
      const [peakRow] = await pool.query(`
        SELECT MAX(peakDemand) AS peakDemand FROM (
          SELECT SUM(ROUND(total_kVA, 1)) AS peakDemand
          FROM modbus_data
          WHERE energy_meter_id BETWEEN 1 AND 11
            AND timestamp BETWEEN ? AND ?
          GROUP BY DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:00')
        ) AS sub;
      `, [startDateTime, endDateTime]);
      peakDemand = peakRow[0]?.peakDemand || 0;
    }

    const query = `
      SELECT '00:00-03:00' AS period, 8.165 AS rate,
        SUM(consumption) AS totalConsumption,
        ROUND(SUM(consumption * 8.165), 2) AS totalCost
      FROM (
        SELECT energy_meter_id, DATE(timestamp) as day,
          MAX(kVAh) - MIN(kVAh) AS consumption
        FROM modbus_data
        WHERE TIME(timestamp) BETWEEN '00:00:00' AND '02:59:59'
          AND timestamp BETWEEN ? AND ?
          AND energy_meter_id BETWEEN 1 AND 11
        GROUP BY energy_meter_id, day
      ) AS p1
      UNION ALL
      SELECT '03:00-05:00', 7.10, SUM(consumption), ROUND(SUM(consumption * 7.10), 2)
      FROM (
        SELECT energy_meter_id, DATE(timestamp) as day,
          MAX(kVAh) - MIN(kVAh) AS consumption
        FROM modbus_data
        WHERE TIME(timestamp) BETWEEN '03:00:00' AND '04:59:59'
          AND timestamp BETWEEN ? AND ?
          AND energy_meter_id BETWEEN 1 AND 11
        GROUP BY energy_meter_id, day
      ) AS p2
      UNION ALL
      SELECT '05:00-10:00', 6.035, SUM(consumption), ROUND(SUM(consumption * 6.035), 2)
      FROM (
        SELECT energy_meter_id, DATE(timestamp) as day,
          MAX(kVAh) - MIN(kVAh) AS consumption
        FROM modbus_data
        WHERE TIME(timestamp) BETWEEN '05:00:00' AND '09:59:59'
          AND timestamp BETWEEN ? AND ?
          AND energy_meter_id BETWEEN 1 AND 11
        GROUP BY energy_meter_id, day
      ) AS p3
      UNION ALL
      SELECT '10:00-19:00', 7.10, SUM(consumption), ROUND(SUM(consumption * 7.10), 2)
      FROM (
        SELECT energy_meter_id, DATE(timestamp) as day,
          MAX(kVAh) - MIN(kVAh) AS consumption
        FROM modbus_data
        WHERE TIME(timestamp) BETWEEN '10:00:00' AND '18:59:59'
          AND timestamp BETWEEN ? AND ?
          AND energy_meter_id BETWEEN 1 AND 11
        GROUP BY energy_meter_id, day
      ) AS p4
      UNION ALL
      SELECT '19:00-23:59', 8.165, SUM(consumption), ROUND(SUM(consumption * 8.165), 2)
      FROM (
        SELECT energy_meter_id, DATE(timestamp) as day,
          MAX(kVAh) - MIN(kVAh) AS consumption
        FROM modbus_data
        WHERE TIME(timestamp) BETWEEN '19:00:00' AND '23:59:59'
          AND timestamp BETWEEN ? AND ?
          AND energy_meter_id BETWEEN 1 AND 11
        GROUP BY energy_meter_id, day
      ) AS p5;
    `;

    const costParams = Array(5).fill([startDateTime, endDateTime]).flat();
    const [rows] = await pool.query(query, costParams);

    const totalCost = parseFloat(
      rows.reduce((sum, row) => sum + (row.totalCost || 0), 0).toFixed(2)
    );

    const kWh = kwhRow[0]?.consumption || 0;
    const kVAh = kvahRow[0]?.consumption || 0;
    const emissions = +(kWh * 0.82).toFixed(1);
    const distance = +(emissions * 0.356).toFixed(1);

    res.status(200).json({
      consumption: kWh,
      apconsumption: kVAh,
      peakDemand,
      totalCost
    });
  } catch (err) {
    console.error('Error in dashboard-metrics:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data', details: err.message });
  }
});

module.exports = router;
