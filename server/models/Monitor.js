/* =========================================
   MONITOR MODEL (The Blueprint)
   ========================================= */
import mongoose from 'mongoose';

// Define what a "Monitor" looks like in our database
const monitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
  },
  url: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['UP', 'DOWN', 'PENDING'], 
    default: 'PENDING' 
  },
  lastChecked: {
    type: Date,
    default: Date.now
  },
  uptimeHistory: [
    {
      timestamp: { type: Date, default: Date.now },
      responseTime: { type: Number }, 
      status: { type: String } 
    }
  ]
});

// Export using ES Module syntax
export default mongoose.model('Monitor', monitorSchema);