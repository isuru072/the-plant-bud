import admin  from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json' with { type: 'json' };
import fs from "fs";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

function sendPushNotification(token, title, body) {
  const message = {
    notification: { title, body },
    token,
  };

  admin.messaging().send(message)
    .then(res => console.log('Notification sent:', res))
    .catch(err => console.error('Error sending notification:', err));
}

async function getPlantsFromFirebase() {
  const snapshot = await db.collection('plants').get();
  return snapshot.docs.map(doc => doc.data());
}


async function uploadPlants() {
  try {
    const data = fs.readFileSync("../data/plants.json", "utf8");
    const plants = JSON.parse(data);

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
