// GECO Academy design tokens — dark theme with the site's cyan accent.
// Ported from the geco-academy app's theme.js.
export type AcademyTheme = {
  bg: string
  surface: string
  surfaceHigh: string
  surfaceHover: string
  border: string
  borderStrong: string
  primary: string
  primaryDark: string
  primaryGlow: string
  primaryBg: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  danger: string
  dangerBg: string
  dangerBorder: string
  warning: string
  warningBg: string
  success: string
  successBg: string
  successBorder: string
  xp: string
  radius: string
  radiusLg: string
  font: string
}

export const academyDarkTheme: AcademyTheme = {
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

export const academyLightTheme: AcademyTheme = {
  // Backgrounds
  bg: "linear-gradient(135deg, #0f95a9 0%, #2175dd 62%, #315ce3 100%)",
  surface: "#ffffff",
  surfaceHigh: "#f5f9ff",
  surfaceHover: "#eef6ff",

  // Borders
  border: "rgba(148,163,184,0.42)",
  borderStrong: "rgba(15,23,42,0.22)",

  // Brand / accent - cyan, matches the active account card in the reference.
  primary: "#0397bf",
  primaryDark: "#087d9f",
  primaryGlow: "rgba(3,151,191,0.18)",
  primaryBg: "rgba(3,151,191,0.1)",

  // Text
  textPrimary: "#071633",
  textSecondary: "#263d5f",
  textMuted: "#52677f",

  // Status
  danger: "#dc2626",
  dangerBg: "rgba(220,38,38,0.1)",
  dangerBorder: "rgba(220,38,38,0.26)",
  warning: "#b7791f",
  warningBg: "rgba(183,121,31,0.12)",
  success: "#07885f",
  successBg: "rgba(7,136,95,0.1)",
  successBorder: "rgba(7,136,95,0.24)",
  xp: "#c77717",

  // Misc
  radius: "10px",
  radiusLg: "14px",
  font: "'Inter', system-ui, sans-serif",
} as const

export const t = academyDarkTheme
