import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0b1120',
          light: '#1e293b',
          dark: '#020617',
        },
        saffron: {
          DEFAULT: '#f97316',
          light: '#fff7ed',
          border: '#fed7aa',
        },
        emerald: {
          DEFAULT: '#10b981',
          light: '#ecfdf5',
          border: '#a7f3d0',
        },
        bbBlue: {
          DEFAULT: '#2563eb',
          light: '#eff6ff',
          border: '#bfdbfe',
        },
      },
    },
  },
  plugins: [],
};

export default config;
