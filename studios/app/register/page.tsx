"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Check, Calendar, Code, Gamepad2, GraduationCap, Lock, Loader2, ShoppingCart, Ticket, Trophy, User } from "lucide-react"
import Image from "next/image"
import { COUNTRIES, ACCOUNT_TYPES, JAMPASS_SUB_TYPES, ACADEMY_SUB_TYPES } from "@/lib/countries"
import { persistAuthSession } from "@/lib/auth-session"

const ACCOUNT_TYPE_ICONS: Record<string, React.ReactNode> = {
  cart: <ShoppingCart className="h-5 w-5" />,
  code: <Code className="h-5 w-5" />,
  ticket: <Ticket className="h-5 w-5" />,
  graduation: <GraduationCap className="h-5 w-5" />,
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
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
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

  const continueToDetails = () => {
    setError("")
    if (!formData.first_name.trim()) return setError("First name is required")
    if (!formData.last_name.trim()) return setError("Last name is required")
    setCurrentStep(2)
  }

  const continueToConfirmation = () => {
    setError("")
    if (!formData.email.includes("@")) return setError("Please enter a valid email address")
    if (!isAcademyAdmin && !formData.phone_number.trim()) return setError("Phone number is required")
    if (!isAcademyAdmin && !formData.date_of_birth) return setError("Date of birth is required")
    setCurrentStep(3)
  }

  const handleFormSubmit = (event: React.FormEvent) => {
    if (currentStep === 1) {
      event.preventDefault()
      continueToDetails()
      return
    }
    if (currentStep === 2) {
      event.preventDefault()
      continueToConfirmation()
      return
    }
    handleSignup(event)
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

      if (data.access) {
        persistAuthSession(data, formData.email)
        localStorage.removeItem("pendingPhoneVerification")
        setIsLoading(false)
        router.push("/select-service")
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
    <main className="register-page relative min-h-screen overflow-hidden bg-[#2c196f] text-white">
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
            <h1 className="mt-10 text-4xl font-black leading-tight tracking-[-.03em] xl:text-5xl">Create one account for every GECO experience.</h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-violet-100/80">Play, build, compete, and learn across the GECO universe with a single account.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold"><Gamepad2 className="h-4 w-4 text-cyan-300" /> Developer</span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold"><Trophy className="h-4 w-4 text-amber-300" /> JamPass</span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold"><GraduationCap className="h-4 w-4 text-fuchsia-300" /> Academy</span>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-start justify-center px-4 py-10 sm:px-8 lg:px-14 lg:py-16 xl:px-20">
          <div className="w-full max-w-[960px] rounded-[2rem] border border-white/15 bg-white/[.09] p-6 shadow-[0_32px_100px_rgba(11,5,46,.45)] backdrop-blur-xl sm:p-10 xl:p-12">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white/5"><Image src="/logo-light.png" alt="Geco Games Studios" fill sizes="48px" className="object-contain p-1" /></div>
              <p className="text-lg font-black">GECO GAMES</p>
            </div>
            <p className="text-xs font-black uppercase tracking-[.28em] text-cyan-200">Start your journey</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.025em] sm:text-4xl">Create your account</h2>
            <p className="mt-3 text-sm leading-6 text-violet-100/70">Choose the GECO experience you want to begin with.</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-violet-100/60">Step {currentStep} of 3</p>
        {/* Card */}
          {currentStep === 1 && (
            <>
          {/* Account Type Selection */}
          <div className="mt-8 mb-8">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {ACCOUNT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleAccountTypeChange(type.value)}
                  title={type.description}
                  aria-label={`${type.label}: ${type.description}`}
                  className={`flex min-h-20 flex-col items-center justify-center rounded-xl border-2 p-3 text-center transition ${
                    selectedType === type.value
                      ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                      : "border-white/15 bg-white/[.04] hover:border-cyan-300/60 hover:bg-white/[.08]"
                  }`}
                >
                  <div className="mb-1.5">{ACCOUNT_TYPE_ICONS[type.icon] ?? <User className="h-5 w-5" />}</div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {type.label}
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
            </>
          )}

          {/* Admin registration key gate */}
          {currentStep === 3 && isAcademyAdmin && (
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
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {currentStep === 1 && (
              <>
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

              </>
            )}

            {currentStep === 2 && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white" placeholder="your@email.com" required />
              </div>
            )}

            {currentStep === 2 && !isAcademyAdmin && (
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

              </>
            )}

            {currentStep === 3 && !isAcademyAdmin && (
              <>
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

            {currentStep === 3 && (
              <>
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

            <div className="flex gap-3">
              <button type="button" onClick={() => { setError(""); setCurrentStep(2) }} disabled={isLoading} className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10">Back</button>
              <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-cyan-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900 dark:text-red-200">{error}</div>}
                <button type="submit" className="flex w-full items-center justify-center rounded-xl bg-cyan-200 px-6 py-3.5 text-sm font-black text-[#24125e] shadow-[0_12px_30px_rgba(103,232,249,.22)] transition hover:bg-white">Continue</button>
              </>
            )}
            {currentStep === 2 && (
              <>
                {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900 dark:text-red-200">{error}</div>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setError(""); setCurrentStep(1) }} className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10">Back</button>
                  <button type="button" onClick={continueToConfirmation} className="flex flex-1 items-center justify-center rounded-xl bg-cyan-200 px-6 py-3.5 text-sm font-black text-[#24125e] shadow-[0_12px_30px_rgba(103,232,249,.22)] transition hover:bg-white">Continue</button>
                </div>
              </>
            )}
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
        </section>
      </div>

      <style jsx>{`
        .register-page :global(label) { color: rgba(237, 233, 254, .9) !important; }
        .register-page :global(input), .register-page :global(select) { border-color: rgba(255, 255, 255, .15) !important; background: rgba(255, 255, 255, .06) !important; color: white !important; }
        .register-page :global(input::placeholder) { color: rgba(221, 214, 254, .4) !important; }
        .register-page :global(input:focus), .register-page :global(select:focus) { border-color: rgba(103, 232, 249, .7) !important; box-shadow: 0 0 0 4px rgba(103, 232, 249, .1) !important; }
        .register-page :global(select option) { background: #2c196f; color: white; }
        .register-page :global(.text-slate-900), .register-page :global(.text-slate-700), .register-page :global(.text-slate-600), .register-page :global(.text-slate-500), .register-page :global(.dark\\:text-slate-300), .register-page :global(.dark\\:text-slate-400) { color: rgba(237, 233, 254, .75) !important; }
        .register-page :global(.text-green-600), .register-page :global(.dark\\:text-green-400) { color: #86efac !important; }
        .register-page :global(.bg-red-50), .register-page :global(.dark\\:bg-red-900) { background: rgba(239, 68, 68, .12) !important; border: 1px solid rgba(252, 165, 165, .25); color: #fee2e2 !important; }
        .register-page :global(button[type=submit]) { background: #bff7fb !important; color: #24125e !important; box-shadow: 0 12px 30px rgba(103, 232, 249, .22); font-weight: 900; }
        .register-page :global(button[type=submit]:hover) { background: white !important; }
      `}</style>
    </main>
  )
}
