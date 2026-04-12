"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Gamepad2, Trophy, TrendingUp } from "lucide-react"

interface User {
  email: string
  type: string
  name: string
  userId: string
}

export default function GamerDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.type !== "gamer") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
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

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="container mx-auto px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Gamer Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Welcome back, {user.name}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 lg:px-6">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total XP
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  15,420 XP
                </p>
              </div>
              <div className="text-4xl">
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Games Played
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  248
                </p>
              </div>
              <div className="text-4xl">
                <Gamepad2 className="h-8 w-8 text-cyan-500" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Current Rank
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  Gold Tier
                </p>
              </div>
              <div className="text-4xl">
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Games Section */}
        <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
            Your Game Library
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Fruit Valley", ranking: "S-Tier", wins: "245" },
              { name: "Arena Legends", ranking: "A-Tier", wins: "189" },
              { name: "Puzzle Mastery", ranking: "S-Tier", wins: "312" },
            ].map((game, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-700"
              >
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {game.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Ranking: <span className="font-semibold">{game.ranking}</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Wins: <span className="font-semibold">{game.wins}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
