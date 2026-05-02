"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  LogOut,
  Users,
  BookOpen,
  CheckSquare,
  Shield,
  Key,
  Building,
  BarChart3,
  Settings,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle
} from "lucide-react"
import { getApiUrl } from "@/lib/api"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  totalTasks: number
  pendingReviews: number
  lockedAccounts: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
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
    if (parsedUser.type !== "admin" && parsedUser.academy_sub_type !== "admin" && parsedUser.is_staff !== true) {
      router.push("/academy/dashboard")
      return
    }

    fetchAdminStats()
  }, [router])

  const fetchAdminStats = async () => {
    try {
      setIsLoading(true)
      const accessToken = localStorage.getItem("accessToken")

      if (!accessToken) {
        router.push("/login")
        return
      }

      // Fetch various admin stats
      const [usersRes, coursesRes, tasksRes] = await Promise.all([
        fetch(getApiUrl("users/"), {
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
        fetch(getApiUrl("academy/admin/courses/"), {
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
        fetch(getApiUrl("academy/admin/tasks/pending_reviews/"), {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      ])

      const usersData = usersRes.ok ? await usersRes.json() : []
      const coursesData = coursesRes.ok ? await coursesRes.json() : []
      const tasksData = tasksRes.ok ? await tasksRes.json() : []

      // Count locked accounts (inactive users)
      const lockedAccounts = usersData.filter((user: any) => !user.is_active) || []

      setStats({
        totalUsers: usersData.length || 0,
        activeUsers: usersData.filter((user: any) => user.is_active).length || 0,
        totalCourses: coursesData.length || 0,
        totalTasks: 0, // Would need a separate endpoint for total tasks
        pendingReviews: tasksData.length || 0,
        lockedAccounts: lockedAccounts.length || 0
      })

      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching admin stats:", err)
      setError("Failed to load dashboard data")
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
          <p className="text-slate-600 dark:text-slate-400">Loading admin dashboard...</p>
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                GECO Academy Admin
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Administrative Dashboard
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
            <Link href="/academy/admin/dashboard" className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm">Dashboard</Link>
            <Link href="/academy/admin/departments" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Departments</Link>
            <Link href="/academy/admin/courses" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Courses</Link>
            <Link href="/academy/admin/tasks" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Tasks</Link>
            <Link href="/academy/admin/accounts" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Accounts</Link>
            <Link href="/academy/admin/password-reset" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Password Reset</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 lg:px-6">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* Total Courses */}
          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalCourses || 0}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Courses</p>
              </div>
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.pendingReviews || 0}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Pending Reviews</p>
              </div>
            </div>
          </div>

          {/* Locked Accounts */}
          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.lockedAccounts || 0}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Locked Accounts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Departments Management */}
          <Link href="/academy/admin/departments" className="group">
            <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                  <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Departments</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Manage academic departments</p>
                </div>
              </div>
              <div className="text-cyan-600 dark:text-cyan-400 text-sm font-medium">
                View & Manage →
              </div>
            </div>
          </Link>

          {/* Courses Management */}
          <Link href="/academy/admin/courses" className="group">
            <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                  <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Courses</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Create and manage courses</p>
                </div>
              </div>
              <div className="text-cyan-600 dark:text-cyan-400 text-sm font-medium">
                View & Manage →
              </div>
            </div>
          </Link>

          {/* Tasks Management */}
          <Link href="/academy/admin/tasks" className="group">
            <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-orange-100 dark:bg-orange-900 flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                  <CheckSquare className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tasks</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Review and approve tasks</p>
                </div>
              </div>
              <div className="text-cyan-600 dark:text-cyan-400 text-sm font-medium">
                View & Manage →
              </div>
            </div>
          </Link>

          {/* Account Management */}
          <Link href="/academy/admin/accounts" className="group">
            <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
                  <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Accounts</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Lock/unlock user accounts</p>
                </div>
              </div>
              <div className="text-cyan-600 dark:text-cyan-400 text-sm font-medium">
                View & Manage →
              </div>
            </div>
          </Link>

          {/* Password Reset */}
          <Link href="/academy/admin/password-reset" className="group">
            <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-teal-100 dark:bg-teal-900 flex items-center justify-center group-hover:bg-teal-200 dark:group-hover:bg-teal-800 transition-colors">
                  <Key className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Password Reset</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Manage password resets</p>
                </div>
              </div>
              <div className="text-cyan-600 dark:text-cyan-400 text-sm font-medium">
                View & Manage →
              </div>
            </div>
          </Link>

          {/* Analytics */}
          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Analytics</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">View system analytics</p>
              </div>
            </div>
            <div className="text-slate-500 dark:text-slate-500 text-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}