// Data layer for the academy admin panel. All calls go through the
// /api/academy proxy with the shared login's JWT.
import type { QuizQuestion } from "@/lib/academy-api"

export interface TraineeRow {
  id: number
  name: string
  email: string
  is_active: boolean
  completed_lessons: number
  total_lessons: number
  last_active: string | null
  enrollment_count: number
  total_xp: number
  level: number
  streak_days: number
}

export interface TraineeEnrollment {
  enrollment_id: number
  course_id: number
  course_title: string
  course_code: string
  status: string
  progress_percentage: number
  completed_lessons: number
  total_lessons: number
  enrolled_at: string
}

export interface TraineeCompletion {
  lesson_id: number
  lesson_title: string
  lesson_type: string
  module_title: string
  course_title: string
  xp_awarded: number
  completed_at: string
  submission_text: string | null
  submission_url: string | null
}

export interface TraineeDetail extends Omit<TraineeRow, "completed_lessons" | "total_lessons" | "enrollment_count" | "last_active"> {
  longest_streak: number
  date_joined: string | null
  enrollments: TraineeEnrollment[]
  completions: TraineeCompletion[]
}

export interface AdminCourse {
  id: number
  title: string
  description: string
  code: string
  status: string
  duration_weeks: number
  department: number
  modules?: { id: number; title: string; order: number }[]
}

export interface AdminModule {
  id: number
  course: number
  title: string
  description: string
  order: number
  duration_hours: number
}

export interface AdminLesson {
  id: number
  module: number
  title: string
  lesson_type: string
  duration: string | null
  video_url: string | null
  notes: string | null
  resources: { label: string; url: string }[]
  quiz: QuizQuestion[] | null
  activity_instructions: string | null
  order: number
  xp_reward: number
}

export interface Overview {
  trainees: number
  active_trainees: number
  courses: number
  lessons: number
  completions_total: number
  completions_this_week: number
  active_today: number
  active_this_week: number
  top_trainees: { trainee_id: number; name: string; email: string; total_xp: number; level: number; streak_days: number }[]
}

export interface EnrollmentRequest {
  id: string
  course_id: number
  course_title: string
  student_id: string | null
  student_name: string
  student_email: string
  requires_payment: boolean
  status: "pending" | "approved" | "dismissed"
  requested_at: string
  updated_at: string
}

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { ...init, headers: { ...authHeaders(), ...(init?.headers ?? {}) } })
  if (res.status === 401) {
    if (typeof window !== "undefined") window.location.href = "/login"
    throw new Error("Not authenticated")
  }
  if (!res.ok) {
    let detail = `Request failed: ${res.status}`
    try {
      const body = await res.json()
      detail = body.error || body.detail || JSON.stringify(body).slice(0, 200)
    } catch { /* keep default */ }
    throw new Error(detail)
  }
  if (res.status === 204) return undefined as T
  const text = await res.text()
  return text ? JSON.parse(text) : (undefined as T)
}

// Trainees
export const fetchTrainees = () => request<TraineeRow[]>("/api/academy/admin/trainees")
export const fetchTraineeDetail = (id: number) => request<TraineeDetail>(`/api/academy/admin/trainees/${id}`)
export const enrollTrainee = (id: number, courseId: number) =>
  request(`/api/academy/admin/trainees/${id}/enroll`, { method: "POST", body: JSON.stringify({ course_id: courseId }) })
export const unenrollTrainee = (id: number, courseId: number) =>
  request(`/api/academy/admin/trainees/${id}/unenroll`, { method: "POST", body: JSON.stringify({ course_id: courseId }) })
export const fetchEnrollmentRequests = () => request<EnrollmentRequest[]>("/api/academy/enrollment-requests")
export const updateEnrollmentRequest = (id: string, status: EnrollmentRequest["status"]) =>
  request<EnrollmentRequest>("/api/academy/enrollment-requests", { method: "PATCH", body: JSON.stringify({ id, status }) })

// Courses / modules / lessons
export const fetchAdminCourses = () => request<AdminCourse[]>("/api/academy/admin/courses")
export const createCourse = (data: { title: string; subtitle?: string; code?: string; durationWeeks?: number }) =>
  request<{ course_id: number; code: string; title: string }>("/api/academy/admin/courses/quick_create", {
    method: "POST",
    body: JSON.stringify(data),
  })
export const updateAdminCourse = (id: number, data: Partial<AdminCourse>) =>
  request<AdminCourse>(`/api/academy/admin/courses/${id}`, { method: "PATCH", body: JSON.stringify(data) })
export const deleteAdminCourse = (id: number) =>
  request(`/api/academy/admin/courses/${id}`, { method: "DELETE" })

export const fetchAdminModules = (courseId: number) =>
  request<AdminModule[]>(`/api/academy/admin/modules?course=${courseId}`)
export const createAdminModule = (data: Omit<AdminModule, "id">) =>
  request<AdminModule>("/api/academy/admin/modules", { method: "POST", body: JSON.stringify(data) })
export const updateAdminModule = (id: number, data: Partial<AdminModule>) =>
  request<AdminModule>(`/api/academy/admin/modules/${id}`, { method: "PATCH", body: JSON.stringify(data) })
export const deleteAdminModule = (id: number) =>
  request(`/api/academy/admin/modules/${id}`, { method: "DELETE" })

export const fetchAdminLessons = (courseId: number) =>
  request<AdminLesson[]>(`/api/academy/admin/lessons?course=${courseId}`)
export const createAdminLesson = (data: Partial<AdminLesson>) =>
  request<AdminLesson>("/api/academy/admin/lessons", { method: "POST", body: JSON.stringify(data) })
export const updateAdminLesson = (id: number, data: Partial<AdminLesson>) =>
  request<AdminLesson>(`/api/academy/admin/lessons/${id}`, { method: "PATCH", body: JSON.stringify(data) })
export const deleteAdminLesson = (id: number) =>
  request(`/api/academy/admin/lessons/${id}`, { method: "DELETE" })

export const importCourse = (payload: unknown) =>
  request<{ course_id: number; code: string; modules_created: number; lessons_created: number; replaced: boolean }>(
    "/api/academy/admin/courses/import_course",
    { method: "POST", body: JSON.stringify(payload) }
  )

// Analytics
export const fetchOverview = () => request<Overview>("/api/academy/admin/overview")

// YouTube helpers (ported from the geco-academy admin panel)
export function extractYouTubeId(url: string): string {
  if (!url) return ""
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/|youtube-nocookie\.com\/embed\/)([\w-]{11})/,
    /^([\w-]{11})$/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return ""
}

export function parseTime(str: string): number {
  if (!str) return 0
  const parts = str.split(":").map((n) => parseInt(n, 10) || 0)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return parts[0] || 0
}

export function buildEmbedUrl(videoId: string, startSecs: number, endSecs: number): string {
  if (!videoId) return ""
  let url = `https://www.youtube-nocookie.com/embed/${videoId}?start=${startSecs || 0}`
  if (endSecs && endSecs > (startSecs || 0)) url += `&end=${endSecs}`
  return url
}
