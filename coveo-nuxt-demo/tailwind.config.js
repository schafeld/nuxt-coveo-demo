/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        coveo: {
          primary: '#1372EC',
          secondary: '#0D5BC6',
          accent: '#FF5722',
          background: '#F5F7FA',
        }
      }
    },
  },
  plugins: [],
}
