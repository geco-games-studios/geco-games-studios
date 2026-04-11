"use client"

import { useState } from "react"
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface NewsletterSubscriptionProps {
  variant?: "default" | "compact" | "hero"
  className?: string
}

export default function NewsletterSubscription({ variant = "default", className = "" }: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [preferences, setPreferences] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  const availablePreferences = [
    "Game Development Updates",
    "Industry Insights",
    "Technical Tutorials",
    "Community Stories",
    "Event Announcements",
    "Product Launches"
  ]

  const handlePreferenceChange = (preference: string, checked: boolean) => {
    if (checked) {
      setPreferences([...preferences, preference])
    } else {
      setPreferences(preferences.filter(p => p !== preference))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")
    setMessageType("")

    try {
      const response = await fetch("/api/newsletter-subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          preferences: preferences.length > 0 ? preferences : undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessageType("success")
        setMessage(data.message)
        setEmail("")
        setFirstName("")
        setLastName("")
        setPreferences([])
      } else {
        setMessageType("error")
        setMessage(data.message || "Something went wrong. Please try again.")
      }
    } catch (error) {
      setMessageType("error")
      setMessage("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (variant === "compact") {
    return (
      <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/20">
            <Mail className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Stay updated</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Get the latest from our studio</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-4 flex items-center gap-2 text-sm ${
            messageType === "success"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}>
            {messageType === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{message}</span>
          </div>
        )}
      </div>
    )
  }

  if (variant === "hero") {
    return (
      <div className={`rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl ${className}`}>
        <h3 className="text-2xl font-semibold text-white mb-2">Subscribe to our newsletter</h3>
        <p className="text-white/80 mb-6">Get weekly insights, updates, and exclusive content from our studio.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name (optional)"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name (optional)"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            ) : (
              "Subscribe now"
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-4 flex items-center gap-2 text-sm ${
            messageType === "success"
              ? "text-green-400"
              : "text-red-400"
          }`}>
            {messageType === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{message}</span>
          </div>
        )}
      </div>
    )
  }

  // Default variant - full featured
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      <div className="text-center mb-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 dark:bg-violet-900/20">
          <Mail className="h-8 w-8 text-violet-600 dark:text-violet-400" />
        </div>
        <h3 className="mt-4 text-2xl font-semibold">Subscribe to our newsletter</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Get the latest updates, insights, and exclusive content from Geco Games Studios.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name (optional)"
            className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name (optional)"
            className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
        />

        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            What topics interest you? (optional)
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {availablePreferences.map((preference) => (
              <label key={preference} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={preferences.includes(preference)}
                  onChange={(e) => handlePreferenceChange(preference, e.target.checked)}
                  className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 dark:border-slate-600 dark:bg-slate-800"
                />
                <span className="text-slate-600 dark:text-slate-400">{preference}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          ) : (
            "Subscribe to newsletter"
          )}
        </button>
      </form>

      {message && (
        <div className={`mt-6 flex items-center gap-2 text-sm ${
          messageType === "success"
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}>
          {messageType === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{message}</span>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  )
}