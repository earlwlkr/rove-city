import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "Be Vietnam Pro",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        teal: {
          50: "#ccfbf1",
          500: "#0d9488",
          600: "#0f766e",
          700: "#115e59",
        },
        burnt: {
          50: "#fff7ed",
          500: "#c2410c",
          600: "#9a3412",
        },
      },
      borderWidth: {
        "3": "3px",
      },
    },
  },
  plugins: [],
};

export default config;
