const express = require('express');
const router = express.Router();
const pool = require('./db.js');


async function getPeakDemandForDate(startDateTime, endDateTime) {
  const cutoff = new Date('2025-05-15T00:00:00');
  const start = new Date(startDateTime);

  let query = '';
  let params = [startDateTime, endDateTime];

  if (start > cutoff) {
    query = `
      SELECT
        DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:00') AS minute,
        total_kVA
      FROM modbus_data
      WHERE energy_meter_id = 12
        AND timestamp BETWEEN ? AND ?
      ORDER BY minute
    `;
  } else {
    query = `
    SELECT
      DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:00') AS minute,
      SUM(total_kVA) AS total_kVA
    FROM modbus_data
    WHERE energy_meter_id BETWEEN 1 AND 11
      AND timestamp BETWEEN ? AND ?
    GROUP BY minute
    ORDER BY minute
    `;
  }

  const [rows] = await pool.query(query, params);

  return rows.map(entry => ({
    minute: entry.minute,
    total_kVA: parseFloat(entry.total_kVA).toFixed(1)
  }));
}

async function fetchDGDC(startDateTime, endDateTime) {
  const query = `SELECT
  DATE_FORMAT(t1.timestamp, '%Y-%m-%d %H:%i:%s') AS timestamp,
  t1.total_kW,
  t1.energy_meter_id
FROM
  modbus_data t1
JOIN (
  SELECT
      energy_meter_id,
      MAX(timestamp) AS max_timestamp
  FROM
      modbus_data
  WHERE
      energy_meter_id IN (13,14)
      AND timestamp BETWEEN ? AND ?
  GROUP BY
      energy_meter_id
) AS t2 ON t1.energy_meter_id = t2.energy_meter_id AND t1.timestamp = t2.max_timestamp
ORDER BY
  t1.energy_meter_id, t1.timestamp DESC;`

try {
  const [rows] = await pool.query(query, [startDateTime, endDateTime]);
  const formattedResult = rows.reduce((acc, row)=>{
      acc[row.energy_meter_id] = {
          total_kW: row.total_kW,
          timestamp: row.timestamp
      };
      return acc;
  }, {});
  return formattedResult;
}

catch (error) {
  throw error;
}
};

router.get('/dashboardpt2', async (req, res) => {
  try {
    const { startDateTime, endDateTime } = req.query;
    if (!startDateTime || !endDateTime) {
      return res.status(400).json({ error: 'startDateTime and endDateTime required' });
    }

    const [peakDemandTimeline, dgdcData] = await Promise.all([
      getPeakDemandForDate(startDateTime, endDateTime),
      fetchDGDC(startDateTime, endDateTime)
    ]);

    res.status(200).json({
      peakDemandTimeline,
      dgdcData
    });

  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data', details: err.message });
  }
});

module.exports = router;
