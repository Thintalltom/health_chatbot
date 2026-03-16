
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        mulish: ['Mulish', 'sans-serif'],
      },
      colors: {
        surface: '#FAFAFA',
        heading: '#FFFFFF',
        body: '#418BF5',
        border: '#F2F2F2',
      }
    },
  },
  plugins: [],
}
