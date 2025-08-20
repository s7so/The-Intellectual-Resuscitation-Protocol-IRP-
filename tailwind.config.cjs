/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.25rem",
          lg: "2rem",
          xl: "2.5rem",
          "2xl": "3rem",
        },
      },
      colors: {
        brand: {
          DEFAULT: "#0ea5e9", // sky-500
          dark: "#0284c7", // sky-600
        },
      },
    },
  },
  plugins: [],
};
