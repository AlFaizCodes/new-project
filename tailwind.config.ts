import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-base": "#EDEEF5",
        "brand-green": "#9fff00",
        notionBg: "#f6f5f4",
        notionBorder: "#e6e6e6",
        notionBlue: "#0075de",
        notionGray: "#7c7b77",
        stickerPurple: "#d6b6f6",
        stickerTeal: "#2a9d99",
        stickerSky: "#62aef0",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", "Helvetica", "Arial", "sans-serif"],
        display: ["Outfit", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
