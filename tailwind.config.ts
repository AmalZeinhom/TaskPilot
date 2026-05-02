/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brightness: {
          primary: "#fff",
          secondary: "#F0F6FF",
          light: "#f5f6fa"
        },
        darkness: {
          dark: "#2c3e50",
          iconList: "#5D7285"
        },
        blue: {
          darkBlue: "#0A3B83",
          lightBlue: "#01A2F9",
          formBlue: "#DBEAFE"
        },
        plusIcon: "#F4D7DA"
      },

      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        serif: ["Merriweather", "serif"]
      },

      spacing: {
        128: "32rem",
        144: "36rem"
      }
    }
  },
  plugins: []
};
