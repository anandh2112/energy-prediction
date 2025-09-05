const express = require('express');
const router = express.Router();
const pool = require('./db.js');

router.get('/mcpeak', async (req, res) => {
  const { startDateTime, endDateTime } = req.query;

  if (!startDateTime || !endDateTime) {
    return res.status(400).json({
      error: 'Both startDateTime and endDateTime are required',
    });
  }

  try {
    const cutoff = new Date('2025-05-15T00:00:00');
    const start = new Date(startDateTime);

    let query, params;

    if (start > cutoff) {
      query = `
        SELECT MAX(total_kVA) AS peakDemand
        FROM modbus_data
        WHERE energy_meter_id = 12
          AND timestamp BETWEEN ? AND ?
      `;
      params = [startDateTime, endDateTime];
    } else {
      query = `
      SELECT MAX(peakDemand) AS peakDemand
        FROM (
          SELECT 
            SUM(ROUND(total_kVA, 1)) AS peakDemand
          FROM modbus_data
          WHERE timestamp BETWEEN ? AND ?
            AND energy_meter_id BETWEEN 1 AND 11
          GROUP BY DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:00')
        ) AS subquery;
      `;
      params = [startDateTime, endDateTime];
    }

    const [rows] = await pool.query(query, params);

    res.status(200).json({
      peakDemand: rows[0]?.peakDemand || 0,
    });
  } catch (err) {
    console.error('Error fetching peak demand:', err);
    res.status(500).json({
      error: 'Failed to fetch peak demand data',
      details: err.message,
    });
  }
});

module.exports = router;
