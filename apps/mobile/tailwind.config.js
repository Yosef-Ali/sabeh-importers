/**
 * NativeWind / Tailwind config for the Sabeh mobile app.
 * Mirrors the web app's design tokens (Sabeh Authority): nautical navy
 * #0A192F, industrial gold #FFD700, Space Grotesk / Space Mono / DM Sans
 * fonts, sharp 0px radii, hard offset shadows.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A192F",
          deep: "#060d17",
          light: "#1a2d4a",
        },
        gold: {
          DEFAULT: "#FFD700",
          light: "#FDE968",
          dark: "#a08339",
        },
        background: "#F8F9FA",
        surface: "#FFFFFF",
        foreground: "#0F172A",
        muted: "#64748B",
        border: "#E2E8F0",
        success: "#10B981",
        destructive: "#EF4444",
        warning: "#FCD34D",
      },
      fontFamily: {
        display: ["SpaceGrotesk_700Bold"],
        "display-medium": ["SpaceGrotesk_500Medium"],
        body: ["DMSans_400Regular"],
        "body-bold": ["DMSans_700Bold"],
        mono: ["SpaceMono_700Bold"],
      },
      letterSpacing: {
        widest: "0.2em",
        command: "0.25em",
      },
      borderRadius: {
        none: "0",
      },
    },
  },
  plugins: [],
};
