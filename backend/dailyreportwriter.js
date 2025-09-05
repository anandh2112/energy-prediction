const fs = require('fs-extra');
const path = require('path');
const XLSX = require('xlsx');
const moment = require('moment-timezone');
const mysql = require('mysql2/promise');

const meterMap = {
  1: { name: "PLATING", category: "C-49" },
  2: { name: "DIE CASTING + CHINA BUFFING + CNC", category: "C-50" },
  3: { name: "SCOTCH BUFFING", category: "C-50" },
  4: { name: "BUFFING", category: "C-49" },
  5: { name: "SPRAY+EPL-I", category: "C-50" },
  6: { name: "SPRAY+ EPL-II", category: "C-49" },
  7: { name: "RUMBLE", category: "C-50" },
  8: { name: "AIR COMPRESSOR", category: "C-49" },
  9: { name: "TERRACE", category: "C-49" },
  10: { name: "TOOL ROOM", category: "C-50" },
  11: { name: "ADMIN BLOCK", category: "C-50" },
  12: { name: "TRANSFORMER", category: ""}
};

const pool = mysql.createPool({
  host: '18.188.231.51',
  user: 'admin',
  password: '2166',
  database: 'metalware',
});

async function fetchMinMaxReadingsBatch(startTime, endTime) {
  const readings = {};

  const [minRows] = await pool.query(`
    SELECT energy_meter_id, timestamp, kVAh, kWh
    FROM modbus_data
    WHERE timestamp BETWEEN ? AND ?
    AND energy_meter_id BETWEEN 1 AND 12
    ORDER BY energy_meter_id ASC, timestamp ASC
  `, [startTime, endTime]);

  const [maxRows] = await pool.query(`
    SELECT energy_meter_id, timestamp, kVAh, kWh
    FROM modbus_data
    WHERE timestamp BETWEEN ? AND ?
    AND energy_meter_id BETWEEN 1 AND 12
    ORDER BY energy_meter_id ASC, timestamp DESC
  `, [startTime, endTime]);

  for (let meterId = 1; meterId <= 12; meterId++) {
    const min = minRows.find(row => row.energy_meter_id === meterId);
    const max = maxRows.find(row => row.energy_meter_id === meterId);
    readings[meterId] = { min: min || {}, max: max || {} };
  }

  return readings;
}

function hasData(readings) {
  return Object.values(readings).some(({ min, max }) => min.kWh && max.kWh);
}

async function writeToExcelFile(allReadings, filePath, sheetName, noData = false) {
  let workbook;

  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
  } else {
    workbook = XLSX.utils.book_new();
  }

  if (workbook.SheetNames.includes(sheetName)) {
    console.log(`ℹ️ Sheet "${sheetName}" already exists in ${filePath}`);
    return;
  }

  const data = [];

  if (noData) {
    data.push([`Day: ${sheetName}`, "", "", "", "", ""]);
    data.push(["No Data Available"]);
  } else {
    for (const { dayLabel, readings } of allReadings) {
      data.push([`Day: ${dayLabel}`, "", "", "", "", ""]);
      data.push(["Zone", "Timestamp", "kVAh", "Consumption (kVAh)", "kWh", "Consumption (kWh)"]);

      Object.entries(readings).forEach(([meterId, { min, max }]) => {
        const zone = meterMap[meterId];
        let name = zone ? zone.name : `Meter ${meterId}`;
        if (zone?.category) {
          name += ` (${zone.category})`;
        }
      
        const cons_kvah = (parseFloat(max.kVAh) - parseFloat(min.kVAh)).toFixed(2);
        const cons_kwh = (parseFloat(max.kWh) - parseFloat(min.kWh)).toFixed(2);
      
        data.push([
          name,
          `Start D&T: ${min.timestamp ? moment(min.timestamp).format("YYYY-MM-DD HH:mm:ss") : "N/A"}`,
          min.kVAh || "N/A",
          "",
          min.kWh || "N/A",
          ""
        ]);
      
        data.push([
          "",
          `End D&T: ${max.timestamp ? moment(max.timestamp).format("YYYY-MM-DD HH:mm:ss") : "N/A"}`,
          max.kVAh || "N/A",
          isNaN(cons_kvah) ? "N/A" : cons_kvah,
          max.kWh || "N/A",
          isNaN(cons_kwh) ? "N/A" : cons_kwh,
        ]);
      });
      

      data.push([]);
    }
  }

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filePath);
  console.log(`✅ Sheet "${sheetName}" written to ${filePath}`);
}

(async () => {
  const timezone = "Asia/Kolkata";
  const now = moment().tz(timezone);
  const baseFolderPath = path.join(__dirname, 'monthly_reports');
  await fs.ensureDir(baseFolderPath);
  const monthLabel = now.format("MMMM_YYYY");
  const filePath = path.join(baseFolderPath, `Metalware_Report_${monthLabel}.xlsx`);

  // Dates
  const today = now.clone().hour(8).minute(0).second(0).millisecond(0);
  const yesterday = now.clone().subtract(1, 'day').hour(8).minute(0).second(0).millisecond(0);

  const datePairs = [
    { start: yesterday.clone(), end: today.clone(), label: yesterday.format("YYYY-MM-DD"), sheet: yesterday.format("MMMM_DD") },
    { start: today.clone(), end: now.clone(), label: today.format("YYYY-MM-DD"), sheet: today.format("MMMM_DD") }
  ];

  for (const { start, end, label, sheet } of datePairs) {
    if (fs.existsSync(filePath) && XLSX.readFile(filePath).SheetNames.includes(sheet)) {
      console.log(`ℹ️ Sheet "${sheet}" already exists, skipping...`);
      continue;
    }

    console.log(`📅 Generating report for: ${label} (${start.format()} → ${end.format()})`);

    const readings = await fetchMinMaxReadingsBatch(start.format(), end.format());
    const validData = hasData(readings);
    const allReadings = [{ dayLabel: label, readings }];

    await writeToExcelFile(allReadings, filePath, sheet, !validData);
  }

  process.exit();
})();
