"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, TrendingUp, Download, Star, Users, Calendar, BarChart3, PieChart, Activity } from "lucide-react"
import { fetchJson } from "@/lib/api"

interface GameStats {
  connected_users: number
  average_rating: number
  active_users: number
  rating_count: number
}

interface Game {
  id: number
  title: string
  average_rating: number
  description: string
  platforms: string[]
}

interface GameWithStats extends Game {
  connected_users: number
  average_rating: number
}

interface ConnectedTrendResponse {
  connected_trend: Record<string, number>
}

interface PlayTimeUser {
  user_id: number
  user_name: string
  seconds_played: number
  minutes_played: number
  hours_played: number
}

interface PlayTimeResponse {
  total_seconds_played: number
  total_minutes_played: number
  total_hours_played: number
  play_time_per_user: PlayTimeUser[]
}

const WEEKDAY_ORDER = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

interface AnalyticsData {
  connectedUsers: number
  averageRating: number
  activeUsers: number
  totalHoursPlayed: number
  totalMinutesPlayed: number
  totalSecondsPlayed: number
  playTimePerUser: PlayTimeUser[]
  connectedUsersTrend: number[]
  connectedUsersTrendLabels: string[]
  topGames: GameWithStats[]
}

export default function DeveloperAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [timeRange, setTimeRange] = useState("30d")
  const router = useRouter()

  useEffect(() => {
    fetchAnalytics()
  }, [router, timeRange])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)

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

      // Fetch games list and aggregate stats
      const gamesData = await fetchJson<Game[]>("developer/games/")
      
      // Calculate aggregate metrics
      let totalConnectedUsers = 0
      let totalRating = 0
      let ratingCount = 0
      
      // Fetch stats for each game
      const topGames: GameWithStats[] = []
      for (const game of gamesData) {
        try {
          const stats = await fetchJson<GameStats>(`developer/games/${game.id}/stats/`)
          totalConnectedUsers += stats.connected_users
          totalRating += stats.average_rating
          ratingCount++
          topGames.push({
            ...game,
            connected_users: stats.connected_users,
            average_rating: stats.average_rating,
          })
        } catch (err) {
          console.warn(`Failed to fetch stats for game ${game.id}:`, err)
        }
      }

      const aggregatedTrend = WEEKDAY_ORDER.reduce<Record<string, number>>((acc, day) => {
        acc[day] = 0
        return acc
      }, {})

      let totalHoursPlayed = 0
      let totalMinutesPlayed = 0
      let totalSecondsPlayed = 0
      const playTimeByUser = new Map<number, PlayTimeUser>()

      for (const game of gamesData) {
        try {
          const trend = await fetchJson<ConnectedTrendResponse>(`developer/games/${game.id}/connected-trend/`)
          WEEKDAY_ORDER.forEach((day) => {
            aggregatedTrend[day] += trend.connected_trend?.[day] ?? 0
          })
        } catch (err) {
          console.warn(`Failed to fetch connected trend for game ${game.id}:`, err)
        }

        try {
          const playTime = await fetchJson<PlayTimeResponse>(`developer/games/${game.id}/play-time/`)
          totalSecondsPlayed += playTime.total_seconds_played
          totalMinutesPlayed += playTime.total_minutes_played
          totalHoursPlayed += playTime.total_hours_played

          playTime.play_time_per_user.forEach((user) => {
            const existing = playTimeByUser.get(user.user_id)
            if (existing) {
              existing.seconds_played += user.seconds_played
              existing.minutes_played += user.minutes_played
              existing.hours_played += user.hours_played
            } else {
              playTimeByUser.set(user.user_id, { ...user })
            }
          })
        } catch (err) {
          console.warn(`Failed to fetch play time for game ${game.id}:`, err)
        }
      }

      const connectedUsersTrend = WEEKDAY_ORDER.map((day) => aggregatedTrend[day])
      const connectedUsersTrendLabels = WEEKDAY_ORDER.map((day) => day.slice(0, 3))
      const playTimePerUser = Array.from(playTimeByUser.values()).sort((a, b) => b.seconds_played - a.seconds_played)

      const analyticsData: AnalyticsData = {
        connectedUsers: totalConnectedUsers,
        averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
        activeUsers: Math.floor(totalConnectedUsers * 0.6),
        totalHoursPlayed,
        totalMinutesPlayed,
        totalSecondsPlayed,
        playTimePerUser,
        connectedUsersTrend,
        connectedUsersTrendLabels,
        topGames: topGames.slice(0, 4)
      }

      setAnalytics(analyticsData)
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching analytics:", err)
      setError(`Failed to load analytics`)
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/login")
  }

  const formatNumber = (num?: number | null) => {
    if (typeof num !== "number" || Number.isNaN(num)) {
      return "-"
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-red-200 border-t-red-600 animate-spin mx-auto mb-4"></div>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">No analytics data available</p>
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
                Developer Portal
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Analytics Dashboard
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
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
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
              className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm"
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
        {/* Time Range Selector */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Analytics Overview
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Track your games' performance and growth metrics
            </p>
          </div>
          <div className="flex gap-2">
            {["7d", "30d", "90d", "1y"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  timeRange === range
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : range === "90d" ? "90 Days" : "1 Year"}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wide">Connected Users</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatNumber(analytics.connectedUsers)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wide">Average Rating</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.averageRating}/5</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wide">Active Users</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatNumber(analytics.activeUsers)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wide">Total Hours Played</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.totalHoursPlayed.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-8 mb-12">
          {/* Connected Users Trend */}
          <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Connected Users</h3>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {analytics.connectedUsersTrend.map((value, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-cyan-500 rounded-t-sm transition-all hover:bg-cyan-600"
                    style={{
                      height: `${analytics.connectedUsersTrend.length > 0 && Math.max(...analytics.connectedUsersTrend) > 0 ? (value / Math.max(...analytics.connectedUsersTrend)) * 200 : 0}px`,
                    }}
                  ></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {analytics.connectedUsersTrendLabels[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Games */}
        <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Performing Games</h3>
          </div>
          <div className="space-y-4">
            {analytics.topGames.map((game, index) => (
              <div key={game.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{game.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {typeof game.average_rating === "number" ? `${game.average_rating.toFixed(1)}/5` : "-"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 dark:text-green-400">{formatNumber(game.connected_users)}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Connected Users</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Play Time by User</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">User</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Hours</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Minutes</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Seconds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {analytics.playTimePerUser.map((user) => (
                  <tr key={user.user_id}>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">{user.user_name}</td>
                    <td className="px-4 py-3 text-right text-sm text-slate-900 dark:text-white">{user.hours_played.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-sm text-slate-900 dark:text-white">{user.minutes_played.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-sm text-slate-900 dark:text-white">{user.seconds_played}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
