/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Existing families (remain)
        proxima: ["Proxima Nova", "sans-serif"],
        "proxima-condensed": ["Proxima Nova Condensed", "sans-serif"],
        "proxima-extracondensed": ["Proxima Nova Extra Condensed", "sans-serif"],
        
        // Newly introduced families
        "proxima-alt": ["Proxima Nova Alt", "sans-serif"],
        "proxima-alt-condensed": ["Proxima Nova Alt Condensed", "sans-serif"],
        "proxima-alt-extracondensed": ["Proxima Nova Alt Extra Condensed", "sans-serif"],
        "proxima-scosf": ["Proxima Nova ScOsf", "sans-serif"],
        "proxima-scosf-condensed": ["Proxima Nova ScOsf Condensed", "sans-serif"],
        "proxima-scosf-extracondensed": [
          "Proxima Nova ScOsf Extra Condensed",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};