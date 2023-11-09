/** @type {import('tailwindcss').Config} */


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        '3xl': 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
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
        'space': ['Poppins','sans-serif','Space Grotesk']
      }
    },
  },
  plugins: [],
}

