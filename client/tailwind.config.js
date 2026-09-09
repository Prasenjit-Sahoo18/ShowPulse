/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cine: {
          bg: '#0a0e17',
          surface: '#111827',
          card: '#161f30',
          hover: '#1f2b42',
          border: '#26334d',
          primary: '#8b5cf6',
          'primary-dark': '#7c3aed',
          accent: '#ec4899',
          gold: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
