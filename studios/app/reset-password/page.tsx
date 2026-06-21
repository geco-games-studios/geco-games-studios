"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!token) {
      setError("This reset link is missing its token. Please request a new reset link.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reset_token: token,
          new_password: password,
          confirm_password: confirmPassword,
        }),
      })
      const data = await response.json().catch(() => ({ message: "Invalid response from the server." }))

      if (!response.ok) {
        setError(data.message || "Could not reset your password. Please request a new reset link.")
        return
      }

      setSuccess(data.message || "Password reset successfully. You can now sign in.")
      window.setTimeout(() => router.push("/login"), 1800)
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-indigo-900 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-8 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl dark:bg-slate-800/50 dark:border-slate-700/50">
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/50">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold text-white">Create New Password</h1>
            <p className="text-sm text-slate-300">Enter a new password for your GECO account.</p>
          </div>

          {!token && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
              This reset link is missing its token. Please request a new reset link.
            </div>
          )}

          {success ? (
            <div className="text-center">
              <CheckCircle className="mx-auto mb-4 h-14 w-14 text-green-400" />
              <p className="text-sm text-slate-200">{success}</p>
              <Link href="/login" className="mt-6 inline-flex rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-slate-400/30 bg-white/10 px-4 py-3 pr-12 text-white placeholder:text-slate-400 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    disabled={isLoading || !token}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                    disabled={isLoading || !token}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-lg border border-slate-400/30 bg-white/10 px-4 py-3 pr-12 text-white placeholder:text-slate-400 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                    placeholder="Repeat your new password"
                    required
                    minLength={8}
                    disabled={isLoading || !token}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                    disabled={isLoading || !token}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !token}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-cyan-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>

              <p className="pt-2 text-center text-sm text-slate-400">
                Need a new link?{" "}
                <Link href="/forgot-password" className="font-semibold text-cyan-400 transition hover:text-cyan-300">
                  Request another
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
