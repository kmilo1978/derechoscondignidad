/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./dist/**/*.html', './src/app.js'],
  theme: {
    extend: {
      fontFamily: { sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'] },
      colors: {
        navy: { 800: '#174d74', 900: '#0f3d5e', 950: '#071e2f' },
        gold: {
          50: '#f8f5ef',
          100: '#efe8db',
          200: '#dfd1b7',
          400: '#c5ac84',
          500: '#b2966a',
          600: '#9c8054',
          700: '#6e5633',
          900: '#45341c',
        },
      },
      boxShadow: { glow: '0 0 20px rgba(178, 150, 106, 0.22)' },
    },
  },
  plugins: [],
};
