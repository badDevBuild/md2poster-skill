/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vite-project/index.html",
        "./vite-project/src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
