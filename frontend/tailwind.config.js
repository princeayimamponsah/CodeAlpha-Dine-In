export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: '#6D1F3D',
          50: '#f6e6ea',
          100: '#efd0d9',
          200: '#e6a8b5',
          500: '#6D1F3D',
        },
        peach: {
          DEFAULT: '#F7D6C2',
        },
        cream: {
          DEFAULT: '#FFF7F2',
        },
        beige: {
          DEFAULT: '#EAD7CC',
        },
        gold: {
          DEFAULT: '#D4A373',
        },
        olive: {
          DEFAULT: '#7D8F69',
        },
        charcoal: {
          DEFAULT: '#2B2B2B',
        },
        softgray: {
          DEFAULT: '#6B6B6B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0,0,0,0.1)',
        'medium': '0 4px 12px 0 rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
