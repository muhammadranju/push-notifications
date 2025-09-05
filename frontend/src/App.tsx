/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [showModal, setShowModal] = useState<boolean>(false); // Modal state
  const [notificationInfo, setNotificationInfo] = useState<{
    title: string;
    body: any;
    image: any;
  } | null>(null);

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

  useEffect(() => {
    requestPermission();

    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      if (payload.notification?.title) {
        const { title, body, image } = payload.notification;
        // Show notification
        new Notification(title, {
          body: body,
          icon: "/logo192.png",
          image: image, // Cast to `any` to avoid TypeScript error
        } as any);

        // Save the notification info to show in the modal when clicked
        setNotificationInfo({ title, body, image });

        // Add click event listener for notification
        const notification = new Notification(title, {
          body: body,
          icon: "/logo192.png",
          image: image,
        } as any);
        notification.onclick = () => {
          // Show the modal when the notification is clicked
          setShowModal(true);
        };
      }
    });
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setNotificationInfo(null);
  };

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

      {/* Modal Popup */}
      {showModal && notificationInfo && (
        <div className="fixed top-0 left-0 right-0 bottom-0  bg-opacity-50 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-gray-100 p-6 rounded-lg max-w-lg w-full text-black shadow-xl transform transition-all duration-300 flex flex-col gap-4">
            <button
              className=" text-black text-xl cursor-pointer"
              onClick={closeModal}
            >
              &times;
            </button>
            <div className="text-center">
              {notificationInfo.image && (
                <img
                  src={notificationInfo.image}
                  alt="Notification Image"
                  className="mb-4 w-full max-h-64 object-cover rounded-lg"
                />
              )}
              <h2 className="text-2xl font-semibold mb-2">
                {notificationInfo.title}
              </h2>
              <p className="text-lg">{notificationInfo.body}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
