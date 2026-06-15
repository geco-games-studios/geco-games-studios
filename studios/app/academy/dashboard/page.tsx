"use client"

import { useEffect, useMemo, useState, type CSSProperties } from "react"
import { ArrowRight, Flame } from "lucide-react"
import { useRouter } from "next/navigation"
import { t } from "@/lib/academy-theme"
import { LessonTypeIcon, IconBox, CheckIcon } from "@/components/academy/icons"
import {
  fetchCourses,
  fetchLessons,
  fetchProgress,
  groupLessonsByModule,
  type Course,
  type Lesson,
  type Progress,
} from "@/lib/academy-api"

export default function AcademyDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("Student")
  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Progress | null>(null)
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        const firstWithLessons = coursesData.find((c) => lessonsData.some((l) => l.course_id === c.id))
        setActiveCourseId((firstWithLessons ?? coursesData[0])?.id ?? null)
      })
      .catch((e) => {
        if (e.message !== "Not authenticated") setError("Could not load your courses. Please try again.")
      })
      .finally(() => setLoading(false))
  }, [router])

  const completed = useMemo(() => new Set(progress?.completed_lesson_ids ?? []), [progress])
  const activeCourse = courses.find((c) => c.id === activeCourseId) ?? null
  const courseLessons = useMemo(
    () => lessons.filter((l) => l.course_id === activeCourseId),
    [lessons, activeCourseId]
  )
  const byModule = useMemo(() => groupLessonsByModule(courseLessons), [courseLessons])

  const totalLessons = courseLessons.length
  const completedCount = courseLessons.filter((l) => completed.has(l.id)).length
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const nextLesson = courseLessons.find((l) => !completed.has(l.id)) ?? null
  const xp = progress?.total_xp ?? 0
  const level = progress?.level ?? 1
  const streak = progress?.streak_days ?? 0

  if (loading) {
    return (
      <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <span style={{ color: t.textMuted, fontSize: 14 }}>Loading your dashboard…</span>
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
            <h1 style={s.heroTitle}>Welcome back, {userName.split(" ")[0]}</h1>
            <p style={s.heroSub}>Keep building. Every lesson gets you closer to shipping your first African game.</p>
          </div>
          {nextLesson && (
            <button style={s.resumeBtn} onClick={() => router.push(`/academy/lessons/${nextLesson.id}`)}>
              Continue learning <ArrowRight size={16} />
            </button>
          )}
        </div>

        <div style={s.statsRow}>
          <div style={s.statCard}>
            <div style={s.statVal}>{completedCount}</div>
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

        <div style={s.progressWrap}>
          <div style={s.progressHeader}>
            <span style={s.progressLabel}>Overall progress</span>
            <span style={s.progressLabel}>{completedCount} / {totalLessons} lessons · {progressPct}%</span>
          </div>
          <div style={s.progressTrack}>
            <div style={{ ...s.progressFill, width: `${progressPct}%` }} />
          </div>
        </div>

        {courses.length > 1 && (
          <div style={s.courseTabs}>
            {courses.map((c) => (
              <button
                key={c.id}
                style={{ ...s.courseTab, ...(c.id === activeCourseId ? s.courseTabActive : {}) }}
                onClick={() => setActiveCourseId(c.id)}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}

        {activeCourse && (
          <div style={s.courseHeader}>
            <div>
              <h2 style={s.sectionTitle}>{activeCourse.title}</h2>
              <p style={s.sectionSub}>{activeCourse.description}</p>
            </div>
          </div>
        )}

        {totalLessons === 0 && (
          <div style={s.emptyBox}>
            No lessons in this course yet. Check back soon — your instructors are preparing content.
          </div>
        )}

        {(activeCourse?.modules ?? []).map((module) => {
          const moduleLessons = byModule.get(module.id) ?? []
          if (moduleLessons.length === 0) return null
          return (
            <div key={module.id} style={s.moduleCard}>
              <div style={s.moduleTitle}>{module.title}</div>
              <div style={s.lessonList}>
                {moduleLessons.map((lesson) => {
                  const done = completed.has(lesson.id)
                  const isNext = lesson.id === nextLesson?.id
                  return (
                    <div
                      key={lesson.id}
                      style={{ ...s.lessonRow, cursor: "pointer", background: isNext ? t.primaryBg : "transparent" }}
                      onClick={() => router.push(`/academy/lessons/${lesson.id}`)}
                    >
                      <LessonTypeIcon type={lesson.type} size={34} />
                      <div style={s.lessonInfo}>
                        <div style={{ ...s.lessonName, color: isNext ? t.textPrimary : t.textSecondary }}>{lesson.title}</div>
                        <div style={s.lessonMeta}>
                          {lesson.type}{lesson.video_url ? " with YouTube segment" : ""}
                          {lesson.duration ? ` · ${lesson.duration}` : ""}
                        </div>
                      </div>
                      {done && (
                        <IconBox size={26} radius={6} style={{ background: t.primaryBg, border: `1px solid ${t.primary}44` }}>
                          <CheckIcon size={13} color={t.primary} />
                        </IconBox>
                      )}
                      {isNext && !done && <span style={s.nextBadge}>Up next</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const s: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", background: t.bg, fontFamily: t.font, color: t.textPrimary },
  container: { maxWidth: 760, margin: "0 auto", padding: "32px 24px" },
  hero: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 },
  heroTitle: { fontSize: 24, fontWeight: 700, color: t.textPrimary, margin: "0 0 6px" },
  heroSub: { fontSize: 14, color: t.textMuted, maxWidth: 460, margin: 0 },
  resumeBtn: { background: t.primary, color: "#fff", border: "none", borderRadius: t.radius, padding: "12px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 8 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 },
  statCard: { background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, padding: "16px", textAlign: "center" },
  statVal: { fontSize: 22, fontWeight: 700, color: t.textPrimary },
  statLabel: { fontSize: 12, color: t.textMuted, marginTop: 4 },
  progressWrap: { background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, padding: "16px 20px", marginBottom: 28 },
  progressHeader: { display: "flex", justifyContent: "space-between", marginBottom: 10 },
  progressLabel: { fontSize: 13, color: t.textMuted },
  progressTrack: { height: 6, background: t.surfaceHigh, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", background: t.primary, borderRadius: 3, transition: "width 0.4s" },
  courseTabs: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  courseTab: { fontSize: 13, color: t.textSecondary, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 100, padding: "6px 16px", cursor: "pointer" },
  courseTabActive: { color: t.primary, background: t.primaryBg, border: `1px solid ${t.primary}` },
  courseHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 700, color: t.textPrimary, margin: "0 0 4px" },
  sectionSub: { fontSize: 13, color: t.textMuted, margin: 0 },
  emptyBox: { background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, padding: "28px", textAlign: "center", color: t.textMuted, fontSize: 14 },
  moduleCard: { background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, marginBottom: 12, overflow: "hidden" },
  moduleTitle: { fontSize: 11, fontWeight: 700, color: t.textMuted, padding: "10px 20px", background: t.surfaceHigh, borderBottom: `1px solid ${t.border}`, textTransform: "uppercase", letterSpacing: "0.06em" },
  lessonList: { padding: "4px 0" },
  lessonRow: { display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", transition: "background 0.15s" },
  lessonInfo: { flex: 1 },
  lessonName: { fontSize: 14, fontWeight: 500 },
  lessonMeta: { fontSize: 12, color: t.textMuted, marginTop: 2 },
  nextBadge: { fontSize: 11, background: t.primaryBg, color: t.primary, border: `1px solid ${t.primary}`, padding: "2px 10px", borderRadius: 100, fontWeight: 500 },
}
