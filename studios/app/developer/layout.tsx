"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowRight, Gamepad2, Users, User } from "lucide-react"
import type { ReactNode } from "react"

const navItems = [
  { href: "/developer/dashboard", label: "Dashboard" },
  { href: "/developer/profile", label: "Profile" },
  { href: "/developer/games", label: "My Games" },
  { href: "/developer/analytics", label: "Analytics" },
  { href: "/developer/leaderboards", label: "Leaderboards" },
  { href: "/developer/communities", label: "Communities" },
  { href: "/developer/stores", label: "Stores" },
  { href: "/developer/support", label: "Support" },
  { href: "/developer/finance", label: "Finance" },
]

export default function DeveloperLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() || ""
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<{ type?: string } | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData))
      } catch (error) {
        console.warn("Failed to parse currentUser from localStorage", error)
        setCurrentUser(null)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link href="/developer" className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <Gamepad2 className="h-5 w-5" />
                Developer Portal
              </Link>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                Manage your games, analytics, communities, and support from one place.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/developer/games"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ArrowRight className="h-4 w-4" />
                Submit game
              </Link>
              {currentUser ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <User className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/login?type=developer"
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600"
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
              )}
            </div>
          </div>

          <nav className="mt-4 overflow-x-auto">
            <div className="flex gap-1 border-t border-slate-200 pt-3 dark:border-slate-800">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-3 border-b-2 text-sm font-semibold transition ${
                      isActive
                        ? "border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400"
                        : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}
