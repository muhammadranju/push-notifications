import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "626b3525f3dc.ngrok-free.app", // add your ngrok host here
    ],
  },
});
