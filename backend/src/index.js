import cors from "cors";
import express from "express";
import {
  sendPushNotifications,
  sendSingleNotification,
} from "./helpers/sendPushNotifications.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

// Send notification to all registered tokens
app.post("/send-notification", async (req, res) => {
  try {
    const { title, body, image, tokens } = req.body;

    if (!tokens.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Token is required",
      });
    }

    const response = await sendPushNotifications(tokens, title, body, image);

    if (!response.successCount > 0) {
      return res.json({ success: false, response: "Invalid token" });
    }

    return res.json({ success: true, response });
  } catch (err) {
    // console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/send-single-notification", async (req, res) => {
  try {
    const { title, body, image, token } = req.body; // single token

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token is required",
      });
    }

    const response = await sendSingleNotification(token, title, body, image);

    return res.json({ success: true, response });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
