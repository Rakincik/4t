// tailwind.config.mjs
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0D47A1",
          light: "#1E88E5",
          dark: "#002171",
        },
        secondary: {
          DEFAULT: "#D32F2F",
          light: "#E57373",
        },
        dark: {
          DEFAULT: "#212121",
          light: "#424242",
        },
        light: {
          DEFAULT: "#FFFFFF",
          muted: "#F4F7F6",
        },
      },
    },
  },

  plugins: [typography],
};

export default config;
