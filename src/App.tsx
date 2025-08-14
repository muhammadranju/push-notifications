/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getToken, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import { messaging } from "./firebase";
import toast from "react-hot-toast";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Request notification permission and get FCM token
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (currentToken) {
          console.log("FCM Token:", currentToken);
          setToken(currentToken);
        } else {
          console.warn("No token retrieved.");
        }
      } else {
        alert("You denied notification permissions");
      }
    } catch (err) {
      console.error("Error getting token:", err);
    }
  };

  // Send notification to backend
  const sendNotification = async () => {
    if (!token) {
      alert("Token not available");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, title, body, image: imageUrl }),
      });

      const data = await response.json();
      if (data.success) {
        toast("Notification sent successfully!");
      } else {
        toast(`Error sending notification: ${data.error}`);
      }
    } catch (err) {
      console.error("Send notification error:", err);
      toast(`Failed to send notification `);
    }
  };

  useEffect(() => {
    requestPermission();

    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      if (payload.notification?.title) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: "/logo192.png", // optional local icon
          // @ts-ignore
          image: payload.notification.image, // display image if provided
        });
      }
    });
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Firebase Push Notifications</h1>

      <label className="block mb-2 font-semibold">FCM Token:</label>
      <textarea
        readOnly
        value={token || ""}
        className="w-full h-24 p-2 border border-gray-300 rounded mb-6"
      />

      <div className="mb-4">
        <label className="block font-semibold mb-1">Notification Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter title"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Notification Body:</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter message body"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Image URL:</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter image URL"
        />
      </div>

      <button
        onClick={sendNotification}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Send Notification
      </button>
    </div>
  );
}

export default App;
