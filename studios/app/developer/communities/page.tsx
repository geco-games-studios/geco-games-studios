"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Users, PlusCircle, ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import { fetchJson, postJson } from "@/lib/api"
import { canAccessService } from "@/lib/auth-session"

interface Community {
  id: number
  name: string
  description: string
  category?: string
  member_count?: number
  is_joined?: boolean
}

interface Membership {
  id: number
  community_id: number
  community_name: string
  role?: string
}

interface Game {
  id: number
  title: string
}

export default function DeveloperCommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isCreateLoading, setIsCreateLoading] = useState(false)
  const [newCommunityName, setNewCommunityName] = useState("")
  const [newCommunityDescription, setNewCommunityDescription] = useState("")
  const [newCommunityCategory, setNewCommunityCategory] = useState("")
  const [newCommunityGameId, setNewCommunityGameId] = useState<number | string>("")
  const [createMessage, setCreateMessage] = useState("")
  const [createError, setCreateError] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (!canAccessService(parsedUser, "developer")) {
      router.push("/login")
      return
    }

    fetchAllData()
  }, [router])

  const fetchAllData = async () => {
    setIsLoading(true)
    setError("")

    try {
      const [communitiesData, membershipData, gamesData] = await Promise.all([
        fetchJson<Community[]>("/api/developer/communities/"),
        fetchJson<Membership[]>("/api/developer/community-members/"),
        fetchJson<unknown>("/api/developer/games/"),
      ])

      const gamesList = Array.isArray(gamesData)
        ? gamesData
        : (gamesData as any)?.results || []

      setCommunities(communitiesData || [])
      setMemberships(membershipData || [])
      setGames(gamesList)
    } catch (err) {
      console.error("Error loading communities:", err)
      setError("Unable to load developer communities at this time.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinCommunity = async (communityId: number) => {
    setIsActionLoading(true)
    try {
      await postJson(`/api/developer/communities/${communityId}/join/`, {})
      await fetchAllData()
    } catch (err) {
      console.error("Error joining community:", err)
      setError("Could not join the community. Please try again.")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleLeaveCommunity = async (communityId: number) => {
    setIsActionLoading(true)
    try {
      await postJson(`/api/developer/communities/${communityId}/leave/`, {})
      await fetchAllData()
    } catch (err) {
      console.error("Error leaving community:", err)
      setError("Could not leave the community. Please try again.")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleCreateCommunity = async () => {
    if (!newCommunityName.trim() || !newCommunityDescription.trim()) {
      setCreateMessage("")
      setCreateError("Please provide a community name and description.")
      return
    }

    if (!newCommunityGameId) {
      setCreateMessage("")
      setCreateError("Please attach the community to one of your games.")
      return
    }

    setIsCreateLoading(true)
    setCreateMessage("")
    setCreateError("")
    setError("")

    try {
      await postJson("/api/developer/communities/", {
        name: newCommunityName,
        description: newCommunityDescription,
        category: newCommunityCategory || "General",
        game: Number(newCommunityGameId),
      })
      setCreateMessage("Community created successfully.")
      setCreateError("")
      setNewCommunityName("")
      setNewCommunityDescription("")
      setNewCommunityCategory("")
      setNewCommunityGameId("")
      await fetchAllData()
    } catch (err) {
      console.error("Error creating community:", err)
      setCreateMessage("")
      setCreateError("Could not create the community. Please try again.")
    } finally {
      setIsCreateLoading(false)
    }
  }

  const filteredCommunities = communities.filter((community) => {
    const query = searchQuery.toLowerCase()
    return (
      community.name.toLowerCase().includes(query) ||
      community.description.toLowerCase().includes(query) ||
      (community.category || "").toLowerCase().includes(query)
    )
  })

  const joinedCount = communities.filter((community) => community.is_joined).length

  return (
    <div className="container mx-auto px-4 lg:px-6 py-10">
      <div className="space-y-8">
        <section className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Developer Communities</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Join or manage your developer groups</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                Discover communities for developers, collaborate with peers, and manage your memberships from one place.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Joined communities</p>
              <p className="mt-2 text-3xl font-semibold">{joinedCount}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    type="text"
                    placeholder="Search communities..."
                    className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-900/40"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                  Loading communities...
                </div>
              ) : error ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
                  {error}
                </div>
              ) : filteredCommunities.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                  No communities found. Try a different search term or refresh the page.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCommunities.map((community) => (
                    <div key={community.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200">
                              <Users className="h-5 w-5" />
                            </span>
                            {community.category || "Developer Community"}
                          </div>
                          <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">{community.name}</h2>
                          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{community.description}</p>
                        </div>
                        <div className="flex flex-col items-start gap-3 sm:items-end">
                          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {community.member_count ?? 0} members
                          </div>
                          {community.is_joined ? (
                            <button
                              onClick={() => handleLeaveCommunity(community.id)}
                              disabled={isActionLoading}
                              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200 dark:hover:bg-red-900"
                            >
                              <XCircle className="h-4 w-4" />
                              Leave
                            </button>
                          ) : (
                            <button
                              onClick={() => handleJoinCommunity(community.id)}
                              disabled={isActionLoading}
                              className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
                            >
                              <PlusCircle className="h-4 w-4" />
                              Join
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <aside className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Your Memberships</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Active memberships</h2>
                </div>
                <div className="rounded-full bg-cyan-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                  {memberships.length}
                </div>
              </div>

              {memberships.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                  You are not currently a member of any developer community. Join a community from the list to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {memberships.map((membership) => (
                    <div key={membership.id} className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-900">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{membership.community_name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Role: {membership.role ?? "Member"}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                  <PlusCircle className="h-4 w-4" />
                  Create Community
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Create a new developer community once you have a game in your account.
                </p>

                {games.length === 0 ? (
                  <div className="mt-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                    You need at least one game before you can create a community.
                  </div>
                ) : (
                  <div className="mt-4 space-y-4" aria-live="polite">
                    {createMessage ? (
                      <div className="rounded-2xl bg-cyan-50 p-4 text-sm text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200">
                        {createMessage}
                      </div>
                    ) : null}
                    {createError ? (
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
                        {createError}
                      </div>
                    ) : null}

                    <input
                      value={newCommunityName}
                      onChange={(event) => setNewCommunityName(event.target.value)}
                      type="text"
                      placeholder="Community name"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-900/40"
                    />
                    <select
                      value={newCommunityGameId}
                      onChange={(event) => setNewCommunityGameId(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-900/40"
                    >
                      <option value="">Attach to a game</option>
                      {games.map((game) => (
                        <option key={game.id} value={game.id}>
                          {game.title}
                        </option>
                      ))}
                    </select>
                    <input
                      value={newCommunityCategory}
                      onChange={(event) => setNewCommunityCategory(event.target.value)}
                      type="text"
                      placeholder="Category (optional)"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-900/40"
                    />
                    <textarea
                      value={newCommunityDescription}
                      onChange={(event) => setNewCommunityDescription(event.target.value)}
                      placeholder="Short description"
                      rows={4}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-900/40"
                    />
                    <button
                      type="button"
                      onClick={handleCreateCommunity}
                      disabled={isCreateLoading}
                      className="w-full rounded-full bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCreateLoading ? "Creating…" : "Create community"}
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Membership tips
                </div>
                <ul className="space-y-2">
                  <li>• Join multiple developer groups to expand your reach.</li>
                  <li>• Share launch updates and collaborate with other developers.</li>
                  <li>• Leave communities if they no longer fit your focus.</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  )
}
