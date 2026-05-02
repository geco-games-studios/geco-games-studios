"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  Search,
  Filter,
  MoreHorizontal,
  Lock,
  Unlock,
  Eye,
  Edit,
  Key,
  Calendar,
  Mail,
  User as UserIcon
} from "lucide-react"
import { getApiUrl } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  account_type: string
  is_active: boolean
  is_staff: boolean
  date_joined: string
  last_login?: string
}

interface LockedAccount {
  id: number
  user: {
    id: number
    username: string
    email: string
  }
  locked_at: string
  reason?: string
}

export default function AdminAccountsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [lockedAccounts, setLockedAccounts] = useState<LockedAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
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
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        router.push("/login")
        return
      }

      // Fetch all users - this might need a specific admin endpoint
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
      // Process locked accounts from users data
      const lockedAccounts = data.filter((user: User) => !user.is_active).map((user: User) => ({
        id: Math.random(), // Generate a temporary ID for locked account entry
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        locked_at: "N/A", // We don't have this info from users endpoint
        reason: "Account inactive"
      }))
      setLockedAccounts(lockedAccounts)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLockAccount = async (userId: number) => {
    try {
      setActionLoading(userId)
      const accessToken = localStorage.getItem("accessToken")

      const response = await fetch(getApiUrl("academy/admin/accounts/lock_account/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ user_id: userId }),
      })

      if (!response.ok) {
        throw new Error("Failed to lock account")
      }

      // Refresh data
      await fetchUsers()
    } catch (err) {
      console.error("Error locking account:", err)
      setError("Failed to lock account")
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnlockAccount = async (userId: number) => {
    try {
      setActionLoading(userId)
      const accessToken = localStorage.getItem("accessToken")

      const response = await fetch(getApiUrl("academy/admin/accounts/unlock_account/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ user_id: userId }),
      })

      if (!response.ok) {
        throw new Error("Failed to unlock account")
      }

      // Refresh data
      await fetchUsers()
    } catch (err) {
      console.error("Error unlocking account:", err)
      setError("Failed to unlock account")
    } finally {
      setActionLoading(null)
    }
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" ||
                         (filterType === "active" && user.is_active) ||
                         (filterType === "inactive" && !user.is_active) ||
                         (filterType === "staff" && user.is_staff)

    return matchesSearch && matchesFilter
  })

  const isAccountLocked = (userId: number) => {
    return lockedAccounts.some(locked => locked.user.id === userId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading accounts...</p>
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
                Account Management
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.clear()
                router.push("/login")
              }}
              className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
            >
              <UserX className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 border-t border-slate-200 dark:border-slate-800 pt-4 pb-0 -mb-px overflow-x-auto">
            <Link href="/academy/admin/dashboard" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Dashboard</Link>
            <Link href="/academy/admin/departments" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Departments</Link>
            <Link href="/academy/admin/courses" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Courses</Link>
            <Link href="/academy/admin/tasks" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Tasks</Link>
            <Link href="/academy/admin/accounts" className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm">Accounts</Link>
            <Link href="/academy/admin/password-reset" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Password Reset</Link>
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
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{users.filter(u => u.is_active).length}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Users</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{lockedAccounts.length}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Locked Accounts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
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
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
                <option value="staff">Staff Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Account Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Joined</th>
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
                      <div className="flex items-center gap-2">
                        {user.is_active ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <UserX className="h-3 w-3 mr-1" />
                            Inactive
                          </span>
                        )}
                        {isAccountLocked(user.id) && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(user.date_joined).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isAccountLocked(user.id) ? (
                          <button
                            onClick={() => handleUnlockAccount(user.id)}
                            disabled={actionLoading === user.id}
                            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800 transition disabled:opacity-50"
                          >
                            <Unlock className="h-3 w-3" />
                            Unlock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleLockAccount(user.id)}
                            disabled={actionLoading === user.id}
                            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition disabled:opacity-50"
                          >
                            <Lock className="h-3 w-3" />
                            Lock
                          </button>
                        )}
                        <button
                          onClick={() => handleViewUser(user)}
                          className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </button>
                      </div>
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

      {/* User Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              User Details
            </DialogTitle>
            <DialogDescription>
              View detailed information about this user account.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-xl font-semibold text-cyan-600 dark:text-cyan-400">
                  {selectedUser.first_name?.charAt(0) || selectedUser.username?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    @{selectedUser.username}
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedUser.email}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Account Type: {selectedUser.account_type}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedUser.is_active ? (
                    <UserCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <UserX className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Status: {selectedUser.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                {selectedUser.is_staff && (
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Staff Member
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Joined: {new Date(selectedUser.date_joined).toLocaleDateString()}
                  </span>
                </div>

                {selectedUser.last_login && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Last Login: {new Date(selectedUser.last_login).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}