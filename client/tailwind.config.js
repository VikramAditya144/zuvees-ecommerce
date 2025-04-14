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
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'hover': '0 10px 25px rgba(0, 0, 0, 0.1)',
        'product': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      transitionDuration: {
        '400': '400ms',
        '2000': '2000ms',
      },
      height: {
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '90rem',
      },
      screens: {
        '3xl': '1920px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

