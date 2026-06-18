/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      'surface': '#36393f',
      'surface-secondary': '#2f3136',
      'surface-tertiary': '#202225',
      'primary': '#dcddde',
      'secondary': '#72767d',
      'accent': '#ff6b35',
      'accent-hover': '#ff8c5a',
      'default-border': '#202225',
    },
    extend: {},
  },
  plugins: [],
}