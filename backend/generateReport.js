const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const mysql = require('mysql2/promise');

const REPORT_DIR = path.join(__dirname, './reports'); 
if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR);

const dbConfig = {
  host: '18.188.231.51',
  user: 'admin',
  password: '2166',
  database: 'metalware',
};

async function getPreviousDayConsumption(date) {
  const pool = await mysql.createPool(dbConfig);

  const start = `${date} 08:00:00`;
  const endDate = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000);
  const end = `${endDate.slice(0, 10)} 08:00:00`;

  const [rows] = await pool.query(
    `SELECT energy_meter_id, ROUND(MAX(kWh) - MIN(kWh), 2) AS consumption
     FROM modbus_data
     WHERE timestamp BETWEEN ? AND ?
     GROUP BY energy_meter_id`,
    [start, end]
  );

  await pool.end();

  const total = rows.reduce((sum, row) => sum + (row.consumption || 0), 0);
  return { date, totalConsumption: total };
}

async function writeToExcel(consumptionData, reportPath) {
  let workbook;
  let worksheet;

  if (fs.existsSync(reportPath)) {
    workbook = XLSX.readFile(reportPath);
    worksheet = workbook.Sheets['Report'];
  } else {
    workbook = XLSX.utils.book_new();
    worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  }

  const existingData = XLSX.utils.sheet_to_json(worksheet);
  const newData = [...existingData, consumptionData];

  const newSheet = XLSX.utils.json_to_sheet(newData);
  workbook.Sheets['Report'] = newSheet;
  XLSX.writeFile(workbook, reportPath);
}

async function main() {
  const today = new Date();
  const reportMonth = today.toISOString().slice(0, 7); 
  const reportPath = path.join(REPORT_DIR, `${reportMonth}-energy-report.xlsx`);

  const reportDate = new Date(today.getTime() - 24 * 60 * 60 * 1000).slice(0, 10);

  const consumption = await getPreviousDayConsumption(reportDate);
  await writeToExcel(consumption, reportPath);

  console.log(`✅ Updated report for ${reportDate}: ${consumption.totalConsumption} kWh`);
}

main();
