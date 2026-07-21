/**
 * VeyloPrep Design System & Theme Constants
 */

export const THEME_COLORS = {
  dark: {
    bg: "#09090B",
    cardBg: "#18181B",
    elevatedBg: "#0E0E10",
    border: "#27272A",
    textPrimary: "#F4F4F5",
    textSecondary: "#A1A1AA",
    textMuted: "#71717A",
    accentPrimary: "#3B82F6",
    accentSuccess: "#10B981",
    accentWarning: "#F59E0B",
    accentDanger: "#EF4444",
  },
  light: {
    bg: "#FAFAFA",
    cardBg: "#FFFFFF",
    elevatedBg: "#F4F4F5",
    border: "#E4E4E7",
    textPrimary: "#09090B",
    textSecondary: "#52525B",
    textMuted: "#71717A",
    accentPrimary: "#2563EB",
    accentSuccess: "#059669",
    accentWarning: "#D97706",
    accentDanger: "#DC2626",
  },
} as const;

export const SPACING_TOKENS = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
} as const;

export const TYPOGRAPHY = {
  fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  monoFamily: "JetBrains Mono, Menlo, monospace",
} as const;
