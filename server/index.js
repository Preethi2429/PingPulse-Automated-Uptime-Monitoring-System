/* =========================================
   1. IMPORTS & CONFIGURATION
   ========================================= */
import { startMonitoring } from './utils/uptimeWorker.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' }); // Explicitly tells Node where to look
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Import our routes (Extension .js is required!)
import monitorRoutes from './routes/monitorRoutes.js'; 

const app = express();

/* =========================================
   2. MIDDLEWARE
   ========================================= */
app.use(cors());
app.use(express.json());

/* =========================================
   3. DATABASE CONNECTION
   ========================================= */
// TEMPORARY FIX: Paste your actual string here
const DB_URI = "mongodb+srv://preethi810895_db_user:B1Hvr37leK0lGdPJ@cluster0.g3xv9be.mongodb.net/?appName=Cluster0";

console.log("Connecting to Database..."); // Removed the variable print for now

mongoose.connect(DB_URI) // Use the variable we just made
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));



/* =========================================
   4. ROUTES
   ========================================= */
app.get('/', (req, res) => {
  res.send('PingPulse Backend is Running!');
});

// Use the monitor routes
app.use('/api/monitors', monitorRoutes);

/* =========================================
   5. SERVER START
   ========================================= */
// Start the Background Worker

startMonitoring();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});