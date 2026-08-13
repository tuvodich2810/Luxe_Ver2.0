/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        lux: {
          black:  '#0A0A0A',
          dark:   '#111111',
          mid:    '#1A1A1A',
          card:   '#1C1C1E',
          white:  '#F5F5F7',
          silver: '#A0A0A0',
          muted:  '#6B6B6B',
          gold:   '#C9A96E',
          goldlt: '#E8C98A',
          golddk: '#A68450',
        },
      },
      fontFamily: {
        sans:    ['"Jost"', 'system-ui', 'sans-serif'],
        display: ['"Jost"', 'system-ui', 'sans-serif'],
        label:   ['"Jost"', 'system-ui', 'sans-serif'],
        mono:    ['"Jost"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};