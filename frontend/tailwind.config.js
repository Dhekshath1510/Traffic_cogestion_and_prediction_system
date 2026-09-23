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
        dark: {
          900: '#0b0f17',
          800: '#111827',
          700: '#1f293d',
          600: '#374151',
          500: '#4b5563',
        },
        traffic: {
          low: '#10B981',      // Emerald 500
          lowBg: 'rgba(16, 185, 129, 0.15)',
          moderate: '#F59E0B', // Amber 500
          moderateBg: 'rgba(245, 158, 11, 0.15)',
          severe: '#EF4444',   // Red 500
          severeBg: 'rgba(239, 68, 68, 0.15)',
          cyan: '#06B6D4',
          indigo: '#6366F1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 8px currentColor)' },
          '50%': { opacity: 0.7, filter: 'drop-shadow(0 0 2px currentColor)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
