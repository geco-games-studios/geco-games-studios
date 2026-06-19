"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, Loader2 } from "lucide-react"
import { persistAuthSession } from "@/lib/auth-session"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState("")

  useEffect(() => {
    const access = searchParams.get("access")
    const refresh = searchParams.get("refresh")
    const errorMessage = searchParams.get("error") || searchParams.get("message")

    if (errorMessage) {
      setError(errorMessage)
      return
    }

    if (!access) {
      setError("The sign in provider did not return a GECO access token.")
      return
    }

    persistAuthSession({
      access,
      refresh: refresh || undefined,
      account_type: searchParams.get("account_type") || "master",
      academy_sub_type: searchParams.get("academy_sub_type"),
      sub_user_type: searchParams.get("sub_user_type"),
      jampass_sub_type: searchParams.get("jampass_sub_type"),
      active_service: searchParams.get("active_service"),
      email: searchParams.get("email") || undefined,
      name: searchParams.get("name") || undefined,
    })

    router.replace("/select-service")
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 p-8 text-center shadow-2xl">
        {error ? (
          <>
            <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-300" />
            <h1 className="text-2xl font-bold">Sign in could not finish</h1>
            <p className="mt-3 text-sm text-slate-300">{error}</p>
            <Link
              href="/login"
              className="mt-6 inline-flex rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
            >
              Back to login
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-cyan-300" />
            <h1 className="text-2xl font-bold">Finishing sign in</h1>
            <p className="mt-3 text-sm text-slate-300">Connecting your GECO account across the ecosystem.</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 p-8 text-center shadow-2xl">
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-cyan-300" />
            <h1 className="text-2xl font-bold">Finishing sign in</h1>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}
