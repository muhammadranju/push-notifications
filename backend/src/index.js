import cors from "cors";
import express from "express";
import { sendPushNotifications, sendSingleNotification } from "./helpers/sendPushNotifications.js";

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
    const { title, body, image, tokens: token } = req.body; // single token

    console.log(req.body);

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token is required",
      });
    }
    const tk = [
      "d1zN2vqb8iLiArA9CbZn7p:APA91bEUnfxRfX6F3U_bzt05pjNxUj4o_X5QI7JUqFLSOpeNQbCGNc6z0jhE6YZbLDl1hfUC9z_rhzY9XV8YDcCrtc0oYkI9-FCnGSLnVEKojdWh7QKa900",
      "c3oyOX0nR8lsmXgP5JkxD8:APA91bHl8S5z3mwCmdPv7SdkYCrWQ6Il99CKpWrayUVzZTWl3hxAdaMRq2gkucFj2wWIvxusE9njdb34FIwYXln5kIyrUnaFRAgGJj4mD8g4eZnKjIjG33A",
    ];
    // const response = await sendSingleNotification(token, title, body, image);
    const response = await sendPushNotifications(tk, title, body, image);

    return res.json({ success: true, response });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// app.post("/send-notification", async (req, res) => {
//   try {
//     const { title, body, image, tokens } = req.body;

//     const message = {
//       notification: { title, body },
//       webpush: { notification: { image } },
//     };

//     const response = await admin.messaging().sendEachForMulticast({
//       tokens,
//       ...message,
//     });
//     return res.json({ success: true, response });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// });

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
