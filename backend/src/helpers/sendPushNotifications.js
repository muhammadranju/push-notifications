import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Initialize Firebase Admin SDK
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase service account (always relative to this file)
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send notifications to multiple tokens (users)
export const sendPushNotifications = async (tokens, title, body, image) => {
  // console.log(tokens);
  const messages = tokens.map((token) => ({
    token,
    notification: { title, body },
    webpush: { notification: { image } },
  }));

  try {
    const response = await admin.messaging().sendEach(messages);
    // Log the detailed response
    // console.log("Notification send response:", response);
    return response;
  } catch (error) {
    console.error("Error sending notifications:", error);
    if (error instanceof admin.firestore.FirestoreError) {
      console.error("Firestore specific error:", error);
    }
    throw error; // Let the error propagate
  }
};

// Function to send a notification to a single token (user)
export const sendSingleNotification = async (token, title, body, image) => {
  const message = {
    token,
    notification: { title, body },
    webpush: { notification: { image } },
  };

  try {
    // Send the notification
    const response = await admin.messaging().send(message); // Single message to one token
    return response;
  } catch (error) {
    console.error("Error sending single notification:", error);
    throw error; // Let the error propagate for further handling
  }
};
