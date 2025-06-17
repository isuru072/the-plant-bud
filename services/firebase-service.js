import admin from "firebase-admin";
//import serviceAccount from '../serviceAccountKey.json' with { type: 'json' };
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_KEY, "base64").toString("utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

function sendPushNotification(token, title, body) {
  const message = {
    notification: { title, body },
    token,
  };

  admin
    .messaging()
    .send(message)
    .then((res) => console.log("Notification sent:", res))
    .catch((err) => console.error("Error sending notification:", err));
}

async function getPlantsFromFirebase() {
  const snapshot = await db.collection("plants").get();
  return snapshot.docs.map((doc) => doc.data());
}

async function uploadPlants() {
  try {
    const plantPath = path.join(__dirname, "../assets/plants.json");
    const plants = JSON.parse(fs.readFileSync(plantPath));

    const batch = db.batch();

    plants.forEach((plant) => {
      const docRef = db.collection("plants").doc(); // auto-generated ID
      batch.set(docRef, plant);
    });

    await batch.commit();
    console.log("✅ Successfully uploaded all plants to Firestore!");
  } catch (err) {
    console.error("❌ Error uploading plants:", err);
  }
}

export { sendPushNotification, getPlantsFromFirebase, uploadPlants };
