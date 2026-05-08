"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Gamepad2, Plus, Edit2, Trash2, TrendingUp, Download, Star } from "lucide-react"
import { fetchJson, deleteJson } from "@/lib/api"

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
  is_active: boolean
  created_at: string
  updated_at: string
  developer: number
}

export default function DeveloperGamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchGames()
  }, [router])

  const fetchGames = async () => {
    try {
      setIsLoading(true)

      const userData = localStorage.getItem("currentUser")
      const accessToken = localStorage.getItem("accessToken")

      if (!userData) {
        router.push("/login")
        return
      }

      if (!accessToken) {
        console.warn("No access token found in localStorage")
        setError("Session expired. Please log in again.")
        router.push("/login")
        return
      }

      const parsedUser = JSON.parse(userData)

      // Only allow developer users
      if (parsedUser.type !== "developer") {
        router.push("/login")
        return
      }

      // Fetch games from API
      const gamesData = await fetchJson<Game[]>("developer/games/")
      setGames(gamesData)
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching games:", err)
      setError(`Failed to load games: ${err instanceof Error ? err.message : "Unknown error"}`)
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/login")
  }

  const handleDeleteGame = async (gameId: number) => {
    if (confirm("Are you sure you want to delete this game?")) {
      try {
        await deleteJson(`developer/games/${gameId}/`)
        setGames(games.filter(game => game.id !== gameId))
      } catch (err) {
        console.error("Error deleting game:", err)
        setError("Failed to delete game")
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "development":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "beta":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "production":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "archived":
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading games...</p>
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
                My Games
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
              className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm"
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
        {/* Header with Action */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              My Games
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Manage and track your published games
            </p>
          </div>
          <Link
            href="/developer"
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
          >
            <Plus className="h-5 w-5" />
            Submit New Game
          </Link>
        </div>

        {/* Games Grid */}
        {games.length === 0 ? (
          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-12 text-center">
            <Gamepad2 className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No Games Yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              You haven't submitted any games yet. Start by submitting your first game!
            </p>
            <Link
              href="/developer"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
            >
              <Plus className="h-5 w-5" />
              Submit Your First Game
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <div
                key={game.id}
                className="rounded-xl bg-white shadow-lg dark:bg-slate-800 overflow-hidden hover:shadow-xl transition"
              >
                {/* Game Header */}
                <div className="h-40 bg-gradient-to-br from-cyan-500 to-indigo-600 relative overflow-hidden">
                  {game.game_image ? (
                    <img
                      src={game.game_image}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Gamepad2 className="h-16 w-16 text-white/30" />
                    </div>
                  )}
                </div>

                {/* Game Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {game.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {game.studio_name}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(game.status)}`}>
                      {game.status}
                    </span>
                  </div>

                  {/* Platforms */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                          Rating
                        </p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {game.average_rating.toFixed(1)}/5
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide block w-full">
                        Version
                      </span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {game.version}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                    {game.description}
                  </p>

                  {/* Status Badge */}
                  <div className="mb-4 flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${game.is_active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"}`}>
                      {game.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 py-2 font-semibold text-sm transition hover:bg-cyan-200 dark:hover:bg-cyan-900/50">
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGame(game.id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 py-2 font-semibold text-sm transition hover:bg-red-200 dark:hover:bg-red-900/50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
