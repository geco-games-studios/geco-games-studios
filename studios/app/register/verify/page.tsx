"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle, Loader2, RefreshCcw, Smartphone } from "lucide-react"

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
    <main className="relative min-h-screen overflow-hidden bg-[#2c196f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(43,221,225,.28),transparent_24%),radial-gradient(circle_at_88%_90%,rgba(136,73,232,.28),transparent_30%),linear-gradient(135deg,#311b79_0%,#3b237f_48%,#25145f_100%)]" />
      <div className="absolute -left-28 -top-32 h-[430px] w-[430px] rounded-full border-[42px] border-cyan-300/30 shadow-[inset_0_0_60px_rgba(10,10,60,.45),0_0_70px_rgba(34,211,238,.18)]" />
      <div className="absolute -left-16 -top-20 h-[300px] w-[430px] rotate-[20deg] rounded-[50%] border-[36px] border-violet-400/55 shadow-[0_20px_50px_rgba(6,4,40,.45)]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-[540px] rounded-[2rem] border border-white/15 bg-white/[.09] p-6 shadow-[0_32px_100px_rgba(11,5,46,.45)] backdrop-blur-xl sm:p-10">
          <Link href="/" className="mb-8 flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white/5">
              <Image src="/logo-light.png" alt="Geco Games Studios" fill sizes="48px" className="object-contain p-1" priority />
            </div>
            <p className="text-lg font-black">GECO GAMES</p>
          </Link>

          <div className="mb-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-cyan-200">
              <Smartphone className="h-7 w-7" />
            </div>
            <p className="text-xs font-black uppercase tracking-[.28em] text-cyan-200">Secure verification</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-.025em] sm:text-4xl">Verify your phone</h1>
            <p className="mt-3 text-sm leading-6 text-violet-100/70">Enter the one-time passcode we sent to complete your registration.</p>
          </div>

          <div className="mb-6 rounded-xl border border-white/15 bg-white/[.06] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-100/55">Code sent to</p>
            <p className="mt-2 break-words text-sm font-bold text-white">{phone || "No phone number available"}</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label htmlFor="otp" className="mb-2 block text-xs font-bold text-violet-100">One-time passcode</label>
              <input id="otp" type="text" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit code" className="w-full rounded-xl border border-white/15 bg-white/[.06] px-4 py-3.5 text-center text-lg font-bold tracking-[.35em] text-white outline-none transition placeholder:text-left placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-violet-200/35 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10" maxLength={6} required />
            </div>

            {error && <div className="rounded-xl border border-red-300/20 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>}
            {success && <div className="flex gap-3 rounded-xl border border-emerald-300/20 bg-emerald-500/10 p-4 text-sm text-emerald-100"><CheckCircle className="h-5 w-5 shrink-0" />{success}</div>}

            <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 px-6 py-3.5 text-sm font-black text-[#24125e] shadow-[0_12px_30px_rgba(103,232,249,.22)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Verifying..." : "Verify phone"}
            </button>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={handleResend} disabled={isResending} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">
              <RefreshCcw className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
              {isResending ? "Resending..." : "Resend code"}
            </button>
            <Link href="/register" className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-cyan-200 transition hover:bg-white/5 hover:text-white">Back to registration</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
