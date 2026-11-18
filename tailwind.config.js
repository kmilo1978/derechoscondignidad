/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./dist/**/*.html', './src/app.js'],
  theme: {
    extend: {
      fontFamily: { sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'] },
      colors: {
        navy: { 800: '#1e293b', 900: '#0f172a', 950: '#070d1a' },
        gold: { 500: '#d4af37', 600: '#b4941f', 700: '#7a5f0f' },
      },
      boxShadow: { glow: '0 0 20px rgba(212, 175, 55, 0.15)' },
    },
  },
  plugins: [],
};
