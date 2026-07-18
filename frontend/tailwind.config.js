/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Sporty dark theme: near-black base, deep navy surfaces, electric light-blue accent
        base: {
          950: '#04060C', // page background
          900: '#0A0F1C', // section background
          800: '#0F1730', // card surface
          700: '#182242', // raised surface / borders
        },
        navy: {
          600: '#1E3A8A',
          500: '#2748A8',
        },
        volt: {
          // electric light-blue accent, the "performance" color
          400: '#7DD3FC',
          500: '#38BDF8',
          600: '#0EA5E9',
          glow: '#5EEAD4',
        },
      },
      fontFamily: {
        display: ['"Rajdhani"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'speed-lines': 'repeating-linear-gradient(115deg, rgba(56,189,248,0.06) 0px, rgba(56,189,248,0.06) 2px, transparent 2px, transparent 40px)',
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(56,189,248,0.18), transparent 60%)',
      },
      boxShadow: {
        volt: '0 0 25px -5px rgba(56,189,248,0.5)',
      },
      clipPath: {
        angled: 'polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%)',
      },
    },
  },
  plugins: [],
};
