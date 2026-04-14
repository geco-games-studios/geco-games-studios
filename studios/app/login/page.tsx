"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Call backend API for authentication
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Authentication failed. Please check your credentials and try again.")
        setIsLoading(false)
        return
      }

      // Store user data in localStorage (in production, use secure session/token)
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email: data.user.email,
          type: data.user.type,
          name: data.user.name,
          userId: data.user.userId,
        })
      )

      // Redirect based on user type
      const redirectMap: { [key: string]: string } = {
        student: "/academy/dashboard",
        gamer: "/gamer/dashboard",
        customer: "/customer/dashboard",
      }

      const redirectPath = redirectMap[data.user.type] || "/"
      setIsLoading(false)
      router.push(redirectPath)
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
        {/* Login Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl dark:bg-slate-800/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-cyan-500/20">
          {/* Logo Section */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:scale-110 transition-transform duration-300">
              <Image
                src="/logo-dark.png"
                alt="GECO"
                width={48}
                height={48}
                className="object-contain filter brightness-0 invert"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center animate-fade-in animation-delay-100">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Sign in to access your personal dashboard and manage your gaming journey with GECO Studios
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6 animate-fade-in animation-delay-200">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-400/30 bg-white/10 backdrop-blur-sm px-4 py-3 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 dark:bg-slate-700/30 dark:border-slate-600/30 dark:focus:border-cyan-400"
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-400/30 bg-white/10 backdrop-blur-sm px-4 py-3 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 dark:bg-slate-700/30 dark:border-slate-600/30 dark:focus:border-cyan-400"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
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

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/50 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-400/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-slate-900 via-cyan-900 to-indigo-900 dark:bg-slate-800 text-slate-400">Or</span>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-400/20 bg-white/5 p-4 text-center">
              <p className="text-sm text-slate-300 mb-3">
                New to GECO Studios?
              </p>
              <Link
                href="/register"
                className="inline-block w-full rounded-lg border border-cyan-400/50 bg-cyan-400/10 hover:bg-cyan-400/20 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition-all duration-300 hover:border-cyan-400"
              >
                Create an Account
              </Link>
            </div>
          </div>

          {/* Footer Text */}
          <p className="mt-6 text-center text-xs text-slate-400">
            By signing in, you agree to our{" "}
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Privacy Policy</a>
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Need help?{" "}
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">Contact Support</a>
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
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  )
}
