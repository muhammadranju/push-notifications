/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getToken, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import { messaging } from "./firebase";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [tokensList, setTokensList] = useState<string[]>([]); // for multiple tokens

  // Request notification permission and get FCM token
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

        const currentToken = await getToken(messaging, {
          vapidKey:
            "BI1vK68MGFOnPc3YxMTmOvOJ22bnbrXnWokhavlWWJxHO2Kt0VlC3gzv66Vxsl-b37fmjcFQmLLs-0lXuTEo2aw",
          serviceWorkerRegistration: registration,
        });

        if (currentToken) {
          console.log("FCM Token:", currentToken);
          Cookies.set("token", currentToken);
          setToken(currentToken);
        } else {
          console.warn("No token retrieved.");
        }
      } else {
        toast("You denied notification permissions");
      }
    } catch (err) {
      console.error("Error getting token:", err);
    }
  };

  // Send notification to backend
  const sendNotification = async () => {
    const allTokens = tokensList.length ? tokensList : token ? [token] : [];
    if (allTokens.length === 0) {
      toast("No tokens available");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          image: imageUrl,
          tokens: allTokens,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast("Notification sent successfully!");
      } else {
        toast(`Error sending notification: ${data.error}`);
      }
    } catch (err) {
      console.error("Send notification error:", err);
      toast(`Failed to send notification`);
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
          icon: "/logo192.png",
          // @ts-ignore
          image: payload.notification.image,
        });
      }
    });
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 mt-24">
      <h1 className="text-3xl font-bold mb-4">Firebase Push Notifications</h1>

      <input
        type="text"
        value={title as string}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <textarea
        value={body as string}
        rows={6}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Body"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <textarea
        value={tokensList.join("\n")}
        onChange={(e) => setTokensList(e.target.value.split("\n"))}
        placeholder="Other browser tokens (one per line)"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <div className="flex flex-row justify-between w-full">
        <button
          onClick={() => {
            navigator.clipboard
              .writeText(token as string)
              .then(() => toast("Token copied to clipboard!"))
              .catch((err) => console.error("Failed to copy: ", err));
          }}
          className="bg-blue-900 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Copy Token
        </button>
        <button
          onClick={sendNotification}
          className="bg-neutral-900 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-neutral-700 transition"
        >
          Send Notification
        </button>
      </div>
    </div>
  );
}

export default App;
