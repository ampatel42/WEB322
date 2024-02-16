/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/*.html`],
  theme: {
    extend: ["black"],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ["black"],
  },
}


