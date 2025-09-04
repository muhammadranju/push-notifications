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
    const { title, body, image, tokens } = req.body; // single token

    // console.log(req.body);

    // if (!token) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "Token is required",
    //   });
    // }
    const token = [
      "c3oyOX0nR8lsmXgP5JkxD8:APA91bHl8S5z3mwCmdPv7SdkYCrWQ6Il99CKpWrayUVzZTWl3hxAdaMRq2gkucFj2wWIvxusE9njdb34FIwYXln5kIyrUnaFRAgGJj4mD8g4eZnKjIjG33A",
      "d1zN2vqb8iLiArA9CbZn7p:APA91bG9wKnD1qdgrKUdCfkGGiJORemtlF85awPOts7lgE8aoa51M48M7Nj9cgafEnXsA__uJHEw4wuthxlhGghPyVBSrwt_OgPpcnObvIdPO1jKdfyxUhQ",
    ];

    // const response = await sendSingleNotification(token, title, body, image);
    const response = await sendPushNotifications(token, title, body, image);
    console.log("response", response);

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
