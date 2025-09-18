/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        dash: {
          to: { strokeDashoffset: "-1000" }, // animation for marching effect
        },
      },
      animation: {
        dash: "dash 12s linear infinite",
      },
    },
  },
  plugins: [],
};
