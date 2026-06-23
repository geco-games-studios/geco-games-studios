"use client"

import { usePathname } from "next/navigation"
import type React from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isUnityLeaderboard = pathname === "/unity-leaderboard"

  return (
    <>
      {!isUnityLeaderboard ? <Navigation /> : null}
      <main>{children}</main>
      {!isUnityLeaderboard ? <Footer /> : null}
    </>
  )
}
