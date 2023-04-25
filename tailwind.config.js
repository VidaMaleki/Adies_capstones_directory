/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [

    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
    extend: {
      colors: {
        'aqua-blue': 'rgb(12, 192, 223)',
        'dark-turquoise': 'rgb(0, 151, 178)',
      }
    },
  },
  plugins: [],
}