/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#E54065',    // Pink accent color
        background: '#F4F5F9', // Main background
        border: '#CFD2DC',    // Border color
        content: '#636363',   // Text color
        filter: '#E1E4EA',    // Filter button background
        read: '#F2F2F2'       // Read email background
      },
    },
  },
  plugins: [],
}

