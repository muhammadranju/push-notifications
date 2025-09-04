import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Type definitions for the notification functions
interface NotificationMessage {
  title: string;
  body: string;
  image?: string;
}

interface SendPushNotificationsResponse {
  successCount: number;
  failureCount: number;
  responses: any[];
}

// Initialize Firebase admin
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase service account (always relative to this file)
const serviceAccountPath = path.join(__dirname, "..", "serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send notifications to multiple tokens
export const sendPushNotifications = async (
  tokens: string[],
  title: string,
  body: string,
  image?: string
): Promise<SendPushNotificationsResponse> => {
  const message: NotificationMessage = {
    title,
    body,
    image,
  };

  const response = await admin.messaging().sendEachForMulticast({
    tokens,
    ...message,
  });
  return response;
};

// Function to send a single notification to a token
export const sendSingleNotification = async (
  token: string,
  title: string,
  body: string,
  image?: string
): Promise<any> => {
  const message: NotificationMessage = {
    title,
    body,
    image,
  };

  const response = await admin.messaging().send({
    token,
    ...message,
  });
  return response;
};
