"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Gamepad2, Edit2, Trash2, TrendingUp, Download, Star, ShieldCheck, Eye, Plus } from "lucide-react"
import { fetchJson, deleteJson, postJson, getMediaUrl } from "@/lib/api"
import { SubmitGameDialog } from "@/components/developer/submit-game-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"


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
  api_key?: string
}

export default function DeveloperGamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<Game | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [detailsGame, setDetailsGame] = useState<Game | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [developerName, setDeveloperName] = useState<string>("")
  const [studioName, setStudioName] = useState<string>("")
  const router = useRouter()
    // Dialog state for verification result
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [verifyDialogStatus, setVerifyDialogStatus] = useState<'success' | 'fail' | 'connect-fail' | null>(null)
  const [verifyDialogMessage, setVerifyDialogMessage] = useState("")

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

      setDeveloperName(parsedUser.name || "")
      setStudioName(parsedUser.studio_name || "")

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

  const confirmDeleteGame = (game: Game) => {
    setDeleteTarget(game)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteGame = async (gameId: number) => {
    try {
      await deleteJson(`developer/games/${gameId}/`)
      setGames(games.filter((game) => game.id !== gameId))
      setDeleteTarget(null)
      setIsDeleteDialogOpen(false)
    } catch (err) {
      console.error("Error deleting game:", err)
      setError("Failed to delete game")
    }
  }


  const handleVerifyGame = async (game: Game) => {
    // Check access token before any API call
    const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
    if (!accessToken) {
      setVerifyDialogStatus('fail')
      setVerifyDialogMessage('Session expired. Please log in again.')
      setVerifyDialogOpen(true)
      router.push("/login")
      return
    }

    if (!game.api_key) {
      setVerifyDialogStatus('fail')
      setVerifyDialogMessage('No API key found for this game.')
      setVerifyDialogOpen(true)
      return
    }

    // 1. Check connection to the game
    try {
      const connectRes = await postJson<any>(`developer/games/${game.id}/connect/`, {})
      // Check if session exists and is_connected is true, or if status field indicates success
      const isConnected = connectRes?.session?.is_connected === true || connectRes?.status === 'connected'
      if (!isConnected) {
        setVerifyDialogStatus('connect-fail')
        setVerifyDialogMessage('Could not connect to the game. Please ensure your game is online and try again.')
        setVerifyDialogOpen(true)
        return
      }
    } catch (err) {
      setVerifyDialogStatus('connect-fail')
      setVerifyDialogMessage('Failed to connect to the game. Please ensure your game is online and try again.')
      setVerifyDialogOpen(true)
      return
    }

    // 2. If connection is successful, verify the key
    try {
      const response = await postJson<any>("developer/games/verify-key/", {
        api_key: game.api_key
      })
      if (response.status === "verified" || response.verified === true) {
        setVerifyDialogStatus('success')
        setVerifyDialogMessage('Game verified successfully!')
        setVerifyDialogOpen(true)
        // Optionally refresh games to show updated status
        fetchGames()
      } else {
        setVerifyDialogStatus('fail')
        setVerifyDialogMessage(response.message || 'Game verification failed. API key not found or invalid.')
        setVerifyDialogOpen(true)
      }
    } catch (err: any) {
      setVerifyDialogStatus('fail')
      // Show detail/message from API error if available
      let msg = 'Failed to verify game. Please try again.'
      if (err && typeof err === 'object') {
        if (err.detail) msg = err.detail
        else if (err.message) msg = err.message
      }
      setVerifyDialogMessage(msg)
      setVerifyDialogOpen(true)
    }
  }

  const handleGameCreated = (game: Game) => {
    setGames((previousGames) => [game, ...previousGames])
  }

  const handleViewDetails = (game: Game) => {
    setDetailsGame(game)
    setIsDetailsDialogOpen(true)
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


  // Always render the verification dialog so it can show during loading or error
  const verificationDialog = (
    <Dialog open={verifyDialogOpen} onOpenChange={(open) => {
      setVerifyDialogOpen(open)
      // If closing after successful verification, refresh the page
      if (!open && verifyDialogStatus === 'success') {
        setTimeout(() => window.location.reload(), 300)
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {verifyDialogStatus === 'success' && 'Game Verified!'}
            {verifyDialogStatus === 'fail' && 'Verification Failed'}
            {verifyDialogStatus === 'connect-fail' && 'Connection Failed'}
          </DialogTitle>
          <DialogDescription>
            {verifyDialogMessage}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <button className="mt-2 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Close</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading games...</p>
        </div>
        {verificationDialog}
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
        {verificationDialog}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      {verificationDialog}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 lg:px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              My Games
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Manage and track your published games
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsSubmitDialogOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400"
          >
            <Plus className="h-4 w-4" />
            Submit New Game
          </button>
        </div>

        <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6 mb-8">
          <div className="flex flex-col gap-3 md:items-center md:flex-row md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Dynamic Leaderboard Setup</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Configure your game rankings and keep leaderboard metrics updated with the developer API.
              </p>
            </div>
            <Link
              href="/developer/analytics"
              className="inline-flex items-center rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-300 dark:hover:bg-cyan-900"
            >
              Learn More in Analytics
            </Link>
          </div>
          <ol className="mt-6 space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <li>
              <span className="font-semibold">1. Register your game</span> — submit your title through the portal or <code>POST /developer/games/</code>.
            </li>
            <li>
              <span className="font-semibold">2. Configure the leaderboard metric</span> — create a config via <code>POST /developer/leaderboard-configs/</code> with <code>game</code>, <code>metric_name</code>, <code>display_name</code>, and <code>metric_type</code>.
            </li>
            <li>
              <span className="font-semibold">3. Update player progress</span> — keep the chosen metric synced in player profiles or the <code>XPoints</code> model.
            </li>
            <li>
              <span className="font-semibold">4. View the leaderboard</span> — fetch ranking data from <code>GET /leaderboard/game/&lt;game_id&gt;/</code>.
            </li>
            <li>
              <span className="font-semibold">5. Change the leaderboard metric</span> — update your game’s leaderboard config to switch from <code>score</code> to <code>coins</code>, <code>level</code>, or another field.
            </li>
            <li>
              <span className="font-semibold">6. Display it in your game</span> — consume the leaderboard API in your game client or website.
            </li>
          </ol>
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
            <button
              type="button"
              onClick={() => setIsSubmitDialogOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400"
            >
              <Plus className="h-4 w-4" />
              Submit Your First Game
            </button>
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
                      src={getMediaUrl(game.game_image)}
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
                    <button
                      onClick={() => handleViewDetails(game)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 py-2 font-semibold text-sm transition hover:bg-blue-200 dark:hover:bg-blue-900/50"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleVerifyGame(game)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 py-2 font-semibold text-sm transition hover:bg-green-200 dark:hover:bg-green-900/50"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Verify
                    </button>
                    <button
                      onClick={() => confirmDeleteGame(game)}
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
        <SubmitGameDialog
          open={isSubmitDialogOpen}
          onOpenChange={(open) => setIsSubmitDialogOpen(open)}
          onGameCreated={handleGameCreated}
          developerName={developerName}
          studioName={studioName}
          editGame={null}
        />

        <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
          setIsDeleteDialogOpen(open)
          if (!open) setDeleteTarget(null)
        }}>
          <DialogContent className="max-w-xl bg-white text-slate-950 dark:bg-slate-950 dark:text-white border border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle>Delete game?</DialogTitle>
              <DialogDescription>
                {deleteTarget ? (
                  <>This will permanently delete "{deleteTarget.title}" from your games.</>
                ) : (
                  "This action cannot be undone."
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Are you sure you want to continue? This cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </DialogClose>
              <button
                type="button"
                onClick={() => deleteTarget && handleDeleteGame(deleteTarget.id)}
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
              >
                Delete
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Game Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white text-slate-950 dark:bg-slate-950 dark:text-white border border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle>Game Details</DialogTitle>
              <DialogDescription>
                Detailed information about your game
              </DialogDescription>
            </DialogHeader>

            {detailsGame && (
              <div className="space-y-6">
                {/* Game Image */}
                <div className="flex justify-center">
                  {detailsGame.game_image ? (
                    <img
                      src={getMediaUrl(detailsGame.game_image)}
                      alt={detailsGame.title}
                      className="max-w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Gamepad2 className="h-16 w-16 text-white/30" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                    <div className="space-y-2">
                      <p><strong>Title:</strong> {detailsGame.title}</p>
                      <p><strong>Version:</strong> {detailsGame.version}</p>
                      <p><strong>Studio:</strong> {detailsGame.studio_name}</p>
                      <p><strong>Developer:</strong> {detailsGame.developer_name}</p>
                      <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(detailsGame.status)}`}>{detailsGame.status}</span></p>
                      <p><strong>Active:</strong> {detailsGame.is_active ? "Yes" : "No"}</p>
                      <p><strong>Rating:</strong> {detailsGame.average_rating.toFixed(1)}/5</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Technical Details</h3>
                    <div className="space-y-2">
                      <p><strong>Platforms:</strong></p>
                      <div className="flex flex-wrap gap-2">
                        {detailsGame.platforms.map((platform) => (
                          <span
                            key={platform}
                            className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                      <p><strong>Game Currency:</strong> {detailsGame.game_currency}</p>
                      <p><strong>Has IAPs:</strong> {detailsGame.has_iaps ? "Yes" : "No"}</p>
                      {detailsGame.has_iaps && <p><strong>IAP Provider:</strong> {detailsGame.iap_provider}</p>}
                      <p><strong>Has Ads:</strong> {detailsGame.has_ads ? "Yes" : "No"}</p>
                      {detailsGame.has_ads && <p><strong>Ad Provider:</strong> {detailsGame.ad_provider}</p>}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-slate-600 dark:text-slate-400">{detailsGame.description}</p>
                </div>

                {/* Screenshots */}
                {(detailsGame.screenshot_1 || detailsGame.screenshot_2 || detailsGame.screenshot_3 || detailsGame.screenshot_4) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Screenshots</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {detailsGame.screenshot_1 && (
                        <img
                          src={getMediaUrl(detailsGame.screenshot_1)}
                          alt="Screenshot 1"
                          className="w-full h-32 object-cover rounded"
                        />
                      )}
                      {detailsGame.screenshot_2 && (
                        <img
                          src={getMediaUrl(detailsGame.screenshot_2)}
                          alt="Screenshot 2"
                          className="w-full h-32 object-cover rounded"
                        />
                      )}
                      {detailsGame.screenshot_3 && (
                        <img
                          src={getMediaUrl(detailsGame.screenshot_3)}
                          alt="Screenshot 3"
                          className="w-full h-32 object-cover rounded"
                        />
                      )}
                      {detailsGame.screenshot_4 && (
                        <img
                          src={getMediaUrl(detailsGame.screenshot_4)}
                          alt="Screenshot 4"
                          className="w-full h-32 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Gameplay Video */}
                {detailsGame.gameplay_video && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Gameplay Video</h3>
                    <video
                      src={getMediaUrl(detailsGame.gameplay_video)}
                      controls
                      className="w-full max-h-96 rounded"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {/* API Key */}
                {detailsGame.api_key && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">API Key</h3>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded font-mono text-sm break-all">
                      {detailsGame.api_key}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="text-sm text-slate-500 dark:text-slate-400 border-t pt-4">
                  <p>Created: {new Date(detailsGame.created_at).toLocaleString()}</p>
                  <p>Last Updated: {new Date(detailsGame.updated_at).toLocaleString()}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
