/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          primary: "#4d2c56",
          secondary: "#e9ac8d"
        }
      },
      animation: {
        width: 'width 5s linear'
      },
      keyframes: {
        width: {
          '0%': {
            width: '0%'
          },
          '100%': {
            width: '100%'
          }
        }
      }
    },
  },
  plugins: [],
}
