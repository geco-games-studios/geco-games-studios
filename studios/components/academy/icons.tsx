// Academy icon set — dark rounded-square container with white line icons,
// matching the GECO Academy brand style.
import type { CSSProperties, ReactNode } from "react"
import { t } from "@/lib/academy-theme"

export function IconBox({
  size = 40,
  radius = 10,
  children,
  style = {},
}: {
  size?: number
  radius?: number
  children?: ReactNode
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: "#0d0f1a",
        border: `1px solid ${t.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

const iconStyle: CSSProperties = { display: "block" }

export function PlayIcon({ size = 18, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

export function BookIcon({ size = 18, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

export function WrenchIcon({ size = 18, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

export function CheckIcon({ size = 18, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function LockIcon({ size = 18, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

export function LessonTypeIcon({ type, size = 34 }: { type: string; size?: number }) {
  const inner = Math.round(size * 0.45)
  const icon =
    type === "reading" ? (
      <BookIcon size={inner} />
    ) : type === "activity" ? (
      <WrenchIcon size={inner} />
    ) : (
      <PlayIcon size={inner} />
    )
  return (
    <IconBox size={size} radius={Math.round(size * 0.28)}>
      {icon}
    </IconBox>
  )
}
