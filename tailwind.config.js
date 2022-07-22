/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        twitch: '#9146ff',
      },
      ringWidth: {
        3: '3px',
      },
      screens: {
        normal: '450px',
      },
    },
  },
  plugins: [],
};
