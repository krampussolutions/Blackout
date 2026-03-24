import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0d0f",
        panel: "#12181c",
        panelSoft: "#182127",
        border: "#26333b",
        text: "#f5f7f8",
        muted: "#98a6ad",
        accent: "#7dd3a7",
        warning: "#f2c46d"
      }
    }
  },
  plugins: []
};

export default config;
