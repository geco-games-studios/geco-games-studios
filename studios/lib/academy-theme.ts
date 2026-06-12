// GECO Academy design tokens — dark theme with the site's cyan accent.
// Ported from the geco-academy app's theme.js.
export const t = {
  // Backgrounds
  bg: "#0b0b14",
  surface: "#141420",
  surfaceHigh: "#1c1c2e",
  surfaceHover: "#1e1e30",

  // Borders
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.15)",

  // Brand / accent — cyan, matches gecogames.com buttons
  primary: "#06b6d4",
  primaryDark: "#0891b2",
  primaryGlow: "rgba(6,182,212,0.18)",
  primaryBg: "rgba(6,182,212,0.12)",

  // Text
  textPrimary: "#ffffff",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",

  // Status
  danger: "#ef4444",
  dangerBg: "rgba(239,68,68,0.12)",
  dangerBorder: "rgba(239,68,68,0.3)",
  warning: "#f59e0b",
  warningBg: "rgba(245,158,11,0.12)",
  success: "#10b981",
  successBg: "rgba(16,185,129,0.12)",
  successBorder: "rgba(16,185,129,0.3)",
  xp: "#EF9F27",

  // Misc
  radius: "10px",
  radiusLg: "14px",
  font: "'Inter', system-ui, sans-serif",
} as const
