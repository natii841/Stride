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
        instagram: {
          pink: '#E1306C',
          purple: '#833AB4',
          orange: '#F56040',
          yellow: '#FCAF45',
          blue: '#3897F0',
          darkBg: '#000000',
          darkCard: '#121212',
          darkBorder: '#262626',
          darkHover: '#1c1c1c',
          lightBg: '#FAFAFA',
          lightCard: '#FFFFFF',
          lightBorder: '#DBDBDB',
          lightHover: '#F0F0F0',
          textMutedDark: '#8E8E8E',
          textMutedLight: '#737373',
        }
      },
      backgroundImage: {
        'instagram-gradient': 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        'instagram-subtle': 'linear-gradient(135deg, rgba(240, 148, 51, 0.1) 0%, rgba(225, 48, 108, 0.1) 50%, rgba(131, 58, 180, 0.1) 100%)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
