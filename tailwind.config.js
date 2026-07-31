/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#18191B",
        secondary: "#5E6168",
        background: "#FFFFFF",
        surface: "#F8F9FB",
        card: "#FCFCFD",
        border: "#E5E7EB",
        gold: "#A39B89",
        goldLight: "#C9B27D",
        goldDark: "#8D7A4F",
      },
      boxShadow: {
        premium: "0 10px 30px rgba(0,0,0,0.06)",
        glow: "0 15px 40px rgba(0,0,0,0.08)",
      }
    },
  },
  plugins: [],
}
