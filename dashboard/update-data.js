// KARA Dashboard Data Updater
// This script runs periodically to fetch data from skills and update data.json

const fs = require('fs');
const path = require('path');
const os = require('os');

// Paths
const DATA_FILE = path.join(__dirname, 'data.json');

// Main function
async function update() {
  console.log('🔄 Updating dashboard data...');
  
  try {
    // 1. Read current data
    let data = { projects: [], activity: [], stats: {} };
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }

    // 2. Fetch System Stats
    const systemStats = getSystemStats();
    data.system = systemStats;

    // 3. TODO: Fetch Social Data (Postiz)
    // const socialData = await fetchPostizData();
    // data.social = socialData;

    // 4. Update Global Stats
    data.lastUpdated = new Date().toISOString();
    
    // 5. Write back
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('✅ Dashboard updated successfully');

  } catch (error) {
    console.error('❌ Failed to update dashboard:', error);
    process.exit(1);
  }
}

// Get basic system stats
function getSystemStats() {
  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  const usedMem = totalMem - freeMem;
  const memPercent = Math.round((usedMem / totalMem) * 100);
  
  const uptime = os.uptime(); // seconds
  const uptimeDays = Math.floor(uptime / 86400);
  const uptimeHours = Math.floor((uptime % 86400) / 3600);

  return {
    memory: {
      used: formatBytes(usedMem),
      total: formatBytes(totalMem),
      percent: memPercent
    },
    uptime: `${uptimeDays}d ${uptimeHours}h`,
    platform: `${os.type()} ${os.release()}`,
    cpu: os.cpus()[0].model
  };
}

// Helper: Format bytes
function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Run
update();
