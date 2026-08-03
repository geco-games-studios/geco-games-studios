"use client"

import { BarChart3, Loader2, RefreshCw } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

type ResultOption = { label?: string; answer?: string; name?: string; count?: number; percentage?: number; value?: number }
type ResultQuestion = { id?: string; key?: string; label?: string; question?: string; text?: string; answers?: ResultOption[]; options?: ResultOption[]; results?: ResultOption[] }

const titleFor = (question: ResultQuestion) => question.label || question.question || question.text || question.id || question.key || "Survey question"
const optionLabel = (option: ResultOption) => option.label || option.answer || option.name || String(option.value ?? "")
const asPercent = (option: ResultOption, total: number) => Math.round(option.percentage ?? (total ? ((option.count ?? option.value ?? 0) / total) * 100 : 0))
const optionsFor = (question: ResultQuestion) => {
  const source = question.answers || question.options || question.results || []
  if (Array.isArray(source)) return source
  return Object.entries(source as unknown as Record<string, number>).map(([label, count]) => ({ label, count }))
}

function normaliseResults(payload: unknown): ResultQuestion[] {
  if (Array.isArray(payload)) return payload as ResultQuestion[]
  if (!payload || typeof payload !== "object") return []
  const data = payload as Record<string, unknown>
  for (const key of ["results", "questions", "data"]) if (Array.isArray(data[key])) return data[key] as ResultQuestion[]
  return Object.entries(data).filter(([, value]) => Array.isArray(value) || (value && typeof value === "object")).map(([id, value]) => {
    const entry = value as any
    return { id, label: entry.label || entry.question, answers: Array.isArray(value) ? value : entry.answers || entry.options || entry.results || entry }
  })
}

export default function SurveyResults() {
  const [questions, setQuestions] = useState<ResultQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/v1/test/survey/results/", { cache: "no-store" })
      if (!response.ok) throw new Error("Survey results are not available right now.")
      setQuestions(normaliseResults(await response.json()))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Survey results are not available right now.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  const totalAnswers = useMemo(() => questions.reduce((total, question) => total + optionsFor(question).reduce((sum, answer) => sum + (answer.count || answer.value || 0), 0), 0), [questions])

  return <div className="min-h-screen px-5 py-28 sm:px-8"><div className="mx-auto max-w-5xl"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-black uppercase tracking-[.24em] text-cyan-200">Internal dashboard</p><h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Anonymous survey results</h1><p className="mt-4 max-w-2xl leading-7 text-violet-100">Combined response data only. Individual submissions are never shown here.</p></div><button type="button" onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button></div>
    {loading ? <div className="flex min-h-[360px] items-center justify-center gap-3 text-violet-100"><Loader2 className="h-5 w-5 animate-spin" /> Loading combined results…</div> : error ? <div className="mt-10 rounded-3xl border border-rose-300/30 bg-rose-500/10 p-8 text-rose-100">{error}</div> : <><div className="mt-10 grid gap-4 sm:grid-cols-2"><div className="rounded-3xl border border-white/10 bg-[#211b57]/80 p-5"><p className="text-xs font-bold uppercase tracking-wider text-violet-200">Questions tracked</p><p className="mt-2 text-3xl font-black text-white">{questions.length}</p></div><div className="rounded-3xl border border-white/10 bg-[#211b57]/80 p-5"><p className="text-xs font-bold uppercase tracking-wider text-violet-200">Recorded selections</p><p className="mt-2 text-3xl font-black text-white">{totalAnswers}</p></div></div><div className="mt-6 grid gap-6">{questions.map((question, index) => <ResultCard key={question.id || question.key || index} question={question} />)}</div>{!questions.length ? <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-violet-100">No anonymous responses have been counted yet.</div> : null}</>}</div></div>
}

function ResultCard({ question }: { question: ResultQuestion }) {
  const options = optionsFor(question)
  const total = options.reduce((sum, option) => sum + (option.count || option.value || 0), 0)
  return <section className="rounded-[2rem] border border-white/10 bg-[#211b57]/80 p-6 shadow-xl sm:p-8"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300/15 text-cyan-200"><BarChart3 className="h-5 w-5" /></span><h2 className="text-xl font-bold text-white">{titleFor(question)}</h2></div><div className="mt-7 space-y-5">{options.map((option, index) => { const percentage = asPercent(option, total); return <div key={`${optionLabel(option)}-${index}`}><div className="mb-2 flex justify-between gap-4 text-sm"><span className="font-semibold text-violet-50">{optionLabel(option)}</span><span className="font-black text-cyan-200">{percentage}%</span></div><div className="h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }} /></div></div> })}</div></section>
}
