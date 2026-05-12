import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0F1115",
        fg: "#F5F6F7",
        gold: "#C9A96A"
      }
    }
  },
  plugins: []
};

export default config;
