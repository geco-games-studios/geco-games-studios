"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle, CheckCircle, RefreshCcw } from "lucide-react"

export default function VerifyPhonePage() {
  const [otp, setOtp] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedPhone = localStorage.getItem("pendingPhoneVerification") || ""
    setPhone(storedPhone)
  }, [])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!otp.trim()) {
      setError("Please enter the verification code sent to your phone.")
      return
    }

    if (!phone) {
      setError("Phone number is missing. Please return to registration.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/verify-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp }),
      })

      let data: any = { message: "Verification failed. Please try again." }
      try {
        data = await response.json()
      } catch {
        data = { message: "Invalid response from verification service." }
      }

      if (!response.ok) {
        setError(data.message || "Verification failed. Please try again.")
        setIsLoading(false)
        return
      }

      setSuccess("Phone number verified successfully. Redirecting to login...")
      localStorage.removeItem("pendingPhoneVerification")
      setTimeout(() => {
        router.push("/login")
      }, 1400)
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setError("")
    setSuccess("")

    if (!phone) {
      setError("Phone number is missing. Please return to registration.")
      return
    }

    setIsResending(true)
    try {
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      })

      let data: any = { message: "Unable to resend the verification code." }
      try {
        data = await response.json()
      } catch {
        data = { message: "Invalid response from resend service." }
      }

      if (!response.ok) {
        setError(data.message || "Unable to resend the verification code.")
        return
      }

      setSuccess("A fresh verification code has been sent to your phone.")
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-indigo-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl dark:bg-slate-800/60 dark:border-slate-700/50">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300 shadow-lg shadow-cyan-500/10">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-white">Verify Your Phone</h1>
            <p className="mt-3 text-sm text-slate-300">
              Enter the OTP sent to your phone number to complete registration.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-5 border border-slate-400/10 mb-6 text-slate-200">
            <p className="text-sm">
              Verification code sent to:
            </p>
            <p className="mt-2 font-semibold text-white break-words">{phone || "No phone number available"}</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                One-time Passcode
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full rounded-2xl border border-slate-400/30 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-100">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Verify Phone
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-500/30 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCcw className="h-4 w-4" />
              {isResending ? "Resending..." : "Resend Code"}
            </button>
            <Link
              href="/register"
              className="text-sm font-medium text-cyan-300 hover:text-cyan-100"
            >
              Back to registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
