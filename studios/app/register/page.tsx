"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Check, Calendar, Code, GraduationCap, Lock, ShoppingCart, Ticket, User } from "lucide-react"
import Image from "next/image"
import { COUNTRIES, ACCOUNT_TYPES, JAMPASS_SUB_TYPES, ACADEMY_SUB_TYPES } from "@/lib/countries"

const ACCOUNT_TYPE_ICONS: Record<string, React.ReactNode> = {
  cart: <ShoppingCart className="h-6 w-6" />,
  code: <Code className="h-6 w-6" />,
  ticket: <Ticket className="h-6 w-6" />,
  graduation: <GraduationCap className="h-6 w-6" />,
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    account_type: "jampass",
    jampass_sub_type: "player",
    academy_sub_type: "trainee",
    password: "",
    confirmPassword: "",
    phone_number: "",
    country: "ZM",
    date_of_birth: "",
    nrc_number: "",
    admin_key: "",
    agreeTerms: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [selectedType, setSelectedType] = useState("jampass")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Academy admins register with just name/email/password + an 8-digit key.
  const isAcademyAdmin = selectedType === "academy" && formData.academy_sub_type === "admin"

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

  const getRegistrationError = (data: any) => {
    if (typeof data?.message === "string") return data.message
    if (typeof data?.detail === "string") return data.detail

    if (data && typeof data === "object") {
      for (const [field, value] of Object.entries(data)) {
        if (Array.isArray(value) && value.length > 0) {
          return `${field}: ${value.join(", ")}`
        }

        if (typeof value === "string") {
          return `${field}: ${value}`
        }
      }
    }

    return "Registration failed. Please try again."
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    setFormData((prev) => {
      const nextState = {
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }

      if (name === "country") {
        const selectedCountry = COUNTRIES.find((c) => c.code === value)
        if (selectedCountry) {
          nextState.phone_number = selectedCountry.prefix
        }
      }

      return nextState
    })
  }

  const handleAccountTypeChange = (accountType: string) => {
    setSelectedType(accountType)
    setFormData((prev) => ({
      ...prev,
      account_type: accountType,
    }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.first_name.trim()) {
      setError("First name is required")
      return
    }

    if (!formData.last_name.trim()) {
      setError("Last name is required")
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

    if (isAcademyAdmin) {
      if (!/^\d{8}$/.test(formData.admin_key.trim())) {
        setError("Enter the 8-digit admin key to create an admin account")
        return
      }
    } else {
      if (!formData.phone_number.trim()) {
        setError("Phone number is required")
        return
      }

      if (!formData.country) {
        setError("Please select a country")
        return
      }

      if (!formData.date_of_birth) {
        setError("Date of birth is required")
        return
      }

      if (!formData.nrc_number.trim()) {
        setError("NRC number is required")
        return
      }
    }

    if (!formData.agreeTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setIsLoading(true)

    try {
      // Prepare payload for backend. Academy admins send only name/email/password
      // plus their 8-digit key; everyone else sends the full profile.
      const payload = isAcademyAdmin
        ? {
            email: formData.email,
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name,
            account_type: "academy",
            academy_sub_type: "admin",
            admin_key: formData.admin_key.trim(),
          }
        : {
            email: formData.email,
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name,
            account_type: formData.account_type,
            country: formData.country,
            phone_number: formData.phone_number,
            nrc_number: formData.nrc_number,
            date_of_birth: formData.date_of_birth,
            ...(formData.account_type === "jampass" && { jampass_sub_type: formData.jampass_sub_type }),
            ...(formData.account_type === "academy" && { academy_sub_type: formData.academy_sub_type }),
          }

      // Call backend API for registration
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      let data: any = { message: "Registration failed. Please try again." }
      try {
        data = await response.json()
      } catch (parseError) {
        data = { message: "Invalid response from the registration service." }
      }

      if (!response.ok) {
        setError(getRegistrationError(data))
        setIsLoading(false)
        return
      }

      const user = data?.user
      const currentUser = user
        ? {
            email: user.email,
            type: user.type,
            name: `${user.first_name} ${user.last_name}`,
            userId: user.userId,
          }
        : {
            email: formData.email,
            type: formData.account_type,
            name: `${formData.first_name} ${formData.last_name}`,
            userId: "",
          }

      localStorage.setItem("currentUser", JSON.stringify(currentUser))

      setIsLoading(false)
      if (isAcademyAdmin) {
        localStorage.removeItem("pendingPhoneVerification")
        router.push("/login")
        return
      }

      localStorage.setItem("pendingPhoneVerification", formData.phone_number)
      router.push("/register/verify")
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
              <video
                src={encodeURI("/logoAnimation1 .mp4")}
                aria-label="GECO animated logo"
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-contain"
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
              Account Type
            </label>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
              {ACCOUNT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleAccountTypeChange(type.value)}
                  className={`rounded-xl p-4 text-center transition border-2 ${
                    selectedType === type.value
                      ? "border-cyan-600 bg-cyan-50 dark:bg-cyan-900"
                      : "border-slate-300 bg-slate-50 hover:border-cyan-300 dark:border-slate-600 dark:bg-slate-700"
                  }`}
                >
                  <div className="mb-2 flex justify-center">{ACCOUNT_TYPE_ICONS[type.icon] ?? <User className="h-6 w-6" />}</div>
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

          {/* Sub-type Selection for JamPass */}
          {selectedType === "jampass" && (
            <div className="mb-6">
              <label htmlFor="jampass_sub_type" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                JamPass Type
              </label>
              <select
                id="jampass_sub_type"
                name="jampass_sub_type"
                value={formData.jampass_sub_type}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                {JAMPASS_SUB_TYPES.map((subType) => (
                  <option key={subType.value} value={subType.value}>
                    {subType.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sub-type Selection for Academy */}
          {selectedType === "academy" && (
            <div className="mb-6">
              <label htmlFor="academy_sub_type" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Academy Role
              </label>
              <select
                id="academy_sub_type"
                name="academy_sub_type"
                value={formData.academy_sub_type}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                {ACADEMY_SUB_TYPES.map((subType) => (
                  <option key={subType.value} value={subType.value}>
                    {subType.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Admin registration key gate */}
          {isAcademyAdmin && (
            <div className="mb-6 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-700/60 dark:bg-amber-900/20">
              <label className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                <Lock className="h-4 w-4" /> Admin Registration Key
              </label>
              <input
                type="text"
                name="admin_key"
                inputMode="numeric"
                maxLength={8}
                value={formData.admin_key}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-amber-300 bg-white px-4 py-3 tracking-[0.4em] text-center text-lg font-semibold text-slate-900 placeholder:tracking-normal placeholder:text-slate-400 focus:border-amber-500 focus:outline-none dark:border-amber-700 dark:bg-slate-700 dark:text-white"
                placeholder="8-digit key"
              />
              <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                Admin accounts require a one-time key for first registration. You won&apos;t need it again — afterwards you sign in with just your email and password.
              </p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="John"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Doe"
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

            {!isAcademyAdmin && (
              <>
                {/* Country and Phone Number */}
                <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
                  <div>
                    <label htmlFor="country" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      required
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name} ({country.prefix})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="phone_number" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone_number"
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="+260 978 516 926"
                      required
                    />
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Use the selected country code and enter the full phone number.
                    </p>
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="date_of_birth" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      id="date_of_birth"
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      required
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 dark:text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* NRC Number */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    NRC Number
                  </label>
                  <input
                    type="text"
                    name="nrc_number"
                    value={formData.nrc_number}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    placeholder="468133/74/1"
                  />
                </div>
              </>
            )}

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
                id="agreeTerms"
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600"
                required
              />
              <label htmlFor="agreeTerms" className="text-sm text-slate-600 dark:text-slate-400">
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
