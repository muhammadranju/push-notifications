# 🔔 Push Notification Web App

A **real-time push notification system** built with **React.js**, **Node.js**, **Firebase Cloud Messaging (FCM)**, and **Socket.IO**.  
This project allows sending and receiving push notifications on the web, with token management and real-time updates.

---

## 🚀 Features

- 🔑 **User Token Management** – Generate and store FCM device tokens.
- 📩 **Send Notifications** – Trigger notifications from the backend.
- ⚡ **Real-time Updates** – Delivered instantly using **Socket.IO**.
- 🔔 **Firebase Cloud Messaging Integration** – Reliable cross-browser push delivery.
- 🌐 **React.js Frontend** – Clean and responsive UI for managing notifications.
- 🔒 **Secure Token Handling** – Tokens stored safely with cookies/localStorage.

---

## 🛠️ Tech Stack

### Frontend

- **React.js** + **Vite** (fast bundler)
- **TailwindCSS** (for styling)
- **Firebase Web SDK** (FCM integration)
- **React Hot Toast** (beautiful notifications)

### Backend

- **Node.js** + **Express.js**
- **Socket.IO** (real-time communication)
- **Firebase Admin SDK** (server-side push notification handling)
- **JWT Authentication** (optional for secure users)

---

## 📂 Project Structure

```

push-notification-app/
│── client/                # React.js frontend
│   ├── src/
│   │   ├── firebase.js    # Firebase config
│   │   ├── App.jsx        # Main UI
│   │   └── ...
│── server/                # Node.js backend
│   ├── index.js           # Express + Socket.IO server
│   ├── firebaseAdmin.js   # Firebase Admin SDK config
│   └── ...
│── README.md

```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/push-notification-app.git
cd push-notification-app
```

### 2️⃣ Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Enable **Cloud Messaging**.
4. Get your **Firebase Config** and add it to `client/src/firebase.js`.
5. Download `serviceAccountKey.json` and place it inside `server/`.

### 3️⃣ Install Dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ./server
npm install
```

### 4️⃣ Run the Project

```bash
# Start backend
cd server
npm run dev

# Start frontend
cd ./client
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint    | Description                       |
| ------ | ----------- | --------------------------------- |
| POST   | `/send`     | Send push notification to a token |
| GET    | `/tokens`   | Get registered device tokens      |
| POST   | `/register` | Register new token                |

---

## 🔔 How It Works

1. User opens the frontend → **Firebase generates a device token**.
2. Token is sent & stored in the backend.
3. Backend (via API or Socket.IO) sends notification requests.
4. **Firebase Cloud Messaging** delivers push notifications to the browser.
5. React frontend listens and displays notifications in real-time.

## 🚧 Roadmap

- [ ] User Authentication (JWT + Firebase Auth)
- [ ] Notification Groups / Topics
- [ ] Mobile PWA Support
- [ ] Admin Panel for sending notifications

---

## 🤝 Contributing

Pull requests are welcome!
For major changes, open an issue first to discuss what you’d like to change.

---

## 📜 License

MIT License © 2025 Muhammad Ranju
