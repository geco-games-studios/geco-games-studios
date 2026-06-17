"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ClipboardList, FileText, Link2, MonitorPlay, Star, XCircle } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { academyDarkTheme, academyLightTheme, type AcademyTheme } from "@/lib/academy-theme"
import { LessonTypeIcon, IconBox, PlayIcon } from "@/components/academy/icons"
import {
  completeLesson,
  fetchCourses,
  fetchLessons,
  fetchProgress,
  groupLessonsByModule,
  uploadActivityFile,
  type Course,
  type Lesson,
  type Progress,
} from "@/lib/academy-api"

export default function LessonPlayerPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const lessonId = Number(params.id)
  const { resolvedTheme, theme: selectedTheme } = useTheme()
  const t = (resolvedTheme ?? selectedTheme) === "light" ? academyLightTheme : academyDarkTheme
  const s = useMemo(() => createStyles(t), [t])

  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizPassed, setQuizPassed] = useState(false)
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 })

  // Activity state
  const [activityText, setActivityText] = useState("")
  const [activityFile, setActivityFile] = useState<File | null>(null)
  const [activityFileError, setActivityFileError] = useState<string | null>(null)
  const [activitySubmitting, setActivitySubmitting] = useState(false)
  const [resubmitting, setResubmitting] = useState(false)

  const [activeTab, setActiveTab] = useState("notes")
  const [xpToast, setXpToast] = useState<string | null>(null)
  const [lessonFinished, setLessonFinished] = useState(false)
  const [videoRestartNonce, setVideoRestartNonce] = useState(0)
  const [completing, setCompleting] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const playerRef = useRef<any>(null)
  const autoCompletingRef = useRef(false)

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      router.push("/login?type=student")
      return
    }
    Promise.all([fetchCourses(), fetchLessons(), fetchProgress()])
      .then(([coursesData, lessonsData, progressData]) => {
        setCourses(coursesData)
        setLessons(lessonsData)
        setProgress(progressData)
      })
      .catch(() => undefined)
      .finally(() => setLoading(false))
  }, [router])

  const lesson = lessons.find((l) => l.id === lessonId) ?? null
  const course = courses.find((c) => c.id === lesson?.course_id) ?? null
  const courseLessons = useMemo(
    () => lessons.filter((l) => l.course_id === lesson?.course_id),
    [lessons, lesson]
  )
  const byModule = useMemo(() => groupLessonsByModule(courseLessons), [courseLessons])
  const orderedLessons = useMemo(() => {
    const result: Lesson[] = []
    for (const module of course?.modules ?? []) result.push(...(byModule.get(module.id) ?? []))
    return result
  }, [course, byModule])

  const lessonIndex = orderedLessons.findIndex((l) => l.id === lessonId)
  const prevLesson = lessonIndex > 0 ? orderedLessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex >= 0 && lessonIndex < orderedLessons.length - 1 ? orderedLessons[lessonIndex + 1] : null

  const completed = useMemo(() => new Set(progress?.completed_lesson_ids ?? []), [progress])
  const done = completed.has(lessonId)
  const existingSubmission = progress?.submissions?.[String(lessonId)] ?? null
  const xp = progress?.total_xp ?? 0
  const level = progress?.level ?? 1

  const quiz = lesson?.quiz && lesson.quiz.length > 0 ? lesson.quiz : null
  const isActivity = lesson?.type === "activity"
  const isAutoCompletableVideo = Boolean(lesson?.video_url) && !quiz && !isActivity
  const videoSrc = lesson?.video_url ? withYouTubeApi(lesson.video_url, done) : null
  const videoEndSeconds = lesson?.video_url ? getYouTubeEndSeconds(lesson.video_url) : null
  const showActivityPause = isActivity && Boolean(lesson?.video_url) && lessonFinished && !done
  const canCompleteLesson = !lesson?.video_url || lessonFinished || done

  // Reset state when navigating between lessons
  useEffect(() => {
    setSelectedAnswers([])
    setQuizSubmitted(false)
    setQuizPassed(false)
    setQuizScore({ correct: 0, total: 0 })
    setActivityText("")
    setActivityFile(null)
    setActivityFileError(null)
    setResubmitting(false)
    setLessonFinished(false)
    setVideoRestartNonce(0)
    setCompleting(false)
    autoCompletingRef.current = false
    setActiveTab(isActivity ? "activity" : quiz ? "quiz" : "notes")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, loading])

  async function finishVideoLesson() {
    setLessonFinished(true)
    if (isActivity) {
      playerRef.current?.stopVideo?.()
      playerRef.current?.pauseVideo?.()
      setActiveTab("activity")
    }
    if (!isAutoCompletableVideo || done || autoCompletingRef.current) return

    autoCompletingRef.current = true
    setCompleting(true)
    try {
      const result = await completeLesson(lessonId)
      applyResult(result)
      if (result.xp_awarded > 0) showXp(`+${result.xp_awarded} XP - lesson complete!`)
      else showXp("Lesson complete.")
      startNextLesson()
    } finally {
      setCompleting(false)
    }
  }

  useEffect(() => {
    if (!lesson || done || !lesson.video_url) {
      setLessonFinished(true)
      return
    }

    let cancelled = false
    let pollTimer: ReturnType<typeof window.setInterval> | null = null
    let cleanupPlayer: (() => void) | null = null

    const markFinishedIfAtSegmentEnd = () => {
      if (!videoEndSeconds || autoCompletingRef.current) return
      const player = playerRef.current
      const currentTime = Number(player?.getCurrentTime?.())
      if (Number.isFinite(currentTime) && currentTime >= videoEndSeconds - 1) {
        void finishVideoLesson()
      }
    }

    const initPlayer = () => {
      const YT = (window as any).YT
      if (cancelled || !iframeRef.current || !YT?.Player) return
      playerRef.current?.destroy?.()
      playerRef.current = new YT.Player(iframeRef.current, {
        events: {
          onReady: () => {
            pollTimer = window.setInterval(markFinishedIfAtSegmentEnd, 1000)
          },
          onStateChange: (event: { data: number }) => {
            if (event.data === YT.PlayerState.ENDED) {
              void finishVideoLesson()
            } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.BUFFERING) {
              markFinishedIfAtSegmentEnd()
            }
          },
        },
      })
      cleanupPlayer = () => {
        if (pollTimer) window.clearInterval(pollTimer)
        playerRef.current?.destroy?.()
        playerRef.current = null
      }
    }

    if ((window as any).YT?.Player) {
      initPlayer()
    } else {
      const previousReady = (window as any).onYouTubeIframeAPIReady
      ;(window as any).onYouTubeIframeAPIReady = () => {
        previousReady?.()
        initPlayer()
      }
      if (!document.querySelector("script[src='https://www.youtube.com/iframe_api']")) {
        const tag = document.createElement("script")
        tag.src = "https://www.youtube.com/iframe_api"
        document.body.appendChild(tag)
      }
    }

    return () => {
      cancelled = true
      if (pollTimer) window.clearInterval(pollTimer)
      cleanupPlayer?.()
    }
  }, [lesson, lessonId, done, videoEndSeconds, videoRestartNonce])

  function handleRestartVideo() {
    autoCompletingRef.current = false
    setLessonFinished(false)
    setVideoRestartNonce((nonce) => nonce + 1)
  }

  if (loading) {
    return (
      <div style={{ ...s.root, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <span style={{ color: t.textMuted, fontSize: 14 }}>Loading lesson…</span>
      </div>
    )
  }
  if (!lesson) {
    return (
      <div style={{ ...s.root, padding: 60, textAlign: "center" }}>
        <p style={{ color: t.textSecondary }}>Lesson not found or you are not enrolled in this course.</p>
        <button style={s.completeBtn} onClick={() => router.push("/academy/dashboard")}>← Back to dashboard</button>
      </div>
    )
  }

  const tabs = [
    "notes",
    quiz ? "quiz" : null,
    isActivity ? "activity" : null,
    lesson.resources?.length ? "resources" : null,
  ].filter(Boolean) as string[]

  function showXp(message: string) {
    setXpToast(message)
    setTimeout(() => setXpToast(null), 2500)
  }

  function applyResult(result: { total_xp: number; level: number; streak_days: number }) {
    setProgress((prev) =>
      prev
        ? {
            ...prev,
            completed_lesson_ids: prev.completed_lesson_ids.includes(lessonId)
              ? prev.completed_lesson_ids
              : [...prev.completed_lesson_ids, lessonId],
            total_xp: result.total_xp,
            level: result.level,
            streak_days: result.streak_days,
          }
        : prev
    )
  }

  function startNextLesson() {
    if (!nextLesson) return
    setTimeout(() => {
      router.push(`/academy/lessons/${nextLesson.id}?autoplay=1`)
    }, 1200)
  }

  async function handleQuizSubmit() {
    if (!quiz) return
    if (!canCompleteLesson) return
    if (!quiz.every((_, i) => selectedAnswers[i] != null)) return

    let correct = 0
    quiz.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct) correct++
    })
    const total = quiz.length
    const pct = Math.round((correct / total) * 100)
    setQuizScore({ correct, total })
    setQuizSubmitted(true)

    if (pct >= 80) {
      setQuizPassed(true)
      if (!done) {
        const result = await completeLesson(lessonId, {
          submission_text: formatQuizSubmission(quiz, selectedAnswers),
        })
        applyResult(result)
        startNextLesson()
        showXp(`+${result.xp_awarded} XP — Quiz passed! ${correct}/${total} correct.`)
      }
    }
  }

  function handleQuizRetry() {
    setSelectedAnswers([])
    setQuizSubmitted(false)
    setQuizPassed(false)
    setQuizScore({ correct: 0, total: 0 })
  }

  async function handleActivitySubmit() {
    if (!activityFile) {
      setActivityFileError("Upload a PDF or video file before submitting the activity.")
      return
    }
    if (!canCompleteLesson) return
    setActivitySubmitting(true)
    setActivityFileError(null)
    try {
      const upload = await uploadActivityFile(activityFile)
      const submissionText = activityText.trim()
      const result = await completeLesson(lessonId, {
        submission_text: submissionText || undefined,
        submission_url: upload.url,
      })
      applyResult(result)
      startNextLesson()
      setProgress((prev) =>
        prev
          ? {
              ...prev,
              submissions: {
                ...prev.submissions,
                [String(lessonId)]: {
                  submission_text: submissionText || null,
                  submission_url: upload.url,
                },
              },
            }
          : prev
      )
      setResubmitting(false)
      setActivityFile(null)
      if (result.xp_awarded > 0) showXp(`+${result.xp_awarded} XP — Activity submitted!`)
      else showXp("Submission updated.")
    } catch (error) {
      setActivityFileError(error instanceof Error ? error.message : "Activity upload failed.")
    } finally {
      setActivitySubmitting(false)
    }
  }

  function handleActivityFile(file: File | null) {
    setActivityFile(file)
    if (!file) {
      setActivityFileError("Upload a PDF or video file before submitting the activity.")
      return
    }
    if (!(file.type === "application/pdf" || file.type.startsWith("video/"))) {
      setActivityFile(null)
      setActivityFileError("Only PDF and video files are accepted.")
      return
    }
    setActivityFileError(null)
  }

  async function handleMarkComplete() {
    if (!lessonFinished || completing) return
    setCompleting(true)
    const result = await completeLesson(lessonId)
    applyResult(result)
    startNextLesson()
    setCompleting(false)
    showXp(`+${result.xp_awarded} XP — lesson complete!`)
  }

  const courseProgressPct = orderedLessons.length
    ? Math.round((orderedLessons.filter((l) => completed.has(l.id)).length / orderedLessons.length) * 100)
    : 0

  return (
    <div style={s.root}>
      {xpToast && <div style={s.toast}>{xpToast}</div>}

      <nav style={s.nav}>
        <button style={s.backBtn} onClick={() => router.push("/academy/dashboard")}><ArrowLeft size={14} /> Back to course</button>
        <div style={s.navCenter}>
          <span style={s.navLesson}>{lesson.title}</span>
        </div>
        <div style={s.navXp}>
          <span style={s.xpLabel}><Star size={13} fill="currentColor" /> {xp} XP</span>
          <span style={s.levelLabel}>Lv {level}</span>
        </div>
      </nav>

      <div style={s.layout}>
        {/* Sidebar */}
        <div style={s.sidebar}>
          <div style={s.sidebarHeader}>
            <div style={s.courseTitle}>{course?.title}</div>
            <div style={s.progressRow}>
              <span style={s.progressText}>
                {orderedLessons.filter((l) => completed.has(l.id)).length} / {orderedLessons.length} lessons
              </span>
              <span style={s.progressText}>{courseProgressPct}%</span>
            </div>
            <div style={s.progressTrack}>
              <div style={{ ...s.progressFill, width: `${courseProgressPct}%` }} />
            </div>
          </div>
          <div style={s.sidebarScroll}>
            {(course?.modules ?? []).map((module) => {
              const moduleLessons = byModule.get(module.id) ?? []
              if (moduleLessons.length === 0) return null
              return (
                <div key={module.id}>
                  <div style={s.modLabel}>{module.title}</div>
                  {moduleLessons.map((l) => {
                    const active = l.id === lessonId
                    return (
                      <div
                        key={l.id}
                        style={{ ...s.sideItem, background: active ? t.surfaceHigh : "transparent", cursor: "pointer" }}
                        onClick={() => router.push(`/academy/lessons/${l.id}`)}
                      >
                        {active && <div style={s.activeBar} />}
                        <LessonTypeIcon type={l.type} size={28} theme={t} />
                        <div>
                          <div style={{ ...s.sideTitle, color: active ? t.textPrimary : t.textSecondary }}>
                            {l.title}{completed.has(l.id) && <Check size={11} color={t.primary} style={{ display: "inline", marginLeft: 4, verticalAlign: "-1px" }} />}
                          </div>
                          <div style={s.sideMeta}>
                            {l.type}
                            {l.duration ? ` · ${l.duration}` : ""}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* Main content */}
        <div style={s.main}>
          <div style={s.videoBox}>
            {lesson.video_url ? (
              <iframe
                key={`${lesson.id}-${videoRestartNonce}`}
                ref={iframeRef}
                src={videoSrc ?? lesson.video_url}
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                title={lesson.title}
              />
            ) : (
              <div style={s.videoPlaceholder}>
                <IconBox size={64} radius={16} theme={t} style={s.videoPlaceholderIcon}>
                  <PlayIcon size={26} color={t.textPrimary} />
                </IconBox>
                <div style={s.videoPlaceholderText}>{lesson.title}</div>
                <div style={s.videoPlaceholderSub}>Video coming soon — your instructor will add it shortly</div>
              </div>
            )}
            {showActivityPause && (
              <div style={s.activityVideoOverlay}>
                <div style={s.activityVideoOverlayTitle}>Lesson Pause - Do the Activity below</div>
                <button style={s.restartVideoBtn} onClick={handleRestartVideo}>
                  Restart Video
                </button>
              </div>
            )}
          </div>

          {lesson.video_url && (
            <div style={s.videoNote}>
              <MonitorPlay size={14} /> Video reference — watch this segment, then complete the {isActivity ? "activity" : quiz ? "quiz" : "lesson"} below.
            </div>
          )}

          <div style={s.body}>
            <div style={s.lessonHeader}>
              <div>
                <h1 style={s.lessonTitle}>{lesson.title}</h1>
                <p style={s.lessonMeta}>
                  {lesson.module_title} · Lesson {lessonIndex + 1} of {orderedLessons.length}
                  {lesson.duration ? ` · ${lesson.duration}` : ""}
                </p>
              </div>
              <div style={s.headerActions}>
                {done ? (
                  <span style={s.completedBadge}><Check size={14} /> Completed</span>
                ) : isAutoCompletableVideo ? (
                  <button
                    style={{ ...s.completeBtn, opacity: lessonFinished && !completing ? 1 : 0.45 }}
                    disabled={!lessonFinished || completing}
                    onClick={handleMarkComplete}
                  >
                    {completing ? "Completing..." : "Mark complete"} <Check size={14} />
                  </button>
                ) : null}
              </div>
            </div>

            {isAutoCompletableVideo && !done && (
              <div style={s.pureVideoNote}>
                {lessonFinished
                  ? "Lesson finished - mark it complete to start the next lesson."
                  : "Watch the video segment to the end to unlock Mark complete."}
              </div>
            )}

            {false && isAutoCompletableVideo && !done && (
              <div style={s.pureVideoNote}>No assessment for this lesson — mark complete when you&apos;re ready to continue.</div>
            )}

            <div style={s.tabs}>
              {tabs.map((tab) => (
                <button key={tab} style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}) }} onClick={() => setActiveTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === "notes" && (
              <div style={s.tabContent}>
                <p style={s.notes}>{lesson.notes || "No notes for this lesson."}</p>
              </div>
            )}

            {activeTab === "quiz" && quiz && (
              <div style={s.tabContent}>
                {done && !quizPassed && <div style={s.alreadyDone}><Check size={14} /> You&apos;ve already passed this lesson.</div>}
                {quiz.map((q, qi) => {
                  const selected = selectedAnswers[qi]
                  return (
                    <div key={qi} style={s.quizCard}>
                      <p style={s.quizQ}>
                        <span style={s.qNum}>Q{qi + 1}.</span> {q.question}
                      </p>
                      {q.options.map((opt, oi) => {
                        let bg: string = t.surfaceHigh
                        let border = `1px solid ${t.border}`
                        let color: string = t.textSecondary
                        if (quizSubmitted) {
                          if (oi === q.correct) {
                            bg = t.successBg; border = `1px solid ${t.successBorder}`; color = t.success
                          } else if (oi === selected && selected !== q.correct) {
                            bg = t.dangerBg; border = `1px solid ${t.dangerBorder}`; color = t.danger
                          }
                        } else if (oi === selected) {
                          bg = t.primaryBg; border = `1px solid ${t.primary}`; color = t.primary
                        }
                        return (
                          <div
                            key={oi}
                            style={{ ...s.optRow, background: bg, border, color, cursor: quizSubmitted || done ? "default" : "pointer" }}
                            onClick={() => {
                              if (quizSubmitted || done) return
                              setSelectedAnswers((prev) => {
                                const next = [...prev]
                                next[qi] = oi
                                return next
                              })
                            }}
                          >
                            <div style={{ ...s.optDot, background: quizSubmitted && oi === q.correct ? t.success : oi === selected ? t.primary : t.borderStrong }} />
                            {opt}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}

                {!quizSubmitted && !done && (
                  <button
                    style={{ ...s.submitBtn, opacity: canCompleteLesson && quiz.every((_, i) => selectedAnswers[i] != null) ? 1 : 0.5 }}
                    disabled={!canCompleteLesson || !quiz.every((_, i) => selectedAnswers[i] != null)}
                    onClick={handleQuizSubmit}
                  >
                    {canCompleteLesson ? "Submit Quiz" : "Finish video to unlock quiz"}
                  </button>
                )}

                {quizSubmitted && (
                  <div style={{ ...s.quizResult, background: quizPassed ? t.successBg : t.dangerBg, color: quizPassed ? t.success : t.danger }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      {quizPassed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {quizPassed
                        ? `Passed! ${quizScore.correct}/${quizScore.total} correct — well done.`
                        : `Score: ${quizScore.correct}/${quizScore.total}. You need 80% to pass. Review the video segment and try again.`}
                    </span>
                    {!quizPassed && (
                      <button style={s.retryBtn} onClick={handleQuizRetry}>Try again</button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && isActivity && (
              <div style={s.tabContent}>
                {lesson.activity_instructions && (
                  <div style={s.activityInstructions}>
                    <div style={s.activityInstructionsTitle}><ClipboardList size={14} /> Instructions</div>
                    <pre style={s.activityInstructionsPre}>{lesson.activity_instructions}</pre>
                  </div>
                )}

                {done && existingSubmission && !resubmitting ? (
                  <div style={s.submittedBox}>
                    <div style={s.submittedTitle}><CheckCircle2 size={15} /> Activity submitted! Great work.</div>
                    {existingSubmission.submission_text && <p style={s.submittedText}>{existingSubmission.submission_text}</p>}
                    {existingSubmission.submission_url && (
                      <a href={existingSubmission.submission_url} target="_blank" rel="noreferrer" style={s.submittedLink}>
                        <Link2 size={13} /> {existingSubmission.submission_url}
                      </a>
                    )}
                    <button
                      style={s.resubmitBtn}
                      onClick={() => {
                        setActivityText(existingSubmission.submission_text || "")
                        setActivityFile(null)
                        setActivityFileError(null)
                        setResubmitting(true)
                      }}
                    >
                      Resubmit
                    </button>
                  </div>
                ) : (
                  <div style={s.activityForm}>
                    <label style={s.activityLabel}>Describe what you built or paste your notes here</label>
                    <textarea
                      style={s.activityTextarea}
                      placeholder="Optional notes about your implementation, what worked, or what you learned..."
                      value={activityText}
                      onChange={(e) => setActivityText(e.target.value)}
                      rows={6}
                    />
                    <label style={s.activityLabel}>
                      Activity file <span style={{ fontWeight: 400, color: t.textMuted }}>(required PDF or video)</span>
                    </label>
                    <input
                      style={s.activityFileInput}
                      type="file"
                      accept="application/pdf,video/*"
                      onChange={(e) => handleActivityFile(e.target.files?.[0] ?? null)}
                    />
                    {activityFile && (
                      <div style={s.activityFileSelected}>
                        {activityFile.name} · {formatFileSize(activityFile.size)}
                      </div>
                    )}
                    {activityFileError && <div style={s.activityFileError}>{activityFileError}</div>}
                    <button
                      style={{ ...s.submitBtn, opacity: canCompleteLesson && activityFile ? 1 : 0.5 }}
                      disabled={!canCompleteLesson || !activityFile || activitySubmitting}
                      onClick={handleActivitySubmit}
                    >
                      {activitySubmitting ? "Uploading…" : "Submit Activity"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "resources" && (lesson.resources?.length ?? 0) > 0 && (
              <div style={s.tabContent}>
                {lesson.resources.map((r, i) => (
                  <a key={i} href={r.url || "#"} style={s.resourceRow} target="_blank" rel="noreferrer">
                    <FileText size={16} color={t.textMuted} />
                    <span style={{ flex: 1, fontSize: 14, color: t.textPrimary }}>{r.label}</span>
                    <span style={{ fontSize: 12, color: t.textMuted }}>↗</span>
                  </a>
                ))}
              </div>
            )}

            <div style={s.navRow}>
              <button
                style={{ ...s.navBtn, opacity: prevLesson ? 1 : 0.3 }}
                disabled={!prevLesson}
                onClick={() => prevLesson && router.push(`/academy/lessons/${prevLesson.id}`)}
              >
                <ArrowLeft size={14} /> Previous
              </button>
              <button
                style={{ ...s.navBtn, ...s.navBtnPrimary, opacity: nextLesson && done ? 1 : 0.3 }}
                disabled={!nextLesson || !done}
                onClick={() => nextLesson && router.push(`/academy/lessons/${nextLesson.id}`)}
              >
                {done ? "Next lesson" : "Complete to continue"} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function withYouTubeApi(src: string, alreadyDone: boolean) {
  try {
    const url = new URL(src)
    url.searchParams.set("enablejsapi", "1")
    if (!alreadyDone) url.searchParams.set("autoplay", "1")
    if (typeof window !== "undefined") url.searchParams.set("origin", window.location.origin)
    return url.toString()
  } catch {
    return src
  }
}

function getYouTubeEndSeconds(src: string) {
  try {
    const end = Number(new URL(src).searchParams.get("end"))
    return Number.isFinite(end) && end > 0 ? end : null
  } catch {
    return null
  }
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function formatQuizSubmission(quiz: NonNullable<Lesson["quiz"]>, selectedAnswers: (number | null)[]) {
  return quiz.map((question, index) => {
    const selected = selectedAnswers[index]
    const selectedLabel = selected != null ? question.options[selected] : "No answer"
    const correctLabel = question.options[question.correct] ?? "Unknown"
    const result = selected === question.correct ? "Correct" : "Incorrect"
    return [
      `Q${index + 1}: ${question.question}`,
      `Answer: ${selectedLabel}`,
      `Correct answer: ${correctLabel}`,
      `Result: ${result}`,
    ].join("\n")
  }).join("\n\n")
}

function createStyles(t: AcademyTheme): Record<string, CSSProperties> {
  const isLight = t === academyLightTheme
  return {
  root: { minHeight: "100vh", background: t.bg, fontFamily: t.font, color: t.textPrimary },
  nav: { background: isLight ? "rgba(255,255,255,0.94)" : t.surface, borderBottom: `1px solid ${t.border}`, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", position: "sticky", top: 0, zIndex: 20, boxShadow: isLight ? "0 8px 24px rgba(15,23,42,0.08)" : undefined, backdropFilter: isLight ? "blur(14px)" : undefined },
  backBtn: { background: "none", border: "none", fontSize: 13, color: t.textMuted, cursor: "pointer", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 5 },
  navCenter: { flex: 1, textAlign: "center" },
  navLesson: { fontSize: 14, fontWeight: 600, color: t.textPrimary },
  navXp: { display: "flex", alignItems: "center", gap: 8 },
  xpLabel: { fontSize: 13, fontWeight: 500, color: t.xp, display: "inline-flex", alignItems: "center", gap: 5 },
  levelLabel: { fontSize: 12, background: "rgba(239,159,39,0.15)", color: t.xp, padding: "2px 8px", borderRadius: 100, fontWeight: 600 },
  layout: { display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "calc(100vh - 56px)" },
  sidebar: { display: "flex", flexDirection: "column", background: isLight ? "rgba(255,255,255,0.92)" : t.surface, borderRight: `1px solid ${t.border}`, overflowY: "auto", maxHeight: "calc(100vh - 56px)", position: "sticky", top: 56, boxShadow: isLight ? "14px 0 30px rgba(15,23,42,0.08)" : undefined, backdropFilter: isLight ? "blur(12px)" : undefined },
  sidebarHeader: { padding: "16px", borderBottom: `1px solid ${t.border}`, flexShrink: 0 },
  courseTitle: { fontSize: 13, fontWeight: 600, color: t.textPrimary, marginBottom: 10 },
  progressRow: { display: "flex", justifyContent: "space-between" },
  progressText: { fontSize: 11, color: t.textMuted },
  progressTrack: { height: 4, background: t.surfaceHigh, borderRadius: 2, marginTop: 6, overflow: "hidden" },
  progressFill: { height: "100%", background: t.primary, borderRadius: 2, transition: "width 0.4s" },
  sidebarScroll: { flex: 1, overflowY: "auto", padding: "8px 0" },
  modLabel: { fontSize: 10, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", padding: "10px 16px 6px" },
  sideItem: { display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", position: "relative", transition: "background 0.1s" },
  activeBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: t.primary, borderRadius: "0 2px 2px 0" },
  sideTitle: { fontSize: 13, lineHeight: 1.3 },
  sideMeta: { fontSize: 11, color: t.textMuted, marginTop: 1 },
  main: { display: "flex", flexDirection: "column", minHeight: "calc(100vh - 56px)" },
  videoBox: { position: "relative", background: isLight ? "#071633" : "#050508", aspectRatio: "16/9", width: "100%", maxHeight: "55vh", overflow: "hidden" },
  videoPlaceholder: { width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "#fff" },
  videoPlaceholderIcon: { background: isLight ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.06)", border: isLight ? `1.5px solid ${t.borderStrong}` : "1.5px solid rgba(255,255,255,0.12)" },
  videoPlaceholderText: { fontSize: 16, fontWeight: 600 },
  videoPlaceholderSub: { fontSize: 12, color: t.textMuted, textAlign: "center", maxWidth: 280 },
  activityVideoOverlay: { position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24, textAlign: "center", background: isLight ? "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(230,247,255,0.94))" : "rgba(5,5,8,0.94)", color: t.textPrimary },
  activityVideoOverlayTitle: { maxWidth: 720, fontSize: "clamp(28px, 4vw, 54px)", lineHeight: 1.08, fontWeight: 800 },
  restartVideoBtn: { background: t.primary, color: "#fff", border: "none", borderRadius: t.radius, padding: "12px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: `0 10px 28px ${t.primaryGlow}` },
  videoNote: { background: t.primaryBg, borderBottom: `1px solid ${t.primary}22`, padding: "8px 20px", fontSize: 12, color: t.primary, display: "flex", alignItems: "center", gap: 6 },
  body: { padding: "24px 28px", flex: 1, background: isLight ? "rgba(255,255,255,0.92)" : t.bg, boxShadow: isLight ? "inset 0 1px 0 rgba(255,255,255,0.65)" : undefined },
  lessonHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, gap: 16, flexWrap: "wrap" },
  lessonTitle: { fontSize: 20, fontWeight: 700, color: t.textPrimary, margin: "0 0 4px" },
  lessonMeta: { fontSize: 13, color: t.textMuted },
  headerActions: { flexShrink: 0 },
  completeBtn: { background: t.primary, color: "#fff", border: "none", borderRadius: t.radius, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
  completedBadge: { background: t.primaryBg, color: t.primary, border: `1px solid ${t.primary}`, borderRadius: t.radius, padding: "9px 18px", fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 },
  pureVideoNote: { fontSize: 12, color: t.textMuted, marginBottom: 16, fontStyle: "italic" },
  alreadyDone: { background: t.primaryBg, color: t.primary, borderRadius: t.radius, padding: "10px 14px", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 },
  tabs: { display: "flex", borderBottom: `1px solid ${t.border}`, marginBottom: 20 },
  tab: { fontSize: 13, padding: "8px 16px", background: "none", border: "none", borderBottomWidth: 2, borderBottomStyle: "solid", borderBottomColor: "transparent", cursor: "pointer", color: t.textMuted, marginBottom: -1 },
  tabActive: { color: t.primary, borderBottomColor: t.primary, fontWeight: 500 },
  tabContent: { marginBottom: 28 },
  notes: { fontSize: 14, color: t.textSecondary, lineHeight: 1.75, whiteSpace: "pre-wrap" },
  quizCard: { border: `1px solid ${t.border}`, borderRadius: t.radiusLg, padding: "20px", marginBottom: 16, background: t.surface },
  quizQ: { fontSize: 15, fontWeight: 600, color: t.textPrimary, marginBottom: 14 },
  qNum: { color: t.primary, marginRight: 6 },
  optRow: { display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: t.radius, marginBottom: 8, fontSize: 14, transition: "all 0.15s" },
  optDot: { width: 14, height: 14, borderRadius: "50%", flexShrink: 0, transition: "background 0.15s" },
  submitBtn: { marginTop: 4, background: t.primary, color: "#fff", border: "none", borderRadius: t.radius, padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  quizResult: { marginTop: 16, padding: "14px 18px", borderRadius: t.radius, fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 },
  retryBtn: { fontSize: 12, padding: "6px 16px", background: t.dangerBg, color: t.danger, border: `1px solid ${t.dangerBorder}`, borderRadius: 6, cursor: "pointer", fontWeight: 600 },
  activityInstructions: { background: t.surfaceHigh, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "16px 20px", marginBottom: 20 },
  activityInstructionsTitle: { fontSize: 13, fontWeight: 700, color: t.textSecondary, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 },
  activityInstructionsPre: { fontSize: 13, color: t.textSecondary, lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit" },
  activityForm: { display: "flex", flexDirection: "column", gap: 10 },
  activityLabel: { fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.04em" },
  activityTextarea: { padding: "10px 14px", border: `1px solid ${t.borderStrong}`, borderRadius: t.radius, fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none", background: t.surfaceHigh, color: t.textPrimary },
  activityInput: { padding: "10px 14px", border: `1px solid ${t.borderStrong}`, borderRadius: t.radius, fontSize: 14, outline: "none", background: t.surfaceHigh, color: t.textPrimary },
  activityFileInput: { padding: "12px 14px", border: `1px solid ${t.borderStrong}`, borderRadius: t.radius, fontSize: 14, outline: "none", background: t.surfaceHigh, color: t.textPrimary, cursor: "pointer" },
  activityFileSelected: { fontSize: 13, color: t.textSecondary, background: t.primaryBg, border: `1px solid ${t.primary}44`, borderRadius: t.radius, padding: "9px 12px" },
  activityFileError: { fontSize: 13, color: t.danger, background: t.dangerBg, border: `1px solid ${t.dangerBorder}`, borderRadius: t.radius, padding: "9px 12px" },
  submittedBox: { background: t.primaryBg, border: `1px solid ${t.primary}44`, borderRadius: t.radius, padding: "20px", display: "flex", flexDirection: "column", gap: 10 },
  submittedTitle: { fontSize: 14, fontWeight: 600, color: t.primary, display: "flex", alignItems: "center", gap: 6 },
  submittedText: { fontSize: 13, color: t.textSecondary, whiteSpace: "pre-wrap", margin: 0 },
  submittedLink: { fontSize: 13, color: t.primary, wordBreak: "break-all", display: "inline-flex", alignItems: "center", gap: 5 },
  resubmitBtn: { alignSelf: "flex-start", fontSize: 12, padding: "6px 14px", background: t.surfaceHigh, border: `1px solid ${t.border}`, borderRadius: 6, cursor: "pointer", color: t.textSecondary },
  resourceRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: `1px solid ${t.border}`, borderRadius: t.radius, marginBottom: 8, textDecoration: "none", background: t.surface },
  navRow: { display: "flex", justifyContent: "space-between", paddingTop: 20, borderTop: `1px solid ${t.border}` },
  navBtn: { fontSize: 13, padding: "9px 18px", border: `1px solid ${t.border}`, borderRadius: t.radius, background: t.surfaceHigh, color: t.textSecondary, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
  navBtnPrimary: { background: t.primary, borderColor: t.primary, color: "#fff" },
  toast: { position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: t.primary, color: "#fff", padding: "10px 20px", borderRadius: 100, fontSize: 13, fontWeight: 500, zIndex: 100, boxShadow: `0 4px 24px ${t.primaryGlow}` },
  }
}
