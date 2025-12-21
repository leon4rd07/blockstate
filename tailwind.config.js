/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#1a1a1a",
          green: "#ccff00",
          gray: "#2d2d2d",
        },
      },
    },
  },
  plugins: [],
};
