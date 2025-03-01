/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        proxima: ["Proxima Nova", "sans-serif"],
        "proxima-condensed": ["Proxima Nova Condensed", "sans-serif"],
        "proxima-extracondensed": ["Proxima Nova Extra Condensed", "sans-serif"],
      },
    },
  },
  plugins: [],
};
