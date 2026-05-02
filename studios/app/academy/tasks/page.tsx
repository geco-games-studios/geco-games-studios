"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface Task {
  id: number
  title: string
  description?: string
  module?: number
  status?: string
  submitted?: boolean
}

interface User {
  email: string
  type: string
  name: string
  userId: string
}

type TabType = "all" | "submitted" | "review"

export default function TasksPage() {
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [submittedTasks, setSubmittedTasks] = useState<Task[]>([])
  const [tasksInReview, setTasksInReview] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [submissionText, setSubmissionText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    fetchTasks()
  }, [router])

  const fetchTasks = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        setError("No access token")
        setIsLoading(false)
        return
      }

      // Fetch all tasks
      const tasksRes = await fetch("/api/academy/tasks", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        const tasksList = Array.isArray(tasksData) ? tasksData : tasksData.results || []
        setTasks(tasksList)
      }

      // Fetch submitted tasks (my_reviews)
      const submittedRes = await fetch("/api/academy/tasks/my_reviews", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (submittedRes.ok) {
        const submittedData = await submittedRes.json()
        const submittedList = Array.isArray(submittedData) ? submittedData : submittedData.results || []
        setSubmittedTasks(submittedList)
      }

      // Fetch pending reviews
      const pendingRes = await fetch("/api/academy/tasks/my_pending_reviews", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json()
        const pendingList = Array.isArray(pendingData) ? pendingData : pendingData.results || []
        setTasksInReview(pendingList)
      }

      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setError("Failed to load tasks")
      setIsLoading(false)
    }
  }

  const handleSubmitTask = async () => {
    if (!selectedTask || !submissionText.trim()) {
      setError("Please enter a submission")
      return
    }

    setIsSubmitting(true)
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        setError("No access token")
        setIsSubmitting(false)
        return
      }

      const response = await fetch("/api/academy/tasks/submit_task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          task_id: selectedTask.id,
          submission_text: submissionText,
        }),
      })

      if (response.ok) {
        setError("")
        setShowSubmitModal(false)
        setSubmissionText("")
        setSelectedTask(null)
        fetchTasks() // Refresh tasks
      } else {
        setError("Failed to submit task")
      }
    } catch (err) {
      console.error("Error submitting task:", err)
      setError("Failed to submit task")
    } finally {
      setIsSubmitting(false)
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
                GECO Academy
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                My Tasks
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
            <Link href="/academy/modules" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Modules</Link>
            <Link href="/academy/tasks" className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm">Tasks</Link>
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

        {/* Task Tabs */}
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-4 px-4 font-semibold text-sm transition ${
                activeTab === "all"
                  ? "border-b-2 border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab("submitted")}
              className={`pb-4 px-4 font-semibold text-sm transition ${
                activeTab === "submitted"
                  ? "border-b-2 border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Submitted ({submittedTasks.length})
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={`pb-4 px-4 font-semibold text-sm transition ${
                activeTab === "review"
                  ? "border-b-2 border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              In Review ({tasksInReview.length})
            </button>
          </div>
        </div>

        {/* Task Lists */}
        <div className="space-y-4">
          {activeTab === "all" &&
            (tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {task.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        {task.description || "No description"}
                      </p>
                    </div>
                    <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTask(task)
                      setShowSubmitModal(true)
                    }}
                    className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
                  >
                    Submit Task
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-lg bg-slate-100 p-8 text-center dark:bg-slate-800">
                <p className="text-slate-600 dark:text-slate-400">No tasks available</p>
              </div>
            ))}

          {activeTab === "submitted" &&
            (submittedTasks.length > 0 ? (
              submittedTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {task.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        {task.description || "No description"}
                      </p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg bg-slate-100 p-8 text-center dark:bg-slate-800">
                <p className="text-slate-600 dark:text-slate-400">No submitted tasks</p>
              </div>
            ))}

          {activeTab === "review" &&
            (tasksInReview.length > 0 ? (
              tasksInReview.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {task.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        {task.description || "No description"}
                      </p>
                    </div>
                    <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg bg-slate-100 p-8 text-center dark:bg-slate-800">
                <p className="text-slate-600 dark:text-slate-400">No tasks in review</p>
              </div>
            ))}
        </div>
      </main>

      {/* Submit Task Modal */}
      {showSubmitModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 dark:bg-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Submit Task: {selectedTask.title}
            </h2>

            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Enter your task submission..."
              className="w-full rounded-lg border border-slate-300 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700 dark:text-white mb-4 min-h-32 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowSubmitModal(false)
                  setSubmissionText("")
                  setSelectedTask(null)
                }}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTask}
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50 dark:bg-cyan-600 dark:hover:bg-cyan-500"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
