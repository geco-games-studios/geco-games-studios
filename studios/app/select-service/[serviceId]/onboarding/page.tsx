"use client"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { GECO_SERVICES, persistAuthSession, setActiveService } from "@/lib/auth-session"

export default function ServiceOnboardingPage() {
  const router = useRouter()
  const params = useParams<{ serviceId: string }>()
  const [goal, setGoal] = useState("")
  const [experience, setExperience] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const service = useMemo(
    () => GECO_SERVICES.find((item) => item.id === params.serviceId),
    [params.serviceId]
  )

  async function submitOnboarding(event: React.FormEvent) {
    event.preventDefault()
    if (!service) return

    const token = localStorage.getItem("accessToken")
    if (!token) {
      router.push("/login")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/auth/services/${service.id}/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: service.id,
          goal,
          experience,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data.message || "Could not create this service profile yet.")
        return
      }

      if (data.access || data.user || data.current_user || data.profile) persistAuthSession(data)
      setActiveService(service.id)
      router.push(service.dashboardPath)
    } catch {
      setError("Network error while creating the service profile.")
    } finally {
      setLoading(false)
    }
  }

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="max-w-md rounded-lg border border-white/15 bg-white/10 p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-300" />
          <h1 className="text-2xl font-bold">Service not found</h1>
          <Link href="/select-service" className="mt-6 inline-flex text-sm font-semibold text-cyan-300">
            Back to services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/select-service" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
          <ArrowLeft className="h-4 w-4" />
          Back to services
        </Link>

        <div className="rounded-lg border border-white/15 bg-white/10 p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Brief onboarding</p>
          <h1 className="mt-4 text-3xl font-bold">Join {service.name}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            We will use your master GECO account details and create only a service profile for this area.
          </p>

          {error && (
            <div className="mt-6 rounded-lg border border-red-300/25 bg-red-400/10 p-4 text-sm text-red-100">
              {error}
            </div>
          )}

          <form onSubmit={submitOnboarding} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">What do you want to do here?</label>
              <textarea
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                className="min-h-28 w-full rounded-lg border border-white/20 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
                placeholder="Example: learn Unity, submit a game, join tournaments..."
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Experience level</label>
              <select
                value={experience}
                onChange={(event) => setExperience(event.target.value)}
                className="w-full rounded-lg border border-white/20 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
                required
              >
                <option value="">Select one</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="organization">Organization or team</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-600 disabled:cursor-wait disabled:opacity-70"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create service profile
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
