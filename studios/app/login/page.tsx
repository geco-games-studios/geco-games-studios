"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"

// Mock user data - In production, this would come from your backend
const MOCK_USERS = {
  student: {
    email: "student@geco.com",
    password: "student123",
    type: "student",
    name: "Alex Studio",
    userId: "STU-001",
  },
  gamer: {
    email: "gamer@geco.com",
    password: "gamer123",
    type: "gamer",
    name: "Pro Player",
    userId: "GAM-001",
  },
  customer: {
    email: "customer@geco.com",
    password: "customer123",
    type: "customer",
    name: "John Buyer",
    userId: "CUS-001",
  },
}

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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check credentials against mock data
    let userType = null
    let redirectPath = ""

    for (const [key, user] of Object.entries(MOCK_USERS)) {
      if (user.email === email && user.password === password) {
        userType = user.type

        // Redirect based on user type
        switch (user.type) {
          case "student":
            redirectPath = "/academy/dashboard"
            break
          case "gamer":
            redirectPath = "/gamer/dashboard"
            break
          case "customer":
            redirectPath = "/customer/dashboard"
            break
        }

        // Store user data in localStorage (in production, use secure session/token)
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            email: user.email,
            type: user.type,
            name: user.name,
            userId: user.userId,
          })
        )

        setIsLoading(false)
        router.push(redirectPath)
        return
      }
    }

    setIsLoading(false)
    setError("Invalid email or password. Try: student@geco.com / student123")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-800">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Image
                src="/logo-dark.png"
                alt="GECO"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">
            Welcome to GECO
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Sign in to your account
          </p>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400"
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
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900 dark:text-red-200">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-cyan-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Demo Credentials (for testing):
            </p>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  👨‍🎓 Student/Academy
                </p>
                <p>student@geco.com / student123</p>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-600 pt-2">
                <p className="font-medium text-slate-900 dark:text-white">
                  🎮 Gamer
                </p>
                <p>gamer@geco.com / gamer123</p>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-600 pt-2">
                <p className="font-medium text-slate-900 dark:text-white">
                  🛒 Customer/Marketplace
                </p>
                <p>customer@geco.com / customer123</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-cyan-600 transition hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              Register here
            </Link>
          </p>
          <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-500">
            After registration, you'll receive login credentials via email
          </p>
        </div>
      </div>
    </div>
  )
}
