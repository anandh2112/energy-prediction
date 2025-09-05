const express = require('express');
const moment = require('moment-timezone');
const router = express.Router();
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: '18.188.231.51',
  user: 'admin',
  password: '2166',
  database: 'metalware',
  waitForConnections: true,
  connectionLimit: 10
});

// Peak Demand Data
async function getPeakDemandAboveThreshold(startDateTime, endDateTime) {
  const [rows] = await pool.promise().query(
    `
    SELECT
      DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:00') AS minute,
      SUM(total_kVA) AS total_kVA
    FROM modbus_data
    WHERE energy_meter_id BETWEEN 1 AND 11
      AND timestamp BETWEEN ? AND ?
    GROUP BY minute
    HAVING SUM(total_kVA) > 596
    ORDER BY minute DESC
    `,
    [startDateTime, endDateTime]
  );

  return rows.map((entry, index) => ({
    id: index + 1,
    minute: entry.minute,
    total_kVA: parseFloat(entry.total_kVA).toFixed(1)
  }));
}

async function getDGActivateandDeactivate(startDateTime, endDateTime) {
  const [rows] = await pool.promise().query(
    `
    SELECT 
      energy_meter_id,
      timestamp,
      kWh
    FROM modbus_data
    WHERE energy_meter_id IN (13, 14)
      AND timestamp BETWEEN ? AND ?
    ORDER BY energy_meter_id, timestamp
    `,
    [startDateTime, endDateTime]
  );

  const events = [];
  const state = {};

  for (const row of rows) {
    const id = row.energy_meter_id;
    const ts = moment.tz(row.timestamp, 'Asia/Kolkata'); // force IST
    const kWh = parseFloat(row.kWh);

    if (!state[id]) {
      state[id] = { on: false, prev: kWh, startKWh: null, startTime: null };
      continue;
    }

    const meter = state[id];

    if (!meter.on && kWh > meter.prev) {
      meter.on = true;
      meter.startKWh = kWh;
      meter.startTime = ts.clone();

      events.push({
        meter: id,
        timestamp: ts.format('YYYY-MM-DD HH:mm:ss'), // IST string
        status: "DG started",
        kWh: kWh
      });
    } else if (meter.on && kWh === meter.prev) {
      meter.on = false;

      events.push({
        meter: id,
        timestamp: ts.format('YYYY-MM-DD HH:mm:ss'),
        status: "DG stopped",
        kWh: kWh,
        startKWh: meter.startKWh,
        startTime: meter.startTime.format('YYYY-MM-DD HH:mm:ss')
      });
    }

    meter.prev = kWh;
  }

  return events;
}

// API Route
router.get('/apd', async (req, res) => { 
  const { startDateTime, endDateTime } = req.query;
  console.log("Received:", startDateTime, endDateTime);

  try {
    const peakDemandAboveThresholdData = await getPeakDemandAboveThreshold(startDateTime, endDateTime);
    const dgActivations = await getDGActivateandDeactivate(startDateTime, endDateTime);

    res.status(200).json({
      peakDemandAboveThreshold: peakDemandAboveThresholdData,
      dgActivations: dgActivations
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;
