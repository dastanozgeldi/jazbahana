/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      colors: {
        primary: "#3b82f6",
        secondary: "#eab308",
        bg: "#f9fafb",
        darkBg: "#111111",
        error: "#ef4444",
      },
    },
  },
  darkMode: "class",
};
