const express = require('express');
const router = express.Router();
const pool = require('./db.js');

function getTariffRate(hour) {
  if (hour >= 5 && hour < 10) {
    return { period: "Off-Peak Tariff (05:00 - 10:00)", rate: 6.035 }; 
  } else if (hour >= 10 && hour < 19) {
    return { period: "Normal Tariff (10:00 - 19:00)", rate: 7.10 }; 
  } else if ((hour >= 19 && hour <= 23) || (hour >= 0 && hour < 3)) {
    return { period: "Peak Tariff (19:00 - 03:00)", rate: 8.165 }; 
  } else if (hour >= 3 && hour < 5) {
    return { period: "Normal Tariff (03:00 - 05:00)", rate: 7.10 }; 
  }
  return { period: "Unknown Tariff", rate: 0 }; 
}

async function fetchHourlyCostConsumption(startDateTime, endDateTime) {
  const query = `
    SELECT
      DATE_FORMAT(timestamp, '%Y-%m-%d %H:00:00') AS hour,
      energy_meter_id,
      MAX(CASE WHEN kVAh > 0 THEN kVAh ELSE NULL END) - MIN(CASE WHEN kVAh > 0 THEN kVAh ELSE NULL END) AS kVAh_difference
    FROM modbus_data
    WHERE timestamp BETWEEN ? AND ?
      AND energy_meter_id BETWEEN 1 AND 11
    GROUP BY energy_meter_id, hour
    ORDER BY hour ASC
  `;

  try {
    const [rows] = await pool.query(query, [startDateTime, endDateTime]);

    const hourlyCostConsumption = rows.reduce((acc, { hour, kVAh_difference }) => {
      const roundedDifference = parseFloat(kVAh_difference || 0).toFixed(1);
      const date = new Date(hour);
      const tariff = getTariffRate(date.getHours()); 
      const cost = parseFloat(roundedDifference) * tariff.rate; 

      if (!acc[hour]) {
        acc[hour] = 0;
      }
      acc[hour] += parseFloat(cost.toFixed(2)); 
      return acc;
    }, {});

    return hourlyCostConsumption;
  } catch (error) {
    throw error;
  }
}

router.get('/hcostconsumption', async (req, res) => {
  const { startDateTime, endDateTime } = req.query;

  if (!startDateTime || !endDateTime) {
    console.warn('Missing required query parameters:', { startDateTime, endDateTime });
    return res.status(400).json({ error: 'startDateTime and endDateTime are required' });
  }

  try {
    const costConsumptionData = await fetchHourlyCostConsumption(startDateTime, endDateTime);

    const roundedCostConsumptionData = Object.entries(costConsumptionData).reduce((acc, [hour, value]) => {
      acc[hour] = parseFloat(value).toFixed(1); 
      return acc;
    }, {});

    res.status(200).json({ consumptionData: roundedCostConsumptionData });
  } catch (error) {
    console.error('Error in /hcostconsumption route:', error.message);
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;