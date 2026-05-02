"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { LogOut, ChevronDown, ChevronUp } from "lucide-react"

interface CourseOutline {
  id: number
  title: string
  description?: string
  course?: number
  modules?: Module[]
}

interface Module {
  id: number
  title: string
  description?: string
  outline?: number
  lessons?: Lesson[]
}

interface Lesson {
  id: number
  title: string
  description?: string
  module?: number
}

interface User {
  email: string
  type: string
  name: string
  userId: string
}

export default function CourseOutlinePage() {
  const [user, setUser] = useState<User | null>(null)
  const [outline, setOutline] = useState<CourseOutline | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [expandedModules, setExpandedModules] = useState<number[]>([])
  const router = useRouter()
  const params = useParams()
  const courseId = params.id

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (!["student", "academy", "admin", "trainee", "developer", "jampass"].includes(parsedUser.type)) {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    fetchCourseOutline()
  }, [router, courseId])

  const fetchCourseOutline = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        setError("No access token")
        setIsLoading(false)
        return
      }

      const response = await fetch(`academy/outlines/${courseId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOutline(data)
      } else {
        setError("Failed to load course outline")
      }

      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching course outline:", err)
      setError("Failed to load course outline")
      setIsLoading(false)
    }
  }

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    )
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
          <p className="text-slate-600 dark:text-slate-400">Loading course outline...</p>
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
                Course Outline
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
            <Link href="/academy/courses" className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm">Courses</Link>
            <Link href="/academy/modules" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Modules</Link>
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

        {outline ? (
          <div className="max-w-3xl">
            <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-800 mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {outline.title}
              </h1>
              {outline.description && (
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  {outline.description}
                </p>
              )}
            </div>

            {/* Modules List */}
            <div className="space-y-4">
              {outline.modules && outline.modules.length > 0 ? (
                outline.modules.map((module) => (
                  <div key={module.id} className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 px-6 py-4 transition"
                    >
                      <div className="text-left">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                          {module.title}
                        </h3>
                        {module.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {module.description}
                          </p>
                        )}
                      </div>
                      {expandedModules.includes(module.id) ? (
                        <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      )}
                    </button>

                    {/* Lessons */}
                    {expandedModules.includes(module.id) && module.lessons && (
                      <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                          {module.lessons.map((lesson) => (
                            <li key={lesson.id} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                              <h4 className="font-semibold text-slate-900 dark:text-white">
                                {lesson.title}
                              </h4>
                              {lesson.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  {lesson.description}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-8 text-center">
                  <p className="text-slate-600 dark:text-slate-400">No modules available</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400">Course outline not found</p>
            <Link href="/academy/courses" className="mt-4 inline-block text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
              Back to Courses
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
