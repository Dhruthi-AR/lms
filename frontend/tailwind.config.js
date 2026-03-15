/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4F46E5', // Primary
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        secondary: {
          500: '#8b5cf6',
          600: '#7C3AED', // Secondary
        },
        accent: {
          400: '#22D3EE', // Accent
          500: '#06b6d4',
        },
        background: '#F8FAFC',
        card: '#FFFFFF',
        textMain: '#0F172A'
      }
    },
  },
  plugins: [],
}
