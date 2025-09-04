import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase service account (always relative to this file)
const serviceAccountPath = path.join(__dirname, "..", "serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendPushNotifications = async (tokens, title, body, image) => {
  const message = {
    notification: { title, body },
    webpush: { notification: { image } },
  };
  console.log(tokens);

  const response = await admin.messaging().sendEach({
    tokens,
    ...message,
  });
  return response;
};

export const sendSingleNotification = async (token, title, body, image) => {
  const message = {
    token,
    notification: { title, body },
    webpush: { notification: { image } },
  };

  const response = await admin.messaging().send(message);
  return response;
};
