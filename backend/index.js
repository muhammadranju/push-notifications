import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// Load Firebase service account
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve("./serviceAccountKey.json"), "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Send notification to all registered tokens
app.post("/send-notification", async (req, res) => {
  try {
    const { title, body, image, tokens } = req.body;
    console.log(tokens);

    const message = {
      notification: { title, body },
      webpush: { notification: { image } },
    };

    const response = await admin.messaging().sendEachForMulticast({
      tokens: tokens,
      ...message,
    });
    return res.json({ success: true, response });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
