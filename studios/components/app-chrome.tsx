"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import type React from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import PortalAccountMenu from "@/components/portal-account-menu"
import { AUTH_SESSION_CHANGED_EVENT, clearAuthSession, getStoredUser, isAccessTokenExpired } from "@/lib/auth-session"
import { refreshAccessToken } from "@/lib/api"

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const hadAuthSession = useRef(false)
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

  useEffect(() => {
    const validateSession = async () => {
      const user = getStoredUser()
      if (!user) {
        if (hadAuthSession.current && isPortal) router.replace("/login")
        return
      }
      hadAuthSession.current = true

      const token = localStorage.getItem("accessToken")
      if (!isAccessTokenExpired(token)) return

      if (!(await refreshAccessToken())) {
        clearAuthSession()
        if (isPortal) router.replace("/login")
      }
    }

    validateSession()
    const interval = window.setInterval(validateSession, 30_000)
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, validateSession)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, validateSession)
    }
  }, [isPortal, pathname, router])

  return (
    <div className={isPortal ? "portal-site" : isAuthPage ? "auth-site" : "cosmic-site"}>
      {!isUnityLeaderboard && !isPortal && !isAuthPage ? <Navigation /> : null}
      {isPortal && !isUnityLeaderboard ? <PortalAccountMenu /> : null}
      <main>{children}</main>
      {!isUnityLeaderboard && !isPortal && !isAuthPage ? <Footer /> : null}
    </div>
  )
}
