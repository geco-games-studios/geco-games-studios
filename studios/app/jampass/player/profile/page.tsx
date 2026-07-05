"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Award, CheckCircle, Globe, Mail, Phone, Save, User } from "lucide-react"
import { COUNTRIES } from "@/lib/countries"
import { getApiUrl } from "@/lib/api"

interface PlayerProfile {
  id?: string | number
  userId?: string
  user_id?: string | number
  email?: string
  name?: string
  first_name?: string
  middle_name?: string | null
  last_name?: string
  phone?: string
  phone_number?: string
  country?: string
  username?: string
  type?: string
  account_type?: string
  sub_user_type?: string
  jampass_sub_type?: string
  date_joined?: string
}

interface ProfileForm {
  name: string
  first_name: string
  middle_name: string
  last_name: string
  phone_number: string
  country: string
}

function getDisplayName(profile: PlayerProfile | null) {
  if (!profile) return ""
  return (
    profile.name ||
    [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(" ") ||
    profile.email ||
    "JamPass Player"
  )
}

function getPhone(profile: PlayerProfile | null) {
  return profile?.phone_number || profile?.phone || ""
}

function getUserId(profile: PlayerProfile | null) {
  return profile?.userId || profile?.user_id || profile?.id || ""
}

function isJamPassPlayer(profile: PlayerProfile) {
  const type = String(profile.type || profile.account_type || "").toLowerCase()
  const subType = String(profile.sub_user_type || profile.jampass_sub_type || "").toLowerCase()
  return type === "jampass" || type === "player" || subType === "player"
}

export default function JamPassPlayerProfilePage() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    phone_number: "",
    country: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const countryName = useMemo(() => {
    if (!profile?.country) return "Not set"
    return COUNTRIES.find((country) => country.code === profile.country || country.name === profile.country)?.name || profile.country
  }, [profile?.country])

  const populateForm = (nextProfile: PlayerProfile) => {
    setForm({
      name: getDisplayName(nextProfile),
      first_name: nextProfile.first_name || "",
      middle_name: nextProfile.middle_name || "",
      last_name: nextProfile.last_name || "",
      phone_number: getPhone(nextProfile),
      country: nextProfile.country || "",
    })
  }

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      setError("")

      const token = localStorage.getItem("accessToken")
      const storedUser = localStorage.getItem("currentUser")

      if (!token || !storedUser) {
        router.push("/login")
        return
      }

      const sessionUser = JSON.parse(storedUser) as PlayerProfile
      if (!isJamPassPlayer(sessionUser)) {
        router.push("/login")
        return
      }

      const userId = getUserId(sessionUser)
      if (!userId) {
        throw new Error("User ID not found in your session.")
      }

      const response = await fetch(getApiUrl(`users/${userId}/`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || data?.detail || `Failed to load profile: ${response.status}`)
      }

      const remoteProfile = (await response.json()) as PlayerProfile
      const combinedProfile = { ...sessionUser, ...remoteProfile }
      setProfile(combinedProfile)
      populateForm(combinedProfile)
      localStorage.setItem("currentUser", JSON.stringify(combinedProfile))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load profile."
      setError(message)

      const storedUser = localStorage.getItem("currentUser")
      if (storedUser) {
        const sessionUser = JSON.parse(storedUser) as PlayerProfile
        setProfile(sessionUser)
        populateForm(sessionUser)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const updateForm = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setError("")
      setSuccess("")

      if (!form.name.trim() && !form.first_name.trim() && !form.last_name.trim()) {
        setError("Please enter your name before saving.")
        return
      }

      const token = localStorage.getItem("accessToken")
      if (!token || !profile) {
        setError("Session expired. Please log in again.")
        return
      }

      const userId = getUserId(profile)
      if (!userId) {
        setError("User ID not found in your session.")
        return
      }

      setIsSaving(true)
      const displayName = form.name.trim() || [form.first_name, form.last_name].filter(Boolean).join(" ")
      const payload = {
        name: displayName,
        first_name: form.first_name.trim(),
        middle_name: form.middle_name.trim() || null,
        last_name: form.last_name.trim(),
        phone_number: form.phone_number.trim(),
        country: form.country,
      }

      const response = await fetch(getApiUrl(`users/${userId}/`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || data?.detail || `Failed to update profile: ${response.status}`)
      }

      const savedProfile = (await response.json()) as PlayerProfile
      const nextProfile = {
        ...profile,
        ...payload,
        ...savedProfile,
        name: savedProfile.name || payload.name,
        phone_number: savedProfile.phone_number || payload.phone_number,
        phone: savedProfile.phone || payload.phone_number,
      }

      setProfile(nextProfile)
      populateForm(nextProfile)
      localStorage.setItem("currentUser", JSON.stringify(nextProfile))
      setSuccess("Account details updated.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="container mx-auto px-4 py-10 lg:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                JamPass Player
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                Account Details
              </h2>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-500 dark:hover:bg-cyan-400"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
              {success}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-3xl font-bold text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200">
                  {getDisplayName(profile).charAt(0).toUpperCase() || "P"}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-2xl font-bold text-slate-900 dark:text-white">
                    {getDisplayName(profile)}
                  </h3>
                  <p className="truncate text-sm text-slate-600 dark:text-slate-400">{profile?.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
                  <Mail className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Email</p>
                    <p className="truncate font-semibold text-slate-900 dark:text-white">{profile?.email || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
                  <Phone className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Phone</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{getPhone(profile) || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
                  <Globe className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Country</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{countryName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
                  <Award className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Account</p>
                    <p className="font-semibold text-slate-900 dark:text-white">Active Player</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Status</p>
                    <p className="font-semibold text-green-700 dark:text-green-300">Ready to play</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Display Name</span>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={form.name}
                      onChange={(event) => updateForm("name", event.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-cyan-900"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</span>
                  <input
                    value={form.first_name}
                    onChange={(event) => updateForm("first_name", event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-cyan-900"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Middle Name</span>
                  <input
                    value={form.middle_name}
                    onChange={(event) => updateForm("middle_name", event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-cyan-900"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</span>
                  <input
                    value={form.last_name}
                    onChange={(event) => updateForm("last_name", event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-cyan-900"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</span>
                  <input
                    type="tel"
                    value={form.phone_number}
                    onChange={(event) => updateForm("phone_number", event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-cyan-900"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Country</span>
                  <select
                    value={form.country}
                    onChange={(event) => updateForm("country", event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-cyan-900"
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.prefix})
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
