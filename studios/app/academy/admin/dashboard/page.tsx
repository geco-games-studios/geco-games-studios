"use client"

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react"
import { Archive, ArrowRight, BarChart3, BookOpen, Check, Flame, Inbox, Link2, Package, Pencil, Plus, Trophy, Users, Video, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { t } from "@/lib/academy-theme"
import type { QuizQuestion } from "@/lib/academy-api"
import {
  fetchTrainees, fetchTraineeDetail, enrollTrainee, unenrollTrainee,
  fetchAdminCourses, createCourse, updateAdminCourse, deleteAdminCourse,
  fetchAdminModules, createAdminModule, updateAdminModule, deleteAdminModule,
  fetchAdminLessons, createAdminLesson, updateAdminLesson, deleteAdminLesson,
  importCourse, fetchOverview, extractYouTubeId, parseTime, buildEmbedUrl,
  fetchEnrollmentRequests, updateEnrollmentRequest,
  type TraineeRow, type TraineeDetail, type AdminCourse, type AdminModule,
  type AdminLesson, type Overview, type EnrollmentRequest,
} from "@/lib/academy-admin-api"

// ────────────────────────────────────────────────────────────────────────────
// Page shell
// ────────────────────────────────────────────────────────────────────────────

const TABS = [
  ["requests", "Enrollment Requests", Inbox],
  ["trainees", "Trainees", Users],
  ["courses", "Courses & Lessons", BookOpen],
  ["analytics", "Analytics", BarChart3],
  ["legacy", "Legacy", Archive],
] as const

export default function AdminPanel() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState("trainees")

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/login")
      return
    }
    const parsed = JSON.parse(userData)
    const isAdmin = parsed.type === "admin" || parsed.academy_sub_type === "admin" || parsed.is_staff === true
    if (!isAdmin) {
      router.push("/academy/dashboard")
      return
    }
    setReady(true)
  }, [router])

  if (!ready) return <div style={{ ...s.page, minHeight: "60vh" }} />

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.pageTitleRow}>
          <div>
            <h1 style={s.pageTitle}>
              Academy Admin <span style={s.adminBadge}>ADMIN</span>
            </h1>
            <p style={s.sectionDesc}>Manage trainees, courses, and lessons for GECO Academy.</p>
          </div>
          <button style={s.ghostBtn} onClick={() => router.push("/academy/dashboard")}>Student view</button>
        </div>

        <div style={s.tabs}>
          {TABS.map(([key, label, Icon]) => (
            <button key={key} style={{ ...s.tab, ...(tab === key ? s.tabActive : {}) }} onClick={() => setTab(key)}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {tab === "requests" && <RequestsTab />}
        {tab === "trainees" && <TraineesTab />}
        {tab === "courses" && <CoursesTab />}
        {tab === "analytics" && <AnalyticsTab />}
        {tab === "legacy" && <LegacyTab />}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Trainees
// ────────────────────────────────────────────────────────────────────────────

function RequestsTab() {
  const [requests, setRequests] = useState<EnrollmentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    fetchEnrollmentRequests()
      .then(setRequests)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { reload() }, [reload])

  async function setStatus(id: string, status: EnrollmentRequest["status"]) {
    setBusyId(id)
    setError(null)
    try {
      const updated = await updateEnrollmentRequest(id, status)
      setRequests((prev) => prev.map((request) => request.id === id ? updated : request))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update request.")
    } finally {
      setBusyId(null)
    }
  }

  const pendingCount = requests.filter((request) => request.status === "pending").length

  if (loading) return <div style={s.loading}>Loading enrollment requests...</div>

  return (
    <div>
      <p style={s.sectionDesc}>
        {pendingCount} pending request{pendingCount !== 1 ? "s" : ""}. Use the trainee panel to complete enrollment after approval.
      </p>
      {error && <div style={{ ...s.loading, color: t.danger, padding: 12 }}>{error}</div>}
      {requests.length === 0 && <div style={s.loading}>No enrollment requests yet.</div>}
      {requests.map((request) => (
        <div key={request.id} style={s.requestRow}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary }}>{request.student_name}</span>
              <span style={{
                ...s.requestStatus,
                ...(request.status === "pending" ? s.requestPending : request.status === "approved" ? s.requestApproved : s.requestDismissed),
              }}>
                {request.status}
              </span>
              {request.requires_payment && <span style={s.requestStatus}>Paid course</span>}
            </div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>
              {request.student_email} requested {request.course_title}
            </div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>
              {new Date(request.requested_at).toLocaleString()}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button
              style={s.addBtn}
              disabled={busyId === request.id || request.status === "approved"}
              onClick={() => setStatus(request.id, "approved")}
            >
              <Check size={13} /> Approve
            </button>
            <button
              style={s.dangerGhostBtn}
              disabled={busyId === request.id || request.status === "dismissed"}
              onClick={() => setStatus(request.id, "dismissed")}
            >
              <XCircle size={13} /> Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function TraineesTab() {
  const [trainees, setTrainees] = useState<TraineeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    fetchTrainees()
      .then(setTrainees)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={s.loading}>Loading trainees…</div>
  if (error) return <div style={{ ...s.loading, color: t.danger }}>{error}</div>
  if (!trainees.length) return <div style={s.loading}>No trainees yet.</div>

  return (
    <div>
      <p style={s.sectionDesc}>
        {trainees.length} trainee{trainees.length !== 1 ? "s" : ""}, sorted by XP. Click a row for full progress and submissions.
      </p>
      <div style={s.tableHeader}>
        <span style={{ flex: 2 }}>Name</span>
        <span style={{ flex: 2 }}>Email</span>
        <span style={{ flex: 1, textAlign: "center" }}>XP</span>
        <span style={{ flex: 1.4, textAlign: "center" }}>Lessons</span>
        <span style={{ flex: 1, textAlign: "center" }}>Streak</span>
        <span style={{ flex: 1.4, textAlign: "right" }}>Last active</span>
      </div>
      {trainees.map((trainee) => {
        const pct = trainee.total_lessons ? Math.round((trainee.completed_lessons / trainee.total_lessons) * 100) : 0
        const isExpanded = expanded === trainee.id
        return (
          <div key={trainee.id}>
            <div
              style={{ ...s.tableRow, background: isExpanded ? t.surfaceHigh : t.surface }}
              onClick={() => setExpanded(isExpanded ? null : trainee.id)}
            >
              <span style={{ flex: 2, fontWeight: 500, color: t.textPrimary }}>{trainee.name || "—"}</span>
              <span style={{ flex: 2, color: t.textMuted, fontSize: 13 }}>{trainee.email}</span>
              <span style={{ flex: 1, textAlign: "center", color: t.xp, fontWeight: 600 }}>{trainee.total_xp}</span>
              <span style={{ flex: 1.4, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span style={s.progressPill}><span style={{ ...s.progressPillFill, width: `${pct}%` }} /></span>
                <span style={{ fontSize: 11, color: t.textMuted }}>{trainee.completed_lessons}/{trainee.total_lessons}</span>
              </span>
              <span style={{ flex: 1, textAlign: "center", color: t.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>{trainee.streak_days} <Flame size={13} color={t.xp} /></span>
              <span style={{ flex: 1.4, textAlign: "right", fontSize: 12, color: t.textMuted }}>
                {trainee.last_active ? new Date(trainee.last_active).toLocaleDateString() : "—"}
              </span>
            </div>
            {isExpanded && <TraineePanel traineeId={trainee.id} />}
          </div>
        )
      })}
    </div>
  )
}

function TraineePanel({ traineeId }: { traineeId: number }) {
  const [detail, setDetail] = useState<TraineeDetail | null>(null)
  const [courses, setCourses] = useState<AdminCourse[]>([])
  const [enrollCourseId, setEnrollCourseId] = useState("")
  const [busy, setBusy] = useState(false)

  const reload = useCallback(() => {
    fetchTraineeDetail(traineeId).then(setDetail).catch(() => undefined)
  }, [traineeId])

  useEffect(() => {
    reload()
    fetchAdminCourses().then(setCourses).catch(() => undefined)
  }, [reload])

  if (!detail) return <div style={{ ...s.loading, padding: 20 }}>Loading…</div>

  const enrolledIds = new Set(detail.enrollments.map((e) => e.course_id))
  const enrollable = courses.filter((c) => !enrolledIds.has(c.id))

  async function handleEnroll() {
    if (!enrollCourseId) return
    setBusy(true)
    try {
      await enrollTrainee(traineeId, Number(enrollCourseId))
      setEnrollCourseId("")
      reload()
    } finally {
      setBusy(false)
    }
  }

  async function handleUnenroll(courseId: number) {
    setBusy(true)
    try {
      await unenrollTrainee(traineeId, courseId)
      reload()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={s.detailPanel}>
      <div style={s.detailGrid}>
        <div style={s.detailStat}><div style={s.detailStatVal}>{detail.total_xp}</div><div style={s.detailStatLabel}>Total XP</div></div>
        <div style={s.detailStat}><div style={s.detailStatVal}>Lv {detail.level}</div><div style={s.detailStatLabel}>Level</div></div>
        <div style={s.detailStat}><div style={{ ...s.detailStatVal, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>{detail.streak_days} <Flame size={15} color={t.xp} /></div><div style={s.detailStatLabel}>Streak</div></div>
        <div style={s.detailStat}><div style={s.detailStatVal}>{detail.longest_streak}</div><div style={s.detailStatLabel}>Best streak</div></div>
      </div>

      <div style={s.detailSectionTitle}>Enrollments</div>
      {detail.enrollments.length === 0 && <p style={s.emptyNote}>Not enrolled in any course.</p>}
      {detail.enrollments.map((enrollment) => (
        <div key={enrollment.enrollment_id} style={s.enrollmentRow}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary }}>{enrollment.course_title}</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>
              {enrollment.completed_lessons}/{enrollment.total_lessons} lessons · {enrollment.progress_percentage}% · {enrollment.status}
            </div>
          </div>
          <span style={s.progressPill}><span style={{ ...s.progressPillFill, width: `${enrollment.progress_percentage}%` }} /></span>
          <button style={s.dangerGhostBtn} disabled={busy} onClick={() => handleUnenroll(enrollment.course_id)}>Unenroll</button>
        </div>
      ))}

      {enrollable.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <select style={{ ...s.input, flex: 1 }} value={enrollCourseId} onChange={(e) => setEnrollCourseId(e.target.value)}>
            <option value="">Enroll in course…</option>
            {enrollable.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <button style={s.addBtn} disabled={!enrollCourseId || busy} onClick={handleEnroll}>Enroll</button>
        </div>
      )}

      <div style={s.detailSectionTitle}>Completed lessons & submissions</div>
      {detail.completions.length === 0 && <p style={s.emptyNote}>No lessons completed yet.</p>}
      {detail.completions.map((completion) => (
        <div key={completion.lesson_id} style={s.completionRow}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: t.textPrimary }}>
              {completion.lesson_title}
              <span style={{ color: t.textMuted, fontSize: 11 }}> · {completion.module_title} · {completion.lesson_type}</span>
            </div>
            {completion.submission_text && (
              <div style={s.submissionBox}>
                <div style={{ whiteSpace: "pre-wrap" }}>{completion.submission_text}</div>
                {completion.submission_url && (
                  <a href={completion.submission_url} target="_blank" rel="noreferrer" style={{ color: t.primary, fontSize: 12, wordBreak: "break-all", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <Link2 size={12} /> {completion.submission_url}
                  </a>
                )}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 12, color: t.xp, fontWeight: 600 }}>+{completion.xp_awarded} XP</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>{new Date(completion.completed_at).toLocaleDateString()}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Courses, modules & lessons
// ────────────────────────────────────────────────────────────────────────────

function CoursesTab() {
  const [courses, setCourses] = useState<AdminCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCourse, setActiveCourse] = useState<AdminCourse | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const reload = useCallback(async (selectId?: number) => {
    const data = await fetchAdminCourses()
    setCourses(data)
    setLoading(false)
    if (selectId) setActiveCourse(data.find((c) => c.id === selectId) ?? null)
  }, [])

  useEffect(() => { reload().catch(() => setLoading(false)) }, [reload])

  async function handleDelete(courseId: number) {
    await deleteAdminCourse(courseId)
    setConfirmDelete(null)
    if (activeCourse?.id === courseId) setActiveCourse(null)
    reload()
  }

  if (loading) return <div style={s.loading}>Loading courses…</div>

  return (
    <div>
      <NewCourseCard onCreated={(id) => reload(id)} />
      <ImportCourseCard onImported={(id) => reload(id)} />

      <div style={s.detailSectionTitle}>Courses</div>
      {courses.map((course) => (
        <div key={course.id} style={{ ...s.courseRow, border: activeCourse?.id === course.id ? `1px solid ${t.primary}` : `1px solid ${t.border}` }}>
          <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setActiveCourse(activeCourse?.id === course.id ? null : course)}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary }}>{course.title}</div>
            <div style={{ fontSize: 12, color: t.textMuted }}>{course.code} · {course.status} · {course.duration_weeks} weeks</div>
          </div>
          {confirmDelete === course.id ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: t.danger, fontWeight: 600 }}>Delete course and all its lessons?</span>
              <button style={s.deleteConfirmBtn} onClick={() => handleDelete(course.id)}>Yes, delete</button>
              <button style={s.ghostBtn} onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button style={s.ghostBtn} onClick={() => setActiveCourse(activeCourse?.id === course.id ? null : course)}>
                {activeCourse?.id === course.id ? "Close" : "Manage"}
              </button>
              <button style={s.dangerGhostBtn} onClick={() => setConfirmDelete(course.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
      {courses.length === 0 && <p style={s.emptyNote}>No courses yet — import one above to get started.</p>}

      {activeCourse && <CourseEditor course={activeCourse} onChanged={() => reload(activeCourse.id)} />}
    </div>
  )
}

function NewCourseCard({ onCreated }: { onCreated: (courseId: number) => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [durationWeeks, setDurationWeeks] = useState("24")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate() {
    if (!title.trim()) return
    setBusy(true)
    setError(null)
    try {
      const res = await createCourse({
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        durationWeeks: Number(durationWeeks) || 24,
      })
      setTitle("")
      setSubtitle("")
      setOpen(false)
      onCreated(res.course_id)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create course.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={s.formCard}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ ...s.sectionHeading, display: "flex", alignItems: "center", gap: 7 }}><Plus size={16} /> Create a course</div>
          <p style={{ ...s.sectionDesc, margin: "4px 0 0" }}>
            Start a course from scratch, then add modules, lessons, quizzes and activities below.
          </p>
        </div>
        <button style={s.ghostBtn} onClick={() => setOpen(!open)}>{open ? "Hide" : "Open"}</button>
      </div>
      {open && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr", gap: 10 }}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Title</label>
              <input style={s.input} placeholder="e.g. Unity Fundamentals" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Subtitle</label>
              <input style={s.input} placeholder="Short description" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Weeks</label>
              <input style={s.input} type="number" value={durationWeeks} onChange={(e) => setDurationWeeks(e.target.value)} />
            </div>
          </div>
          {error && <div style={{ color: t.danger, fontSize: 13 }}>{error}</div>}
          <button
            style={{ ...s.addBtn, alignSelf: "flex-start", opacity: title.trim() ? 1 : 0.5 }}
            disabled={!title.trim() || busy}
            onClick={handleCreate}
          >
            {busy ? "Creating…" : "Create course"}
          </button>
        </>
      )}
    </div>
  )
}

function ImportCourseCard({ onImported }: { onImported: (courseId: number) => void }) {
  const [open, setOpen] = useState(false)
  const [jsonText, setJsonText] = useState("")
  const [replace, setReplace] = useState(false)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleImport() {
    setError(null)
    setResult(null)
    let payload: Record<string, unknown>
    try {
      payload = JSON.parse(jsonText)
    } catch {
      setError("Invalid JSON — check the syntax and try again.")
      return
    }
    if (!payload.title || !Array.isArray(payload.modules) || payload.modules.length === 0) {
      setError('The JSON needs a "title" and a non-empty "modules" array.')
      return
    }
    setBusy(true)
    try {
      const res = await importCourse({ ...payload, replace })
      setResult(`Imported "${payload.title}" — ${res.modules_created} modules, ${res.lessons_created} lessons${res.replaced ? " (replaced existing)" : ""}.`)
      setJsonText("")
      onImported(res.course_id)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed.")
    } finally {
      setBusy(false)
    }
  }

  function handleFile(file: File | null) {
    if (!file) return
    file.text().then(setJsonText)
  }

  return (
    <div style={s.formCard}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ ...s.sectionHeading, display: "flex", alignItems: "center", gap: 7 }}><Package size={16} /> Import course from JSON</div>
          <p style={{ ...s.sectionDesc, margin: "4px 0 0" }}>
            Paste or upload the course JSON (same format as courseData) — modules, lessons, quizzes and activities import in one go.
          </p>
        </div>
        <button style={s.ghostBtn} onClick={() => setOpen(!open)}>{open ? "Hide" : "Open"}</button>
      </div>
      {open && (
        <>
          <input type="file" accept=".json,application/json" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} style={{ fontSize: 13, color: t.textMuted }} />
          <textarea
            style={{ ...s.input, minHeight: 160, fontFamily: "monospace", fontSize: 12 }}
            placeholder='{"title": "My Course", "subtitle": "...", "modules": [{"title": "Module 1", "lessons": [...]}]}'
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.textSecondary, cursor: "pointer" }}>
            <input type="checkbox" checked={replace} onChange={(e) => setReplace(e.target.checked)} />
            Replace existing course with the same code (overwrites its modules and lessons)
          </label>
          {error && <div style={{ color: t.danger, fontSize: 13 }}>{error}</div>}
          {result && <div style={{ color: t.success, fontSize: 13 }}>{result}</div>}
          <button style={{ ...s.addBtn, alignSelf: "flex-start", opacity: jsonText.trim() ? 1 : 0.5 }} disabled={!jsonText.trim() || busy} onClick={handleImport}>
            {busy ? "Importing…" : "Import course"}
          </button>
        </>
      )}
    </div>
  )
}

function getLessonVideoTimes(videoUrl: string | null) {
  if (!videoUrl) return { start: "", end: "" }
  try {
    const url = new URL(videoUrl)
    return {
      start: url.searchParams.get("start") ?? "",
      end: url.searchParams.get("end") ?? "",
    }
  } catch {
    return { start: "", end: "" }
  }
}

function getCourseVideoFromLessons(lessons: AdminLesson[]) {
  const lessonVideo = lessons.find((lesson) => lesson.video_url)?.video_url ?? ""
  const videoId = extractYouTubeId(lessonVideo)
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : lessonVideo
}

function CourseEditor({ course, onChanged }: { course: AdminCourse; onChanged: () => void }) {
  const [title, setTitle] = useState(course.title)
  const [description, setDescription] = useState(course.description)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [modules, setModules] = useState<AdminModule[]>([])
  const [lessons, setLessons] = useState<AdminLesson[]>([])
  const [courseVideoInput, setCourseVideoInput] = useState("")
  const [editingLesson, setEditingLesson] = useState<AdminLesson | null>(null)
  const [addingLessonTo, setAddingLessonTo] = useState<number | null>(null)
  const [newModuleTitle, setNewModuleTitle] = useState("")
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null)
  const [moduleTitle, setModuleTitle] = useState("")

  const reloadContent = useCallback(() => {
    fetchAdminModules(course.id).then(setModules).catch(() => undefined)
    fetchAdminLessons(course.id)
      .then((items) => {
        setLessons(items)
        setCourseVideoInput((current) => current || getCourseVideoFromLessons(items))
      })
      .catch(() => undefined)
  }, [course.id])

  useEffect(() => {
    setTitle(course.title)
    setDescription(course.description)
    setCourseVideoInput("")
    reloadContent()
  }, [course, reloadContent])

  async function saveCourse() {
    setSaving(true)
    await updateAdminCourse(course.id, { title, description })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onChanged()
  }

  async function addModule() {
    if (!newModuleTitle.trim()) return
    await createAdminModule({
      course: course.id,
      title: newModuleTitle.trim(),
      description: "",
      order: (modules.at(-1)?.order ?? 0) + 1,
      duration_hours: 1,
    })
    setNewModuleTitle("")
    reloadContent()
  }

  async function renameModule(moduleId: number) {
    await updateAdminModule(moduleId, { title: moduleTitle })
    setEditingModuleId(null)
    reloadContent()
  }

  async function removeModule(moduleId: number) {
    await deleteAdminModule(moduleId)
    reloadContent()
  }

  async function removeLesson(lessonId: number) {
    await deleteAdminLesson(lessonId)
    reloadContent()
  }

  return (
    <div style={{ ...s.formCard, marginTop: 20 }}>
      <div style={{ ...s.sectionHeading, display: "flex", alignItems: "center", gap: 7 }}><Pencil size={15} /> {course.title}</div>

      <div style={s.fieldGroup}>
        <label style={s.label}>Course title</label>
        <input style={s.input} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div style={s.fieldGroup}>
        <label style={s.label}>Subtitle / description</label>
        <input style={s.input} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div style={s.courseVideoPanel}>
        <div>
          <label style={s.label}>Course YouTube video URL</label>
          <div style={s.helpText}>Use one video for the whole course. Each lesson below only sets the start and end time for its segment.</div>
        </div>
        <input
          style={s.input}
          placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
          value={courseVideoInput}
          onChange={(e) => setCourseVideoInput(e.target.value)}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button style={s.addBtn} disabled={saving} onClick={saveCourse}>{saving ? "Saving…" : "Save course"}</button>
        {saved && <span style={{ ...s.savedTag, display: "inline-flex", alignItems: "center", gap: 4 }}>Saved <Check size={12} /></span>}
      </div>

      <div style={s.detailSectionTitle}>Modules & lessons</div>
      {modules.map((module) => (
        <div key={module.id} style={s.moduleBlock}>
          <div style={s.moduleHeader}>
            {editingModuleId === module.id ? (
              <div style={{ display: "flex", gap: 8, flex: 1 }}>
                <input style={{ ...s.input, flex: 1 }} value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} />
                <button style={s.addBtn} onClick={() => renameModule(module.id)}>Save</button>
                <button style={s.ghostBtn} onClick={() => setEditingModuleId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <span style={{ fontSize: 13, fontWeight: 700, color: t.textSecondary }}>{module.title}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={s.ghostBtn} onClick={() => { setEditingModuleId(module.id); setModuleTitle(module.title) }}>Rename</button>
                  <button style={s.ghostBtn} onClick={() => setAddingLessonTo(addingLessonTo === module.id ? null : module.id)}>+ Lesson</button>
                  <button style={s.dangerGhostBtn} onClick={() => removeModule(module.id)}>Delete</button>
                </div>
              </>
            )}
          </div>

          {lessons.filter((l) => l.module === module.id).map((lesson) => (
            <div key={lesson.id} style={s.lessonAdminRow}>
              <span style={{ fontSize: 13, color: t.textPrimary, flex: 1 }}>
                {lesson.title}
                <span style={{ color: t.textMuted, fontSize: 11 }}>
                  {" "}· {lesson.lesson_type}{lesson.duration ? ` · ${lesson.duration}` : ""}
                  {lesson.video_url ? <> · <Video size={11} style={{ display: "inline", verticalAlign: "-1px" }} /></> : null}{lesson.quiz?.length ? ` · ${lesson.quiz.length}q quiz` : ""}
                </span>
              </span>
              <span style={lesson.video_url ? s.videoLinkedBadge : s.videoMissingBadge}>
                <Video size={12} /> {lesson.video_url ? "Video linked" : "No video link"}
              </span>
              <button style={s.ghostBtn} onClick={() => setEditingLesson(editingLesson?.id === lesson.id ? null : lesson)}>
                {editingLesson?.id === lesson.id ? "Close" : "Edit"}
              </button>
              <button style={s.dangerGhostBtn} onClick={() => removeLesson(lesson.id)}>Delete</button>
            </div>
          ))}

          {editingLesson && editingLesson.module === module.id && (
            <LessonEditor
              key={editingLesson.id}
              lesson={editingLesson}
              courseVideoUrl={courseVideoInput}
              onDone={() => { setEditingLesson(null); reloadContent() }}
            />
          )}

          {addingLessonTo === module.id && (
            <LessonEditor
              courseVideoUrl={courseVideoInput}
              lesson={{
                id: 0, module: module.id, title: "", lesson_type: "video", duration: "",
                video_url: "", notes: "", resources: [], quiz: null, activity_instructions: "",
                order: (lessons.filter((l) => l.module === module.id).at(-1)?.order ?? 0) + 1, xp_reward: 50,
              }}
              isNew
              onDone={() => { setAddingLessonTo(null); reloadContent() }}
            />
          )}
        </div>
      ))}

      <div style={{ display: "flex", gap: 8 }}>
        <input style={{ ...s.input, flex: 1 }} placeholder="New module title…" value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)} />
        <button style={s.addBtn} disabled={!newModuleTitle.trim()} onClick={addModule}>Add module</button>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Lesson editor with video + quiz builder
// ────────────────────────────────────────────────────────────────────────────

function LessonEditor({ lesson, courseVideoUrl, isNew = false, onDone }: { lesson: AdminLesson; courseVideoUrl: string; isNew?: boolean; onDone: () => void }) {
  const [form, setForm] = useState({ ...lesson })
  const savedTimes = getLessonVideoTimes(lesson.video_url)
  const [startTime, setStartTime] = useState(savedTimes.start)
  const [endTime, setEndTime] = useState(savedTimes.end)
  const videoInput = courseVideoUrl
  const setVideoInput = (_value: string) => undefined
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof AdminLesson, value: unknown) => setForm((f) => ({ ...f, [key]: value }))

  function applyVideo() {
    const id = extractYouTubeId(courseVideoUrl)
    if (!id) {
      setError("Add the course YouTube video URL above before applying lesson times.")
      return
    }
    set("video_url", buildEmbedUrl(id, parseTime(startTime), parseTime(endTime)))
  }

  async function save() {
    if (!form.title.trim()) { setError("Lesson title is required."); return }
    const id = extractYouTubeId(courseVideoUrl)
    const nextVideoUrl = id ? buildEmbedUrl(id, parseTime(startTime), parseTime(endTime)) : form.video_url || null
    setSaving(true)
    setError(null)
    const payload = {
      module: form.module,
      title: form.title.trim(),
      lesson_type: form.lesson_type,
      duration: form.duration || null,
      video_url: nextVideoUrl,
      notes: form.notes || null,
      resources: form.resources ?? [],
      quiz: form.quiz?.length ? form.quiz : null,
      activity_instructions: form.activity_instructions || null,
      order: form.order,
      xp_reward: form.xp_reward,
    }
    try {
      if (isNew) await createAdminLesson(payload)
      else await updateAdminLesson(lesson.id, payload)
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={s.lessonEditor}>
      <div style={s.fieldGroup}>
        <label style={s.label}>Lesson title</label>
        <input style={s.input} value={form.title} onChange={(e) => set("title", e.target.value)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div style={s.fieldGroup}>
          <label style={s.label}>Type</label>
          <select style={s.input} value={form.lesson_type} onChange={(e) => set("lesson_type", e.target.value)}>
            <option value="video">Video</option>
            <option value="reading">Reading</option>
            <option value="activity">Activity</option>
          </select>
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Duration</label>
          <input style={s.input} placeholder="e.g. 5 min" value={form.duration ?? ""} onChange={(e) => set("duration", e.target.value)} />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>XP reward</label>
          <input style={s.input} type="number" value={form.xp_reward} onChange={(e) => set("xp_reward", Number(e.target.value) || 50)} />
        </div>
      </div>

      <div style={s.fieldGroup}>
        <div style={s.videoLinkHeader}>
          <div>
            <label style={s.label}>Lesson video segment</label>
            <div style={s.helpText}>This lesson uses the course video above. Set only the start and end time for this lesson.</div>
          </div>
          {form.video_url ? (
            <span style={s.videoLinkedBadge}><Video size={12} /> Video linked</span>
          ) : (
            <span style={s.videoMissingBadge}><Video size={12} /> Required for video lessons</span>
          )}
        </div>
        <label style={s.subLabel}>Course video</label>
        <div style={s.courseVideoReference}>
          {courseVideoUrl || "Add the course YouTube video URL above before setting lesson times."}
        </div>
        <div style={{ display: "none" }}>
          <input style={{ ...s.input, flex: 2 }} placeholder="https://youtube.com/watch?v=…" value={videoInput} onChange={(e) => setVideoInput(e.target.value)} />
          <input style={{ ...s.input, width: 90 }} placeholder="start 0:00" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <input style={{ ...s.input, width: 90 }} placeholder="end 5:30" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          <button style={s.ghostBtn} onClick={applyVideo}>Apply</button>
        </div>
        <div style={s.lessonSegmentGrid}>
          <div style={s.fieldGroup}>
            <label style={s.subLabel}>Lesson start time</label>
            <input style={s.input} placeholder="0:00" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.subLabel}>Lesson end time</label>
            <input style={s.input} placeholder="5:30" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
          <button style={s.ghostBtn} onClick={applyVideo}>Preview segment</button>
        </div>
        {form.video_url && <div style={{ fontSize: 11, color: t.textMuted, fontFamily: "monospace", wordBreak: "break-all" }}>{form.video_url}</div>}
      </div>

      <div style={s.fieldGroup}>
        <label style={s.label}>Notes</label>
        <textarea style={{ ...s.input, minHeight: 80 }} value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
      </div>

      {form.lesson_type === "activity" && (
        <div style={s.fieldGroup}>
          <label style={s.label}>Activity instructions</label>
          <textarea style={{ ...s.input, minHeight: 80 }} value={form.activity_instructions ?? ""} onChange={(e) => set("activity_instructions", e.target.value)} />
        </div>
      )}

      <QuizBuilder quiz={form.quiz ?? []} onChange={(quiz) => set("quiz", quiz)} />

      {error && <div style={{ color: t.danger, fontSize: 13 }}>{error}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <button style={s.addBtn} disabled={saving} onClick={save}>{saving ? "Saving…" : isNew ? "Add lesson" : "Save lesson"}</button>
        <button style={s.ghostBtn} onClick={onDone}>Cancel</button>
      </div>
    </div>
  )
}

function QuizBuilder({ quiz, onChange }: { quiz: QuizQuestion[]; onChange: (quiz: QuizQuestion[]) => void }) {
  function updateQuestion(qi: number, text: string) {
    onChange(quiz.map((q, i) => (i === qi ? { ...q, question: text } : q)))
  }
  function updateOption(qi: number, oi: number, text: string) {
    onChange(quiz.map((q, i) => (i === qi ? { ...q, options: q.options.map((o, j) => (j === oi ? text : o)) } : q)))
  }
  function setCorrect(qi: number, oi: number) {
    onChange(quiz.map((q, i) => (i === qi ? { ...q, correct: oi } : q)))
  }
  function addQuestion() {
    onChange([...quiz, { question: "", options: ["", "", "", ""], correct: 0 }])
  }
  function removeQuestion(qi: number) {
    onChange(quiz.filter((_, i) => i !== qi))
  }

  return (
    <div style={s.fieldGroup}>
      <label style={s.label}>Quiz ({quiz.length} question{quiz.length !== 1 ? "s" : ""} — students need 80% to pass)</label>
      {quiz.map((q, qi) => (
        <div key={qi} style={s.quizEditorCard}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: t.primary }}>Q{qi + 1}</span>
            <input style={{ ...s.input, flex: 1 }} placeholder="Question text" value={q.question} onChange={(e) => updateQuestion(qi, e.target.value)} />
            <button style={s.dangerGhostBtn} onClick={() => removeQuestion(qi)}>Remove</button>
          </div>
          {q.options.map((opt, oi) => (
            <div key={oi} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <button
                title="Mark as correct answer"
                style={{
                  ...s.correctToggle,
                  background: q.correct === oi ? t.success : t.surfaceHigh,
                  color: q.correct === oi ? "#fff" : t.textMuted,
                }}
                onClick={() => setCorrect(qi, oi)}
              >
                <Check size={14} style={{ display: "block", margin: "0 auto" }} />
              </button>
              <input style={{ ...s.input, flex: 1 }} placeholder={`Option ${String.fromCharCode(65 + oi)}`} value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)} />
            </div>
          ))}
        </div>
      ))}
      <button style={{ ...s.ghostBtn, alignSelf: "flex-start" }} onClick={addQuestion}>+ Add question</button>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Analytics
// ────────────────────────────────────────────────────────────────────────────

function AnalyticsTab() {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOverview().then(setOverview).catch((e) => setError(e.message))
  }, [])

  if (error) return <div style={{ ...s.loading, color: t.danger }}>{error}</div>
  if (!overview) return <div style={s.loading}>Loading analytics…</div>

  const stats: [string, string | number][] = [
    ["Trainees", overview.trainees],
    ["Courses", overview.courses],
    ["Lessons", overview.lessons],
    ["Lessons completed", overview.completions_total],
    ["Completions this week", overview.completions_this_week],
    ["Active today", overview.active_today],
    ["Active this week", overview.active_this_week],
  ]

  return (
    <div>
      <div style={s.statsGrid}>
        {stats.map(([label, value]) => (
          <div key={label} style={s.statCard}>
            <div style={s.statVal}>{value}</div>
            <div style={s.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ ...s.detailSectionTitle, display: "flex", alignItems: "center", gap: 6 }}><Trophy size={13} color={t.xp} /> Top trainees</div>
      {overview.top_trainees.length === 0 && <p style={s.emptyNote}>No XP earned yet.</p>}
      {overview.top_trainees.map((trainee, i) => (
        <div key={trainee.trainee_id} style={s.tableRow}>
          <span style={{ width: 28, fontWeight: 700, color: i === 0 ? t.xp : t.textMuted }}>#{i + 1}</span>
          <span style={{ flex: 2, color: t.textPrimary, fontWeight: 500 }}>{trainee.name}</span>
          <span style={{ flex: 2, color: t.textMuted, fontSize: 13 }}>{trainee.email}</span>
          <span style={{ flex: 1, textAlign: "center", color: t.xp, fontWeight: 600 }}>{trainee.total_xp} XP</span>
          <span style={{ flex: 1, textAlign: "right", color: t.textMuted, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>Lv {trainee.level} · {trainee.streak_days} <Flame size={13} color={t.xp} /></span>
        </div>
      ))}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Legacy
// ────────────────────────────────────────────────────────────────────────────

const LEGACY_LINKS = [
  { href: "/academy/admin/accounts", title: "Accounts", desc: "Create and manage trainee user accounts and account locks." },
  { href: "/academy/admin/tasks", title: "Tasks", desc: "Assigned tasks with submissions and review workflow." },
  { href: "/academy/admin/departments", title: "Departments", desc: "Department structure (no longer required for courses)." },
  { href: "/academy/admin/courses", title: "Old course manager", desc: "The previous course/outline management screens." },
  { href: "/academy/admin/password-reset", title: "Password resets", desc: "Approve trainee password reset requests." },
]

function LegacyTab() {
  return (
    <div>
      <p style={s.sectionDesc}>
        Tools from the previous academy system. They still work against the same database, but day-to-day management now lives in the Trainees and Courses tabs.
      </p>
      {LEGACY_LINKS.map((link) => (
        <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
          <div style={s.legacyRow}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary }}>{link.title}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>{link.desc}</div>
            </div>
            <ArrowRight size={15} color={t.textMuted} />
          </div>
        </Link>
      ))}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", background: t.bg, fontFamily: t.font, color: t.textPrimary },
  container: { maxWidth: 960, margin: "0 auto", padding: "32px 24px" },
  pageTitleRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 8 },
  pageTitle: { fontSize: 22, fontWeight: 700, color: t.textPrimary, margin: 0, display: "flex", alignItems: "center", gap: 10 },
  adminBadge: { fontSize: 11, background: "rgba(139,92,246,0.15)", color: "#a78bfa", padding: "2px 8px", borderRadius: 100, fontWeight: 600, border: "1px solid rgba(139,92,246,0.3)" },
  tabs: { display: "flex", gap: 4, borderBottom: `1px solid ${t.border}`, marginBottom: 28, flexWrap: "wrap" },
  tab: { fontSize: 14, padding: "10px 18px", background: "none", border: "none", borderBottomWidth: 2, borderBottomStyle: "solid", borderBottomColor: "transparent", cursor: "pointer", color: t.textMuted, marginBottom: -1, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 7 },
  tabActive: { color: t.primary, borderBottomColor: t.primary },
  sectionDesc: { fontSize: 13, color: t.textMuted, marginBottom: 16, marginTop: 4 },
  sectionHeading: { fontSize: 15, fontWeight: 700, color: t.textPrimary },
  loading: { padding: 40, color: t.textMuted, fontSize: 14 },
  ghostBtn: { fontSize: 12, color: t.textSecondary, background: "none", border: `1px solid ${t.border}`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", whiteSpace: "nowrap" },
  dangerGhostBtn: { fontSize: 12, color: t.danger, background: "none", border: `1px solid ${t.dangerBorder}`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", whiteSpace: "nowrap" },
  addBtn: { padding: "9px 18px", background: t.primary, color: "#fff", border: "none", borderRadius: t.radius, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
  deleteConfirmBtn: { padding: "5px 12px", background: t.danger, color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
  savedTag: { fontSize: 12, background: t.primaryBg, color: t.primary, padding: "4px 10px", borderRadius: 100, border: `1px solid ${t.primary}44` },
  emptyNote: { fontSize: 13, color: t.textMuted, fontStyle: "italic", margin: "4px 0" },
  input: { padding: "9px 12px", border: `1px solid ${t.borderStrong}`, borderRadius: t.radius, fontSize: 14, color: t.textPrimary, outline: "none", width: "100%", boxSizing: "border-box", background: t.surfaceHigh },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.04em" },
  formCard: { background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, padding: "20px", display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 },
  requestRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, marginBottom: 8, flexWrap: "wrap" },
  requestStatus: { fontSize: 11, background: t.surfaceHigh, color: t.textMuted, padding: "3px 8px", borderRadius: 100, border: `1px solid ${t.border}`, fontWeight: 700, textTransform: "capitalize" },
  requestPending: { background: "rgba(239,159,39,0.14)", color: t.xp, border: "1px solid rgba(239,159,39,0.35)" },
  requestApproved: { background: t.successBg, color: t.success, border: `1px solid ${t.successBorder}` },
  requestDismissed: { background: t.dangerBg, color: t.danger, border: `1px solid ${t.dangerBorder}` },
  // Tables
  tableHeader: { display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" },
  tableRow: { display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, marginBottom: 6, cursor: "pointer" },
  progressPill: { display: "inline-block", width: 60, height: 6, background: t.surfaceHigh, borderRadius: 3, overflow: "hidden" },
  progressPillFill: { display: "block", height: "100%", background: t.primary, borderRadius: 3 },
  // Trainee detail
  detailPanel: { background: t.surfaceHigh, border: `1px solid ${t.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 10, marginTop: -2 },
  detailGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10, marginBottom: 8 },
  detailStat: { background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px", textAlign: "center" },
  detailStatVal: { fontSize: 17, fontWeight: 700, color: t.textPrimary },
  detailStatLabel: { fontSize: 11, color: t.textMuted, marginTop: 2 },
  detailSectionTitle: { fontSize: 12, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", margin: "16px 0 8px" },
  enrollmentRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, marginBottom: 6 },
  completionRow: { display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, marginBottom: 6 },
  submissionBox: { marginTop: 6, padding: "8px 10px", background: t.surfaceHigh, borderRadius: 6, fontSize: 12, color: t.textSecondary, display: "flex", flexDirection: "column", gap: 4 },
  // Courses
  courseRow: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: t.surface, borderRadius: 10, marginBottom: 8 },
  courseVideoPanel: { border: `1px solid ${t.primary}33`, background: t.primaryBg, borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 8 },
  moduleBlock: { border: `1px solid ${t.border}`, borderRadius: 10, marginBottom: 10, overflow: "hidden" },
  moduleHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 14px", background: t.surfaceHigh },
  lessonAdminRow: { display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderTop: `1px solid ${t.border}` },
  lessonEditor: { padding: "14px", borderTop: `1px solid ${t.border}`, background: t.bg, display: "flex", flexDirection: "column", gap: 12 },
  videoLinkHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", border: `1px solid ${t.primary}33`, background: t.primaryBg, borderRadius: 10, padding: 12, marginBottom: 8 },
  courseVideoReference: { border: `1px solid ${t.border}`, background: t.surface, borderRadius: 8, padding: "9px 10px", fontSize: 12, color: t.textSecondary, wordBreak: "break-all" },
  lessonSegmentGrid: { display: "grid", gridTemplateColumns: "minmax(120px, 160px) minmax(120px, 160px) auto", gap: 8, alignItems: "end", marginTop: 8 },
  helpText: { fontSize: 11, color: t.textMuted, marginTop: 3 },
  subLabel: { fontSize: 11, color: t.textMuted, fontWeight: 700 },
  videoLinkedBadge: { display: "inline-flex", alignItems: "center", gap: 4, border: `1px solid ${t.primary}55`, background: t.primaryBg, color: t.primary, borderRadius: 100, padding: "4px 8px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" },
  videoMissingBadge: { display: "inline-flex", alignItems: "center", gap: 4, border: `1px solid ${t.danger}44`, background: `${t.danger}10`, color: t.danger, borderRadius: 100, padding: "4px 8px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" },
  quizEditorCard: { border: `1px solid ${t.border}`, borderRadius: 8, padding: "12px", background: t.surface },
  correctToggle: { width: 34, borderRadius: 6, border: `1px solid ${t.border}`, cursor: "pointer", fontSize: 13, fontWeight: 700, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  // Analytics
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 8 },
  statCard: { background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, padding: "16px", textAlign: "center" },
  statVal: { fontSize: 22, fontWeight: 700, color: t.textPrimary },
  statLabel: { fontSize: 12, color: t.textMuted, marginTop: 4 },
  // Legacy
  legacyRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "14px 16px", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, marginBottom: 8 },
}
