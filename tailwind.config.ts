// Maps CSS tokens to Tailwind names. No hex values here.
import type { Config } from "tailwindcss";

const v = (name: string) => `var(--${name})`;
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: v("bg"), surface: v("surface"), card: v("card"), raised: v("raised"), text: v("text"), muted: v("muted"),
        line: v("line"), link: v("link"), accent: v("accent"), sand: v("sand"), umber: v("umber"),
        supported: v("v-supported"), outdated: v("v-outdated"),
        contradicted: v("v-contradicted"), unverifiable: v("v-unverifiable"),
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: { squircle: "1.75rem" },
    },
  },
};
export default config;
