export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a365d',
        secondary: '#2b6cb0',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            table: {
              width: '100%',
              marginTop: '1em',
              marginBottom: '1em',
              borderCollapse: 'collapse',
            },
            'tr:nth-child(even)': {
              backgroundColor: '#f8fafc',
            },
            'th,td': {
              border: '1px solid #e5e7eb',
              padding: '0.75em 1em',
              textAlign: 'left',
            },
            th: {
              backgroundColor: '#f1f5f9',
              fontWeight: '600',
              color: '#1e293b',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}