"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Mail, User, Phone, Globe, CheckCircle, XCircle, Clock, Award } from "lucide-react"
import { fetchJson, putJson } from "@/lib/api"

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czech Republic", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan",
  "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Madagascar", "Malawi", "Malaysia", "Maldives",
  "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
  "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Republic of the Congo", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
  "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
]

interface UserProfile {
  email: string
  name: string
  userId: string
  type: string
  date_joined?: string
  updated_at?: string
}

export default function DeveloperProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editError, setEditError] = useState("")
  const [editSuccess, setEditSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    country: "",
    website: "",
    bio: "",
  })
  const router = useRouter()

  useEffect(() => {
    fetchProfileData()
  }, [router])

  const fetchProfileData = async () => {
    try {
      setIsLoading(true)

      const userData = localStorage.getItem("currentUser")

      if (!userData) {
        router.push("/login")
        return
      }

      const parsedUser = JSON.parse(userData)

      // Only allow developer users
      if (parsedUser.type !== "developer") {
        router.push("/login")
        return
      }

      // Fetch profile from backend
      const userId = parsedUser.userId
      if (!userId) {
        throw new Error("User ID not found in session")
      }
      const profileData = await fetchJson<any>(`users/${userId}/`)
      
      const combinedUser = {
        ...parsedUser,
        ...profileData,
      }

      setUser(combinedUser)
      setFormData({
        name: profileData?.name || parsedUser.name || "",
        phone: profileData?.phone || "",
        country: profileData?.country || "",
        website: profileData?.website || "",
        bio: profileData?.bio || "",
      })
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching profile:", err)
      // Fall back to localStorage data if backend fetch fails
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setFormData({
          name: parsedUser.name || "",
          phone: parsedUser.phone || "",
          country: parsedUser.country || "",
          website: parsedUser.website || "",
          bio: parsedUser.bio || "",
        })
      } else {
        setError(`Failed to load profile data`)
      }
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/login")
  }

  const handleEditClick = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        country: user.country || "",
        website: user.website || "",
        bio: user.bio || "",
      })
      setEditError("")
      setEditSuccess("")
      setIsEditMode(true)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setEditError("")
      setEditSuccess("")
      setIsSaving(true)

      const userData = localStorage.getItem("currentUser")

      if (!userData) {
        setEditError("Session expired. Please login again.")
        setIsSaving(false)
        return
      }

      const parsedUser = JSON.parse(userData)
      const userId = parsedUser.userId

      if (!userId) {
        throw new Error("User ID not found in session")
      }

      // Prepare the profile update payload
      const profileUpdatePayload = {
        name: formData.name,
        phone: formData.phone,
        country: formData.country,
        website: formData.website,
        bio: formData.bio,
      }

      // Send profile update to backend
      await putJson(`users/${userId}/`, profileUpdatePayload)

      // Update local storage with new profile data
      const updatedUser = {
        ...parsedUser,
        name: formData.name,
        phone: formData.phone,
        country: formData.country,
        website: formData.website,
        bio: formData.bio,
      }

      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setEditSuccess("Profile updated successfully!")
      setIsEditMode(false)

      // Hide success message after 3 seconds
      setTimeout(() => setEditSuccess(""), 3000)
    } catch (err) {
      console.error("Error saving profile:", err)
      setEditError(`Error: ${err instanceof Error ? err.message : "Failed to save profile"}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditMode(false)
    setEditError("")
    setEditSuccess("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-red-200 border-t-red-600 animate-spin mx-auto mb-4"></div>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">No profile data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Developer Portal
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your Profile
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 border-t border-slate-200 dark:border-slate-800 pt-4 pb-0 -mb-px overflow-x-auto">
            <Link
              href="/developer/dashboard"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Dashboard
            </Link>
            <Link
              href="/developer/profile"
              className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm"
            >
              Profile
            </Link>
            <Link
              href="/developer/games"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              My Games
            </Link>
            <Link
              href="/developer/analytics"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Analytics
            </Link>
            <Link
              href="/developer/support"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Support
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 lg:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <div className="rounded-2xl bg-white shadow-lg dark:bg-slate-800 overflow-hidden mb-8">
            {/* Profile Header Background */}
            <div className="h-32 bg-gradient-to-r from-cyan-500 to-indigo-600"></div>

            {/* Profile Content */}
            <div className="px-8 pb-8">
              {/* Profile Avatar and Basic Info */}
              <div className="flex items-end gap-6 -mt-16 mb-8">
                <div className="h-32 w-32 rounded-2xl bg-cyan-100 dark:bg-cyan-900 border-4 border-white dark:border-slate-800 flex items-center justify-center text-4xl font-bold text-cyan-600 dark:text-cyan-400">
                  {user.name?.charAt(0).toUpperCase() || "D"}
                </div>
                <div className="mb-2">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </h1>
                  <p className="text-cyan-600 dark:text-cyan-400 font-semibold capitalize">
                    Developer
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Email */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <Mail className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Email</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{user.email}</p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <Phone className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Phone Number</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{user.phone || "Contact not set"}</p>
                  </div>
                </div>

                {/* Country */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <Globe className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Country</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{user.country || "Not set"}</p>
                  </div>
                </div>

                {/* Account Type */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <Award className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Account Type</p>
                    <p className="text-slate-900 dark:text-white font-semibold capitalize">
                      Developer
                    </p>
                  </div>
                </div>

                {/* Account Status */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Account Status</p>
                    <p className="text-green-700 dark:text-green-400 font-semibold">
                      Active
                    </p>
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Member Since</p>
                    <p className="text-slate-900 dark:text-white font-semibold">
                      2026
                    </p>
                  </div>
                </div>
              </div>

              {/* Website and Bio Section */}
              {(user.website || user.bio) && (
                <div className="mt-6 space-y-4">
                  {user.website && (
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                      <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">Website</p>
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                        {user.website}
                      </a>
                    </div>
                  )}
                  {user.bio && (
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                      <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">Bio</p>
                      <p className="text-slate-900 dark:text-white">{user.bio}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Edit Profile Button */}
              {!isEditMode ? (
                <button
                  onClick={handleEditClick}
                  className="w-full mt-8 rounded-lg bg-cyan-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="w-full mt-8">
                  {editError && (
                    <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-red-700 dark:text-red-400 text-sm">{editError}</p>
                    </div>
                  )}
                  {editSuccess && (
                    <div className="mb-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <p className="text-green-700 dark:text-green-400 text-sm">{editSuccess}</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Developer Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">Select a country</option>
                        {COUNTRIES.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Studio Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleFormChange}
                        placeholder="https://yourstudio.com"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleFormChange}
                        placeholder="Tell us about your studio..."
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex-1 rounded-lg bg-cyan-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 rounded-lg bg-slate-200 px-6 py-3 text-center font-semibold text-slate-900 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
