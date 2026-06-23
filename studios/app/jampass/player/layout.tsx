"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { LogOut, Repeat2 } from "lucide-react"
import { clearAuthSession } from "@/lib/auth-session"

interface CurrentUser {
  email: string
  type: string
  name: string
  userId: string
}

export default function PlayerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    const accessToken = localStorage.getItem("accessToken")

    if (!userData || !accessToken) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.type !== "jampass" || (parsedUser.sub_user_type !== "player" && parsedUser.jampass_sub_type !== "player")) {
        router.push("/login")
        return
      }
      setUser(parsedUser)
    } catch (err) {
      router.push("/login")
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    clearAuthSession()
    router.push("/login")
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Jampass Player Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Welcome back, gamer!
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/select-service"
                className="flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-200 dark:bg-cyan-900 dark:text-cyan-200 dark:hover:bg-cyan-800"
              >
                <Repeat2 className="h-4 w-4" />
                Switch Service
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 border-t border-slate-200 dark:border-slate-800 pt-4 pb-0 -mb-px overflow-x-auto">
            <Link
              href="/jampass/player/dashboard"
              className={`px-4 py-3 border-b-2 font-semibold text-sm transition ${
                isActive("/jampass/player/dashboard")
                  ? "border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400"
                  : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/jampass/player/communities"
              className={`px-4 py-3 border-b-2 font-semibold text-sm transition ${
                isActive("/jampass/player/communities")
                  ? "border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400"
                  : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Communities
            </Link>
            <Link
              href="/jampass/player/games"
              className={`px-4 py-3 border-b-2 font-semibold text-sm transition ${
                isActive("/jampass/player/games")
                  ? "border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400"
                  : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              My Games
            </Link>
            <Link
              href="/jampass/player/leaderboards"
              className={`px-4 py-3 border-b-2 font-semibold text-sm transition ${
                isActive("/jampass/player/leaderboards")
                  ? "border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400"
                  : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Leaderboards
            </Link>
            <Link
              href="/jampass/player/finance"
              className={`px-4 py-3 border-b-2 font-semibold text-sm transition ${
                isActive("/jampass/player/finance")
                  ? "border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400"
                  : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Finance
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}
    </div>
  )
}
