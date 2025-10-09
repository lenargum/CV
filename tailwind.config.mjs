/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          default: '#0A0A0A', // Primary black
          bg: '#0A0A0A' // White
        },
        secondary: '#222222', // Dark gray (neutral)
        text: {
          primary: '#FFFFFF', // White
          secondary: '#FFFFFF', // Medium gray for body text
          tertiary: '#718096', // Lighter gray for less important text
        },
        noise: {
          primary: '#FFFFFF',
          secondary: '#000000',
        },
        border: '#E2E8F0', // Light gray for borders
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      display: ['print'],
      flexDirection: ['print'],
      width: ['print'],
    },
  },
} 