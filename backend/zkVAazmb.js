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

// Utility: Get block start/end times based on block number
function getBlockTimes(startDateTime, blockNumber) {
  const base = new Date(startDateTime);
  const blockStart = new Date(base.getTime() + blockNumber * 30 * 60 * 1000);
  const blockEnd = new Date(blockStart.getTime() + 30 * 60 * 1000);
  return { blockStart, blockEnd };
}

// Format time to "HH:MM"
function formatTime(date) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// Endpoint: Zone-wise peak kVA in 30-min blocks
router.get('/zkVAazmb', async (req, res) => {
  const { startDateTime, endDateTime } = req.query;

  if (!startDateTime || !endDateTime) {
    return res.status(400).json({ error: 'startDateTime and endDateTime are required' });
  }

  try {
    const query = `
      WITH time_blocks AS (
        SELECT 
          timestamp,
          energy_meter_id,
          total_kVA,
          FLOOR(TIMESTAMPDIFF(MINUTE, ?, timestamp) / 30) AS block_number
        FROM modbus_data 
        WHERE timestamp >= ? AND timestamp < ?
          AND energy_meter_id BETWEEN 1 AND 11
      ),
      ranked_data AS (
        SELECT 
          timestamp,
          energy_meter_id,
          total_kVA,
          block_number,
          ROW_NUMBER() OVER (
            PARTITION BY energy_meter_id, block_number 
            ORDER BY total_kVA DESC
          ) AS rn
        FROM time_blocks
        WHERE total_kVA IS NOT NULL
      )
      SELECT 
        energy_meter_id,
        block_number,
        timestamp,
        total_kVA
      FROM ranked_data 
      WHERE rn = 1
      ORDER BY energy_meter_id, block_number
    `;

    const [rows] = await pool.promise().query(query, [startDateTime, startDateTime, endDateTime]);

    // Transform rows into desired format
    const result = {};
    rows.forEach(row => {
      const { blockStart, blockEnd } = getBlockTimes(startDateTime, row.block_number);
      const timeRange = `${formatTime(blockStart)}-${formatTime(blockEnd)}`;
      const value = row.total_kVA ? parseFloat(row.total_kVA).toFixed(1) : '0.0';

      if (!result[row.energy_meter_id]) {
        result[row.energy_meter_id] = {};
      }
      result[row.energy_meter_id][timeRange] = value;
    });

    res.status(200).json(result);

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;
