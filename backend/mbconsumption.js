const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

const pool = mysql.createPool({
  host: '18.188.231.51',
  user: 'admin',
  password: '2166',
  database: 'metalware',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

router.get('/mbconsumption', async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  const currentTime = req.query.currentTime;

  try {
    console.log(`Fetching consumption data for year: ${year}, up to: ${currentTime || 'full year'}`);

    const queryParams = [year];
    let timeCondition = '';

    // If `currentTime` is provided, limit the data up to that timestamp
    if (currentTime) {
      timeCondition = 'AND timestamp <= ?';
      queryParams.push(currentTime);
    }

    const [rows] = await pool.promise().query(
      `
      SELECT 
        DATE_FORMAT(timestamp, '%Y-%m-%d') AS date, 
        MAX(kWh) AS max_kWh, 
        MIN(kWh) AS min_kWh 
      FROM modbus_data 
      WHERE YEAR(timestamp) = ? ${timeCondition}
      GROUP BY date
      HAVING max_kWh > 0 AND min_kWh > 0
      `,
      queryParams
    );

    console.log(`Fetched ${rows.length} rows of data`);

    // Calculate daily consumption and sum up for each month
    const monthlyConsumption = Array(12).fill(0);
    rows.forEach((row) => {
      const date = new Date(row.date);
      const month = date.getMonth(); // 0 = January, 11 = December
      const dailyConsumption = row.max_kWh - row.min_kWh;

      if (dailyConsumption > 0) {
        monthlyConsumption[month] += dailyConsumption;
      }
    });

    console.log('Final Monthly Consumption:', monthlyConsumption);

    res.json({ success: true, monthlyConsumption });
  } catch (error) {
    console.error('Error fetching monthly consumption:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
