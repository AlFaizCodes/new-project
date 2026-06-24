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
        // Notion Design System Colors
        primary: "#0075de",           // Notion Blue
        "primary-active": "#005bab",  // Pressed Blue
        secondary: "#213183",         // Deep Indigo (night hero band)
        "on-primary": "#ffffff",      // White text on primary
        canvas: "#ffffff",            // White canvas
        "canvas-soft": "#f6f5f4",    // Warm Paper (main background)
        surface: "#ffffff",           // White surface (cards, panels)
        ink: "#000000",               // Near-black text
        "ink-secondary": "#31302e",  // Warm Charcoal
        "ink-muted": "#615d59",       // Stone
        "ink-faint": "#a39e98",      // Ash
        hairline: "#e6e6e6",          // Hairline borders
        
        // Accent Sticker Palette (decorative only)
        "accent-sky": "#62aef0",
        "accent-purple": "#d6b6f6",
        "accent-purple-deep": "#391c57",
        "accent-pink": "#ff64c8",
        "accent-orange": "#dd5b00",
        "accent-orange-deep": "#793400",
        "accent-teal": "#2a9d99",
        "accent-green": "#1aae39",
        "accent-brown": "#523410",

        // Brand & Base
        "bg-base": "#EDEEF5",
        "brand-green": "#9fff00",
        
        // Legacy Notion colors (for compatibility)
        notionBg: "#f6f5f4",
        notionBorder: "#e6e6e6",
        notionBlue: "#0075de",
        notionGray: "#7c7b77",
        stickerPurple: "#d6b6f6",
        stickerTeal: "#2a9d99",
        stickerSky: "#62aef0",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Outfit",
          "Inter",
          "sans-serif",
        ],
      },
      fontSize: {
        'xs': ['12px', '1.43'],
        'sm': ['15px', '1.33'],
        'base': ['16px', '1.5'],
        'lg': ['20px', '1.4'],
        'xl': ['22px', '1.27'],
        '2xl': ['26px', '1.23'],
        '3xl': ['40px', '1.1'],
        '4xl': ['54px', '1.04'],
        '5xl': ['64px', '1.0'],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'xxl': '32px',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '5px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
    },
  },
  plugins: [],
};
export default config;
