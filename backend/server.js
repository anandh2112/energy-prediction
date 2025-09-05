const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('./scheduler'); 
const fs = require('fs');
const { spawn } = require('child_process');
const { Pool } = require('pg');

const reportsDir = path.join(__dirname, 'monthly_reports');
const energyRoutes = require('./hconsumption');
const meterRoutes = require('./econsumption');
const ehConsumptionRoutes = require('./ehconsumption');
const zConsumptionRoutes = require('./zconsumption');
const oPeakDemandRoutes = require('./opeakdemand');
const mbConsumptionRoutes = require('./mbconsumption');
const mcconspeakRoutes = require('./mcconspeak');
const ConsumptionRoutes = require('./consumption');
const mcconsRoutes = require('./mccons');
const mcapconsRoutes = require('./mcapcons');
const hlconsRoutes = require('./hlcons');
const mcpeakRoutes = require('./mcpeak');
const pfRoutes = require('./pf');
const hkVAhRoutes = require('./hkVAhconsumption');
const zkVAhConsumptionRoutes = require('./zkVAhconsumption');
const ccRoutes = require('./cc');
const apdRoutes = require('./apd');
const DashboardRoutes = require('./dashboardpt1');
const hcostconsumptionRoutes = require('./hcostconsumption');
const authRoute = require('./auth');
const heartBeatRoute = require('./heartbeat');
const filesRoute = require('./fileF');
const mrRoute = require('./meterreading');
const zkVARoute = require('./zkVA');
const zkVAazRoute = require('./zkVAaz');
const dgdcRoute = require('./dgdc');
const dgdRoute = require('./dgd');
const dgdcvRoute = require('./dgdcv');
const dgdrtRoute = require('./dgdrt');
const dgdkWhdiffRoute = require('./dgdkWhdiff');
const zkVAhAZconsumption = require('./zkVAhAZconsumption');
const zkWhAZconsumption = require('./zkWhAZconsumption');
const dashboardpt1Route = require('./dashboardpt1');
const dashboardpt2Route = require('./dashboardpt2');
const opeakdemandmbRoute = require('./opeakdemandmb');
const zkVAazmbRoute = require('./zkVAazmb');
const app = express();
const port = 3001;

const baseFolderPath = '/Users/jonathanprince/Documents/Work/filesTest';

// DB Config
const DB_CONFIG = {
  host: 'localhost',
  database: 'energydb',
  user: 'postgres',
  password: '123',
  port: 5432,
};
const pool = new Pool(DB_CONFIG);

app.use('/reports', express.static(path.join(__dirname, 'monthly_reports')));
app.use('/uploads', express.static(baseFolderPath));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', energyRoutes);
app.use('/api', meterRoutes);
app.use('/api', ehConsumptionRoutes);
app.use('/api', zConsumptionRoutes);
app.use('/api', oPeakDemandRoutes);
app.use('/api', mbConsumptionRoutes);
app.use('/api', mcconspeakRoutes);
app.use('/api', ConsumptionRoutes);
app.use('/api', mcconsRoutes);
app.use('/api', hlconsRoutes);
app.use('/api', mcpeakRoutes);
app.use('/api', pfRoutes);
app.use('/api', hkVAhRoutes);
app.use('/api', zkVAhConsumptionRoutes);
app.use('/api', ccRoutes);
app.use('/api', apdRoutes);
app.use('/api', DashboardRoutes);
app.use('/api', hcostconsumptionRoutes);
app.use('/api', mcapconsRoutes);
app.use('/api', authRoute);
app.use('/api', heartBeatRoute);
app.use('/api', filesRoute);
app.use('/api', mrRoute);
app.use('/api', zkVARoute);
app.use('/api', zkVAazRoute);
app.use('/api', dgdcRoute);
app.use('/api', dgdRoute);
app.use('/api', dgdcvRoute);
app.use('/api', dgdrtRoute);
app.use('/api', dgdkWhdiffRoute);
app.use('/api', zkVAhAZconsumption);
app.use('/api', zkWhAZconsumption);
app.use('/api', dashboardpt1Route);
app.use('/api', dashboardpt2Route);
app.use('/api', opeakdemandmbRoute);
app.use('/api', zkVAazmbRoute);

// Endpoint to run prediction.py and fetch prediction table data
app.get('/api/prediction-data', async (req, res) => {
  try {
    const pythonProcess = spawn('python', [
      path.join(__dirname, '../src/power forecasting/prediction.py'),
    ]);

    let pythonStdout = '';
    let pythonStderr = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonStdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      pythonStderr += data.toString();
    });

    pythonProcess.on('close', async (code) => {
      console.log('Python stdout:', pythonStdout);
      console.log('Python stderr:', pythonStderr);

      if (code !== 0) {
        console.error(`prediction.py exited with code ${code}`);
        return res.status(500).json({ error: 'Prediction script failed', details: pythonStderr });
      }

      try {
        const result = await pool.query('SELECT * FROM prediction ORDER BY hour ASC');
        return res.json(result.rows);
      } catch (dbErr) {
        console.error('DB error:', dbErr);
        return res.status(500).json({ error: 'Database error' });
      }
    });
  } catch (err) {
    console.error('Error running prediction:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ New endpoint for prediction_history with formatted date
app.get('/api/prediction-history', async (req, res) => {
  try {
    const { date } = req.query;

    let query = 'SELECT id, TO_CHAR(date, \'YYYY-MM-DD\') AS date, hour, predicted_kVAh FROM prediction_history';
    const params = [];

    if (date) {
      query += ' WHERE date = $1 ORDER BY hour ASC';
      params.push(date);
    } else {
      query += ' ORDER BY date DESC, hour ASC';
    }

    const result = await pool.query(query, params);
    return res.json(result.rows);
  } catch (err) {
    console.error('Error fetching prediction history:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/download-report/:filename', (req, res) => {
  const file = path.join(reportsDir, req.params.filename);
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.filename}`);
  
  const fileStream = fs.createReadStream(file);
  fileStream.pipe(res);
  
  fileStream.on('error', (err) => {
    console.error('Error streaming file:', err);
    res.status(500).send('Error downloading file');
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
