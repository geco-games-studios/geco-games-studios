"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Key,
  Search,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Lock
} from "lucide-react"
import { getApiUrl } from "@/lib/api"

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  account_type: string
  is_active: boolean
}

export default function AdminPasswordResetPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetMethod, setResetMethod] = useState<"email" | "manual">("email")
  const [newPassword, setNewPassword] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
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

    fetchUsers()
  }, [router])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        router.push("/login")
        return
      }

      const response = await fetch(getApiUrl("users/"), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handlePasswordReset = async () => {
    if (!selectedUser) return

    try {
      setActionLoading(true)
      setError("")
      setSuccessMessage("")

      const accessToken = localStorage.getItem("accessToken")

      let response;
      if (resetMethod === "email") {
        response = await fetch(getApiUrl("academy/admin/accounts/reset_password_email/"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ user_id: selectedUser.id }),
        })
      } else {
        response = await fetch(getApiUrl("academy/admin/accounts/reset_password_manual/"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user_id: selectedUser.id,
            new_password: newPassword
          }),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to reset password")
      }

      const result = await response.json()
      setSuccessMessage(result.message || "Password reset successfully")

      // Reset form
      setShowResetModal(false)
      setSelectedUser(null)
      setNewPassword("")
      setResetMethod("email")

    } catch (err: any) {
      console.error("Error resetting password:", err)
      setError(err.message || "Failed to reset password")
    } finally {
      setActionLoading(false)
    }
  }

  const openResetModal = (user: User) => {
    setSelectedUser(user)
    setShowResetModal(true)
    setError("")
    setSuccessMessage("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
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
                Password Reset Management
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.clear()
                router.push("/login")
              }}
              className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
            >
              <Key className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 border-t border-slate-200 dark:border-slate-800 pt-4 pb-0 -mb-px overflow-x-auto">
            <Link href="/academy/admin/dashboard" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Dashboard</Link>
            <Link href="/academy/admin/departments" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Departments</Link>
            <Link href="/academy/admin/courses" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Courses</Link>
            <Link href="/academy/admin/tasks" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Tasks</Link>
            <Link href="/academy/admin/accounts" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Accounts</Link>
            <Link href="/academy/admin/password-reset" className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm">Password Reset</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 lg:px-6">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{users.length}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Users</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {users.filter(u => u.account_type === 'admin').length}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Admin Users</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Key className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {users.filter(u => u.is_active).length}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name, username, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 mb-6">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-green-800 dark:text-green-200">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Account Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                          {user.first_name?.charAt(0) || user.username?.charAt(0) || "U"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            @{user.username}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.account_type === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        user.account_type === 'staff' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {user.account_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        user.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openResetModal(user)}
                        className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-cyan-100 text-cyan-800 hover:bg-cyan-200 dark:bg-cyan-900 dark:text-cyan-200 dark:hover:bg-cyan-800 transition"
                      >
                        <Key className="h-3 w-3" />
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No users found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      {/* Password Reset Modal */}
      {showResetModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Reset Password for {selectedUser.first_name} {selectedUser.last_name}
            </h3>

            <div className="mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Choose how to reset the password for <strong>{selectedUser.username}</strong> ({selectedUser.email})
              </p>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                  <input
                    type="radio"
                    name="resetMethod"
                    value="email"
                    checked={resetMethod === "email"}
                    onChange={(e) => setResetMethod(e.target.value as "email")}
                    className="text-cyan-600 focus:ring-cyan-500"
                  />
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Send Reset Email</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">User will receive an email with reset instructions</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                  <input
                    type="radio"
                    name="resetMethod"
                    value="manual"
                    checked={resetMethod === "manual"}
                    onChange={(e) => setResetMethod(e.target.value as "manual")}
                    className="text-cyan-600 focus:ring-cyan-500"
                  />
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Set New Password</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Manually set a new password for the user</p>
                      {resetMethod === "manual" && (
                        <input
                          type="password"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="mt-2 w-full px-3 py-1 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePasswordReset}
                disabled={actionLoading || (resetMethod === "manual" && !newPassword.trim())}
                className="flex-1 rounded-lg bg-cyan-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-cyan-700 disabled:bg-cyan-400 disabled:cursor-not-allowed dark:bg-cyan-600 dark:hover:bg-cyan-500"
              >
                {actionLoading ? "Resetting..." : "Reset Password"}
              </button>
              <button
                onClick={() => {
                  setShowResetModal(false)
                  setSelectedUser(null)
                  setNewPassword("")
                  setResetMethod("email")
                }}
                className="flex-1 rounded-lg bg-slate-300 px-6 py-3 text-center font-semibold text-slate-900 transition hover:bg-slate-400 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}