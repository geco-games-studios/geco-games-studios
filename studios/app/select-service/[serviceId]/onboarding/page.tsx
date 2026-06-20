"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { AlertCircle, Loader2 } from "lucide-react"
import { GECO_SERVICES, persistAuthSession, setActiveService } from "@/lib/auth-session"

export default function ServiceOnboardingPage() {
  const router = useRouter()
  const params = useParams<{ serviceId: string }>()
  const [error, setError] = useState("")

  const service = useMemo(
    () => GECO_SERVICES.find((item) => item.id === params.serviceId),
    [params.serviceId]
  )

  useEffect(() => {
    async function enterService() {
      if (!service) return

      const token = localStorage.getItem("accessToken")
      if (!token) {
        router.push("/login")
        return
      }

      setError("")

      try {
        const response = await fetch(`/api/auth/services/${service.id}/enroll`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ service_id: service.id }),
        })

        const data = await response.json().catch(() => ({}))
        if (response.ok && (data.access || data.user || data.current_user || data.profile)) {
          persistAuthSession(data)
        }

        setActiveService(service.id)
        router.replace(service.dashboardPath)
      } catch {
        setError("Network error while opening this service.")
      }
    }

    enterService()
  }, [router, service])

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
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-lg border border-white/15 bg-white/10 p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">GECO service</p>
        <h1 className="mt-4 text-3xl font-bold">Opening {service.name}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Your master GECO account stays signed in while we load this service profile.
        </p>

        {error ? (
          <div className="mt-6 rounded-lg border border-red-300/25 bg-red-400/10 p-4 text-sm text-red-100">
            {error}
          </div>
        ) : (
          <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-cyan-100">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading dashboard...
          </div>
        )}
      </div>
    </div>
  )
}
