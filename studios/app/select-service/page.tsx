"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react"
import {
  GECO_SERVICES,
  type GecoService,
  getStoredUser,
  hasServiceProfile,
  persistAuthSession,
  setActiveService,
} from "@/lib/auth-session"

type ServiceState = "active" | "not_joined" | "unknown"

interface ServiceCard {
  service: GecoService
  state: ServiceState
}

export default function SelectServicePage() {
  const router = useRouter()
  const [cards, setCards] = useState<ServiceCard[]>([])
  const [loading, setLoading] = useState(true)
  const [busyService, setBusyService] = useState<string | null>(null)
  const [notice, setNotice] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const user = getStoredUser()

    if (!token || !user) {
      router.push("/login")
      return
    }

    const fallbackCards = GECO_SERVICES.map((service) => ({
      service,
      state: hasServiceProfile(user, service) ? "active" as const : "not_joined" as const,
    }))

    fetch("/api/auth/services", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Service registry unavailable")
        const data = await response.json()
        const remoteServices = Array.isArray(data.services) ? data.services : Array.isArray(data) ? data : []
        if (!remoteServices.length) return fallbackCards

        return GECO_SERVICES.map((service) => {
          const remote = remoteServices.find((item: any) => {
            const id = String(item.id || item.service_id || item.slug || item.service || "").toLowerCase()
            return id === service.id || id === service.id.replace("-", "_")
          })
          const status = String(remote?.status || remote?.state || "").toLowerCase()
          const active = ["active", "approved", "enabled"].includes(status) || remote?.active === true
          return { service, state: active ? "active" as const : "not_joined" as const }
        })
      })
      .then(setCards)
      .catch(() => {
        setNotice("Using your saved GECO account profile because the service registry is not available yet.")
        setCards(fallbackCards)
      })
      .finally(() => setLoading(false))
  }, [router])

  const activeCount = useMemo(() => cards.filter((card) => card.state === "active").length, [cards])

  async function selectService(card: ServiceCard) {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      router.push("/login")
      return
    }

    setBusyService(card.service.id)
    setNotice("")

    try {
      const endpoint = card.state === "active" ? "select" : "enroll"
      const response = await fetch(`/api/auth/services/${card.service.id}/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ service_id: card.service.id }),
      })

      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        if (data.access || data.user || data.current_user || data.profile) {
          persistAuthSession(data)
        }
      } else {
        setNotice(data.message || "Service permissions could not be refreshed from the server. Opening with your saved GECO session.")
      }
    } catch {
      setNotice("Service permissions could not be refreshed from the server. Opening with your saved GECO session.")
    } finally {
      setActiveService(card.service.id)
      setBusyService(null)
      router.push(card.service.dashboardPath)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
          Loading GECO services...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">GECO ecosystem</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Choose your service</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Your master GECO account stays signed in. Pick a service and we will load the matching profile,
              permissions, roles, and settings.
            </p>
          </div>
          <div className="rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
            {activeCount} active profile{activeCount === 1 ? "" : "s"}
          </div>
        </div>

        {notice && (
          <div className="mb-6 rounded-lg border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            {notice}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const content = (
              <>
                <div>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-200">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        card.state === "active"
                          ? "bg-emerald-400/15 text-emerald-200"
                          : "bg-slate-700 text-slate-200"
                      }`}
                    >
                      {card.state === "active" ? "Active profile" : "Available"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold">{card.service.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{card.service.description}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-semibold text-cyan-200">
                  <span>Enter service</span>
                  {busyService === card.service.id ? <Loader2 className="h-4 w-4 animate-spin" /> : card.state === "active" ? <CheckCircle2 className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </div>
              </>
            )

            return (
              <button
                key={card.service.id}
                type="button"
                onClick={() => selectService(card)}
                disabled={busyService === card.service.id}
                className="flex min-h-56 flex-col justify-between rounded-lg border border-white/15 bg-white/10 p-6 text-left transition hover:border-cyan-300/60 hover:bg-white/15 disabled:cursor-wait disabled:opacity-70"
              >
                {content}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
