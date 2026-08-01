"use client"

import { usePathname } from "next/navigation"
import type React from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import PortalAccountMenu from "@/components/portal-account-menu"

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isUnityLeaderboard = pathname === "/unity-leaderboard"
  const isAuthPage = pathname === "/login" || pathname === "/forgot-password" || pathname.startsWith("/register")
  const isPortal =
    pathname.includes("/dashboard") ||
    pathname.startsWith("/developer/") ||
    pathname.startsWith("/jampass/player") ||
    (pathname.startsWith("/academy/") && pathname !== "/academy/") ||
    pathname.startsWith("/select-service") ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/play/")

  return (
    <div className={isPortal ? "portal-site" : isAuthPage ? "auth-site" : "cosmic-site"}>
      {!isUnityLeaderboard && !isPortal && !isAuthPage ? <Navigation /> : null}
      {isPortal && !isUnityLeaderboard ? <PortalAccountMenu /> : null}
      <main>{children}</main>
      {!isUnityLeaderboard && !isPortal && !isAuthPage ? <Footer /> : null}
    </div>
  )
}
