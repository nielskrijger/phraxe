/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    colors: {
      ...colors,
      ghostBlue: "#f8f9fc",
      slate: {
        ...colors.slate,
        100: "#EDEFF8", // increase contrast between 50 and 100
      },

      // white theme
      border: "#EDEFF8",
      primary: "#4f46e5",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Arvo", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
