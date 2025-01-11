/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        violet: {
          700: "#7848F4"
        },
        slate: {
          50: "#FFFFFF"
        },
        blue: {
          900: "#10107B"
        }
      }
    },
  },
  plugins: [],
}

