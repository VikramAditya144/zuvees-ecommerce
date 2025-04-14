// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf0f5',
          100: '#fad8e5',
          200: '#f5b0ca',
          300: '#ef88ae',
          400: '#e85f92',
          500: '#da3675',
          600: '#c41d5e',
          700: '#a41550',
          800: '#7a1141',
          900: '#660E36', // Main brand color
          950: '#4d0a28',
        },
      },
      screen: {
        'xs': '480px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.08)',
        'bottom': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};