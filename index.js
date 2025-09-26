

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { scheduleWateringCheck } from './services/schedule.js';
import { uploadPlants } from './services/firebase-service.js';
import serverless from 'serverless-http';

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

app.get('/run-schedule', async (req, res) => {
  try {
    await scheduleWateringCheck();
    res.status(200).json({ success: true, message: 'Watering check executed ✅' });
  } catch (error) {
    console.error('❌ Schedule error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});



// // only run listen() if not in serverless (local dev mode)
// if (process.env.NODE_ENV !== 'production') {
//   const port = process.env.PORT || 3000;
//   app.listen(port, () => {
//     console.log(`🚀 Local server running at http://localhost:${port}`);
//     scheduleWateringCheck();
//   });
// }

//export const handler = serverless(app); // Export for serverless environments
export default app; // Export for local testing