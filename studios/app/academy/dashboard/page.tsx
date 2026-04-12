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
  description: string
  level: "Beginner" | "Intermediate" | "Advanced"
  progress: number
  lessons: number
  completedLessons: number
  icon: React.ReactNode
}

export default function AcademyDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)

    // Only allow students to access academy
    if (parsedUser.type !== "student") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  if (isLoading) {
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

  const courses: Course[] = [
    {
      id: 1,
      title: "Game Development Fundamentals",
      description: "Learn the basics of game development with Unity",
      level: "Beginner",
      progress: 75,
      lessons: 12,
      completedLessons: 9,
      icon: <Zap className="h-5 w-5" />,
    },
    {
      id: 2,
      title: "3D Character Design",
      description: "Master 3D modeling and character design techniques",
      level: "Intermediate",
      progress: 50,
      lessons: 16,
      completedLessons: 8,
      icon: <Globe className="h-5 w-5" />,
    },
    {
      id: 3,
      title: "Advanced Unreal Engine",
      description: "Deep dive into Unreal Engine 5 advanced features",
      level: "Advanced",
      progress: 25,
      lessons: 20,
      completedLessons: 5,
      icon: <Lock className="h-5 w-5" />,
    },
    {
      id: 4,
      title: "Game Audio & Sound Design",
      description: "Create immersive audio experiences for games",
      level: "Intermediate",
      progress: 60,
      lessons: 10,
      completedLessons: 6,
      icon: <Zap className="h-5 w-5" />,
    },
  ]

  const stats = [
    {
      label: "Total XP Earned",
      value: "2,450 XP",
      icon: <Award className="h-6 w-6 text-yellow-500" />,
    },
    {
      label: "Courses Enrolled",
      value: "4",
      icon: <BookOpen className="h-6 w-6 text-cyan-500" />,
    },
    {
      label: "Lessons Completed",
      value: "28",
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
    },
    {
      label: "Streak Days",
      value: "12 Days",
      icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
    },
  ]

  const leaderboard = [
    { rank: 1, name: "Pro Coder", xp: "5,200 XP", avatar: "👨‍💻" },
    { rank: 2, name: "Game Master", xp: "4,800 XP", avatar: "🎮" },
    { rank: 3, name: user.name, xp: "2,450 XP", avatar: "🌟" },
    { rank: 4, name: "Creative Mind", xp: "2,100 XP", avatar: "🎨" },
    { rank: 5, name: "Learning Junkie", xp: "1,900 XP", avatar: "📚" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="container mx-auto px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between">
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
              My Courses
            </h2>
            <Link
              href="#"
              className="text-sm font-semibold text-cyan-600 transition hover:text-cyan-700 dark:text-cyan-400"
            >
              View all →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {courses.map((course) => (
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
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
            Leaderboard
          </h2>

          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between rounded-lg p-4 transition ${
                  entry.rank === 3
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
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
