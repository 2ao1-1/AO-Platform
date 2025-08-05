/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    fontFamily: {
      mainHead: ["Playfair"],
    },

    extend: {
      height: {
        screen: "100dvh",
      },

      colors: {
        main: "#be1e2d",
        primary: "#8e191d",
        secondary: "#fbb117",
        tertiary: " #f5f0e8",
      },

      backgroundImage: {
        "hero-pattern":
          "url('/images/artem-bryzgalov-zdiUGE9nCA0-unsplash.jpg')",
        frame: "url('/images/Spider_Web_Border.png')",
        // "hero-pattern": "url('/images/Hero.jpg')",
      },
    },
  },
};
