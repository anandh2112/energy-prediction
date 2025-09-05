const express = require('express');
const moment = require('moment-timezone');
const router = express.Router();

const pool = require('./db');

async function fetchDGD(startDateTime, endDateTime, DGNo) {
  const query = `SELECT MIN(kWh) as min_kWh, MAX(kWh) as max_kWh 
                 FROM modbus_data 
                 WHERE energy_meter_id = ? AND timestamp BETWEEN ? and ?;`;

  const [rows] = await pool.query(query, [DGNo, startDateTime, endDateTime]);
  const energyProduced = Math.round((rows[0].max_kWh - rows[0].min_kWh) * 10) / 10;
  return { energyProduced };
}

async function fetchDGDCV(startDateTime, endDateTime, DGNo) {
  const query = `SELECT timestamp, avg_vln_value, avg_current_value FROM modbus_data 
                 WHERE energy_meter_id = ? AND timestamp BETWEEN ? AND ? 
                 ORDER BY timestamp DESC LIMIT 1`;

  const [results] = await pool.query(query, [DGNo, startDateTime, endDateTime]);
  const data = results[0];
  if (!data) return null;

  return {
    avg_vln_value: data.avg_vln_value,
    avg_current_value: data.avg_current_value,
    timestamp: moment.tz(data.timestamp, 'Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
  };
}
async function fetchDGRunningTime(startDateTime, endDateTime, DGNo) {
  const query = `SELECT timestamp, kWh FROM modbus_data WHERE energy_meter_id = ? AND timestamp BETWEEN ? AND ? ORDER BY timestamp ASC`;

  const results = await pool.query(query, [DGNo, startDateTime, endDateTime]);
  const rows = results[0];

  if (!rows || rows.length < 2) return 0;

  let totalRunningSeconds = 0;
  let sessionStart = null;

  for (let i = 1; i < rows.length; i++) {
    const prev = rows[i - 1];
    const curr = rows[i];

    const prevKWh = parseFloat(prev.kWh);
    const currKWh = parseFloat(curr.kWh);
    const prevTime = moment.tz(prev.timestamp, 'Asia/Kolkata');
    const currTime = moment.tz(curr.timestamp, 'Asia/Kolkata');
    const diffSeconds = currTime.diff(prevTime, 'seconds');

    if (currKWh > prevKWh && diffSeconds <= 300) {
      if (!sessionStart) sessionStart = prevTime;
    } else {
      if (sessionStart) {
        const sessionEnd = prevTime;
        totalRunningSeconds += sessionEnd.diff(sessionStart, 'seconds');
        sessionStart = null;
      }
    }
  }

  if (sessionStart) {
    const sessionEnd = moment.tz(rows[rows.length - 1].timestamp, 'Asia/Kolkata');
    totalRunningSeconds += sessionEnd.diff(sessionStart, 'seconds');
  }

  const totalMinutes = totalRunningSeconds / 60;
  return {
    runningTimeMinutes: Math.round(totalMinutes),
    runningTimeHours: +(totalMinutes / 60).toFixed(2)
  };
}

async function fetchDGDkWhdiff(startDateTime, endDateTime, DGNo) {
  const query = `SELECT
      DATE_FORMAT(timestamp, '%Y-%m-%d %H:00:00') AS hour,
      MAX(kWh) - MIN(kWh) AS kWh_difference
    FROM modbus_data
    WHERE timestamp BETWEEN ? AND ?
      AND energy_meter_id = ?
    GROUP BY hour
    ORDER BY hour ASC;`;

  const [results] = await pool.query(query, [startDateTime, endDateTime, DGNo]);

  const formatted = {};
  results.forEach(({ hour, kWh_difference }) => {
    const istTime = moment.tz(hour, 'Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    formatted[istTime] = Math.round(kWh_difference * 10) / 10;
  });

  return formatted;
}

router.get('/dgd', async (req, res) => {
  const { startDateTime, endDateTime, DGNo } = req.query;

  if (!startDateTime || !endDateTime || !DGNo) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  try {
    const [dgd, dgdcv, dgdrt, hrly_kwh_diff] = await Promise.all([
      fetchDGD(startDateTime, endDateTime, DGNo),
      fetchDGDCV(startDateTime, endDateTime, DGNo),
      fetchDGRunningTime(startDateTime, endDateTime, DGNo),
      fetchDGDkWhdiff(startDateTime, endDateTime, DGNo)
    ]);

    res.json({
      DGNo,
      dgd,
      dgdcv: { [DGNo]: dgdcv },
      dgdrt: { [DGNo]: dgdrt },
      hrly_kwh_diff: { [DGNo]: hrly_kwh_diff }
    });
  } catch (error) {
    console.error("Error in /dgdata:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
