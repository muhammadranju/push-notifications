import admin, { messaging } from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Initialize Firebase Admin SDK
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase service account (always relative to this file)
const serviceAccountPath = path.join(__dirname, "..", "serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Type definitions for notifications
interface NotificationMessage {
  title: string;
  body: string;
  image?: string;
}

// Function to send notifications to multiple tokens (users)
export const sendPushNotifications = async (
  tokens: string[],
  title: string,
  body: string,
  image?: string
) => {
  const messages = tokens.map((token) => ({
    token,
    notification: { title, body },
    webpush: { notification: { image } },
  }));

  try {
    const response = await admin.messaging().sendEach(messages); // Sending the notifications
    console.log("Notification send response:", response);
    return response;
  } catch (error) {
    console.error("Error sending notifications:", error);
    throw error; // Let the error propagate
  }
};

// Function to send a notification to a single token (user)
export const sendSingleNotification = async (
  token: string,
  title: string,
  body: string,
  image?: string
) => {
  const message: NotificationMessage = {
    title,
    body,
    image,
  };

  try {
    const response = await admin.messaging().send({ token, ...message });
    return response; // Send the notification
  } catch (error) {
    console.error("Error sending single notification:", error);
    throw error; // Let the error propagate for further handling
  }
};
