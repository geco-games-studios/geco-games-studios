"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  FileText,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  User,
  BookOpen
} from "lucide-react"
import { getApiUrl } from "@/lib/api"

interface Task {
  id: number
  title: string
  description: string
  department: string
  assigned_to: number
  due_date: string
  course: number
  course_id?: number
  status: "draft" | "published" | "archived"
  submissions_count?: number
  pending_reviews?: number
  created_at: string
  updated_at: string
}

interface Course {
  id: number
  title: string
  code: string
  department?: string
}

interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  account_type?: string
}

interface TaskSubmission {
  id: number
  task_id: number
  student: {
    id: number
    username: string
    first_name: string
    last_name: string
  }
  submitted_at: string
  status: "submitted" | "reviewed" | "approved" | "rejected"
  grade?: number
  feedback?: string
  assigned_by_name?: string
  submission_text?: string
}

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
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

    fetchTasks()
    fetchCourses()
    fetchUsers()
  }, [router])

  const fetchTaskSubmissionsCount = async (tasksData: Task[]) => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) return tasksData

      // Fetch all pending reviews
      const pendingRes = await fetch(getApiUrl("academy/admin/tasks/pending_reviews/"), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      let pendingReviewsByTask: Record<number, number> = {}

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json()
        console.log("Pending reviews data:", pendingData)
        
        const pendingList = Array.isArray(pendingData) ? pendingData : pendingData.results || []
        
        // Count pending reviews by task_id
        pendingList.forEach((review: any) => {
          const taskId = review.task_id || review.task || review.id
          if (taskId) {
            pendingReviewsByTask[taskId] = (pendingReviewsByTask[taskId] || 0) + 1
          }
        })
      }

      // Try to fetch all submissions to get submission counts
      let submissionsByTask: Record<number, number> = {}
      try {
        const submissionsRes = await fetch(getApiUrl("academy/admin/tasks/submissions/"), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (submissionsRes.ok) {
          const submissionsData = await submissionsRes.json()
          console.log("Submissions data:", submissionsData)
          
          const submissionsList = Array.isArray(submissionsData) ? submissionsData : submissionsData.results || []
          
          // Count submissions by task_id
          submissionsList.forEach((submission: any) => {
            const taskId = submission.task_id || submission.task
            if (taskId) {
              submissionsByTask[taskId] = (submissionsByTask[taskId] || 0) + 1
            }
          })
        }
      } catch (err) {
        console.log("Submissions endpoint not available, using pending reviews only")
      }

      // Update tasks with counts
      const tasksWithCounts = tasksData.map((task) => ({
        ...task,
        submissions_count: submissionsByTask[task.id] || 0,
        pending_reviews: pendingReviewsByTask[task.id] || 0,
      }))

      console.log("Tasks with counts:", tasksWithCounts)
      return tasksWithCounts
    } catch (err) {
      console.error("Error calculating submission counts:", err)
      return tasksData
    }
  }

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        router.push("/login")
        return
      }

      const response = await fetch(getApiUrl("academy/admin/tasks/"), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const data = await response.json()
      
      // Fetch submission counts for each task
      const tasksWithCounts = await fetchTaskSubmissionsCount(data)
      setTasks(tasksWithCounts)
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setError("Failed to load tasks")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) return

      const response = await fetch(getApiUrl("academy/admin/courses/"), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
    } catch (err) {
      console.error("Error fetching courses:", err)
    }
  }

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) return

      const response = await fetch(getApiUrl("users/"), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Filter to only show students and academy users
        const filteredUsers = data.filter((user: User) => 
          user.account_type === "student" || user.account_type === "academy" || user.account_type === "trainee" || user.account_type === "developer"
        )
        setUsers(filteredUsers)
      }
    } catch (err) {
      console.error("Error fetching users:", err)
    }
  }

  const fetchTaskSubmissions = async (taskId: number) => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) return

      // Try normal submissions endpoint first
      const response = await fetch(getApiUrl(`academy/tasks/${taskId}/submissions/`), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setSubmissions(data)
          return
        }
      }

      // If no submissions, fallback to pending_reviews
      const pendingRes = await fetch(getApiUrl("academy/admin/tasks/pending_reviews/"), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (pendingRes.ok) {
        const pendingData = await pendingRes.json()
        const pendingList = Array.isArray(pendingData) ? pendingData : pendingData.results || []
        // Filter for this task only
        const filtered = pendingList.filter((item: any) => item.id === taskId || item.task_id === taskId || item.task === taskId)
        setSubmissions(filtered)
      } else {
        setSubmissions([])
      }
    } catch (err) {
      console.error("Error fetching submissions:", err)
      setSubmissions([])
    }
  }

  const filteredTasks = tasks.filter(task => {
    const user = users.find(u => u.id === task.assigned_to)
    const course = courses.find(c => c.id === task.course)
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user ? `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
                         (course ? course.title.toLowerCase().includes(searchTerm.toLowerCase()) : false)

    const matchesFilter = filterStatus === "all" || task.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const handleCreateTask = async (taskData: any) => {
    try {
      setActionLoading(-1) // -1 indicates create action
      const accessToken = localStorage.getItem("accessToken")

      const response = await fetch(getApiUrl("academy/admin/tasks/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      setShowCreateModal(false)
      await fetchTasks()
    } catch (err) {
      console.error("Error creating task:", err)
      setError("Failed to create task")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      setActionLoading(taskId)
      const accessToken = localStorage.getItem("accessToken")

      const response = await fetch(getApiUrl(`academy/admin/tasks/${taskId}/`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete task")
      }

      await fetchTasks()
    } catch (err) {
      console.error("Error deleting task:", err)
      setError("Failed to delete task")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReviewSubmission = async (submissionId: number, status: string, grade?: number, feedback?: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken")

      const response = await fetch(getApiUrl(`academy/admin/tasks/submissions/${submissionId}/review/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status, grade, feedback }),
      })

      if (!response.ok) {
        throw new Error("Failed to review submission")
      }

      // Refresh submissions
      if (selectedTask) {
        await fetchTaskSubmissions(selectedTask.id)
      }
    } catch (err) {
      console.error("Error reviewing submission:", err)
      setError("Failed to review submission")
    }
  }

  const openSubmissionsModal = async (task: Task) => {
    setSelectedTask(task)
    await fetchTaskSubmissions(task.id)
    setShowSubmissionsModal(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading tasks...</p>
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
                Task Management
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
              >
                <Plus className="h-4 w-4" />
                Create Task
              </button>
              <button
                onClick={() => {
                  localStorage.clear()
                  router.push("/login")
                }}
                className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
              >
                <CheckSquare className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 border-t border-slate-200 dark:border-slate-800 pt-4 pb-0 -mb-px overflow-x-auto">
            <Link href="/academy/admin/dashboard" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Dashboard</Link>
            <Link href="/academy/admin/departments" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Departments</Link>
            <Link href="/academy/admin/courses" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Courses</Link>
            <Link href="/academy/admin/tasks" className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm">Tasks</Link>
            <Link href="/academy/admin/accounts" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Accounts</Link>
            <Link href="/academy/admin/password-reset" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Password Reset</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 lg:px-6">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{tasks.length}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {tasks.reduce((sum, task) => sum + (task.submissions_count || 0), 0)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Submissions</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {tasks.reduce((sum, task) => sum + (task.pending_reviews || 0), 0)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Pending Reviews</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {tasks.filter(t => t.status === "published").length}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Published Tasks</p>
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
                  placeholder="Search tasks by title, description, course, or assigned user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <div key={task.id} className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                    <CheckSquare className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    task.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    task.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {task.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {task.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {task.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Building className="h-4 w-4" />
                    <span>{task.department}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <BookOpen className="h-4 w-4" />
                    <span>Course: {courses.find(c => c.id === task.course)?.title}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <User className="h-4 w-4" />
                    <span>Assigned to: {users.find(u => u.id === task.assigned_to)?.first_name} {users.find(u => u.id === task.assigned_to)?.last_name}</span>
                  </div>

                  {task.due_date && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <FileText className="h-4 w-4" />
                    <span>{task.submissions_count || 0} submissions</span>
                  </div>

                  {(task.pending_reviews || 0) > 0 && (
                    <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                      <AlertCircle className="h-4 w-4" />
                      <span>{task.pending_reviews} pending reviews</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => openSubmissionsModal(task)}
                    className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition
                      ${(task.pending_reviews || 0) > 0
                        ? 'bg-yellow-400 text-yellow-900 animate-pulse border-2 border-yellow-600 shadow-lg hover:bg-yellow-500 dark:bg-yellow-300 dark:text-yellow-900 dark:border-yellow-500'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800'}
                    `}
                  >
                    <Eye className="h-3 w-3" />
                    Review ({task.pending_reviews || 0})
                  </button>

                  <div className="flex gap-2">
                    <button className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={actionLoading === task.id}
                      className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">No tasks found matching your criteria.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
            >
              <Plus className="h-4 w-4" />
              Create First Task
            </button>
          </div>
        )}
      </main>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Create New Task</h3>

            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const taskData = {
                title: formData.get('title'),
                description: formData.get('description'),
                department: formData.get('department'),
                course: parseInt(formData.get('course') as string),
                assigned_to: parseInt(formData.get('assigned_to') as string),
                due_date: formData.get('due_date'),
              }
              handleCreateTask(taskData)
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Course *
                  </label>
                  <select
                    name="course"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select a course...</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    name="department"
                    required
                    placeholder="e.g., Computer Science"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Assigned To *
                  </label>
                  <select
                    name="assigned_to"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select a user...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} ({user.username})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="due_date"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={actionLoading === -1}
                  className="flex-1 rounded-lg bg-cyan-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-cyan-700 disabled:bg-cyan-400 disabled:cursor-not-allowed dark:bg-cyan-600 dark:hover:bg-cyan-500"
                >
                  {actionLoading === -1 ? "Creating..." : "Create Task"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-lg bg-slate-300 px-6 py-3 text-center font-semibold text-slate-900 transition hover:bg-slate-400 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions Review Modal */}
      {showSubmissionsModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Review Submissions - {selectedTask.title}
              </h3>
              <button
                onClick={() => setShowSubmissionsModal(false)}
                className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {/* Try to show student name if available, else fallback to assigned_by_name or blank */}
                        {submission.student?.first_name && submission.student?.last_name
                          ? `${submission.student.first_name} ${submission.student.last_name}`
                          : submission.assigned_by_name || "Unknown"}
                      </p>
                      {submission.student?.username && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          @{submission.student.username}
                        </p>
                      )}
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      submission.status === 'submitted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      submission.status === 'reviewed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      submission.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {submission.status || 'submitted'}
                    </span>
                  </div>

                  {submission.submitted_at && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Submitted: {new Date(submission.submitted_at).toLocaleString()}
                    </p>
                  )}


                  {submission.submission_text && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Submission:</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{submission.submission_text}</p>
                    </div>
                  )}

                  {submission.grade && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Grade: {submission.grade}/100
                    </p>
                  )}

                  {submission.feedback && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Feedback:</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{submission.feedback}</p>
                    </div>
                  )}

                  {(submission.status === 'submitted' || !submission.status) && (
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          const accessToken = localStorage.getItem("accessToken");
                          if (!accessToken) return;
                          await fetch(getApiUrl(`academy/admin/tasks/${submission.id}/approve_task/`), {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${accessToken}`,
                              "Content-Type": "application/json",
                            },
                          });
                          fetchTasks();
                          setShowSubmissionsModal(false);
                        }}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={async () => {
                          const accessToken = localStorage.getItem("accessToken");
                          if (!accessToken) return;
                          await fetch(getApiUrl(`academy/admin/tasks/${submission.id}/reject_task/`), {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${accessToken}`,
                              "Content-Type": "application/json",
                            },
                          });
                          fetchTasks();
                          setShowSubmissionsModal(false);
                        }}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {submissions.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">No submissions yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}