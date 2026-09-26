/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* Gov-tech design tokens — deep forest teal */
        brand: {
          DEFAULT: "#0E4A45",
          dark: "#0B3D3A",
          mid: "#146158",
          light: "#1A7A6E",
          muted: "#E6F2F0",
          soft: "#F0F7F6",
        },
        primary: "#0E4A45",
        "on-primary": "#ffffff",
        "primary-hover": "#0B3D3A",
        "primary-muted": "#E6F2F0",
        background: "#F7F9F9",
        surface: "#F7F9F9",
        card: "#FFFFFF",
        border: "#E5EBEA",
        "border-strong": "#D0DAD8",
        ink: {
          DEFAULT: "#0F1F1E",
          secondary: "#4A5C5A",
          muted: "#6B7C7A",
          inverse: "#FFFFFF",
        },
        success: {
          DEFAULT: "#1B7A4E",
          soft: "#E8F6EF",
          fg: "#0F5C38",
        },
        warning: {
          DEFAULT: "#C47A12",
          soft: "#FFF4E5",
          fg: "#8A5508",
        },
        danger: {
          DEFAULT: "#C0352B",
          soft: "#FDECEA",
          fg: "#8B1F18",
        },
        info: {
          DEFAULT: "#2B6CB0",
          soft: "#E8F1FB",
          fg: "#1A4F86",
        },
        /* Legacy aliases so older screens don't break during migration */
        "on-surface": "#0F1F1E",
        "on-surface-variant": "#4A5C5A",
        "surface-container": "#EEF3F2",
        "surface-container-low": "#F3F6F6",
        "surface-container-high": "#E5EBEA",
        "surface-container-highest": "#D8E0DF",
        "surface-container-lowest": "#FFFFFF",
        "surface-variant": "#E5EBEA",
        outline: "#6B7C7A",
        "outline-variant": "#D0DAD8",
        error: "#C0352B",
        "on-error": "#ffffff",
        "error-container": "#FDECEA",
        navy: "#0B3D3A",
        accent: "#1A7A6E",
        gold: "#C47A12",
        secondary: "#4A5C5A",
        "on-secondary": "#ffffff",
        "secondary-container": "#EEF3F2",
        tertiary: "#C47A12",
        admin: {
          bg: "#0A1211",
          panel: "#111C1B",
          border: "#1E2E2C",
        },
      },
      borderRadius: {
        DEFAULT: "0.625rem", /* 10px */
        sm: "0.5rem",       /* 8px */
        md: "0.625rem",
        lg: "0.75rem",      /* 12px */
        xl: "1rem",
        full: "9999px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        headline: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        label: ["Inter", "system-ui", "sans-serif"],
        arabic: ["Cairo", "Noto Sans Arabic", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(11, 61, 58, 0.06), 0 2px 8px rgba(11, 61, 58, 0.03)",
        card: "0 1px 2px rgba(11, 61, 58, 0.04), 0 1px 3px rgba(11, 61, 58, 0.06)",
        elev: "0 16px 40px rgba(11, 61, 58, 0.1), 0 4px 12px rgba(11, 61, 58, 0.04)",
        btn: "0 1px 2px rgba(11, 61, 58, 0.12), 0 4px 12px rgba(11, 61, 58, 0.12)",
        "btn-hover": "0 4px 16px rgba(11, 61, 58, 0.18), 0 2px 4px rgba(11, 61, 58, 0.08)",
        focus: "0 0 0 3px rgba(14, 74, 69, 0.25)",
      },
      letterSpacing: {
        display: "-0.035em",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
    },
  },
  plugins: [],
}
