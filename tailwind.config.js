/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      scale: {
        102: "1.02",
      },
      screens: {
        xs: "480px",
      },
      fontSize: {
        "2xs": ".625rem",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
