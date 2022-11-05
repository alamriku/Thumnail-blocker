/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  mode: 'jit',

  theme: {
    minWidth: {
      '0': '0',
      'popup': '350px',
      full: '100%'
    },
    extend: {
      zIndex: {
        '1000': '999999999',
      }
    }
  },
  plugins: [



  ],
  variants: {},
  corePlugins: {
    preflight: true,
  },
};
