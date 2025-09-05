const cron = require('node-cron');
const { exec } = require('child_process');

cron.schedule('0 9 * * *', () => {
  console.log('⏰ Running daily report script at 9 AM');

  exec('node dailyReportWriter.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`⚠️ Stderr: ${stderr}`);
      return;
    }
    console.log(`✅ Output: ${stdout}`);
  });
}, {
  timezone: "Asia/Kolkata"
});
