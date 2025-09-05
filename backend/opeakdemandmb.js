const express = require('express');
const router = express.Router();
const pool = require('./db.js');

// Reconstruct the 30-min interval start time
function getBlockTimes(startDateTime, blockNumber) {
  const base = new Date(startDateTime);
  const blockStart = new Date(base.getTime() + blockNumber * 30 * 60 * 1000); // 30 minutes per block
  const blockEnd = new Date(blockStart.getTime() + 30 * 60 * 1000);
  return { blockStart, blockEnd };
}

// Format for time range (e.g., "12:00-12:30")
function formatTime(date) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// Format for timestamp (e.g., "2025-08-07 09:49:47")
function formatDBTimestamp(ts) {
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

router.get('/opeakdemandmb', async (req, res) => {
  const { startDateTime, endDateTime } = req.query;

  if (!startDateTime || !endDateTime) {
    return res.status(400).json({ error: 'startDateTime and endDateTime are required' });
  }

  try {
    const query = `
      WITH time_blocks AS (
        SELECT 
          timestamp,
          total_kVA,
          FLOOR(TIMESTAMPDIFF(MINUTE, ?, timestamp) / 30) as block_number
        FROM modbus_data 
        WHERE timestamp >= ? AND timestamp < ?
          AND energy_meter_id = 12
      ),
      ranked_data AS (
        SELECT 
          timestamp,
          total_kVA,
          block_number,
          ROW_NUMBER() OVER (PARTITION BY block_number ORDER BY total_kVA DESC) as rn
        FROM time_blocks
        WHERE total_kVA IS NOT NULL
      )
      SELECT 
        block_number,
        timestamp,
        total_kVA
      FROM ranked_data 
      WHERE rn = 1
      ORDER BY block_number
    `;

    const [rows] = await pool.query(query, [startDateTime, startDateTime, endDateTime]);

    const peakDemandBlocks = rows.map(row => {
      const { blockStart, blockEnd } = getBlockTimes(startDateTime, row.block_number);

      return {
        time: `${formatTime(blockStart)}-${formatTime(blockEnd)}`,
        value: row.total_kVA ? parseFloat(row.total_kVA).toFixed(1) : '0.0',
        timestamp: row.timestamp ? formatDBTimestamp(row.timestamp) : null
      };
    });

    res.status(200).json({ peakDemandBlocks });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;
