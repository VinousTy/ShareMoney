module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'gofun': '#edebe8',
        'thin-black': '#434343',
        'secondary': '#dd4b39',
        'orange': 'rgb(226, 147, 0)',
        'button-color-orange': '#ffa45b',
        'button-color-orange-hover': '#fa812b',
        'button-color-orange-shadow': '#fa8d35',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
