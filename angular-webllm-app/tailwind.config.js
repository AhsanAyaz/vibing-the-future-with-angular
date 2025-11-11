/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'lovable-dark': '#0a0a0f',
        'lovable-darker': '#050508',
        'lovable-blue': '#3b82f6',
        'lovable-purple': '#8b5cf6',
        'lovable-cyan': '#06b6d4',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        lovable: {
          'primary': '#8b5cf6',           // Purple
          'primary-content': '#ffffff',
          'secondary': '#3b82f6',         // Blue
          'secondary-content': '#ffffff',
          'accent': '#06b6d4',            // Cyan
          'accent-content': '#ffffff',
          'neutral': '#1a1a24',           // Dark neutral
          'neutral-content': '#e5e7eb',
          'base-100': '#0a0a0f',          // Darkest background
          'base-200': '#12121a',          // Dark background
          'base-300': '#1a1a24',          // Medium dark
          'base-content': '#e5e7eb',      // Light text
          'info': '#3b82f6',
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444',
        },
      },
    ],
    darkTheme: 'lovable',
    base: true,
    styled: true,
    utils: true,
  },
}
