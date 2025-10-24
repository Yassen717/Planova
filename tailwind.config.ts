import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f9fafb',
          dark: '#111827',
        },
        foreground: {
          light: '#111827',
          dark: '#f9fafb',
        },
      },
    },
  },
  plugins: [],
};

export default config;