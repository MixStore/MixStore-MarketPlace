/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}",  "./components/HomeScreen/Categories.jsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}