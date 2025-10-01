/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3182ce',
          600: '#2c5aa0',
          700: '#2a4d8a',
          800: '#1e3a74',
          900: '#1a2f5e'
        },
        accent: {
          500: '#38a169',
          600: '#2f855a'
        }
      },
      fontFamily: {
        mono: ['Monaco', 'Menlo', 'Ubuntu Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
