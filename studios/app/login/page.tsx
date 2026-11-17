"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, Apple, Chrome, Eye, EyeOff, Gamepad2, GraduationCap, Loader2, Trophy } from "lucide-react"
import { decodeJwt, persistAuthSession } from "@/lib/auth-session"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [socialProvider, setSocialProvider] = useState<string | null>(null)
  const router = useRouter()
  const nextPath = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("next")
  const destination = nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/select-service"

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      let data: any = { message: "Authentication failed. Please check your credentials and try again." }
      try { data = await response.json() } catch { data = { message: "Invalid response from authentication service." } }

      if (!response.ok) {
        setError(data.message || "Authentication failed. Please check your credentials and try again.")
        setIsLoading(false)
        return
      }

      const decodedToken = data.access ? decodeJwt(data.access) : null
      if (!decodedToken || decodedToken.token_type !== "access") {
        setError("Invalid access token returned from the server.")
        setIsLoading(false)
        return
      }

      persistAuthSession(data, email)
      setIsLoading(false)
      router.push(destination)
    } catch {
      setError("Network error. Please check your connection and try again.")
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: "google" | "facebook" | "apple") => {
    setError("")
    setSocialProvider(provider)
    window.location.href = `/api/auth/social/${provider}/start?next=${encodeURIComponent(destination)}`
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#2c196f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(43,221,225,.28),transparent_24%),radial-gradient(circle_at_88%_90%,rgba(136,73,232,.28),transparent_30%),linear-gradient(135deg,#311b79_0%,#3b237f_48%,#25145f_100%)]" />
      <div className="absolute -left-28 -top-32 h-[430px] w-[430px] rounded-full border-[42px] border-cyan-300/30 shadow-[inset_0_0_60px_rgba(10,10,60,.45),0_0_70px_rgba(34,211,238,.18)]" />
      <div className="absolute -left-16 -top-20 h-[300px] w-[430px] rotate-[20deg] rounded-[50%] border-[36px] border-violet-400/55 shadow-[0_20px_50px_rgba(6,4,40,.45)]" />
      <div className="absolute left-5 top-20 h-[160px] w-[390px] -rotate-[12deg] rounded-[50%] border-[30px] border-cyan-200/45 blur-[1px]" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1440px] lg:grid-cols-[.92fr_1.08fr]">
        <section className="relative hidden min-h-screen flex-col justify-end px-12 py-16 lg:flex xl:px-20 xl:py-20">
          <div className="max-w-lg">
            <Link href="/" className="inline-flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-white/5">
                <Image src="/logo-light.png" alt="Geco Games Studios" fill sizes="80px" className="object-contain p-1" priority />
              </div>
              <div>
                <p className="text-3xl font-black tracking-tight">GECO GAMES</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[.3em] text-cyan-200">Studios</p>
              </div>
            </Link>
            <h1 className="mt-10 text-4xl font-black leading-tight tracking-[-.03em] xl:text-5xl">One account. Every GECO experience.</h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-violet-100/80">Enter the worlds you play, the communities you compete with, and the skills you’re building.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold"><Gamepad2 className="h-4 w-4 text-cyan-300" /> Developer</span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold"><Trophy className="h-4 w-4 text-amber-300" /> JamPass</span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold"><GraduationCap className="h-4 w-4 text-fuchsia-300" /> Academy</span>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8 lg:px-14 xl:px-24">
          <div className="w-full max-w-[540px] rounded-[2rem] border border-white/15 bg-white/[.09] p-6 shadow-[0_32px_100px_rgba(11,5,46,.45)] backdrop-blur-xl sm:p-10 xl:p-12">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white/5"><Image src="/logo-light.png" alt="Geco Games Studios" fill sizes="48px" className="object-contain p-1" /></div>
              <p className="text-lg font-black">GECO GAMES</p>
            </div>
            <p className="text-xs font-black uppercase tracking-[.28em] text-cyan-200">Welcome back</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.025em] sm:text-4xl">Log in to your account</h2>
            <p className="mt-3 text-sm leading-6 text-violet-100/70">Continue to your GECO dashboard and connected services.</p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-bold text-violet-100">Your email</label>
                <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required disabled={isLoading} autoComplete="email" className="w-full rounded-xl border border-white/15 bg-white/[.06] px-4 py-3.5 text-white outline-none transition placeholder:text-violet-200/35 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10" />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-xs font-bold text-violet-100">Your password</label>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required disabled={isLoading} autoComplete="current-password" className="w-full rounded-xl border border-white/15 bg-white/[.06] px-4 py-3.5 pr-12 text-white outline-none transition placeholder:text-violet-200/35 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10" />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-200/60 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-violet-100/70"><input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/5 accent-cyan-300" /> Remember me</label>
                <Link href="/forgot-password" className="font-bold text-cyan-200 hover:text-white">Forgot password?</Link>
              </div>

              {error && <div className="flex gap-3 rounded-xl border border-red-300/20 bg-red-500/10 p-4"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" /><p className="text-sm text-red-100">{error}</p></div>}

              <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 px-6 py-3.5 text-sm font-black text-[#24125e] shadow-[0_12px_30px_rgba(103,232,249,.22)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}{isLoading ? "Signing in..." : "Log in"}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4"><span className="h-px flex-1 bg-white/10" /><span className="text-[11px] font-bold uppercase tracking-wider text-violet-100/50">or continue with</span><span className="h-px flex-1 bg-white/10" /></div>
            <div className="grid grid-cols-3 gap-3">
              {([
                ["google", Chrome, "Google"],
                ["facebook", Gamepad2, "Facebook"],
                ["apple", Apple, "Apple"],
              ] as const).map(([provider, Icon, label]) => (
                <button key={provider} type="button" onClick={() => handleSocialLogin(provider)} disabled={isLoading || Boolean(socialProvider)} className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-xs font-bold transition hover:bg-white/10 disabled:opacity-50">
                  {socialProvider === provider ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}<span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-violet-100/65">Don’t have an account?</p>
            <Link href="/register" className="mt-3 flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10">Create an account</Link>
            <p className="mt-7 text-center text-[11px] leading-5 text-violet-100/45">By continuing, you agree to our <Link href="/support/terms" className="text-violet-100/75 hover:text-white">Terms</Link> and <Link href="/support/privacy" className="text-violet-100/75 hover:text-white">Privacy Policy</Link>.</p>
          </div>
        </section>
      </div>
    </main>
  )
}
