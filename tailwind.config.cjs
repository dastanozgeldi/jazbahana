/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Mono", "sans-serif"],
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
