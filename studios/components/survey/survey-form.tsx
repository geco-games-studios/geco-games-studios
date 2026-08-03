"use client"

import { Check, ChevronLeft, Loader2, LockKeyhole, Send } from "lucide-react"
import { useEffect, useState } from "react"

type Answer = string | number | string[]
type Question = { id?: string; key?: string; name?: string; label?: string; question?: string; text?: string; type?: string; required?: boolean; options?: Choice[]; choices?: Choice[] }
type Choice = string | { value?: string; label?: string; name?: string }
type Category = { id: string; label: string; description: string }

const defaultCategories: Category[] = [
  { id: "general", label: "Platform users", description: "Tell us about your everyday experience." },
  { id: "business", label: "Businesses and marketers", description: "Share what would help your organisation." },
  { id: "creators", label: "Social media influencers / content creators", description: "Help us support your creative work." },
  { id: "awards", label: "Awards", description: "Share feedback for awards and recognition." },
]
const categoryLabels: Record<string, string> = Object.fromEntries(defaultCategories.map((category) => [category.id, category.label]))
const keyFor = (question: Question) => question.id || question.key || question.name || ""
const labelFor = (question: Question) => question.label || question.question || question.text || keyFor(question)
const choiceLabel = (choice: Choice) => typeof choice === "string" ? choice : choice.label || choice.name || choice.value || ""

export default function SurveyForm() {
  const [categories, setCategories] = useState(defaultCategories)
  const [category, setCategory] = useState<Category | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [status, setStatus] = useState<"loading" | "ready" | "loading-questions" | "submitting" | "complete" | "error">("loading")
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/v1/test/survey/schema/").then(async (response) => {
      if (!response.ok) throw new Error("We could not load the survey.")
      return response.json()
    }).then((data) => {
      const available = data.categories || data.category_options || data.sections
      if (Array.isArray(available) && available.length) setCategories(available.map((item: any) => { const id = item.id || item.value; return { id, label: categoryLabels[id] || item.label || item.title || item.name || id, description: item.description || "" } }))
      setStatus("ready")
    }).catch((loadError) => { setError(loadError instanceof Error ? loadError.message : "We could not load the survey."); setStatus("error") })
  }, [])

  async function selectCategory(selected: Category) {
    setCategory(selected)
    setAnswers({})
    setQuestions([])
    setStatus("loading-questions")
    setError("")
    try {
      const response = await fetch(`/api/v1/test/survey/schema/?category=${encodeURIComponent(selected.id)}`)
      if (!response.ok) throw new Error("We could not load these questions.")
      const data = await response.json()
      setQuestions(data.category?.questions || [])
      setStatus("ready")
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "We could not load these questions.")
      setStatus("error")
    }
  }

  function setAnswer(key: string, value: Answer) { setAnswers((current) => ({ ...current, [key]: value })) }
  function toggleAnswer(key: string, value: string) { const current = Array.isArray(answers[key]) ? answers[key] as string[] : []; setAnswer(key, current.includes(value) ? current.filter((item) => item !== value) : [...current, value]) }
  async function submit() {
    setStatus("submitting"); setError("")
    try {
      const response = await fetch("/api/v1/test/survey/responses/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) })
      if (!response.ok) throw new Error("Your feedback could not be sent. Please try again.")
      setStatus("complete")
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Your feedback could not be sent."); setStatus("ready") }
  }

  if (status === "loading") return <SurveyShell><Loading text="Loading survey…" /></SurveyShell>
  if (status === "complete") return <SurveyShell><div className="mx-auto flex min-h-[390px] max-w-lg flex-col items-center justify-center text-center"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400 text-[#17124e]"><Check className="h-10 w-10" /></div><h1 className="mt-8 text-4xl font-black text-white">Thank you.</h1><p className="mt-4 text-lg leading-8 text-violet-100">Your anonymous feedback has been counted.</p><p className="mt-8 text-sm text-violet-200">No account required. We store only anonymous combined results, not individual responses.</p></div></SurveyShell>
  if (!category) return <SurveyShell><Intro categories={categories} error={error} onSelect={selectCategory} /></SurveyShell>
  if (status === "loading-questions") return <SurveyShell><Loading text={`Loading ${category.label} questions…`} /></SurveyShell>
  if (status === "error") return <SurveyShell><div className="rounded-3xl border border-rose-300/30 bg-rose-500/10 p-8 text-center text-rose-100">{error}<button type="button" onClick={() => { setCategory(null); setStatus("ready") }} className="mx-auto mt-5 block font-bold text-white underline">Choose another category</button></div></SurveyShell>
  return <SurveyShell><div className="mx-auto max-w-3xl"><button type="button" onClick={() => { setCategory(null); setQuestions([]); setAnswers({}) }} className="inline-flex items-center gap-2 text-sm font-bold text-violet-100 hover:text-white"><ChevronLeft className="h-4 w-4" /> Change category</button><p className="mt-8 text-xs font-black uppercase tracking-[.24em] text-cyan-200">{category.label}</p><h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Your feedback matters.</h1><section className="mt-8 rounded-[2rem] border border-white/10 bg-[#211b57]/80 p-6 shadow-2xl backdrop-blur sm:p-10"><div className="space-y-9">{questions.map((question) => <QuestionControl key={keyFor(question)} question={question} value={answers[keyFor(question)]} setAnswer={setAnswer} toggleAnswer={toggleAnswer} />)}</div>{!questions.length ? <p className="text-violet-100">There are no questions in this category yet.</p> : null}{error ? <p className="mt-6 text-sm text-rose-200">{error}</p> : null}<div className="mt-10 flex justify-end"><button type="button" onClick={submit} disabled={status === "submitting" || !questions.length} className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-black text-[#17124e] transition hover:bg-cyan-200 disabled:opacity-60">{status === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Submit feedback</button></div></section></div></SurveyShell>
}

function Intro({ categories, error, onSelect }: { categories: Category[]; error: string; onSelect: (category: Category) => void }) { return <div className="mx-auto max-w-4xl text-center"><p className="text-xs font-black uppercase tracking-[.24em] text-cyan-200">Anonymous community survey</p><h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">Which best describes you?</h1><p className="mx-auto mt-5 max-w-xl leading-7 text-violet-100">Choose a category to see the questions made for you. This choice is only used to load the form and is never submitted.</p>{error ? <p className="mt-6 text-rose-200">{error}</p> : null}<div className="mt-10 grid gap-4 text-left sm:grid-cols-2">{categories.map((item) => <button type="button" key={item.id} onClick={() => onSelect(item)} className="rounded-3xl border border-white/10 bg-[#211b57]/80 p-6 transition hover:-translate-y-1 hover:border-cyan-200/60 hover:bg-[#2a236b]"><h2 className="text-xl font-black text-white">{item.label}</h2><p className="mt-2 text-sm leading-6 text-violet-100">{item.description}</p></button>)}</div></div> }
function Loading({ text }: { text: string }) { return <div className="flex min-h-[360px] items-center justify-center gap-3 text-violet-100"><Loader2 className="h-5 w-5 animate-spin" /> {text}</div> }
function QuestionControl({ question, value, setAnswer, toggleAnswer }: { question: Question; value: Answer | undefined; setAnswer: (key: string, value: Answer) => void; toggleAnswer: (key: string, value: string) => void }) {
  const key = keyFor(question)
  const options = (question.options || question.choices || []).map(choiceLabel).filter(Boolean)
  const type = question.type?.toLowerCase() || "radio"
  const rating = type.includes("rating") || type.includes("scale")
  const ranking = type.includes("ranking")
  const multiple = type.includes("check") || type.includes("multi")
  const freeResponse = type.includes("text") || type.includes("open") || type.includes("comment") || type.includes("textarea")
  const choices = rating && !options.length ? ["1", "2", "3", "4", "5"] : options

  const rankedChoices = Array.isArray(value) && value.length ? value : choices
  const reorder = (from: string, to: string) => {
    const fromIndex = rankedChoices.indexOf(from)
    const toIndex = rankedChoices.indexOf(to)
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return
    const next = [...rankedChoices]
    next.splice(fromIndex, 1)
    next.splice(toIndex, 0, from)
    setAnswer(key, next)
  }

  return <fieldset><legend className="text-lg font-bold text-white">{labelFor(question)} {question.required ? <span className="text-cyan-200">*</span> : null}</legend>
    {freeResponse ? <textarea value={typeof value === "string" ? value : ""} onChange={(event) => setAnswer(key, event.target.value)} rows={4} className="mt-4 w-full resize-y rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-violet-200/60 focus:border-cyan-200" placeholder="Share your thoughts (optional)" /> : null}
    {rating ? <div className="mt-4 flex gap-3">{choices.map((choice) => <button type="button" key={choice} onClick={() => setAnswer(key, Number(choice))} className={`flex h-12 w-12 items-center justify-center rounded-2xl border font-black ${Number(value) === Number(choice) ? "border-cyan-200 bg-cyan-300 text-[#17124e]" : "border-white/15 bg-white/5 text-white"}`}>{choice}</button>)}</div> : null}
    {ranking ? <div className="mt-4 space-y-2"><p className="text-sm text-violet-100">Drag platforms into your preferred order.</p>{rankedChoices.map((choice, index) => <div key={choice} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", choice)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); reorder(event.dataTransfer.getData("text/plain"), choice) }} className="flex cursor-grab items-center gap-4 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white active:cursor-grabbing"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-300/15 text-xs font-black text-cyan-200">{index + 1}</span><span className="text-violet-200">⠿</span>{choice}</div>)}</div> : null}
    {!freeResponse && !rating && !ranking ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{choices.map((choice) => { const selected = multiple ? Array.isArray(value) && value.includes(choice) : value === choice; return <button type="button" key={choice} onClick={() => multiple ? toggleAnswer(key, choice) : setAnswer(key, choice)} className={`flex min-h-14 items-center gap-3 rounded-2xl border px-4 text-left text-sm font-semibold ${selected ? "border-cyan-200 bg-cyan-300/15 text-white" : "border-white/15 bg-white/5 text-violet-50"}`}><span className={`flex h-5 w-5 items-center justify-center border ${multiple ? "rounded-md" : "rounded-full"} ${selected ? "border-cyan-200 bg-cyan-300 text-[#17124e]" : "border-white/30"}`}>{selected ? <Check className="h-3.5 w-3.5" /> : null}</span>{choice}</button> })}</div> : null}
  </fieldset>
}
function SurveyShell({ children }: { children: React.ReactNode }) { return <div className="min-h-screen px-5 py-28 sm:px-8"><div className="mx-auto max-w-5xl"><div className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-violet-100"><LockKeyhole className="h-4 w-4 text-cyan-200" /> Anonymous by design</div>{children}</div></div> }
