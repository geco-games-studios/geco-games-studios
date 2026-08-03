"use client"

import { BarChart3, Loader2, RefreshCw } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type ResultOption = { option: string; count: number; percentage: number }
type Result = { question_id: string; responses: number; options: ResultOption[]; rankings?: { option: string; average_rank: number | null }[] }
type DisplayResult = Result & { label: string }
type SchemaQuestion = { id: string; text: string }

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("accessToken")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function SurveyResults() {
  const [questions, setQuestions] = useState<DisplayResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const headers = authHeaders()
      const [resultsResponse, schemaResponse] = await Promise.all([
        fetch("/api/v1/test/survey/results/", { headers, cache: "no-store" }),
        fetch("/api/v1/test/survey/schema/", { cache: "no-store" }),
      ])
      if (resultsResponse.status === 401 || resultsResponse.status === 403) throw new Error("This dashboard is available only to Django superusers.")
      if (!resultsResponse.ok || !schemaResponse.ok) throw new Error("Survey results are not available right now.")
      const resultData = await resultsResponse.json()
      const schemaData = await schemaResponse.json()
      const labels = new Map<string, string>((schemaData.sections || []).flatMap((section: { questions?: SchemaQuestion[] }) => (section.questions || []).map((question) => [question.id, question.text])))
      setQuestions(((resultData.results || []) as Result[]).filter((result) => result.responses > 0).map((result) => ({ ...result, label: labels.get(result.question_id) || result.question_id.replace(/_/g, " ") })))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Survey results are not available right now.")
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.replace("/login?next=/survey/admin")
      return
    }
    load()
  }, [load, router])
  const totalResponses = useMemo(() => questions.reduce((total, question) => total + question.responses, 0), [questions])

  return <div className="min-h-screen px-5 py-28 sm:px-8"><div className="mx-auto max-w-5xl"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-black uppercase tracking-[.24em] text-cyan-200">Django superuser dashboard</p><h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Anonymous survey results</h1><p className="mt-4 max-w-2xl leading-7 text-violet-100">Combined response data only. Individual submissions are never shown here.</p></div><button type="button" onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button></div>
    {loading ? <div className="flex min-h-[360px] items-center justify-center gap-3 text-violet-100"><Loader2 className="h-5 w-5 animate-spin" /> Loading combined results…</div> : error ? <div className="mt-10 rounded-3xl border border-rose-300/30 bg-rose-500/10 p-8 text-rose-100">{error}</div> : <><div className="mt-10 grid gap-4 sm:grid-cols-2"><Metric label="Questions with responses" value={questions.length} /><Metric label="Recorded question responses" value={totalResponses} /></div><CompletionViewer /><div className="mt-6 grid gap-6">{questions.map((question) => <ResultCard key={question.question_id} question={question} />)}</div>{!questions.length ? <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-violet-100">No anonymous responses have been counted yet.</div> : null}</>}</div></div>
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-3xl border border-white/10 bg-[#211b57]/80 p-5"><p className="text-xs font-bold uppercase tracking-wider text-violet-200">{label}</p><p className="mt-2 text-3xl font-black text-white">{value}</p></div> }
function CompletionViewer() {
  const [category, setCategory] = useState("")
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const categories = [
    ["general", "Platform users"],
    ["business", "Businesses and marketers"],
    ["creators", "Social media influencers / content creators"],
    ["awards", "Awards"],
  ]
  async function selectCategory(id: string) {
    setCategory(id); setLoading(true); setError(""); setData(null)
    try {
      const response = await fetch(`/api/v1/test/survey/completions/?category=${id}`, { headers: authHeaders(), cache: "no-store" })
      if (response.status === 401 || response.status === 403) throw new Error("This data is available only to Django superusers.")
      if (!response.ok) throw new Error("Anonymous completion data could not be loaded.")
      setData(await response.json())
    } catch (loadError) { setError(loadError instanceof Error ? loadError.message : "Anonymous completion data could not be loaded.") } finally { setLoading(false) }
  }
  return <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#211b57]/80 p-6 shadow-xl sm:p-8"><p className="text-xs font-black uppercase tracking-[.22em] text-cyan-200">Completion data</p><h2 className="mt-2 text-2xl font-black text-white">Anonymous completions by category</h2><p className="mt-3 text-sm leading-6 text-violet-100">Choose a category to load its stored anonymous completion JSON.</p><div className="mt-6 flex flex-wrap gap-2">{categories.map(([id, label]) => <button type="button" key={id} onClick={() => selectCategory(id)} disabled={loading} className={`rounded-full px-4 py-2 text-sm font-bold transition ${category === id ? "bg-cyan-300 text-[#17124e]" : "border border-white/15 bg-white/5 text-white hover:bg-white/10"}`}>{label}</button>)}</div>{loading ? <div className="mt-6 flex items-center gap-2 text-sm text-violet-100"><Loader2 className="h-4 w-4 animate-spin" /> Loading completions…</div> : null}{error ? <p className="mt-6 text-sm text-rose-200">{error}</p> : null}{data ? <pre className="mt-6 max-h-[32rem] overflow-auto rounded-2xl border border-white/10 bg-[#100d3d] p-4 text-xs leading-6 text-cyan-100">{JSON.stringify(data, null, 2)}</pre> : null}</section>
}
function ResultCard({ question }: { question: DisplayResult }) { const ranking = question.rankings?.filter((item) => item.average_rank !== null).sort((a, b) => (a.average_rank || 0) - (b.average_rank || 0)); return <section className="rounded-[2rem] border border-white/10 bg-[#211b57]/80 p-6 shadow-xl sm:p-8"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/15 text-cyan-200"><BarChart3 className="h-5 w-5" /></span><h2 className="text-xl font-bold text-white">{question.label}</h2></div><span className="shrink-0 text-sm font-bold text-cyan-200">{question.responses} responses</span></div>{ranking?.length ? <div className="mt-7 space-y-3"><p className="text-sm text-violet-100">Average rank (lower is more used)</p>{ranking.map((item, index) => <div key={item.option} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm"><span className="font-semibold text-white">{index + 1}. {item.option}</span><span className="font-black text-cyan-200">{item.average_rank?.toFixed(1)}</span></div>)}</div> : <div className="mt-7 space-y-5">{question.options.map((option) => <div key={option.option}><div className="mb-2 flex justify-between gap-4 text-sm"><span className="font-semibold text-violet-50">{option.option}</span><span className="font-black text-cyan-200">{Math.round(option.percentage)}%</span></div><div className="h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" style={{ width: `${Math.min(100, Math.max(0, option.percentage))}%` }} /></div></div>)}</div>}</section> }
