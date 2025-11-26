import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        averia: ['"Averia Serif Libre"', "serif"],
        kumbh: ['"Kumbh Sans"', "sans-serif"],
        spartan: ['"League Spartan"', "sans-serif"],
        montserrat: ['"Montserrat"', "sans-serif"],
        open: ['"Open Sans"', "sans-serif"],
        young: ['"Young Serif"', "serif"],
      },
    },
  },
  plugins: [forms, typography, aspectRatio],
};
