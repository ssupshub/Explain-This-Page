/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./popup.html",
    "./viewer.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        "glass-bg": "var(--glass-bg)",
        "glass-border": "var(--glass-border)",
        "brand-dark": "#0f0c29",
        "brand-purple": "#302b63",
        "brand-blue": "#24243e",
        main: "var(--text-main)",
        muted: "var(--text-muted)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
