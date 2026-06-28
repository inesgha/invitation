/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050403',
        ivory: '#fffaf0',
        champagne: '#f6e2b6',
        gold: '#d9a441',
        rose: '#d9a09a',
        pearl: '#fff7e8'
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        script: ['Great Vibes', 'Brush Script MT', 'cursive'],
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        gold: '0 0 42px rgba(217, 164, 65, 0.35)',
        luxury: '0 30px 90px rgba(0, 0, 0, 0.32)'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 50%' },
          '100%': { backgroundPosition: '200% 50%' }
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -16px, 0)' }
        },
        petalFall: {
          '0%': { transform: 'translate3d(0, -12vh, 0) rotate(0deg)', opacity: '0' },
          '15%': { opacity: '.82' },
          '100%': { transform: 'translate3d(12vw, 110vh, 0) rotate(240deg)', opacity: '0' }
        },
        glowPulse: {
          '0%, 100%': { opacity: '.22', transform: 'scale(.92)' },
          '50%': { opacity: '.46', transform: 'scale(1.12)' }
        }
      },
      animation: {
        shimmer: 'shimmer 5s linear infinite',
        float: 'float 5s cubic-bezier(.65,0,.35,1) infinite',
        petalFall: 'petalFall 12s linear infinite',
        glowPulse: 'glowPulse 7s cubic-bezier(.65,0,.35,1) infinite'
      }
    }
  },
  plugins: []
};
