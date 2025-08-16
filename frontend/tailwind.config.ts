import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}", // scan all TS/JSX files for Tailwind classes
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // custom primary color
        secondary: "#EC4899", // custom secondary color
        accent: "#FBBF24", // accent color
        dark: "#1F2937", // dark mode color
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Merriweather", "ui-serif", "Georgia"],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "custom-light": "0 4px 6px rgba(0,0,0,0.1)",
        "custom-dark": "0 4px 6px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
