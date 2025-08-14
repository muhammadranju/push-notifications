importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "**********************************",
  authDomain: "**********************************",
  projectId: "**********************************",
  storageBucket: "**********************************",
  messagingSenderId: "**********************************",
  appId: "**********************************",
  measurementId: "**********************************",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message",
    payload
  );
  const notificationTitle = payload.notification?.title || "New Message";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/vite.svg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
