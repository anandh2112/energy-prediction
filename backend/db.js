const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '18.188.231.51',
    user: 'admin',
    password: '2166',
    database: 'metalware',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;