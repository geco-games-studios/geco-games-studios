"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, BookMarked } from "lucide-react"

interface Module {
  id: number
  title: string
  description?: string
  course?: number
  lessons_count?: number
}

interface User {
  email: string
  type: string
  name: string
  userId: string
}

export default function ModulesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  const isAcademyUser = (parsedUser: any) => {
    const userType = parsedUser.type || parsedUser.account_type || parsedUser.user_type || parsedUser.role || ""
    const academySubType = parsedUser.academy_sub_type || ""
    return ["student", "academy", "admin", "trainee", "developer", "jampass"].includes(userType) ||
           ["student", "academy", "admin", "trainee", "developer", "jampass"].includes(academySubType) ||
           ["student", "academy", "admin", "trainee", "developer", "jampass"].includes(parsedUser.account_type)
  }

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (!isAcademyUser(parsedUser)) {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    fetchModules()
  }, [router])

  const fetchModules = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        setError("No access token")
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/academy/modules", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const modulesList = Array.isArray(data) ? data : data.results || []
        setModules(modulesList)
      }

      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching modules:", err)
      setError("Failed to load modules")
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading modules...</p>
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
                GECO Academy
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                My Modules
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
            <Link href="/academy/dashboard" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Dashboard</Link>
            <Link href="/academy/profile" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Profile</Link>
            <Link href="/academy/courses" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Courses</Link>
            <Link href="/academy/modules" className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm">Modules</Link>
            <Link href="/academy/tasks" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Tasks</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 lg:px-6">
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.length > 0 ? (
            modules.map((module) => (
              <div
                key={module.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-800"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
                    <BookMarked className="h-6 w-6" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {module.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  {module.description || "No description available"}
                </p>

                {module.lessons_count && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    {module.lessons_count} lessons
                  </p>
                )}

                <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500">
                  View Module
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-lg bg-slate-100 p-8 text-center dark:bg-slate-800">
              <BookMarked className="mx-auto mb-4 h-12 w-12 text-slate-400 dark:text-slate-600" />
              <p className="text-slate-600 dark:text-slate-400">No modules available</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
