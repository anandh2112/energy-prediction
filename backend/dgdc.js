const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'18.188.231.51',
    user:'admin',
    password:'2166',
    database:'metalware',
    waitForConnections:true,
    connectionLimit:10
});

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
    const [rows] = await pool.promise().query(query, [startDateTime, endDateTime]);
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

router.get('/dgdc', async (req,res) => {
    const { startDateTime, endDateTime} = req.query;
    console.log(startDateTime,endDateTime);
    const dgdcData = await fetchDGDC(startDateTime, endDateTime);
    console.log(dgdcData);
    res.json(dgdcData)
});

module.exports = router;