"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  FileText,
  Users,
  Clock
} from "lucide-react"
import { getApiUrl } from "@/lib/api"

interface Course {
  id: number
  title: string
  description: string
  code: string
  duration_weeks: number
  department?: string
  level: "Beginner" | "Intermediate" | "Advanced"
  instructor?: string
  enrolled_students?: number
  modules_count?: number
  created_at: string
  updated_at: string
  is_active: boolean
  outline?: string
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
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

    fetchCourses()
    fetchDepartments()
  }, [router])

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        router.push("/login")
        return
      }

      const response = await fetch(getApiUrl("academy/admin/courses/"), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch courses")
      }

      const data = await response.json()
      setCourses(data)
    } catch (err) {
      console.error("Error fetching courses:", err)
      setError("Failed to load courses")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterLevel === "all" || course.level === filterLevel

    return matchesSearch && matchesFilter
  })

  const fetchDepartments = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) return

      const response = await fetch(getApiUrl("academy/admin/departments/"), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch departments")
      }

      const data = await response.json()
      setDepartments(data)
    } catch (err) {
      console.error("Error fetching departments:", err)
    }
  }

  const handleCreateCourse = async (courseData: any) => {
    try {
      setActionLoading(-1) // -1 indicates create action
      const accessToken = localStorage.getItem("accessToken")

      const response = await fetch(getApiUrl("academy/admin/courses/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(courseData),
      })

      if (!response.ok) {
        throw new Error("Failed to create course")
      }

      setShowCreateModal(false)
      await fetchCourses()
    } catch (err) {
      console.error("Error creating course:", err)
      setError("Failed to create course")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return

    try {
      setActionLoading(courseId)
      const accessToken = localStorage.getItem("accessToken")

      const response = await fetch(getApiUrl(`academy/admin/courses/${courseId}/`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete course")
      }

      await fetchCourses()
    } catch (err) {
      console.error("Error deleting course:", err)
      setError("Failed to delete course")
    } finally {
      setActionLoading(null)
    }
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
                GECO Academy Admin
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Course Management
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
              >
                <Plus className="h-4 w-4" />
                Create Course
              </button>
              <button
                onClick={() => {
                  localStorage.clear()
                  router.push("/login")
                }}
                className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
              >
                <BookOpen className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 border-t border-slate-200 dark:border-slate-800 pt-4 pb-0 -mb-px overflow-x-auto">
            <Link href="/academy/admin/dashboard" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Dashboard</Link>
            <Link href="/academy/admin/departments" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Departments</Link>
            <Link href="/academy/admin/courses" className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm">Courses</Link>
            <Link href="/academy/admin/tasks" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Tasks</Link>
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
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{courses.length}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Courses</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {courses.reduce((sum, course) => sum + (course.enrolled_students || 0), 0)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Enrollments</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {courses.reduce((sum, course) => sum + (course.modules_count || 0), 0)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Modules</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {courses.filter(c => c.is_active).length}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Courses</p>
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
                  placeholder="Search courses by title, description, or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div key={course.id} className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    course.level === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {course.level}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {course.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="space-y-2 mb-4">
                  {course.instructor && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Users className="h-4 w-4" />
                      <span>{course.instructor}</span>
                    </div>
                  )}

                  {course.duration && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <FileText className="h-4 w-4" />
                    <span>{course.modules_count || 0} modules</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolled_students || 0} enrolled</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    course.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {course.is_active ? 'Active' : 'Inactive'}
                  </span>

                  <div className="flex gap-2">
                    <button className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition">
                      <FileText className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      disabled={actionLoading === course.id}
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

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">No courses found matching your criteria.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
            >
              <Plus className="h-4 w-4" />
              Create First Course
            </button>
          </div>
        )}
      </main>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Create New Course</h3>

            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const courseData = {
                title: formData.get('title'),
                description: formData.get('description'),
                code: formData.get('code'),
                duration_weeks: parseInt(formData.get('duration_weeks') as string),
                department: formData.get('department'),
                outline: formData.get('outline'),
              }
              handleCreateCourse(courseData)
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Course Title *
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
                    Course Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    required
                    placeholder="e.g., CS101"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Duration (Weeks) *
                  </label>
                  <input
                    type="number"
                    name="duration_weeks"
                    required
                    min="1"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Course Outline
                  </label>
                  <textarea
                    name="outline"
                    rows={4}
                    placeholder="Enter course outline, modules, and learning objectives..."
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
                  {actionLoading === -1 ? "Creating..." : "Create Course"}
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
    </div>
  )
}