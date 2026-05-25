"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users, Search, Filter, Crown } from "lucide-react"
import { fetchJson } from "@/lib/api"

interface Community {
  id: number | string
  name: string
  description: string
  member_count: number
  category?: string
}

interface CommunityPost {
  id: number
  content: string
  created_at: string
  author_name: string
  community_id?: number | string
  community_name?: string
  community_description?: string
  member_count?: number
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  const categories = ["all", "gaming", "esports", "streaming", "development", "support"]

  useEffect(() => {
    fetchCommunities()
  }, [router])

  const fetchCommunities = async () => {
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

      const postsData = await fetchJson<CommunityPost[]>("jampass/player/community/posts/")
      const communityMap = new Map<number | string, Community>()

      postsData?.forEach((post) => {
        const key = post.community_id ?? post.community_name ?? `unknown-${post.id}`
        if (!communityMap.has(key)) {
          communityMap.set(key, {
            id: key,
            name: post.community_name ?? "Community",
            description: post.community_description ?? "A player community",
            member_count: post.member_count ?? 0,
            category: "gaming",
          })
        }
      })

      const communitiesData = Array.from(communityMap.values())
      setCommunities(communitiesData)
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching communities:", err)
      setError(`Failed to load communities: ${err instanceof Error ? err.message : "Unknown error"}`)
      setIsLoading(false)
    }
  }

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          community.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || community.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-12 lg:px-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading communities...</p>
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
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Communities</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Communities are available through your player activity. This section shows the groups you are already part of via your community posts.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Communities</h3>
            </div>
            {communities.length > 0 ? (
              <div className="space-y-3">
                {communities.map((community) => (
                  <div key={community.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-semibold text-sm">
                        {community.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white truncate text-sm">{community.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{community.member_count} members</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="h-8 w-8 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400">No joined communities found</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Create a community post to become part of a group.</p>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Filter</h3>
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition text-sm capitalize ${
                    selectedCategory === category
                      ? "bg-cyan-600 text-white dark:bg-cyan-600"
                      : "bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                  }`}
                >
                  {category}
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
                placeholder="Search your communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {filteredCommunities.length > 0 ? (
              filteredCommunities.map((community) => (
                <div key={community.id} className="rounded-xl bg-white shadow-lg dark:bg-slate-800 overflow-hidden hover:shadow-xl transition">
                  <div className="h-24 bg-gradient-to-r from-cyan-400 to-blue-500 dark:from-cyan-600 dark:to-blue-700"></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-semibold text-lg -mt-6 mr-4 border-4 border-white dark:border-slate-800">
                        {community.name.charAt(0).toUpperCase()}
                      </div>
                      {community.category && (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 capitalize">
                          {community.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{community.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{community.description}</p>
                    <div className="flex items-center gap-4 mb-6 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {community.member_count} members
                      </span>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 text-sm font-semibold text-cyan-700 dark:text-cyan-200 inline-flex items-center gap-2">
                      <span>Joined</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Users className="h-16 w-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No joined communities found</h3>
                <p className="text-slate-600 dark:text-slate-400">Community discovery is currently not exposed in the backend. Use community posts to see active groups.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
