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
        width: 'width 5s linear',
        scaleIn: 'scaleIn 1s ease-in-out forwards'
      },
      keyframes: {
        width: {
          '0%': {
            width: '0%'
          },
          '100%': {
            width: '100%'
          }
        },
        scaleIn: {
          '0%': {
            transform: 'scale(1.1)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          } 
        } 
      }
    },
  },
  plugins: [
    require("tailwindcss-animation-delay"),
  ],
}
