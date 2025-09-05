const express = require('express');
const mysql = require('mysql2');
const moment = require('moment-timezone');

const router = express.Router();

const pool = mysql.createPool({
  host: '18.188.231.51',
  user: 'admin',
  password: '2166',
  database: 'metalware',
  waitForConnections: true,
  connectionLimit: 10,
});

router.post('/heartbeat', (req, res) => {
  const sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    return res.status(401).json({ message: 'Session ID not found in cookies.' });
  }

  const last_active = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

  pool.query(
    'UPDATE user_sessions SET last_active = ? WHERE session_id = ?',
    [last_active, sessionId],
    (err, result) => {
      if (err) {
        console.error('Error updating last_active:', err.message);
        return res.status(500).json({ message: 'Database error.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Session not found.' });
      }

      return res.status(200).json({ message: 'Heartbeat received. Session updated.' });
    }
  );
});

module.exports = router;
