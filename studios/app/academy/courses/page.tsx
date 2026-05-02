"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, BookOpen, FileText } from "lucide-react"

interface Course {
  id: number
  title: string
  description?: string
  level?: string
  progress?: number
  lessons?: number
  completed_lessons?: number
}

interface User {
  email: string
  type: string
  name: string
  userId: string
}

export default function CoursesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

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
    fetchCourses()
  }, [router])

  const fetchCourses = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        setError("No access token")
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/academy/courses", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const coursesList = Array.isArray(data) ? data : data.results || []
        setCourses(coursesList)
      }

      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching courses:", err)
      setError("Failed to load courses")
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
          <p className="text-slate-600 dark:text-slate-400">Loading courses...</p>
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
                Courses
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-800"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-400">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  {course.level && (
                    <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                      {course.level}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  {course.description || "No description available"}
                </p>

                {course.progress !== undefined && (
                  <div className="mb-6">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Progress</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Link
                    href={`academy/courses/${course.id}/outline`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
                  >
                    <FileText className="h-4 w-4" />
                    View Outline
                  </Link>
                  <button className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                    Continue Learning
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-lg bg-slate-100 p-8 text-center dark:bg-slate-800">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-400 dark:text-slate-600" />
              <p className="text-slate-600 dark:text-slate-400">No courses enrolled yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
