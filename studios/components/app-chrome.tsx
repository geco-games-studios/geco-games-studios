"use client"

import { usePathname } from "next/navigation"
import type React from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isUnityLeaderboard = pathname === "/unity-leaderboard"
  const isFullscreenExperience = isUnityLeaderboard || pathname.startsWith("/play")

  return (
    <>
      {!isFullscreenExperience ? <Navigation /> : null}
      <main>{children}</main>
      {!isFullscreenExperience ? <Footer /> : null}
    </>
  )
}
