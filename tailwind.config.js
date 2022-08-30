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
        scaleIn: 'scaleIn 0.5s ease-in-out forwards',
        scaleUp: 'scaleUp 0.5s ease-in-out forwards',
        bounceIn: 'bounceIn 0.2s ease-out forwards',
        moveUp: 'moveUp 5s ease-in-out forwards',
        moveAllRight: 'moveAllRight 3s ease-in-out forwards',
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
        moveAllRight: {
          '0%': {
            transform: 'translateX(0)'
          },
          '100%': {
            transform: 'translateX(calc(-100% + 100vw))'
          }
        },
        moveUp: {
          '0%': {
            transform: 'translateY(0)'
          }, 
          '100%': {
            transform: 'translateY(-100vh)'
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
        },
        bounceIn: {
          '0%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(0.9)',
          },
          '100%': {
            transform: 'scale(1)',
          } 
        },
        scaleUp: {
          '0%': {
            transform: 'scale(0.5)',
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
