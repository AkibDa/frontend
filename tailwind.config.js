/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./Index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        accent: '#FF6F00',
      },
    },
  },
  plugins: [],
}
