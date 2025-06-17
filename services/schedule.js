import cron from "node-cron";
import {
  sendPushNotification,
  getPlantsFromFirebase,
} from "./firebase-service.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const plants = await getPlantsFromFirebase();

function scheduleWateringCheck() {
cron.schedule("*/20 * * * * *", () => {
    const now = new Date();

    console.log("Checking plants for watering...");

    plants.forEach((plant) => {
        const next = new Date(plant.nextWatering.seconds * 1000);
        const diff = (next - now) / 60000;

        console.log(diff);
      
        console.log(
            `Water ${plant.name} - Time to water your plant at ${next.toLocaleTimeString()} on ${next.toLocaleDateString()}!`
        );
        //   if (diff >= 0 && diff <= 1) {
        //     // sendPushNotification(
        //     //   plant.token,
        //     //   `Water ${plant.name}`,
        //     //   `Time to water your ${plant.name}!`
        //     // );
        //     console.log(`Water ${plant.name} - Time to water your ${plant.name}!`);

        //   }
    });
});
}

export { scheduleWateringCheck };
