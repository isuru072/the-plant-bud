import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

export async function gemini_service(plantTitle, plantedDate) {
  const _apiKey = process.env.GOOGLE_APIKEY;

  const prompt =
    "I have a plant called " +
    plantTitle +
    ", planted on " +
    plantedDate +
    ". Please provide: \n 1. A recommended watering schedule. \n 2. Sub-variations of this plant. \n 3. Common diseases affecting it.\n 4. Countries where this plant is commonly found.";

  const ai = new GoogleGenAI({ apiKey: _apiKey });

  main();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log(response.text);
    return response;
  } catch (e) {
    print("❌ Gemini API Error: $e");
    return null;
  }
}
