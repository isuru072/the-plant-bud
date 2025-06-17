

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { scheduleWateringCheck } from './services/schedule.js';
import { uploadPlants } from './services/firebase-service.js';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('🌿 Plant Tracker Local Server Running'));

app.post('/upload-plants', async (req, res) => {
  try {
    const result = await uploadPlants();
    res.status(200).json(result);
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  scheduleWateringCheck(); // Start scheduler
});
