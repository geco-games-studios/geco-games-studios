"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Plus, Trash2, Edit2, CheckCircle, Loader2 } from "lucide-react"
import { fetchJson, postJson, putJson, deleteJson } from "@/lib/api"

interface User {
  type: string
}

interface Game {
  id: number
  title: string
}

interface LeaderboardConfig {
  id: number
  game: number | { id: number; title: string }
  metric_name: string
  display_name: string
  metric_type: string
}

export default function DeveloperLeaderboardsPage() {
  const [games, setGames] = useState<Game[]>([])
  const [configs, setConfigs] = useState<LeaderboardConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({})
  const [selectedConfig, setSelectedConfig] = useState<LeaderboardConfig | null>(null)
  const [form, setForm] = useState({
    gameId: 0,
    metricName: "",
    displayName: "",
    metricType: "integer",
  })
  const router = useRouter()

  const editorFieldKey = (field: keyof typeof form) => {
    if (field === "gameId") return "game"
    if (field === "metricName") return "metric_name"
    if (field === "displayName") return "display_name"
    return "metric_type"
  }

  useEffect(() => {
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError("")
      setSuccess("")
      setBackendErrors({})

      const userData = localStorage.getItem("currentUser")
      if (!userData) {
        router.push("/login")
        return
      }

      const parsedUser = JSON.parse(userData) as User
      if (parsedUser.type !== "developer") {
        router.push("/login")
        return
      }

      const [gamesData, configsResponse] = await Promise.all([
        fetchJson<Game[]>("developer/games/"),
        fetchJson<unknown>("developer/leaderboard-configs/"),
      ])

      setGames(gamesData || [])
      setConfigs(Array.isArray(configsResponse) ? configsResponse : (configsResponse as any)?.results || [])

      if ((gamesData || []).length > 0 && form.gameId === 0) {
        setForm((prev) => ({ ...prev, gameId: gamesData[0].id }))
      }
    } catch (err) {
      console.error("Error loading leaderboard configs:", err)
      setError("Failed to load leaderboard data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/login")
  }

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setBackendErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[editorFieldKey(field)]
      return newErrors
    })
  }

  const formatApiErrorData = (data: unknown) => {
    if (!data || typeof data !== "object") {
      return ""
    }

    return Object.entries(data as Record<string, unknown>)
      .map(([key, value]) => {
        const label =
          key === "game"
            ? "Game"
            : key === "metric_name"
            ? "Metric name"
            : key === "display_name"
            ? "Display name"
            : key === "metric_type"
            ? "Metric type"
            : key === "detail"
            ? "Detail"
            : key === "message"
            ? "Message"
            : key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

        if (Array.isArray(value)) {
          return value.map((item) => `${label}: ${item}`).join(" ")
        }

        if (typeof value === "string") {
          return `${label}: ${value}`
        }

        return `${label}: ${JSON.stringify(value)}`
      })
      .join(" ")
  }

  const handleSubmit = async () => {
    try {
      setIsSaving(true)
      setError("")
      setSuccess("")
      setBackendErrors({})

      const payload = {
        game: Number(form.gameId),
        metric_name: form.metricName.trim(),
        display_name: form.displayName.trim(),
        metric_type: form.metricType,
      }

      if (!games.length) {
        setError("No published games found. Please add a game before creating leaderboard metrics.")
        return
      }

      if (!form.gameId || !payload.metric_name || !payload.display_name) {
        setError("Please select a game and fill in all required fields before saving.")
        return
      }

      const response = selectedConfig
        ? await putJson<LeaderboardConfig>(`developer/leaderboard-configs/${selectedConfig.id}/`, payload)
        : await postJson<LeaderboardConfig>("developer/leaderboard-configs/", payload)

      const savedConfig = response
      setConfigs((previous) => {
        if (selectedConfig) {
          return previous.map((item) => (item.id === savedConfig.id ? savedConfig : item))
        }
        return [savedConfig, ...previous]
      })

      setSuccess(selectedConfig ? "Leaderboard metric updated." : "Leaderboard metric created.")
      setSelectedConfig(null)
      setForm((prev) => ({ ...prev, metricName: "", displayName: "", metricType: "integer" }))
    } catch (err) {
      console.error("Error saving leaderboard config:", err)
      let errorMessage = "Unable to save leaderboard config. Please try again."

      if (err instanceof Error) {
        const responseData = (err as any).responseData
        if (responseData && typeof responseData === "object") {
          const fieldErrors: Record<string, string> = {}
          Object.entries(responseData as Record<string, unknown>).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              fieldErrors[key] = value.join(" ")
            } else if (typeof value === "string") {
              fieldErrors[key] = value
            }
          })

          if (Object.keys(fieldErrors).length > 0) {
            setBackendErrors(fieldErrors)
            errorMessage = Object.values(fieldErrors).join(" ") || errorMessage
          }
        }

        const parsedError = responseData ? formatApiErrorData(responseData) : ""
        errorMessage = parsedError || err.message || errorMessage
      }

      setError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (config: LeaderboardConfig) => {
    setSelectedConfig(config)
    const gameId = typeof config.game === "number" ? config.game : config.game.id
    setForm({
      gameId,
      metricName: config.metric_name,
      displayName: config.display_name,
      metricType: config.metric_type,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (configId: number) => {
    if (!confirm("Delete this leaderboard configuration?")) {
      return
    }
    try {
      setIsSaving(true)
      await deleteJson(`developer/leaderboard-configs/${configId}/`)
      setConfigs((previous) => previous.filter((config) => config.id !== configId))
      setSuccess("Leaderboard configuration deleted.")
      if (selectedConfig?.id === configId) {
        setSelectedConfig(null)
        setForm((prev) => ({ ...prev, metricName: "", displayName: "", metricType: "integer" }))
      }
    } catch (err) {
      console.error("Error deleting leaderboard config:", err)
      setError("Unable to delete configuration. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const getGameTitle = (config: LeaderboardConfig) => {
    if (typeof config.game === "number") {
      return games.find((game) => game.id === config.game)?.title || `Game ${config.game}`
    }
    return config.game.title
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading leaderboards...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Developer Portal</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Leaderboard Configuration</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
          <div className="flex gap-1 border-t border-slate-200 dark:border-slate-800 pt-4 pb-0 -mb-px overflow-x-auto">
            <Link href="/developer/dashboard" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">
              Dashboard
            </Link>
            <Link href="/developer/profile" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">
              Profile
            </Link>
            <Link href="/developer/games" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">
              My Games
            </Link>
            <Link href="/developer/analytics" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">
              Analytics
            </Link>
            <Link href="/developer/leaderboards" className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm">
              Leaderboards
            </Link>
            <Link href="/developer/support" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">
              Support
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Leaderboard Metric</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Define the metric that will be used to rank players for your game.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {selectedConfig ? "Edit Mode" : "Create"}
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700/30 dark:bg-red-900/30 dark:text-red-200 mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-700/30 dark:bg-emerald-900/30 dark:text-emerald-200 mb-6">
                {success}
              </div>
            )}

            <div className="grid gap-4">
              <div>
                <label htmlFor="leaderboard-game" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Game</label>
                <select
                  id="leaderboard-game"
                  value={form.gameId || ""}
                  onChange={(event) => handleChange("gameId", Number(event.target.value))}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="" disabled>
                    {games.length ? "Select a game" : "No games available"}
                  </option>
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.title}
                    </option>
                  ))}
                </select>
                {backendErrors.game && (
                  <p className="text-red-500 text-xs font-medium mt-1">{backendErrors.game}</p>
                )}
              </div>

              <div>
                <label htmlFor="leaderboard-metric-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Metric Name</label>
                <input
                  id="leaderboard-metric-name"
                  type="text"
                  value={form.metricName}
                  onChange={(event) => handleChange("metricName", event.target.value)}
                  placeholder="score"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                {backendErrors.metric_name && (
                  <p className="text-red-500 text-xs font-medium mt-1">{backendErrors.metric_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="leaderboard-display-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Display Name</label>
                <input
                  id="leaderboard-display-name"
                  type="text"
                  value={form.displayName}
                  onChange={(event) => handleChange("displayName", event.target.value)}
                  placeholder="Score"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                {backendErrors.display_name && (
                  <p className="text-red-500 text-xs font-medium mt-1">{backendErrors.display_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="leaderboard-metric-type" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Metric Type</label>
                <select
                  id="leaderboard-metric-type"
                  value={form.metricType}
                  onChange={(event) => handleChange("metricType", event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="integer">integer</option>
                  <option value="float">float</option>
                  <option value="string">string</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving || games.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {selectedConfig ? "Save Changes" : "Create Metric"}
                </button>
                {selectedConfig && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedConfig(null)
                      setForm((prev) => ({ ...prev, metricName: "", displayName: "", metricType: "integer" }))
                      setError("")
                      setSuccess("")
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Edit2 className="h-4 w-4" />
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Existing Configurations</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Manage leaderboard metrics for your published games.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {configs.length} configs
              </div>
            </div>

            {configs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                No leaderboard configurations found yet. Create one using the form.
              </div>
            ) : (
              <div className="space-y-4">
                {configs.map((config) => (
                  <div key={config.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{getGameTitle(config)}</p>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{config.display_name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Metric key: <span className="font-medium text-slate-900 dark:text-white">{config.metric_name}</span></p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Type: <span className="font-medium text-slate-900 dark:text-white">{config.metric_type}</span></p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(config)}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(config.id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
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
          </div>
        </div>
      </main>
    </div>
  )
}
