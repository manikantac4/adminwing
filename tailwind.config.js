/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#fde047',
          500: '#e2b740',
          600: '#d97706',
        }
      }
    },
  },
  plugins: [],
}
