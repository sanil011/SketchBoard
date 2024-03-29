/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        '3xl': 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
        '4xl': '#ffca64 0px 7px 29px 0px',
        "5xl":"rgba(0, 0, 0, 0.1) 0 1px 3px 0 rgba(0, 0, 0, 0.1)  0 1px 2px -1px"
      },
      keyframes: {
        scaleTools: {
          '0%': { transform: 'scale(0.1)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        scaleTools: 'scaleTools 0.9s'
      },
      fontFamily: {
        'space': ['Space Grotesk','sans-serif']
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}

