const express = require('express');
const router = express.Router();
const pool = require('./db.js');

async function getKVAhConsumption(startDateTime, endDateTime) {
  const query = `
    SELECT ROUND(SUM(cons), 1) AS consumption FROM (
      SELECT MAX(kVAh) - MIN(kVAh) AS cons
      FROM modbus_data
      WHERE energy_meter_id BETWEEN 1 AND 11
        AND timestamp BETWEEN ? AND ?
      GROUP BY energy_meter_id
    ) AS sub;
  `;
  const [rows] = await pool.query(query, [startDateTime, endDateTime]);
  return rows[0]?.consumption || 0;
}

async function getKWhConsumption(startDateTime, endDateTime) {
  const query = `
    SELECT ROUND(SUM(diff), 1) AS consumption FROM (
      SELECT MAX(kWh) - MIN(kWh) AS diff
      FROM modbus_data
      WHERE energy_meter_id BETWEEN 1 AND 11
        AND timestamp BETWEEN ? AND ?
      GROUP BY energy_meter_id
    ) AS sub;
  `;
  const [rows] = await pool.query(query, [startDateTime, endDateTime]);
  return rows[0]?.consumption || 0;
}

async function getPeakDemand(startDateTime, endDateTime) {
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
    
        const [rows] = await pool.query(query, [startDateTime, endDateTime]);
        return rows[0]?.peakDemand || 0;


      } catch (err) {
       throw err;}
}

async function gethlcons(startDateTime, endDateTime) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        energy_meter_id,
        ROUND(
          MAX(CASE WHEN kVAh > 0 THEN kVAh ELSE NULL END) - MIN(CASE WHEN kVAh > 0 THEN kVAh ELSE NULL END),
          1
        ) AS kVAh_difference
      FROM modbus_data
      WHERE energy_meter_id BETWEEN 1 AND 11
        AND timestamp BETWEEN ? AND ?
      GROUP BY energy_meter_id
    `, [startDateTime, endDateTime]);

    const consumptionData = rows.map(row => ({
      meter_id: row.energy_meter_id,
      consumption: row.kVAh_difference || 0,
    }));

    // Find high zone (max consumption)
    const highZone = consumptionData.reduce(
      (prev, current) => (prev.consumption > current.consumption ? prev : current),
      { meter_id: "N/A", consumption: 0 }
    );

    // Filter zones with non-zero consumption
    const validZones = consumptionData.filter(zone => zone.consumption > 0);

    // Find low zone (min among valid)
    const lowZone = validZones.length > 0
      ? validZones.reduce((prev, current) => (prev.consumption < current.consumption ? prev : current))
      : { meter_id: "N/A", consumption: 0 };

    // Calculate other zones (excluding high and low zone)
    const otherZone = validZones
      .filter(zone => zone.meter_id !== highZone.meter_id && zone.meter_id !== lowZone.meter_id)
      .reduce((sum, zone) => sum + zone.consumption, 0);

    // Return structured result
    return {
      data: {highZone,
      lowZone,
      otherZoneConsumption: parseFloat(otherZone.toFixed(1)) // ensure 1 decimal
    } };
  } catch (error) {
    throw error;
  }
}


async function fetchConsumption(startDateTime, endDateTime) {
  const [rows] = await pool.query(
    `SELECT 
      energy_meter_id,
      MAX(CASE WHEN kVAh > 0 THEN kVAh ELSE NULL END) -
      MIN(CASE WHEN kVAh > 0 THEN kVAh ELSE NULL END) AS kVAh_difference
     FROM modbus_data
     WHERE timestamp BETWEEN ? AND ?
      AND energy_meter_id BETWEEN 1 AND 12
     GROUP BY energy_meter_id`,
     [startDateTime,endDateTime]
  );
  return rows.map(({ energy_meter_id,kVAh_difference})=>({
    energy_meter_id,
    consumption: kVAh_difference !== null ? parseFloat(kVAh_difference).toFixed(1) : 0
  }));
}

async function fetchHourlyConsumption(startDateTime, endDateTime) {
  const query = `
  SELECT
  DATE_FORMAT(timestamp, '%Y-%m-%d %H:00:00') AS hour,
  energy_meter_id,
  ROUND(MAX(kVAh) - MIN(kVAh),1) AS kVAh_difference
FROM modbus_data
WHERE timestamp BETWEEN ? AND ?
  AND energy_meter_id BETWEEN 1 AND 11
GROUP BY energy_meter_id, hour
ORDER BY hour ASC;
  `;

  try {
    const [rows] = await pool.query(query, [startDateTime, endDateTime]);

    const hourlyConsumption = rows.reduce((acc, { hour, kVAh_difference }) => {
      acc[hour] = (acc[hour] || 0) + (parseFloat(kVAh_difference) || 0); // sum first
      return acc;
    }, {});

    // Round only the final result per hour
    const roundedResult = Object.entries(hourlyConsumption).reduce((acc, [hour, value]) => {
      acc[hour] = parseFloat(value.toFixed(1));
      return acc;
    }, {});

    return roundedResult;
  } catch (error) {
    throw error;
  }
}

async function getConsumptionCost(startDateTime, endDateTime) {
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

  const totalCost = parseFloat(
    rows.reduce((sum, row) => sum + (row.totalCost || 0), 0).toFixed(2)
  );

  return totalCost;
}




router.get('/dashboardpt1', async (req, res) => {
  try {
    const { startDateTime, endDateTime } = req.query;
    if (!startDateTime || !endDateTime) {
      return res.status(400).json({ error: 'startDateTime and endDateTime required' });
    }

    const [kVAh, kWh, peak, totalCost, meterWiseConsumption,hlCons,hourlyConsumption ] = await Promise.all([
      getKVAhConsumption(startDateTime, endDateTime),
      getKWhConsumption(startDateTime, endDateTime),
      getPeakDemand(startDateTime, endDateTime),
      getConsumptionCost(startDateTime, endDateTime),
      fetchConsumption(startDateTime, endDateTime),
      gethlcons(startDateTime, endDateTime),
      fetchHourlyConsumption(startDateTime, endDateTime),
    ]);
    console.log('Dashboard data fetched successfully:', { kVAh, kWh, peak });

    res.status(200).json({
      consumptionkVAh: kVAh,
      consumptionkWh: kWh,
      peakDemand: peak,
      totalCost: totalCost,
      hlCons,
      meterWiseConsumption,
      hourlyConsumption,
    });

  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data', details: err.message });
  }
});

module.exports = router;
