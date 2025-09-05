const express = require('express');
const crypto = require('crypto');
const mysql = require('mysql2');
const moment = require('moment-timezone');

const pool = mysql.createPool({
  host: '18.188.231.51',
  user: 'admin',
  password: '2166',
  database: 'metalware',
  waitForConnections: true,
  connectionLimit: 10,
});

const router = express.Router();

const ENCRYPTION_KEY = '9cF7Gk2MZpQ8XvT5LbR3NdYqWjK6HsA4'; 

function decrypt(encryptedText) {
  try {
    const [ivHex, encryptedHex] = encryptedText.split(':'); 
    const iv = Buffer.from(ivHex, 'hex'); 
    const encrypted = Buffer.from(encryptedHex, 'hex'); 

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8'); 

    return decrypted; 
  } catch (error) {
    console.error('Decryption error:', error.message);
    return null; 
  }
}

router.get('/auth', (req, res) => {
  const encryptedCookie = req.cookies?.authData;
  if (!encryptedCookie) {
    return res.status(401).json({ message: 'Access Denied. No cookie provided.' });
  }

  try {
    const decryptedData = decrypt(encryptedCookie);
    if (!decryptedData) throw new Error('Invalid or corrupted cookie');
    
    const cookieData = JSON.parse(decryptedData);

    if (cookieData.auth !== "true") {
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }

    const { username, deviceName, ipAddress } = cookieData;
    const currentTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

    pool.query(
      'SELECT session_id FROM user_sessions WHERE username = ? AND device_name = ? AND ip_address = ? AND logout_time IS NULL ORDER BY login_time DESC LIMIT 1',
      [username, deviceName, ipAddress],
      (err, rows) => {
        if (err) {
          console.error('Error checking session:', err.message);
          return res.status(500).json({ message: 'Database error' });
        }

        if (rows.length > 0) {
          const sessionId = rows[0].session_id;
          pool.query(
            'UPDATE user_sessions SET last_active = ? WHERE session_id = ?',
            [currentTime, sessionId],
            (err) => {
              if (err) {
                console.error('Error updating last_active:', err.message);
                return res.status(500).json({ message: 'Database error' });
              }

              res.cookie('sessionId', sessionId, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 24 * 60 * 60 * 1000,
              });

              return res.status(200).json({
                message: 'Session updated',
                authenticated: true,
                username,
                deviceName,
                ipAddress,
              });
            }
          );
        } else {
          pool.query(
            'INSERT INTO user_sessions (username, login_time, last_active, device_name, ip_address) VALUES (?, ?, ?, ?, ?)',
            [username, currentTime, currentTime, deviceName, ipAddress],
            (err, result) => {
              if (err) {
                console.error('Error inserting session:', err.message);
                return res.status(500).json({ message: 'Database error' });
              }

              const sessionId = result.insertId;
              res.cookie('sessionId', sessionId, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 24 * 60 * 60 * 1000,
              });

              return res.status(200).json({
                message: 'New session created',
                authenticated: true,
                username,
                deviceName,
                ipAddress,
              });
            }
          );
        }
      }
    );
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({ message: 'Invalid token or authentication failed.' });
  }
});


module.exports = router;