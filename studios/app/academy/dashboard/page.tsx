"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Award,
  TrendingUp,
  LogOut,
  Globe,
  Zap,
  CheckCircle,
  Lock,
} from "lucide-react"

interface User {
  email: string
  type: string
  name: string
  userId: string
}

interface Course {
  id: number
  title: string
  description?: string
  level?: "Beginner" | "Intermediate" | "Advanced"
  progress?: number
  lessons?: number
  completedLessons?: number
  icon?: React.ReactNode
}

interface LeaderboardEntry {
  rank: number
  name: string
  xp: string
  avatar?: string
}

interface Stat {
  label: string
  value: string | number
  icon: React.ReactNode
}

export default function AcademyDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState<Stat[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)

    // Redirect admin users to admin dashboard
    if (parsedUser.type === "admin" || parsedUser.academy_sub_type === "admin" || parsedUser.is_staff === true) {
      router.push("/academy/admin/dashboard")
      return
    }

    // Allow academy-related roles to access the academy dashboard
    if (!["student", "academy", "trainee", "developer", "jampass"].includes(parsedUser.type)) {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        setError("No access token. Please login again.")
        setIsLoading(false)
        setDataLoaded(true)
        return
      }

      // Fetch courses using the academy proxy endpoint
      const coursesRes = await fetch("/academy/courses", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      let coursesList: any[] = []
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json()
        coursesList = Array.isArray(coursesData) ? coursesData : coursesData.results || []
        setCourses(coursesList.map((course: any) => ({
          id: course.id,
          title: course.title || course.name,
          description: course.description,
          level: course.level || "Beginner",
          progress: course.progress || 0,
          lessons: course.lessons || 0,
          completedLessons: course.completed_lessons || 0,
        })))
      }

      // Fetch leaderboard data
      const leaderboardRes = await fetch("/academy/leaderboard", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (leaderboardRes.ok) {
        const leaderboardData = await leaderboardRes.json()
        const leaderboardList = Array.isArray(leaderboardData) ? leaderboardData : leaderboardData.results || []
        setLeaderboard(leaderboardList.map((entry: any, index: number) => ({
          rank: entry.rank || index + 1,
          name: entry.name || entry.username || entry.email,
          xp: entry.xp || `${entry.points || 0} XP`,
          avatar: entry.avatar || "👤",
        })))
      } else {
        // Fallback to empty leaderboard initially - will be updated after user data loads
        setLeaderboard([])
      }

      // Fetch user stats
      const statsRes = await fetch("/academy/stats", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      let userStats: any = {}
      if (statsRes.ok) {
        userStats = await statsRes.json()
      }

      // Update stats based on fetched data
      const defaultStats = [
        {
          label: "Total XP Earned",
          value: userStats.totalXp ? `${userStats.totalXp.toLocaleString()} XP` : "0 XP",
          icon: <Award className="h-6 w-6 text-yellow-500" />,
        },
        {
          label: "Courses Enrolled",
          value: coursesList?.length || 0,
          icon: <BookOpen className="h-6 w-6 text-cyan-500" />,
        },
        {
          label: "Lessons Completed",
          value: userStats.lessonsCompleted || 0,
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
        },
        {
          label: "Streak Days",
          value: userStats.streakDays ? `${userStats.streakDays} Days` : "0 Days",
          icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
        },
      ]
      setStats(defaultStats)

      setIsLoading(false)
      setDataLoaded(true)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data")
      setIsLoading(false)
      setDataLoaded(true)
    }
  }

  let coursesList: any[] = []

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  if (isLoading || !dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const displayCourses: Course[] = courses.length > 0 ? courses : []

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
                Welcome back, {user.name}!
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
              href="/academy/dashboard"
              className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/academy/profile"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Profile
            </Link>
            <Link
              href="/academy/courses"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Courses
            </Link>
            <Link
              href="/academy/modules"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Modules
            </Link>
            <Link
              href="/academy/tasks"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Tasks
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 lg:px-6">
        {/* Stats Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Courses Section */}
        <div className="mb-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Courses
            </h2>
            <Link
              href="#"
              className="text-sm font-semibold text-cyan-600 transition hover:text-cyan-700 dark:text-cyan-400"
            >
              View all →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {displayCourses.length > 0 ? (
              displayCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-800"
                >
                  {/* Course Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-400">
                      {course.icon}
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        course.level === "Beginner"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : course.level === "Intermediate"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {course.level}
                    </span>
                  </div>

                  {/* Course Details */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {course.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">
                        Progress
                      </span>
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

                  {/* Lesson Count */}
                  <div className="mb-6 flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>
                      {course.completedLessons} of {course.lessons} lessons
                    </span>
                    <span className="font-semibold">
                      {course.completedLessons}/{course.lessons}
                    </span>
                  </div>

                  {/* Continue Button */}
                  <Link
                    href="#"
                    className="block rounded-lg bg-cyan-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
                  >
                    Continue Learning
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  No courses enrolled yet
                </h3>
                <p className="text-slate-500 dark:text-slate-500 mb-6">
                  Start your learning journey by enrolling in a course.
                </p>
                <Link
                  href="/academy/courses"
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
            Leaderboard
          </h2>

          <div className="space-y-3">
            {leaderboard.length > 0 ? (
              leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between rounded-lg p-4 transition ${
                    entry.name === user?.name
                      ? "bg-cyan-50 dark:bg-cyan-900"
                      : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-900 dark:bg-slate-600 dark:text-white">
                      {entry.rank}
                    </span>
                    <span className="text-2xl">{entry.avatar}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {entry.name}
                    </span>
                  </div>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">
                    {entry.xp}
                  </span>
                </div>
              ))
            ) : isClient && user ? (
              <div className="flex items-center justify-between rounded-lg p-4 bg-cyan-50 dark:bg-cyan-900">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-900 dark:bg-slate-600 dark:text-white">
                    1
                  </span>
                  <span className="text-2xl">👤</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {user.name}
                  </span>
                </div>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">
                  0 XP
                </span>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>Loading leaderboard...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
