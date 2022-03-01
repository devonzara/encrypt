module.exports = {
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            animation: {
                'throb': 'throb 1.25s ease infinite',
            },
            keyframes: {
                throb: {
                    '0%': { transform: 'scale(1)' },
                    '20%': { transform: 'scale(1.2)' },
                    '30%': { transform: 'scale(1.1)' },
                    '50%': { transform: 'scale(1.3)' },
                },
            },
        },
    },
    plugins: [],
};
