"use client"

import { useState, type FormEvent } from "react"

const learningPathOptions = [
  "Complete Game Developer",
  "Game Artist Specialist",
  "Indie Game Creator",
  "Custom Track",
]

const languageOptions = ["Javascript", "C++", "Java", "CSharp", "C"]

export default function AcademyPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [learningPath, setLearningPath] = useState(learningPathOptions[0])
  const [isDeveloper, setIsDeveloper] = useState("yes")
  const [languages, setLanguages] = useState<string[]>([])
  const [rolledOutProject, setRolledOutProject] = useState("no")
  const [unity, setUnity] = useState("no")
  const [unreal, setUnreal] = useState("no")
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const toggleLanguage = (language: string) => {
    setLanguages((current) =>
      current.includes(language) ? current.filter((item) => item !== language) : [...current, language]
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("sending")
    setMessage("")

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      learningPath,
      isDeveloper,
      languages,
      rolledOutProject,
      unity,
      unreal,
    }

    try {
      const response = await fetch("/api/academy-apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error?.message ?? "Unable to submit application")
      }

      setStatus("success")
      setMessage("Your application has been sent successfully. We will contact you shortly.")
      setFirstName("")
      setLastName("")
      setEmail("")
      setPhone("")
      setLearningPath(learningPathOptions[0])
      setIsDeveloper("yes")
      setLanguages([])
      setRolledOutProject("no")
      setUnity("no")
      setUnreal("no")
    } catch (error) {
      setStatus("error")
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while sending your application. Please try again later."
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <section className="bg-blue-950 text-white py-20 px-6 sm:px-10">
        <div className="container mx-auto grid gap-12 lg:grid-cols-[1.4fr_1fr] items-center">
          <div>
            <span className="inline-block rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-green-200">
              Academy Application
            </span>
            <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
              Join the Game Dev Academy
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Apply today for the academy program and get matched with an immersive learning path built for games, interactive experiences, and real-world production skills.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Program type</p>
                <p className="mt-3 text-2xl font-semibold">Practical game development</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Support</p>
                <p className="mt-3 text-2xl font-semibold">Mentorship + project reviews</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">
            <div className="mb-8 rounded-3xl bg-white p-6 text-slate-950 shadow-sm">
              <h2 className="text-2xl font-semibold">Apply for the Academy</h2>
              <p className="mt-2 text-sm text-slate-600">Complete the form below and submit your details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-slate-800">
                  First Name
                  <input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    type="text"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-800">
                  Last Name
                  <input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    type="text"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-slate-800">
                  Email Address
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-800">
                  Phone Number
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    type="tel"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm font-semibold text-slate-800">
                Learning Path
                <select
                  value={learningPath}
                  onChange={(event) => setLearningPath(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {learningPathOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="mb-4 text-base font-semibold uppercase tracking-[0.24em] text-slate-700">Basic Questions</h3>
                <div className="space-y-5">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-800">Are you a software developer?</p>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setIsDeveloper(option.value)}
                          className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                            isDeveloper === option.value
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-800">What languages are you familiar with?</p>
                    <div className="grid grid-cols-2 gap-3">
                      {languageOptions.map((language) => (
                        <button
                          key={language}
                          type="button"
                          onClick={() => toggleLanguage(language)}
                          className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                            languages.includes(language)
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                          }`}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-slate-800">Have you ever rolled out a full project?</p>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "No" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setRolledOutProject(option.value)}
                            className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                              rolledOutProject === option.value
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-slate-800">Do you know Unity 3D?</p>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "No" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setUnity(option.value)}
                            className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                              unity === option.value
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3 sm:col-span-2">
                      <p className="text-sm font-medium text-slate-800">Do you know Unreal?</p>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "No" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setUnreal(option.value)}
                            className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                              unreal === option.value
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {status !== "idle" && (
                <div className={`rounded-2xl p-4 text-sm ${status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "sending" ? "Sending application..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-10">
        <div className="container mx-auto grid gap-8 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-slate-950">Why the Academy?</h2>
            <p className="mt-4 text-slate-600 leading-7">
              Our academy puts real-world game development skills first. You'll learn through project-based training, expert mentorship, and team workflows used by studios.
            </p>
            <ul className="mt-8 space-y-4 text-slate-700">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <strong>Hands-on Projects</strong> - Ship playable game experiences while you learn.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <strong>Live Feedback</strong> - Get critique from developers and designers.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <strong>Career Focus</strong> - Build a portfolio-ready project list.
              </li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-slate-950">Paths to choose from</h3>
            <div className="mt-6 space-y-5">
              {learningPathOptions.slice(0, 3).map((path) => (
                <div key={path} className="rounded-3xl bg-slate-50 p-5">
                  <h4 className="font-semibold text-slate-900">{path}</h4>
                  <p className="mt-2 text-sm text-slate-600">A selective track to build your game development skills and portfolio.</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-slate-950">What we ask</h3>
            <ul className="mt-6 space-y-4 text-slate-700">
              <li>First name, last name, phone and email</li>
              <li>Preferred learning path</li>
              <li>Software development experience</li>
              <li>Languages you know and project history</li>
              <li>Unity 3D and Unreal familiarity</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
