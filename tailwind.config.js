module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        PLGreen: '#5CD69C',
        PLDarkBlue: '#1A1F2A',
      }
    },
    fontFamily:{
      'Manrope': ['Manrope', 'sans-serif'],
      'Nunito Sans': ['Nunito Sans', 'sans-serif'],
      'Commissioner': ['Commissioner', 'sans-serif'],
    },
    fontSize: {

    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '1': '1px',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    }
  },
  plugins: [],
}