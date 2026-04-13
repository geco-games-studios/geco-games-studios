"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Check } from "lucide-react"
import Image from "next/image"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    accountType: "customer",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [selectedType, setSelectedType] = useState("customer")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const accountTypes = [
    {
      value: "customer",
      label: "Customer",
      description: "Shop GECO merchandise",
      icon: "🛒",
    },
    {
      value: "student",
      label: "Student",
      description: "Learn game development",
      icon: "👨‍🎓",
    },
    {
      value: "gamer",
      label: "Gamer",
      description: "Track gaming stats & XP",
      icon: "🎮",
    },
  ]

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    }
    return requirements
  }

  const passwordRequirements = validatePassword(formData.password)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.name.trim()) {
      setError("Full name is required")
      return
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!formData.agreeTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setIsLoading(true)

    try {
      // Call backend API for registration
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          type: selectedType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.")
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

      // Redirect to appropriate dashboard
      const dashboardMap: { [key: string]: string } = {
        student: "/academy/dashboard",
        gamer: "/gamer/dashboard",
        customer: "/customer/dashboard",
      }

      setIsLoading(false)
      router.push(dashboardMap[selectedType] || "/")
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Card */}
        <div className="rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-800 sm:p-12">
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
            Join GECO
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Create your account to get started
          </p>

          {/* Account Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              I want to:
            </label>
            <div className="grid gap-3 grid-cols-3">
              {accountTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setSelectedType(type.value)
                    setFormData((prev) => ({
                      ...prev,
                      accountType: type.value,
                    }))
                  }}
                  className={`rounded-xl p-4 text-center transition border-2 ${
                    selectedType === type.value
                      ? "border-cyan-600 bg-cyan-50 dark:bg-cyan-900"
                      : "border-slate-300 bg-slate-50 hover:border-cyan-300 dark:border-slate-600 dark:bg-slate-700"
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">
                    {type.label}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
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

              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div
                      className={`flex items-center gap-2 ${
                        passwordRequirements.length
                          ? "text-green-600 dark:text-green-400"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                      At least 8 characters
                    </div>
                    <div
                      className={`flex items-center gap-2 ${
                        passwordRequirements.uppercase
                          ? "text-green-600 dark:text-green-400"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                      Uppercase letter
                    </div>
                    <div
                      className={`flex items-center gap-2 ${
                        passwordRequirements.lowercase
                          ? "text-green-600 dark:text-green-400"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                      Lowercase letter
                    </div>
                    <div
                      className={`flex items-center gap-2 ${
                        passwordRequirements.number
                          ? "text-green-600 dark:text-green-400"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                      Number
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword && (
                  <p className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    Passwords match
                  </p>
                )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600"
                required
              />
              <label className="text-sm text-slate-600 dark:text-slate-400">
                I agree to the{" "}
                <Link
                  href="#"
                  className="font-semibold text-cyan-600 transition hover:text-cyan-700 dark:text-cyan-400"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="font-semibold text-cyan-600 transition hover:text-cyan-700 dark:text-cyan-400"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900 dark:text-red-200">
                {error}
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-cyan-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-cyan-600 transition hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Info Section */}
        <div className="mt-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 text-white">
          <h3 className="font-semibold mb-4">Registration Note</h3>
          <p className="text-sm text-white/90">
            After registration, you'll receive an email confirmation. Admin will manually create your account and send you login credentials via email.
          </p>
        </div>
      </div>
    </div>
  )
}
