"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Gamepad2,
  Users,
  TrendingUp,
  LogOut,
  Globe,
  Zap,
  CheckCircle,
  Lock,
  Star,
} from "lucide-react"
import { fetchJson } from "@/lib/api"

interface User {
  email: string
  type: string
  name: string
  userId: string
  studio_name?: string
}

interface Game {
  id: number
  title: string
  description: string
  platforms: string[]
  status: string
  version: string
  average_rating: number
  developer_name: string
  studio_name: string
  game_image: string
  screenshot_1?: string
  screenshot_2?: string
  screenshot_3?: string
  screenshot_4?: string
  gameplay_video?: string
  game_currency?: string
  has_iaps: boolean
  iap_provider?: string
  has_ads: boolean
  ad_provider?: string
  is_active: boolean
  created_at: string
  updated_at: string
  developer: number
}

interface SubmissionEntry {
  rank: number
  title: string
  status: string
  date?: string
  views?: number
}

interface Stat {
  label: string
  value: string | number
  icon: React.ReactNode
}

export default function DeveloperDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [games, setGames] = useState<Game[]>([])
  const [stats, setStats] = useState<Stat[]>([])
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)

    // Only allow developer users
    if (parsedUser.type !== "developer") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        setError("No access token. Please login again.")
        setIsLoading(false)
        setDataLoaded(true)
        return
      }

      // Fetch games from backend
      const gamesData = await fetchJson<Game[]>("developer/games/")
      setGames(gamesData || [])

      // Calculate stats from games data
      const gameCount = gamesData?.length || 0
      const avgRating = gamesData && gamesData.length > 0
        ? (gamesData.reduce((sum, game) => sum + (game.average_rating || 0), 0) / gamesData.length).toFixed(1)
        : "0.0"

      const defaultStats = [
        {
          label: "Games Submitted",
          value: gameCount,
          icon: <Gamepad2 className="h-6 w-6 text-cyan-500" />,
        },
        {
          label: "Active Games",
          value: gamesData?.filter(g => g.is_active).length || 0,
          icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
        },
        {
          label: "Average Rating",
          value: avgRating,
          icon: <Star className="h-6 w-6 text-green-500" />,
        },
        {
          label: "Community Followers",
          value: 0,
          icon: <Users className="h-6 w-6 text-purple-500" />,
        },
      ]
      setStats(defaultStats)
      setSubmissions([])

      setIsLoading(false)
      setDataLoaded(true)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data")
      setIsLoading(false)
      setDataLoaded(true)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  const handleGameCreated = (game: Game) => {
    setGames((previousGames) => {
      const updatedGames = [game, ...previousGames]
      const activeGames = updatedGames.filter((item) => item.is_active).length
      const averageRating = updatedGames.length
        ? (
            updatedGames.reduce((sum, item) => sum + (item.average_rating || 0), 0) /
            updatedGames.length
          ).toFixed(1)
        : "0.0"

      setStats((previousStats) => [
        {
          label: "Games Submitted",
          value: updatedGames.length,
          icon: <Gamepad2 className="h-6 w-6 text-cyan-500" />,
        },
        {
          label: "Active Games",
          value: activeGames,
          icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
        },
        {
          label: "Average Rating",
          value: averageRating,
          icon: <Star className="h-6 w-6 text-green-500" />,
        },
        previousStats[3] || {
          label: "Community Followers",
          value: 0,
          icon: <Users className="h-6 w-6 text-purple-500" />,
        },
      ])

      return updatedGames
    })
  }

  if (isLoading || !dataLoaded) {
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
        <div className="container mx-auto px-4 lg:px-6">
          <div className="py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Developer Portal
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

          {/* Navigation Tabs */}
          <div className="flex gap-1 border-t border-slate-200 dark:border-slate-800 pt-4 pb-0 -mb-px overflow-x-auto">
            <Link
              href="/developer/dashboard"
              className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/developer/profile"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Profile
            </Link>
            <Link
              href="/developer/games"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              My Games
            </Link>
            <Link
              href="/developer/analytics"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Analytics
            </Link>
            <Link
              href="/developer/support"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Support
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 lg:px-6">
        {/* Stats Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Games Section */}
        <div className="mb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              My Games
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {games.length > 0 ? (
              games.map((game) => (
                <div
                  key={game.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-800"
                >
                  {/* Game Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-400">
                      <Gamepad2 className="h-6 w-6" />
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        game.status === "prototype"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : game.status === "beta"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : game.status === "ready"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {game.status ? game.status.charAt(0).toUpperCase() + game.status.slice(1) : "Active"}
                    </span>
                  </div>

                  {/* Game Details */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {game.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {game.description}
                  </p>

                  {/* Platforms */}
                  <div className="mb-6 flex flex-wrap gap-2">
                    {game.platforms?.map((platform) => (
                      <span
                        key={platform}
                        className="inline-flex rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="mb-6 flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {typeof game.average_rating === "number" ? game.average_rating.toFixed(1) : "0.0"}/5
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      Rating
                    </span>
                  </div>

                  {/* View Button */}
                  <Link
                    href="#"
                    className="block rounded-lg bg-cyan-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
                  >
                    View Details
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Gamepad2 className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  No games submitted yet
                </h3>
                <p className="text-slate-500 dark:text-slate-500 mb-6">
                  Share your game with our community and reach players worldwide.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
            Recent Activity
          </h2>

          <div className="space-y-3">
            {submissions.length > 0 ? (
              submissions.map((entry) => (
                <div
                  key={entry.rank}
                  className="flex items-center justify-between rounded-lg p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 transition"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-900 dark:bg-slate-600 dark:text-white">
                      {entry.rank}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {entry.title}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {entry.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 block">
                      {entry.status}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {entry.views} views
                    </span>
                  </div>
                </div>
              ))
            ) : isClient && user ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>No activity yet. Submit your first game to get started!</p>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>Loading activity...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
