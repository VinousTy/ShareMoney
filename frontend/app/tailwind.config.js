module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'gofun': '#edebe8',
        'disabled': 'rgb(128, 128, 128)',
        'thin-black': '#434343',
        'secondary': '#dd4b39',
        'orange': 'rgb(226, 147, 0)',
        'button-color-orange': '#ffa45b',
        'button-color-orange-hover': '#fa812b',
        'button-color-orange-shadow': '#fa8d35',
        'green': 'rgb(0, 185, 46)',
        'amber': 'rgb(254 243 199)',
        'gold': '#a37f06',
        'thin-gold': '#c1ab05',
        'silver': '#808080',
        'thin-silver': '#C0C0C0',
        'bronze': '#964d04',
        'thin-bronze': '#c47222',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
