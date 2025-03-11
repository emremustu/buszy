import type { Config } from "tailwindcss"
;
const daisyui = require("daisyui");

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        
      },
      
    },
  },
  
  plugins: [
    daisyui,
  ],
} satisfies Config;
