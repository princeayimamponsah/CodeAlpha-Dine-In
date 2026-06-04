export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: '#6B1E1E',
          50: '#f9e9e8',
          100: '#f3d4d2',
          200: '#e8b0aa',
          500: '#6B1E1E',
        },
        peach: {
          DEFAULT: '#F8D7C4',
        },
        cream: {
          DEFAULT: '#FFF9F5',
        },
        beige: {
          DEFAULT: '#E9D7C9',
        },
        gold: {
          DEFAULT: '#D4A056',
        },
        olive: {
          DEFAULT: '#2F8F5B',
        },
        charcoal: {
          DEFAULT: '#2B2B2B',
        },
        softgray: {
          DEFAULT: '#6B6B6B',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
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
