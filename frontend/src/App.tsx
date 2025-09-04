/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getToken, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import { messaging } from "./firebase";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import SendNotification from "./components/SendNotification";
import SendSingleNotification from "./components/SendSingleNotification";
import { MdDevices, MdDevicesOther } from "react-icons/md";

function App() {
  const [token, setToken] = useState<string | null>(null);

  const [showNotification, setShowNotification] = useState<boolean>(false);

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
        toast.error("You denied notification permissions");
      }
    } catch (err) {
      console.error("Error getting token:", err);
    }
  };

  // Send notification to backend
  // const sendNotification = async () => {
  //   try {
  //     const response = await fetch("http://localhost:3000/send-notification", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json", // Include this header
  //       },
  //       body: JSON.stringify({
  //         title,
  //         body,
  //         image: imageUrl,
  //         tokens: tokensList, // Ensure tokensList is an array of strings
  //       }),
  //     });

  //     const data = await response.json();

  //     console.log(data.success);

  //     if (data.success) {
  //       toast.success("Notification sent successfully!");
  //     } else {
  //       toast.error(`Error sending notification: ${data.error}`);
  //     }
  //   } catch (err) {
  //     console.error("Send notification error:", err);
  //     toast.error(`Failed to send notification. Error: ${err}`);
  //   }
  // };
  // // Send notification to backend
  // const sendSingleNotification = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:3000/send-single-notification",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json", // Include this header
  //         },
  //         body: JSON.stringify({
  //           title,
  //           body,
  //           image: imageUrl,
  //           tokens: tokensList, // Ensure tokensList is an array of strings
  //         }),
  //       }
  //     );

  //     const data = await response.json();

  //     console.log(data.success);

  //     if (data.success) {
  //       toast.success("Notification sent successfully!");
  //     } else {
  //       toast.error(`Error sending notification: ${data.error}`);
  //     }
  //   } catch (err) {
  //     console.error("Send notification error:", err);
  //     toast.error(`Failed to send notification. Error: ${err}`);
  //   }
  // };

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
      <div className="flex flex-row justify-end w-full mb-5">
        <button
          className={`${
            showNotification ? "bg-neutral-900" : "bg-neutral-900"
          }  text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-neutral-700 transition`}
          onClick={() => setShowNotification(!showNotification)}
        >
          {showNotification ? (
            <span className="flex gap-2 items-center">
              Multiple <MdDevicesOther className="w-6 h-6" />
            </span>
          ) : (
            <span className="flex gap-2 items-center">
              Single <MdDevices className="w-6 h-6" />
            </span>
          )}
        </button>
      </div>

      {!showNotification && <SendNotification />}

      {showNotification && <SendSingleNotification token={token} />}
    </div>
  );
}

export default App;
