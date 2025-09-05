const express = require('express');
const router = express.Router();
const pool = require('./db.js');

async function getTotalConsumption(startDateTime, endDateTime) {
  const query = `
  SELECT 
    ROUND(SUM(emw_cons_kVAh), 1) AS consumption
  FROM (
    SELECT 
      (MAX(kVAh) - MIN(kVAh)) AS emw_cons_kVAh
    FROM 
      modbus_data
    WHERE 
      energy_meter_id BETWEEN 1 AND 11
      AND timestamp BETWEEN ? AND ?
    GROUP BY 
      energy_meter_id
  ) AS subquery;
  `;

  const [rows] = await pool.query(query, [startDateTime, endDateTime]);
  return rows[0]?.consumption || 0; 
}

router.get('/mcapcons', async (req, res) => {
  try {
    const { startDateTime, endDateTime } = req.query;

    if (!startDateTime || !endDateTime) {
      return res.status(400).json({
        error: 'Both startDateTime and endDateTime are required',
      });
    }

    const consumption = await getTotalConsumption(startDateTime, endDateTime);

    res.status(200).json({
      consumption, 
    });
  } catch (err) {
    console.error('Consumption calculation error:', err);
    res.status(500).json({
      error: 'Failed to calculate consumption',
      details: err.message,
    });
  }
});

module.exports = router;