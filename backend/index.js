// server.ts
import express from "express";

import cors from "cors";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());

// Load service account directly from file
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve("./serviceAccountKey.json"), "utf-8")
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Send push notification
app.post("/send-notification", async (req, res) => {
  try {
    const { token, title, body, image, data } = req.body;

    if (!token) return res.status(400).json({ error: "FCM token is required" });

    const message = {
      notification: {
        title: title || "Default Title",
        body: body || "Default Body",
        image: image || undefined, // make sure image is optional
      },
      data: data || {},
      token,
    };

    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
