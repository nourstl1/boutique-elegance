/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        small: "1024px",
        medium: "1280px",
      },
      colors: {
        elegance: {
          cream: "#F7F2EB",
          sand: "#EFE7DC",
          ink: "#211C17",
          taupe: "#5C5347",
          stone: "#8A7F71",
          gold: "#B8865B",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Jost", "-apple-system", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
}
