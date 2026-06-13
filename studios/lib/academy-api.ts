// Data layer for the academy dashboard and lesson player.
// Talks to the Django backend through the site's /api/academy proxy,
// authenticated with the shared login's JWT from localStorage.

export interface QuizQuestion {
  question: string
  options: string[]
  correct: number
}

export interface Lesson {
  id: number
  module: number
  module_title: string
  course_id: number
  title: string
  type: "video" | "reading" | "activity"
  duration: string | null
  video_url: string | null
  notes: string | null
  resources: { label: string; url: string; icon?: string; type?: string }[]
  quiz: QuizQuestion[] | null
  activity_instructions: string | null
  order: number
  xp_reward: number
}

export interface CourseModule {
  id: number
  title: string
  description: string
  order: number
}

export interface Course {
  id: number
  title: string
  description: string
  code: string
  duration_weeks: number
  modules: CourseModule[]
}

export interface Progress {
  completed_lesson_ids: number[]
  submissions: Record<string, { submission_text: string | null; submission_url: string | null }>
  total_xp: number
  level: number
  streak_days: number
  longest_streak: number
}

export interface CompleteResult {
  lesson_id: number
  already_completed: boolean
  xp_awarded: number
  total_xp: number
  level: number
  streak_days: number
}

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: authHeaders() })
  if (res.status === 401) {
    if (typeof window !== "undefined") window.location.href = "/login?type=student"
    throw new Error("Not authenticated")
  }
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export function fetchCourses(): Promise<Course[]> {
  return get<Course[]>("/api/academy/courses")
}

export function fetchLessons(): Promise<Lesson[]> {
  return get<Lesson[]>("/api/academy/lessons")
}

export function fetchProgress(): Promise<Progress> {
  return get<Progress>("/api/academy/lessons/my_progress")
}

export async function completeLesson(
  lessonId: number,
  submission?: { submission_text?: string; submission_url?: string }
): Promise<CompleteResult> {
  const res = await fetch(`/api/academy/lessons/${lessonId}/complete`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(submission ?? {}),
  })
  if (res.status === 401) {
    if (typeof window !== "undefined") window.location.href = "/login?type=student"
    throw new Error("Not authenticated")
  }
  if (!res.ok) throw new Error(`Complete failed: ${res.status}`)
  return res.json()
}

export function groupLessonsByModule(lessons: Lesson[]): Map<number, Lesson[]> {
  const byModule = new Map<number, Lesson[]>()
  for (const lesson of lessons) {
    const list = byModule.get(lesson.module) ?? []
    list.push(lesson)
    byModule.set(lesson.module, list)
  }
  for (const list of byModule.values()) list.sort((a, b) => a.order - b.order)
  return byModule
}
