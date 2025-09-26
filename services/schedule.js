import {
  sendPushNotification,
  getPlantsFromFirebase,
} from "./firebase-service.js";
import cron from "node-cron";

// Instead of running cron inside serverless, expose a function
export async function scheduleWateringCheck() {
  const plants = await getPlantsFromFirebase();
  const now = new Date();

  console.log("Checking plants for watering...");

  plants.forEach((plant) => {
    const next = new Date(plant.nextWatering.seconds * 1000);
    const diff = (next - now) / 60000;

    console.log(diff);

    console.log(
      `Water ${plant.name} - Time to water your plant at ${next.toLocaleTimeString()} on ${next.toLocaleDateString()}!`
    );

    // Example: trigger notification if time is near
    // if (diff >= 0 && diff <= 1) {
    //   sendPushNotification(
    //     plant.token,
    //     `Water ${plant.name}`,
    //     `Time to water your ${plant.name}!`
    //   );
    // }
  });
}
