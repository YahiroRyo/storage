import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  outExtension: "js",
  include: [
    "./app/routes/**/*.{ts,tsx,js,jsx}",
    "./app/components/**/*.{ts,tsx,js,jsx}",
  ],
  exclude: [],
  theme: {
    extend: {
      tokens: {
        colors: {
          whiteGray: { value: "#AAA" },
          darkGray: { value: "#333" },
          whiteBlue: { value: "#7B9EC9" },
          blue: { value: "#4682B4" },
          darkBlue: { value: "#003B6F" },
          red: { value: "#B22222" },
          white: { value: "#FFF" },
          darkWhite: { value: "#ddd" },
          error: { value: "#ff5200" },
        },
      },
      keyframes: {
        rotation: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      xl2: "1536px",
    },
  },
  outdir: "styled-system",
});
