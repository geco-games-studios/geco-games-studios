"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, AlertCircle, CheckCircle, Mail } from "lucide-react"
import Image from "next/image"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      })

      let data: any = { message: "Failed to process reset request." }
      try {
        data = await response.json()
      } catch {
        data = { message: "Invalid response from the server." }
      }

      if (!response.ok) {
        setError(data.message || "Failed to process reset request. Please try again.")
        setIsLoading(false)
        return
      }

      setIsSubmitted(true)
      setIsLoading(false)
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-indigo-900 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-8 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl dark:bg-slate-800/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-cyan-500/20">
          {/* Logo Section */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <Image
                src="/logo-dark.png"
                alt="GECO"
                width={48}
                height={48}
                className="object-contain filter brightness-0 invert"
              />
            </div>
          </div>

          {isSubmitted ? (
            <>
              {/* Success State */}
              <div className="text-center animate-fade-in">
                <div className="flex justify-center mb-6">
                  <CheckCircle className="h-16 w-16 text-green-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">
                  Check Your Email
                </h1>
                <p className="text-slate-300 mb-6">
                  We've sent a password reset link to{" "}
                  <span className="font-semibold text-cyan-400">{email}</span>
                </p>
                <p className="text-slate-400 text-sm mb-8">
                  Click the link in the email to reset your password. The link expires in 24 hours.
                </p>

                <div className="space-y-4">
                  <p className="text-slate-400 text-sm">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                    >
                      try another email
                    </button>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Form State */}
              <div className="mb-8 text-center animate-fade-in">
                <h1 className="text-3xl font-bold text-white mb-3">
                  Reset Password
                </h1>
                <p className="text-slate-300 text-sm">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in animation-delay-200">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-400/30 bg-white/10 backdrop-blur-sm pl-12 pr-4 py-3 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 dark:bg-slate-700/30 dark:border-slate-600/30 dark:focus:border-cyan-400"
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 flex items-start gap-3 animate-shake">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-200">
                      {error}
                    </p>
                  </div>
                )}

                {/* Reset Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/50 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>

                {/* Back to Login */}
                <div className="text-center pt-4">
                  <p className="text-slate-400 text-sm">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                    >
                      Back to Login
                    </Link>
                  </p>
                </div>
              </form>
            </>
          )}

          {/* Footer Text */}
          <p className="mt-6 text-center text-xs text-slate-400 border-t border-slate-400/20 pt-6">
            Need help?{" "}
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
              Contact Support
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}
