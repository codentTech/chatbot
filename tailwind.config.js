/** @type {import('tailwindcss').Config} */

// Enhanced Blue-Indigo Theme for AI Chatbot
const themeColors = {
  // Primary blue system
  primary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6",
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
    950: "#172554",
  },

  // Indigo accents
  indigo: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
    950: "#1E1B4B",
  },

  // Purple accents
  purple: {
    50: "#FAF5FF",
    100: "#F3E8FF",
    200: "#E9D5FF",
    300: "#D8B4FE",
    400: "#C084FC",
    500: "#A855F7",
    600: "#9333EA",
    700: "#7C3AED",
    800: "#6B21A8",
    900: "#581C87",
    950: "#3B0764",
  },

  // NeuralFlow Theme Colors
  neural: {
    bg: "#0F0F23", // Very dark purple-black
    bgSecondary: "#1A1A2E", // Darker purple
    bgTertiary: "#16213E", // Dark blue-purple
    accent: "#7C3AED", // Purple accent
    accentHover: "#9333EA", // Purple hover
    text: "#FFFFFF", // White text
    textSecondary: "#E2E8F0", // Light gray text
    border: "#2D2D5A", // Dark purple border
  },

  // Neutral grays with warm undertones
  neutral: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#E5E5E5",
    300: "#D4D4D4",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0A0A0A",
  },

  // Semantic colors
  success: {
    50: "#ECFDF5",
    100: "#D1FAE5",
    200: "#A7F3D0",
    500: "#10B981",
    600: "#059669",
    700: "#047857",
    800: "#065F46",
  },

  danger: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    200: "#FECACA",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
    800: "#991B1B",
  },

  warning: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
  },

  info: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    500: "#3B82F6",
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
  },
};

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],

  darkMode: "class",

  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },

    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "Fira Code", "monospace"],
    },

    extend: {
      colors: {
        primary: themeColors.primary,
        indigo: themeColors.indigo,
        purple: themeColors.purple,
        neutral: themeColors.neutral,
        success: themeColors.success,
        danger: themeColors.danger,
        warning: themeColors.warning,
        info: themeColors.info,

        // Semantic color aliases
        background: {
          primary: "#FFFFFF",
          secondary: "#F9FAFB",
          tertiary: "#F3F4F6",
        },

        border: {
          light: "#E5E7EB",
          medium: "#D1D5DB",
          dark: "#9CA3AF",
        },

        text: {
          primary: "#111827",
          secondary: "#374151",
          tertiary: "#6B7280",
          inverse: "#FFFFFF",
        },
      },

      spacing: {
        18: "4.5rem",
        88: "22rem",
        sidebar: "16rem",
        "sidebar-collapsed": "4rem",
      },

      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        card: "0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)",
        modal: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },

      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "bounce-subtle": "bounceSubtle 2s infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
        "gradient-shift": "gradientShift 3s ease infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        pulseGlow: {
          "0%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },

      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },

      backdropBlur: {
        xs: "2px",
      },
    },
  },

  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),

    function ({ addBase, addComponents, addUtilities }) {
      addBase({
        ":root": {
          "--color-primary-50": themeColors.primary[50],
          "--color-primary-100": themeColors.primary[100],
          "--color-primary-500": themeColors.primary[500],
          "--color-primary-600": themeColors.primary[600],
          "--color-primary-700": themeColors.primary[700],
          "--color-indigo-500": themeColors.indigo[500],
          "--color-purple-500": themeColors.purple[500],
          "--color-background-primary": "#FFFFFF",
          "--color-background-secondary": "#F9FAFB",
          "--color-text-primary": "#111827",
          "--color-text-secondary": "#374151",
          "--border-radius-default": "0.5rem",
          "--shadow-default":
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },

        html: {
          scrollBehavior: "smooth",
        },

        body: {
          backgroundColor: "#FFFFFF",
          color: "#111827",
          fontFamily: "Inter, system-ui, sans-serif",
          lineHeight: "1.6",
        },

        "*:focus-visible": {
          outline: "2px solid #3B82F6",
          outlineOffset: "2px",
        },
      });

      addComponents({
        ".btn": {
          "@apply inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed":
            {},
        },

        ".btn-primary": {
          "@apply btn bg-gradient-to-r from-primary-500 to-indigo-500 text-white hover:from-primary-600 hover:to-indigo-600 focus:ring-primary-500 shadow-sm":
            {},
        },

        ".btn-secondary": {
          "@apply btn bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 focus:ring-primary-500 shadow-sm":
            {},
        },

        ".btn-ghost": {
          "@apply btn text-neutral-600 hover:bg-neutral-100 focus:ring-primary-500":
            {},
        },

        ".card": {
          "@apply bg-white rounded-lg border border-neutral-200 shadow-sm": {},
        },

        ".card-header": {
          "@apply px-6 py-4 border-b border-neutral-200": {},
        },

        ".card-body": {
          "@apply px-6 py-4": {},
        },

        ".card-footer": {
          "@apply px-6 py-4 border-t border-neutral-200 bg-neutral-50": {},
        },

        ".form-input": {
          "@apply block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500":
            {},
        },

        ".form-label": {
          "@apply block text-sm font-medium text-neutral-700 mb-1": {},
        },

        ".form-error": {
          "@apply text-sm text-danger-600 mt-1": {},
        },

        ".badge": {
          "@apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium":
            {},
        },

        ".badge-success": {
          "@apply badge bg-success-100 text-success-800": {},
        },

        ".badge-warning": {
          "@apply badge bg-warning-100 text-warning-800": {},
        },

        ".badge-danger": {
          "@apply badge bg-danger-100 text-danger-800": {},
        },

        ".badge-info": {
          "@apply badge bg-info-100 text-info-800": {},
        },

        ".sidebar": {
          "@apply fixed inset-y-0 left-0 z-50 w-sidebar bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out":
            {},
        },

        ".main-content": {
          "@apply flex-1 ml-sidebar min-h-screen bg-background-secondary": {},
        },

        ".page-header": {
          "@apply bg-white border-b border-neutral-200 px-6 py-4": {},
        },

        ".glass": {
          "@apply bg-white/80 backdrop-blur-md border border-white/20 shadow-glass":
            {},
        },

        ".glass-dark": {
          "@apply bg-gray-900/80 backdrop-blur-md border border-gray-700/20 shadow-glass-dark":
            {},
        },

        ".gradient-text": {
          "@apply bg-gradient-to-r from-primary-500 to-indigo-500 bg-clip-text text-transparent":
            {},
        },

        // NeuralFlow Theme Backgrounds
        ".bg-neural": {
          "@apply bg-gradient-to-b from-neural-bg via-neural-bgSecondary to-neural-bgTertiary":
            {},
        },

        ".bg-neural-chat": {
          "@apply bg-gradient-to-b from-neural-bg via-neural-bgSecondary to-neural-bg":
            {},
        },

        ".bg-neural-input": {
          "@apply bg-neural-bgSecondary/50 backdrop-blur-sm border border-neural-border/30":
            {},
        },
      });

      addUtilities({
        ".animate-fade-in": {
          animation: "fadeIn 0.2s ease-in-out",
        },

        ".animate-slide-in": {
          animation: "slideIn 0.3s ease-out",
        },

        ".animate-pulse-glow": {
          animation: "pulseGlow 2s ease-in-out infinite alternate",
        },

        ".animate-float": {
          animation: "float 6s ease-in-out infinite",
        },

        ".animate-gradient-shift": {
          animation: "gradientShift 3s ease infinite",
        },

        ".scrollbar-thin": {
          "scrollbar-width": "thin",
          "scrollbar-color": "#D1D5DB #F3F4F6",
        },

        ".scrollbar-thin::-webkit-scrollbar": {
          width: "6px",
        },

        ".scrollbar-thin::-webkit-scrollbar-track": {
          "@apply bg-neutral-100": {},
        },

        ".scrollbar-thin::-webkit-scrollbar-thumb": {
          "@apply bg-neutral-300 rounded-full hover:bg-neutral-400": {},
        },
      });
    },
  ],
};

module.exports.themeColors = themeColors;
