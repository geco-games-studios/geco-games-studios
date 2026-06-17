"use client"

import { useEffect, useMemo, useState, type CSSProperties } from "react"
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Flame, LockKeyhole, Send, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { academyDarkTheme, academyLightTheme, type AcademyTheme } from "@/lib/academy-theme"
import {
  fetchCourses,
  fetchLessons,
  fetchProgress,
  requestCourseEnrollment,
  type Course,
  type Lesson,
  type Progress,
} from "@/lib/academy-api"

type CourseActionState = Record<number, "idle" | "busy" | "sent" | "error">

export default function AcademyDashboard() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const isLightTheme = resolvedTheme === "light"
  const t = isLightTheme ? academyLightTheme : academyDarkTheme
  const s = useMemo(() => createStyles(t, isLightTheme), [t, isLightTheme])
  const [userName, setUserName] = useState("Student")
  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [courseActions, setCourseActions] = useState<CourseActionState>({})
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/login?type=student")
      return
    }
    const parsed = JSON.parse(userData)
    if (parsed.type === "admin" || parsed.academy_sub_type === "admin" || parsed.is_staff === true) {
      router.push("/academy/admin/dashboard")
      return
    }
    setUserName(parsed.first_name || parsed.name || parsed.email?.split("@")[0] || "Student")

    Promise.all([fetchCourses(), fetchLessons(), fetchProgress()])
      .then(([coursesData, lessonsData, progressData]) => {
        setCourses(coursesData)
        setLessons(lessonsData)
        setProgress(progressData)
      })
      .catch((e) => {
        if (e.message !== "Not authenticated") setError("Could not load your courses. Please try again.")
      })
      .finally(() => setLoading(false))
  }, [router])

  const completed = useMemo(() => new Set(progress?.completed_lesson_ids ?? []), [progress])
  const xp = progress?.total_xp ?? 0
  const level = progress?.level ?? 1
  const streak = progress?.streak_days ?? 0
  const totalCompleted = lessons.filter((lesson) => completed.has(lesson.id)).length

  function getCourseLessons(courseId: number) {
    return lessons.filter((lesson) => lesson.course_id === courseId).sort((a, b) => {
      if (a.module !== b.module) return a.module - b.module
      return a.order - b.order
    })
  }

  function isPaidCourse(course: Course) {
    return Boolean(course.requires_payment || course.is_paid || course.paid || course.price)
  }

  function getEnrollmentStatus(course: Course, courseLessons: Lesson[]) {
    const explicitStatus = course.enrollment_status || course.status || null
    const enrolled = course.is_enrolled === true || course.enrolled === true || courseLessons.length > 0
    if (enrolled) return explicitStatus || "enrolled"
    if (explicitStatus && ["pending", "requested", "applied", "awaiting_payment"].includes(explicitStatus.toLowerCase())) return explicitStatus
    return "not_enrolled"
  }

  function getNextLesson(courseLessons: Lesson[]) {
    return courseLessons.find((lesson) => !completed.has(lesson.id)) ?? courseLessons[0] ?? null
  }

  async function handleCourseCard(course: Course) {
    const courseLessons = getCourseLessons(course.id)
    const status = getEnrollmentStatus(course, courseLessons).toLowerCase()
    const nextLesson = getNextLesson(courseLessons)

    if (status === "enrolled" || status === "active" || status === "completed") {
      if (nextLesson) router.push(`/academy/lessons/${nextLesson.id}`)
      else setNotice("This course is enrolled, but no lessons have been published yet.")
      return
    }

    if (["pending", "requested", "applied", "awaiting_payment"].includes(status)) {
      setNotice("Your enrollment request is already with the Academy admin team.")
      return
    }

    setCourseActions((prev) => ({ ...prev, [course.id]: "busy" }))
    try {
      const paid = isPaidCourse(course)
      const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
      const result = await requestCourseEnrollment(course.id, {
        course_title: course.title,
        requires_payment: paid,
        student_id: storedUser.id ?? storedUser.userId ?? storedUser.user_id ?? null,
        student_name: storedUser.name || `${storedUser.first_name || ""} ${storedUser.last_name || ""}`.trim() || null,
        student_email: storedUser.email || null,
      })
      const nextStatus = result.enrollment_status || result.status || (paid ? "pending" : "enrolled")
      setCourses((prev) =>
        prev.map((item) =>
          item.id === course.id
            ? { ...item, is_enrolled: nextStatus === "enrolled", enrollment_status: nextStatus }
            : item
        )
      )
      setCourseActions((prev) => ({ ...prev, [course.id]: "sent" }))
      setNotice(result.message || (paid
        ? "Application sent to the Academy admin team for approval."
        : "You are enrolled. The Academy admin dashboard has been notified."
      ))
    } catch (err) {
      console.error("Course enrollment request failed", err)
      setCourseActions((prev) => ({ ...prev, [course.id]: "error" }))
      setNotice("Could not send the enrollment request. Please try again or contact the Academy admin.")
    }
  }

  if (loading) {
    return (
      <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <span style={{ color: t.textMuted, fontSize: 14 }}>Loading your dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <span style={{ color: t.danger, fontSize: 14 }}>{error}</span>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.hero}>
          <div>
            <h1 style={s.heroTitle}>Your enrolled courses</h1>
            <p style={s.heroSub}>Welcome back, {userName.split(" ")[0]}. Pick up exactly where you left off.</p>
          </div>
        </div>

        {notice && (
          <div style={s.notice}>
            <span>{notice}</span>
            <button style={s.noticeClose} onClick={() => setNotice(null)}>Dismiss</button>
          </div>
        )}

        <div style={s.statsRow}>
          <div style={s.statCard}>
            <div style={s.statVal}>{totalCompleted}</div>
            <div style={s.statLabel}>Lessons complete</div>
          </div>
          <div style={s.statCard}>
            <div style={{ ...s.statVal, color: t.xp }}>{xp}</div>
            <div style={s.statLabel}>Total XP</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statVal}>Level {level}</div>
            <div style={s.statLabel}>Your level</div>
          </div>
          <div style={s.statCard}>
            <div style={{ ...s.statVal, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{streak} <Flame size={18} color={t.xp} /></div>
            <div style={s.statLabel}>Day streak</div>
          </div>
        </div>

        <div style={s.courseGrid}>
          {courses.map((course) => {
            const courseLessons = getCourseLessons(course.id)
            const completedCount = courseLessons.filter((lesson) => completed.has(lesson.id)).length
            const totalLessons = courseLessons.length || course.lessons || 0
            const progressPct = course.progress ?? (totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0)
            const nextLesson = getNextLesson(courseLessons)
            const rawStatus = getEnrollmentStatus(course, courseLessons)
            const status = rawStatus.toLowerCase()
            const enrolled = status === "enrolled" || status === "active" || status === "completed"
            const pending = ["pending", "requested", "applied", "awaiting_payment"].includes(status)
            const paid = isPaidCourse(course)
            const actionState = courseActions[course.id] ?? "idle"
            const actionLabel = enrolled
              ? nextLesson ? "Continue learning" : "No lessons yet"
              : pending || actionState === "sent"
                ? "Request sent"
                : paid
                  ? "Apply to enroll"
                  : "Enroll now"

            return (
              <button
                key={course.id}
                style={s.courseCard}
                onClick={() => handleCourseCard(course)}
                disabled={actionState === "busy"}
              >
                <div style={s.cardTop}>
                  <div style={s.courseIcon}>
                    {enrolled ? <BookOpen size={22} /> : paid ? <LockKeyhole size={22} /> : <Send size={22} />}
                  </div>
                  <span style={{
                    ...s.statusBadge,
                    ...(enrolled ? s.statusActive : pending || actionState === "sent" ? s.statusPending : s.statusOpen),
                  }}>
                    {enrolled ? "Enrolled" : pending || actionState === "sent" ? "Pending admin" : paid ? "Paid course" : "Open enrollment"}
                  </span>
                </div>

                <div style={s.cardTitle}>{course.title}</div>
                <p style={s.cardDescription}>{course.description || "Course details will appear here once published."}</p>

                <div style={s.cardStats}>
                  <span><CheckCircle2 size={13} /> {completedCount}/{totalLessons} lessons</span>
                  <span><Clock3 size={13} /> {course.duration_weeks || "Flexible"} weeks</span>
                  <span><Star size={13} /> {progressPct}%</span>
                </div>

                <div style={s.progressTrack}>
                  <div style={{ ...s.progressFill, width: `${Math.min(progressPct, 100)}%` }} />
                </div>

                <div style={s.cardFooter}>
                  <span style={s.nextText}>
                    {enrolled
                      ? nextLesson ? `Next: ${nextLesson.title}` : "Lessons are being prepared"
                      : paid ? "Admin approval required" : "Admin will be notified"}
                  </span>
                  <span style={s.cardAction}>
                    {actionState === "busy" ? "Sending..." : actionLabel} <ArrowRight size={14} />
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {courses.length === 0 && (
          <div style={s.emptyBox}>No Academy courses are available yet. Check back soon.</div>
        )}
      </div>
    </div>
  )
}

function createStyles(t: AcademyTheme, isLightTheme: boolean): Record<string, CSSProperties> {
  const cardSurface = isLightTheme ? t.surfaceHigh : t.surface

  return {
  page: { minHeight: "100vh", background: t.bg, fontFamily: t.font, color: t.textPrimary, padding: isLightTheme ? "clamp(16px, 4vw, 40px) clamp(12px, 3vw, 20px)" : 0 },
  container: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: isLightTheme ? "clamp(24px, 4vw, 34px) clamp(18px, 4vw, 36px)" : "32px 24px",
    background: isLightTheme ? t.surface : "transparent",
    border: isLightTheme ? `1px solid ${t.border}` : "none",
    borderRadius: isLightTheme ? 22 : 0,
    boxShadow: isLightTheme ? "0 28px 80px rgba(7,22,51,0.18)" : "none",
  },
  hero: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 },
  heroTitle: { fontSize: 28, fontWeight: 700, color: t.textPrimary, margin: "0 0 6px" },
  heroSub: { fontSize: 14, color: t.textMuted, maxWidth: 540, margin: 0 },
  notice: { background: t.primaryBg, border: `1px solid ${t.primary}44`, color: t.textPrimary, borderRadius: t.radiusLg, padding: "12px 14px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontSize: 13 },
  noticeClose: { background: "transparent", border: "none", color: t.primary, fontSize: 12, fontWeight: 700, cursor: "pointer" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 },
  statCard: { background: cardSurface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, padding: "16px", textAlign: "center", boxShadow: isLightTheme ? "none" : `0 16px 40px ${t.primaryGlow}` },
  statVal: { fontSize: 22, fontWeight: 700, color: t.textPrimary },
  statLabel: { fontSize: 12, color: t.textMuted, marginTop: 4 },
  courseGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 },
  courseCard: { textAlign: "left", background: cardSurface, color: t.textPrimary, border: `1px solid ${t.border}`, borderRadius: 8, padding: "18px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 14, minHeight: 280, transition: "border-color 0.15s, transform 0.15s", fontFamily: t.font, boxShadow: isLightTheme ? "none" : `0 18px 46px ${t.primaryGlow}` },
  cardTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  courseIcon: { width: 44, height: 44, borderRadius: 8, background: t.primaryBg, color: t.primary, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${t.primary}33` },
  statusBadge: { fontSize: 11, fontWeight: 700, padding: "4px 9px", borderRadius: 100, whiteSpace: "nowrap" },
  statusActive: { background: t.successBg, color: t.success, border: `1px solid ${t.successBorder}` },
  statusPending: { background: "rgba(239,159,39,0.14)", color: t.xp, border: "1px solid rgba(239,159,39,0.35)" },
  statusOpen: { background: t.surfaceHigh, color: t.textMuted, border: `1px solid ${t.border}` },
  cardTitle: { fontSize: 18, fontWeight: 700, lineHeight: 1.25 },
  cardDescription: { color: t.textMuted, fontSize: 13, lineHeight: 1.55, margin: 0, minHeight: 62 },
  cardStats: { display: "flex", flexWrap: "wrap", gap: 8, fontSize: 12, color: t.textMuted },
  progressTrack: { height: 6, background: t.surfaceHigh, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", background: t.primary, borderRadius: 3, transition: "width 0.4s" },
  cardFooter: { marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderTop: `1px solid ${t.border}`, paddingTop: 14 },
  nextText: { fontSize: 12, color: t.textMuted, lineHeight: 1.35 },
  cardAction: { fontSize: 13, fontWeight: 700, color: t.primary, display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" },
  emptyBox: { background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, padding: "28px", textAlign: "center", color: t.textMuted, fontSize: 14 },
  }
}
