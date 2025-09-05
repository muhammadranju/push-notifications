// importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
// importScripts(
//   "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
// );

// firebase.initializeApp({
//   apiKey: "AIzaSyCcLcrfmzh3MEESGbDNgCrAWKFAf7BoCTk",
//   authDomain: "task-manager-a31c0.firebaseapp.com",
//   projectId: "task-manager-a31c0",
//   storageBucket: "task-manager-a31c0.firebasestorage.app",
//   messagingSenderId: "851482948231",
//   appId: "1:851482948231:web:e01362d18cd16dd8c23e22",
//   measurementId: "G-TCQHFG1VK9",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   // console.log(
//   //   "[firebase-messaging-sw.js] Received background message",
//   //   payload
//   // );
//   const notificationTitle = payload.notification?.title || "New Message";
//   const notificationOptions = {
//     body: payload.notification?.body || "",
//     icon: payload.notification?.icon || "/vite.svg",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// Base64-encoded Firebase config
const encodedConfig =
  "eyJhcGlLZXkiOiAiQXp5YVN5Y0NjTHJmbXpoM01FRU9zR2JkTmNDckFXS0ZhYjZPVEtjIiwgImF1dGhEb21haW4iOiAidGFzay1tYW5hZ2VyLWEzMWMwLmZpcmViYXNlcHBjb20iLCAicHJvamVjdElkIjogInRhc2stbWFuYWdlci1hMzFjMCIsICJzdG9yYWdlQnVja2V0IjogInRhc2stbWFuYWdlci1hMzFjMC5maXJlYmFzZXN0b3JhZ2FwcC5jb20iLCAibWVzc2FnaW5nU2VuZGVySWQiOiAiODUxNDgyOTQyMzEiLCAiYXBwSWQiOiAiMToxODUxNDgyOTQyMzE6d2ViOmUwMTM2MmQxOGNkMTZkZDgyYzIzZTIyIiwgIm1lYXN1cmVtZW50SWQiOiAiRy1UQ1FIRkdJVmt9";

// Decode the Base64 string and parse it
const firebaseConfig = JSON.parse(atob(encodedConfig));

console.log(firebaseConfig);
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification?.title || "New Message";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/vite.svg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
