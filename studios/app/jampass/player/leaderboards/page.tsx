"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Trophy,
  Zap,
  ArrowRight,
  Gamepad2,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react"
import { fetchJson } from "@/lib/api"

interface LeaderboardEntry {
  user_id: number
  user_name: string
  metric_value: number
}

interface LeaderboardResponse {
  game: string
  metric: string
  display_name: string
  leaderboard: LeaderboardEntry[]
}

interface PlayerGame {
  id?: number
  game_id?: number
  title?: string
  game_title?: string
}

function resolveGameTitle(game: PlayerGame) {
  return game.title ?? game.game_title ?? `Game ${game.game_id ?? game.id ?? "unknown"}`
}

export default function LeaderboardsPage() {
  const [games, setGames] = useState<PlayerGame[]>([])
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null)
  const [isLoadingGames, setIsLoadingGames] = useState(true)
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false)
  const [error, setError] = useState("")
  const [leaderboardError, setLeaderboardError] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadGames()
  }, [router])

  useEffect(() => {
    if (selectedGameId !== null) {
      loadLeaderboard(selectedGameId)
    }
  }, [selectedGameId])

  const loadGames = async () => {
    try {
      setIsLoadingGames(true)
      setError("")

      const userData = localStorage.getItem("currentUser")
      const accessToken = localStorage.getItem("accessToken")

      if (!userData || !accessToken) {
        router.push("/login")
        return
      }

      const parsedUser = JSON.parse(userData)
      if (parsedUser.type !== "jampass" || (parsedUser.sub_user_type !== "player" && parsedUser.jampass_sub_type !== "player")) {
        router.push("/login")
        return
      }

      const gamesData = await fetchJson<unknown>("jampass/player/games/")
      const responseObject = gamesData as any

      const normalizedGames: any[] = Array.isArray(gamesData)
        ? gamesData
        : Array.isArray(responseObject.results)
        ? responseObject.results
        : Array.isArray(responseObject.data)
        ? responseObject.data
        : Array.isArray(responseObject.games)
        ? responseObject.games
        : responseObject.game && Array.isArray(responseObject.game)
        ? responseObject.game
        : responseObject.game && typeof responseObject.game === "object"
        ? [responseObject.game]
        : typeof responseObject === "object" && Object.keys(responseObject).length > 0 && (responseObject.game_id || responseObject.title || responseObject.game_title)
        ? [responseObject]
        : []

      const normalized = normalizedGames.map((game) => ({
        id: game.id,
        game_id: game.game_id ?? game.id,
        title: game.title,
        game_title: game.game_title,
      }))

      setGames(normalized)
      if (!selectedGameId && normalized.length > 0) {
        setSelectedGameId(normalized[0].game_id ?? normalized[0].id ?? null)
      }
    } catch (err) {
      console.error("Error loading games for leaderboard page:", err)
      setError(`Failed to load games: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsLoadingGames(false)
    }
  }

  const loadLeaderboard = async (gameId: number) => {
    try {
      setIsLoadingLeaderboard(true)
      setLeaderboardError("")
      setLeaderboard(null)

      const leaderboardData = await fetchJson<LeaderboardResponse>(`jampass/player/leaderboard/game/${gameId}/`)
      setLeaderboard(leaderboardData)
    } catch (err) {
      console.error("Error loading leaderboard:", err)
      setLeaderboardError(`Failed to load leaderboard: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsLoadingLeaderboard(false)
    }
  }

  const selectedGame = useMemo(
    () => games.find((game) => game.game_id === selectedGameId),
    [games, selectedGameId]
  )

  const haveEntry = leaderboard?.leaderboard?.length > 0

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="container mx-auto px-4 py-12 lg:px-6">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Leaderboards</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">
              Live ranking data from your game API. Choose a game below to see the current leaderboard.
            </p>
          </div>
          <Link
            href="/jampass/player/games"
            className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            View My Games
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_auto]">
          <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Game Selector</h2>
            {isLoadingGames ? (
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <RefreshCcw className="h-5 w-5 text-cyan-600 animate-spin" />
                <p>Loading games...</p>
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-red-100 p-4 text-sm text-red-700 dark:bg-red-900 dark:text-red-200">
                {error}
              </div>
            ) : games.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                No games found. Play a game or visit the My Games page to register one.
              </div>
            ) : (
              <div className="space-y-4">
                <label htmlFor="game-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Select game
                </label>
                <select
                  id="game-select"
                  value={selectedGameId ?? ""}
                  onChange={(event) => setSelectedGameId(Number(event.target.value))}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  {games.map((game) => (
                    <option key={game.game_id ?? game.id} value={game.game_id ?? game.id}>
                      {resolveGameTitle(game)}
                    </option>
                  ))}
                </select>
                <div className="rounded-2xl bg-slate-50 p-4 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {selectedGame
                    ? `Viewing the leaderboard for ${resolveGameTitle(selectedGame)}.`
                    : "Select a game to load its leaderboard."}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Leaderboard</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {leaderboard?.display_name ? `Metric: ${leaderboard.display_name}` : "Fetch a leaderboard to see ranking details."}
                </p>
              </div>
              {selectedGameId !== null && (
                <button
                  onClick={() => loadLeaderboard(selectedGameId)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Refresh
                </button>
              )}
            </div>

            {leaderboardError ? (
              <div className="rounded-2xl bg-red-100 p-4 text-sm text-red-700 dark:bg-red-900 dark:text-red-200">
                <AlertTriangle className="inline-block h-4 w-4 mr-2" />
                {leaderboardError}
              </div>
            ) : isLoadingLeaderboard ? (
              <div className="rounded-2xl bg-slate-50 p-6 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Loading leaderboard...
              </div>
            ) : !haveEntry ? (
              <div className="rounded-2xl bg-slate-50 p-6 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                No leaderboard entries available for this game.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-100 dark:bg-slate-950">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Rank</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Player</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">{leaderboard?.display_name ?? "Metric"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
                    {leaderboard?.leaderboard?.map((entry, index) => (
                      <tr key={entry.user_id}>
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">#{index + 1}</td>
                        <td className="px-4 py-4 text-sm text-slate-700 dark:text-slate-300">{entry.user_name}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-semibold text-slate-900 dark:text-white">{entry.metric_value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
