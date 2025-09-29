import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { scheduleWateringCheck } from "./services/schedule.js";
import { uploadPlants, getPlants } from "./services/firebase-service.js";
import serverless from "serverless-http";
import { gemini_service } from "./services/gemini-service.js";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("🌿 Plant Tracker Local Server Running"));
app.get("/hey_buddy", async (req, res) => {
  const { title, plantedDate } = req.query;
  try {
    const geminiResult = await gemini_service(title, plantedDate);
    res.status(200).json({ success: true, geminiResult });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/get-plants", async (req, res) => {
  try {
    const plants = await getPlants();
    res.status(200).json({ success: true, plants });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/upload-plants", async (req, res) => {
  try {
    const result = await uploadPlants();
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  scheduleWateringCheck(); // Start scheduler
});

// module.exports.handler = serverless(app);
export const handler = serverless(app); // Export for serverless environments
export default app; // Export for local testing
