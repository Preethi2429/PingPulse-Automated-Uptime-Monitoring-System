import cron from 'node-cron';
import axios from 'axios';
import Monitor from '../models/Monitor.js';

// The function that checks a SINGLE monitor
const checkMonitor = async (monitor) => {
  const startTime = Date.now();
  
  try {
    // 1. Try to ping the URL
    // We set a timeout of 5 seconds (5000ms). If it takes longer, we consider it DOWN.
    const response = await axios.get(monitor.url, { timeout: 5000 });
    
    // 2. Calculate Response Time
    const duration = Date.now() - startTime;

    // 3. Update the Monitor in Database (Success)
    monitor.status = 'UP';
    monitor.lastChecked = Date.now();
    monitor.uptimeHistory.push({
      timestamp: Date.now(),
      responseTime: duration,
      status: 'UP'
    });

  } catch (error) {
    // 4. Handle Failure (Site is DOWN)
    monitor.status = 'DOWN';
    monitor.lastChecked = Date.now();
    monitor.uptimeHistory.push({
      timestamp: Date.now(),
      responseTime: 0,
      status: 'DOWN'
    });
    console.log(`❌ ${monitor.name} is DOWN: ${error.message}`);
  }

  // 5. Keep the history array short (Optional SDE Trick)
  // We only keep the last 50 checks to prevent the database from getting huge.
  if (monitor.uptimeHistory.length > 50) {
    monitor.uptimeHistory.shift(); // Remove the oldest entry
  }

  // Save changes
  await monitor.save();
};

// The Main Scheduler Function
export const startMonitoring = () => {
  console.log("⏰ Uptime Monitoring Service Started...");

  // Schedule task to run every 1 minute
  // Cron Syntax: '* * * * *' = Every minute
  cron.schedule('* * * * *', async () => {
    try {
      // 1. Get all monitors from DB
      const monitors = await Monitor.find({});

      // 2. Loop through them and check each one
      // We use Promise.all to check them in parallel (faster than one by one)
      await Promise.all(monitors.map(monitor => checkMonitor(monitor)));

      if (monitors.length > 0) {
        console.log(`✅ Checked ${monitors.length} monitors at ${new Date().toLocaleTimeString()}`);
      }

    } catch (error) {
      console.error("⚠️ Error in monitoring loop:", error);
    }
  });
};