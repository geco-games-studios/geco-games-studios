"use client"
import { X } from "lucide-react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Gamepad2,
  Filter,
  Search,
  Star,
  ArrowUpRight,
  Eye,
} from "lucide-react"
import { fetchJson, postJson, getMediaUrl } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

interface PlayerGame {
  id?: number
  game_id?: number
  title?: string
  game_title?: string
  description?: string
  platforms?: string[]
  status?: string
  version?: string
  average_rating?: number
  player_rating?: number
  developer_name?: string
  studio_name?: string
  game_image?: string
  screenshot_1?: string
  screenshot_2?: string
  screenshot_3?: string
  screenshot_4?: string
  gameplay_video?: string
  game_currency?: string
  has_iaps?: boolean
  iap_provider?: string
  has_ads?: boolean
  ad_provider?: string
  is_active?: boolean
  is_connected?: boolean
  created_at?: string
  updated_at?: string
  total_points?: number
  leaderboard_position?: number
  total_players?: number
  win_rate?: number
  recent_matches?: Array<{
    opponent: string
    result: "win" | "loss"
    score: string
  }>
}

export default function MyGamesPage() {
  const [games, setGames] = useState<PlayerGame[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [detailsGame, setDetailsGame] = useState<PlayerGame | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [connectingGameId, setConnectingGameId] = useState<number | null>(null)
  const [connectionError, setConnectionError] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    fetchGamesData()
  }, [router])

  const fetchGamesData = async () => {
    try {
      setIsLoading(true)

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

      if (!normalizedGames.length && typeof responseObject === "object" && Object.keys(responseObject).length > 0) {
        console.warn("MyGamesPage: received unexpected games payload shape", responseObject)
      }

      setGames(normalizedGames.map((game) => ({
        id: game.id,
        game_id: game.game_id ?? game.id,
        title: game.title ?? game.game_title,
        game_title: game.game_title ?? game.title,
        description: game.description,
        platforms: game.platforms,
        status: game.status,
        version: game.version,
        average_rating: game.average_rating,
        player_rating: game.player_rating,
        developer_name: game.developer_name,
        studio_name: game.studio_name,
        game_image: game.game_image,
        screenshot_1: game.screenshot_1,
        screenshot_2: game.screenshot_2,
        screenshot_3: game.screenshot_3,
        screenshot_4: game.screenshot_4,
        gameplay_video: game.gameplay_video,
        game_currency: game.game_currency,
        has_iaps: game.has_iaps,
        iap_provider: game.iap_provider,
        has_ads: game.has_ads,
        ad_provider: game.ad_provider,
        is_active: game.is_active,
        created_at: game.created_at,
        updated_at: game.updated_at,
        total_points: game.total_points,
        leaderboard_position: game.leaderboard_position,
        total_players: game.total_players,
        win_rate: game.win_rate,
        recent_matches: game.recent_matches,
        is_connected: game.is_connected ?? game.connected ?? false,
      })))

      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching games data:", err)
      setError(`Failed to load games: ${err instanceof Error ? err.message : "Unknown error"}`)
      setIsLoading(false)
    }
  }

  const resolveTitle = (game: PlayerGame) => game.title ?? game.game_title ?? "Untitled Game"
  const resolveRating = (game: PlayerGame) => game.average_rating ?? game.player_rating ?? 0

  const handleConnectToGame = async (gameId?: number) => {
    if (!gameId) return

    setConnectingGameId(gameId)
    setConnectionError("")
    try {
      const response = await postJson<any>(`/api/developer/games/${gameId}/connect/`, {})
      if (response?.status !== "connected" && response?.session?.is_connected !== true) {
        throw new Error("Unable to establish an active game connection.")
      }
      // Refresh games list to update connection status
      await fetchGamesData()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to connect to game"
      console.error("Failed to connect to game:", err)
      setConnectionError(errorMsg)
    } finally {
      setConnectingGameId(null)
    }
  }

  const filteredAndSortedGames = games
    .filter((game) =>
      resolveTitle(game).toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return resolveRating(b) - resolveRating(a)
        case "points":
          return (b.total_points ?? 0) - (a.total_points ?? 0)
        case "position":
          return (a.leaderboard_position ?? 0) - (b.leaderboard_position ?? 0)
        default:
          return 0
      }
    })

  const openDetails = (game: PlayerGame) => {
    setDetailsGame(game)
    setIsDetailsDialogOpen(true)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-12 lg:px-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading your games...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-12 lg:px-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-12 lg:px-6">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Games</h2>
        <p className="text-slate-600 dark:text-slate-400">
          See your game collection, ratings, platforms, and full game details.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Overview</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Games in Library</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{games.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Average Rating</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {games.length > 0
                    ? (games.reduce((sum, g) => sum + resolveRating(g), 0) / games.length).toFixed(1)
                    : "0.0"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Points</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {games.reduce((sum, g) => sum + (g.total_points ?? 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Sort By</h3>
            </div>
            <div className="space-y-2">
              {[
                { value: "rating", label: "Highest Rating" },
                { value: "points", label: "Most Points" },
                { value: "position", label: "Best Position" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                    sortBy === option.value
                      ? "bg-cyan-600 text-white dark:bg-cyan-600"
                      : "bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {connectionError && (
            <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">{connectionError}</p>
              </div>
              <button
                onClick={() => setConnectionError("")}
                className="ml-4 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="space-y-6">
            {filteredAndSortedGames.length > 0 ? (
              filteredAndSortedGames.map((game) => (
                <div key={game.game_id} className="rounded-3xl bg-white shadow-lg dark:bg-slate-800 overflow-hidden transition hover:shadow-xl">
                  <div className="grid gap-6 lg:grid-cols-[320px_auto]">
                    <div className="relative h-72 overflow-hidden bg-slate-100 dark:bg-slate-900">
                      {game.game_image ? (
                        <img
                          src={getMediaUrl(game.game_image)}
                          alt={resolveTitle(game)}
                          className="w-full h-full object-cover"
                        />
                      ) : game.screenshot_1 ? (
                        <img
                          src={getMediaUrl(game.screenshot_1)}
                          alt={resolveTitle(game)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                          <Gamepad2 className="h-16 w-16" />
                        </div>
                      )}

                      <div className="absolute inset-x-0 top-4 px-4 flex items-center justify-between gap-4">
                        <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                          {game.status ?? "Unknown"}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${game.is_active ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"}`}>
                          {game.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-5">
                      <div className="space-y-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                              {resolveTitle(game)}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {game.studio_name ?? "Unknown Studio"} · {game.developer_name ?? "Unknown Developer"}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                              <Star className="h-3.5 w-3.5 text-yellow-500" />
                              {resolveRating(game).toFixed(1)} / 5
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                              v{game.version ?? "—"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(game.platforms ?? []).map((platform) => (
                            <span key={platform} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full">
                              {platform}
                            </span>
                          ))}
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 line-clamp-3">
                          {game.description ?? "No description available."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                          <p className="text-xs uppercase tracking-wide">Currency</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{game.game_currency ?? "N/A"}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                          <p className="text-xs uppercase tracking-wide">IAPs</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{game.has_iaps ? "Yes" : "No"}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                          <p className="text-xs uppercase tracking-wide">Ads</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{game.has_ads ? "Yes" : "No"}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                          <p className="text-xs uppercase tracking-wide">Updated</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{game.updated_at ? new Date(game.updated_at).toLocaleDateString() : "—"}</p>
                        </div>
                      </div>
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleConnectToGame(game.game_id)}
                          disabled={connectingGameId === game.game_id}
                          className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-60"
                        >
                          {connectingGameId === game.game_id ? "Connecting..." : game.is_connected ? "Connected" : "Connect to Game"}
                        </button>
                        {game.is_connected && (
                          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Session active</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => openDetails(game)}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-700 transition"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </button>
                        {game.gameplay_video && (
                          <a
                            href={getMediaUrl(game.gameplay_video)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                            Watch Trailer
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 rounded-3xl bg-white shadow-lg dark:bg-slate-800 p-8">
                <Gamepad2 className="h-16 w-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No games yet</h3>
                <p className="text-slate-600 dark:text-slate-400">Start playing to see your games and full details here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white text-slate-950 dark:bg-slate-950 dark:text-white border border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>{resolveTitle(detailsGame ?? {})} Details</DialogTitle>
            <DialogDescription>View full game information, screenshots, and media.</DialogDescription>
          </DialogHeader>

          {detailsGame && (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  {detailsGame.game_image ? (
                    <img
                      src={getMediaUrl(detailsGame.game_image)}
                      alt={resolveTitle(detailsGame)}
                      className="w-full h-80 object-cover rounded-3xl"
                    />
                  ) : (
                    <div className="w-full h-80 rounded-3xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500">
                      <Gamepad2 className="h-20 w-20" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Basic Info</p>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{resolveTitle(detailsGame)}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{detailsGame.description ?? "No description available."}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-xs uppercase tracking-wide">Developer</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{detailsGame.developer_name ?? "Unknown"}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-xs uppercase tracking-wide">Studio</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{detailsGame.studio_name ?? "Unknown"}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-xs uppercase tracking-wide">Status</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{detailsGame.status ?? "Unknown"}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-xs uppercase tracking-wide">Version</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{detailsGame.version ?? "—"}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-xs uppercase tracking-wide">Rating</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{resolveRating(detailsGame).toFixed(1)} / 5</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                      <p className="text-xs uppercase tracking-wide">Currency</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{detailsGame.game_currency ?? "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-900">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    {(detailsGame.platforms ?? []).length > 0 ? (
                      detailsGame.platforms!.map((platform) => (
                        <span key={platform} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-white">
                          {platform}
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-600 dark:text-slate-400">No platforms listed.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-900">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monetization</h4>
                  <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                    <p><strong>In-app purchases:</strong> {detailsGame.has_iaps ? "Yes" : "No"}</p>
                    {detailsGame.has_iaps && <p><strong>Provider:</strong> {detailsGame.iap_provider ?? "Not specified"}</p>}
                    <p><strong>Ads:</strong> {detailsGame.has_ads ? "Yes" : "No"}</p>
                    {detailsGame.has_ads && <p><strong>Provider:</strong> {detailsGame.ad_provider ?? "Not specified"}</p>}
                  </div>
                </div>
              </div>

              {(detailsGame.screenshot_1 || detailsGame.screenshot_2 || detailsGame.screenshot_3 || detailsGame.screenshot_4) && (
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Screenshots</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {detailsGame.screenshot_1 && <img src={getMediaUrl(detailsGame.screenshot_1)} alt="Screenshot 1" className="w-full h-48 object-cover rounded-3xl" />}
                    {detailsGame.screenshot_2 && <img src={getMediaUrl(detailsGame.screenshot_2)} alt="Screenshot 2" className="w-full h-48 object-cover rounded-3xl" />}
                    {detailsGame.screenshot_3 && <img src={getMediaUrl(detailsGame.screenshot_3)} alt="Screenshot 3" className="w-full h-48 object-cover rounded-3xl" />}
                    {detailsGame.screenshot_4 && <img src={getMediaUrl(detailsGame.screenshot_4)} alt="Screenshot 4" className="w-full h-48 object-cover rounded-3xl" />}
                  </div>
                </div>
              )}

              {detailsGame.gameplay_video && (
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Gameplay Video</h4>
                  <video src={getMediaUrl(detailsGame.gameplay_video)} controls className="w-full rounded-3xl max-h-[420px] bg-slate-900" />
                </div>
              )}

              <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-900">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Updated Info</h4>
                <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <p><strong>Created:</strong> {detailsGame.created_at ? new Date(detailsGame.created_at).toLocaleString() : "—"}</p>
                  <p><strong>Last updated:</strong> {detailsGame.updated_at ? new Date(detailsGame.updated_at).toLocaleString() : "—"}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <button className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-700 transition">
                Close
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
