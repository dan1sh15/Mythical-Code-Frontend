/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        ipad: "950px",
        phone: "450px",
      }
    },
  },
  plugins: [],
}

