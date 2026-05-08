"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  LogOut,
  Trophy,
  Users,
  MessageSquare,
  TrendingUp,
  Star,
  Crown,
  Gamepad2,
  Plus,
  Send,
  Target,
  Award,
  Zap
} from "lucide-react"
import { fetchJson, postJson } from "@/lib/api"

interface Community {
  id: number
  name: string
  description: string
  member_count: number
  is_joined: boolean
}

interface GameStats {
  game_id: number
  game_title: string
  player_rating: number
  total_points: number
  leaderboard_position: number
  total_players: number
}

interface PlayerStats {
  total_rating: number
  total_points: number
  games_played: number
  communities_joined: number
  game_stats: GameStats[]
}

interface Post {
  id: number
  content: string
  created_at: string
  author_name: string
  community_name: string
}

export default function PlayerDashboardPage() {
  const [stats, setStats] = useState<PlayerStats | null>(null)
  const [communities, setCommunities] = useState<Community[]>([])
  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      const userData = localStorage.getItem("currentUser")
      const accessToken = localStorage.getItem("accessToken")

      if (!userData) {
        router.push("/login")
        return
      }

      if (!accessToken) {
        setError("Session expired. Please log in again.")
        router.push("/login")
        return
      }

      const parsedUser = JSON.parse(userData)

      // Only allow jampass player users
      if (parsedUser.type !== "jampass" || (parsedUser.sub_user_type !== "player" && parsedUser.jampass_sub_type !== "player")) {
        router.push("/login")
        return
      }

      // Fetch player stats
      const statsData = await fetchJson<PlayerStats>("jampass/player/stats/")
      setStats(statsData)

      // Fetch recent community posts
      const postsData = await fetchJson<Post[]>("jampass/player/community/posts/")
      setPosts(postsData)

      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError(`Failed to load dashboard: ${err instanceof Error ? err.message : "Unknown error"}`)
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/login")
  }

  const handleJoinCommunity = async (communityId: number) => {
    try {
      await postJson(`jampass/communities/${communityId}/join/`, {})
      // Refresh data
      await fetchDashboardData()
    } catch (err) {
      console.error("Error joining community:", err)
    }
  }

  const handleLeaveCommunity = async (communityId: number) => {
    try {
      await postJson(`jampass/communities/${communityId}/leave/`, {})
      // Refresh data
      await fetchDashboardData()
    } catch (err) {
      console.error("Error leaving community:", err)
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.trim() || !selectedCommunity) return

    try {
      setIsPosting(true)
      await postJson("jampass/player/community/posts/", {
        content: newPost,
        community: selectedCommunity
      })

      setNewPost("")
      setSelectedCommunity(null)

      // Refresh posts
      const postsData = await fetchJson<Post[]>("jampass/player/community/posts/")
      setPosts(postsData)
    } catch (err) {
      console.error("Error creating post:", err)
    } finally {
      setIsPosting(false)
    }
  }

  const gameStats = stats?.game_stats ?? []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading player dashboard...</p>
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

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">No dashboard data available</p>
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
                Jampass Player Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Welcome back, gamer!
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
              href="/jampass/player/dashboard"
              className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/jampass/player/communities"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Communities
            </Link>
            <Link
              href="/jampass/player/games"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              My Games
            </Link>
            <Link
              href="/jampass/player/leaderboards"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Leaderboards
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 lg:px-6">
        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Player Rating</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{(stats.total_rating ?? 0).toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Points</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{(stats.total_points ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Gamepad2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Games Played</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.games_played ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Communities</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.communities_joined ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Game Stats & Leaderboards */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Your Game Performance</h3>
              </div>

              <div className="space-y-4">
                {gameStats.map((game) => (
                  <div key={game.game_id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                        <Gamepad2 className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{game.game_title}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {(game.player_rating ?? 0).toFixed(1)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {(game.total_points ?? 0).toLocaleString()} pts
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <span className="font-bold text-slate-900 dark:text-white">
                          #{game.leaderboard_position ?? 0}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        of {(game.total_players ?? 0).toLocaleString()} players
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Feed */}
            <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Community Feed</h3>
              </div>

              {/* Create Post */}
              {joinedCommunities.length > 0 && (
                <div className="mb-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label htmlFor="community-select" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Post to Community
                      </label>
                      <select
                        id="community-select"
                        value={selectedCommunity || ""}
                        onChange={(e) => setSelectedCommunity(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">Select community...</option>
                        {joinedCommunities.map((community) => (
                          <option key={community.id} value={community.id}>
                            {community.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-3">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share your gaming experience..."
                      rows={3}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      onClick={handleCreatePost}
                      disabled={isPosting || !newPost.trim() || !selectedCommunity}
                      className="px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isPosting ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Post
                    </button>
                  </div>
                </div>
              )}

              {/* Posts Feed */}
              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                          {post.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-slate-900 dark:text-white">{post.author_name}</span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">in {post.community_name}</span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-900 dark:text-white">{post.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 mb-4">No posts yet</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      Join a community and start sharing your gaming experiences!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Communities Sidebar */}
          <div className="space-y-8">
            <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Communities</h3>
              </div>

              <div className="space-y-4">
                {communities.map((community) => (
                  <div key={community.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{community.name}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{community.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {community.member_count} members
                      </span>
                      {community.is_joined ? (
                        <button
                          onClick={() => handleLeaveCommunity(community.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                        >
                          Leave
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinCommunity(community.id)}
                          className="px-3 py-1 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/jampass/marketplace"
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
                >
                  <Zap className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-slate-900 dark:text-white">Visit Jam Store</span>
                </Link>
                <Link
                  href="/jampass/tournaments"
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
                >
                  <Trophy className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-slate-900 dark:text-white">Join Tournament</span>
                </Link>
                <Link
                  href="/jampass/player/profile"
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
                >
                  <Award className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-slate-900 dark:text-white">Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}