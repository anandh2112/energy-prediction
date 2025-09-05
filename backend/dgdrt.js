const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const moment = require('moment-timezone');

const pool = mysql.createPool({
    host: '18.188.231.51',
    user: 'admin',
    password: '2166',
    database: 'metalware',
    waitForConnections: true,
    connectionLimit: 10,
});

async function fetchDGRunningTime(startDateTime, endDateTime, DGNo) {
  const query = `
    SELECT timestamp, kWh
    FROM modbus_data
    WHERE energy_meter_id = ?
      AND timestamp BETWEEN ? AND ?
    ORDER BY timestamp ASC
  `;

  return new Promise((resolve, reject) => {
    pool.query(query, [DGNo, startDateTime, endDateTime], (err, results) => {
      if (err) return reject(err);
      if (!results || results.length < 2) return resolve(0);
            
      let totalRunningSeconds = 0;
      let sessionStart = null;

      for (let i = 1; i < results.length; i++) {
        const prev = results[i - 1];
        const curr = results[i];

        const prevKWh = parseFloat(prev.kWh);
        const currKWh = parseFloat(curr.kWh);

        const prevTime = moment.tz(prev.timestamp, 'Asia/Kolkata');
        const currTime = moment.tz(curr.timestamp, 'Asia/Kolkata');
        const diffSeconds = currTime.diff(prevTime, 'seconds');

        if (currKWh > prevKWh && diffSeconds <= 300) {
          if (!sessionStart) {
            sessionStart = prevTime;
          }
        } else {
          if (sessionStart) {
            const sessionEnd = prevTime;
            const durationSeconds = sessionEnd.diff(sessionStart, 'seconds');
            totalRunningSeconds += durationSeconds;
            sessionStart = null;
          }
        }
      }

      if (sessionStart) {
        const sessionEnd = moment.tz(results[results.length - 1].timestamp, 'Asia/Kolkata');
        const durationSeconds = sessionEnd.diff(sessionStart, 'seconds');
        totalRunningSeconds += durationSeconds;
      }

      const totalRunningMinutes = totalRunningSeconds / 60;      
      resolve(totalRunningMinutes);
    });
  });
}

  router.get('/dgdrt', async (req,res) => {
    const {startDateTime, endDateTime, DGNo} = req.query;

    try {
      const runningTimeMinutes = await fetchDGRunningTime(startDateTime, endDateTime, DGNo);

      res.json({
        dgdrt: {
          [DGNo]: {
            runningTimeMinutes: Math.round(runningTimeMinutes), 
            runningTimeHours: +(runningTimeMinutes / 60).toFixed(2) 
        }
    }})
    }
    catch (error) {
      throw error;
    }

  });

  module.exports = router;
  