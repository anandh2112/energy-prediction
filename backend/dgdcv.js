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
    connectionLimit: 10
});

async function fetchDGDCV(startDateTime, endDateTime, DGNo) {
    const query = `SELECT timestamp, avg_vln_value, avg_current_value FROM modbus_data 
    WHERE energy_meter_id = ? AND timestamp BETWEEN ? AND ? ORDER BY timestamp DESC LIMIT 1`;

    return new Promise((resolve, reject) => {
        pool.query(query, [DGNo, startDateTime, endDateTime], (error, results) => {
            if (error) {
                reject (error);
            } else {
                resolve(results[0] || null);
            }
        });
    });
}

router.get('/dgdcv', async (req,res) => {
    const { startDateTime, endDateTime, DGNo } = req.query;
    try {
        const data = await fetchDGDCV(startDateTime, endDateTime, DGNo);
        let formattedData = {};
        if (data) {
            formattedData = {
                avg_vln_value: data.avg_vln_value,
                avg_current_value: data.avg_current_value,
                timestamp: moment.tz(data.timestamp, 'Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
            }
        }
        res.json({
            dgdcv:{
                [DGNo]: formattedData
            }
        });
    } catch (err) {
        throw err;

    }
})

module.exports = router;