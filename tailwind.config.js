/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0D0E11",
        cardGlass: "#16181E",
        billieLime: "#C6F135",
        stringC: "#38BDF8",
        stringG: "#C6F135",
        stringD: "#A855F7",
        stringA: "#F43F5E",
        // Susana's Favorite Pastels & Lesbian Flag Palette
        pastelSky: "#7DD3FC",
        pastelPink: "#F472B6",
        pastelRose: "#FDA4AF",
        pastelPurple: "#C084FC",
        pastelLilac: "#E9D5FF",
        pastelMint: "#86EFAC",
        lesbianOrange: "#FB923C",
        lesbianCoral: "#F97316",
        lesbianWhite: "#FFF7ED",
        lesbianPink: "#F472B6",
        lesbianBerry: "#BE185D",
      },
      fontFamily: {
        sans: ['"Outfit"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neon: "0 0 25px rgba(198, 241, 53, 0.25)",
        neonStrong: "0 0 35px rgba(198, 241, 53, 0.45)",
        neonBlue: "0 0 25px rgba(56, 189, 248, 0.35)",
        neonPurple: "0 0 25px rgba(192, 132, 252, 0.35)",
        neonPink: "0 0 25px rgba(244, 114, 182, 0.35)",
        neonSunset: "0 0 30px rgba(251, 146, 60, 0.35)",
        cardGlass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 15px rgba(198, 241, 53, 0.7))' },
          '50%': { opacity: 0.6, filter: 'drop-shadow(0 0 5px rgba(198, 241, 53, 0.3))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
