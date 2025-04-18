/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#FBEC5D', // Primary yellow
        secondary: '#F5F5F5', // Light gray (neutral)
        text: {
          primary: '#2D3748', // Dark gray for headings and important text
          secondary: '#4A5568', // Medium gray for body text
          tertiary: '#718096', // Lighter gray for less important text
        },
        noise: '#f9e312',
        noiseSecondary: '#F5F5F5',
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