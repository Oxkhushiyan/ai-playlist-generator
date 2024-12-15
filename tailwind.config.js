/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 1s ease-in forwards',
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 20s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%': { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: '0.1' },
          '25%': { transform: 'translate(100px, 50px) rotate(90deg) scale(1.2)', opacity: '0.2' },
          '50%': { transform: 'translate(0, 100px) rotate(180deg) scale(1)', opacity: '0.1' },
          '75%': { transform: 'translate(-100px, 50px) rotate(270deg) scale(1.2)', opacity: '0.2' },
          '100%': { transform: 'translate(0, 0) rotate(360deg) scale(1)', opacity: '0.1' },
        },
      },
      colors: {
        primary: 'rgb(var(--primary-color) / <alpha-value>)',
        secondary: 'rgb(var(--secondary-color) / <alpha-value>)',
        accent: 'rgb(var(--accent-color) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}