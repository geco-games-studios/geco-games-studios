"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getApiUrl } from "@/lib/api"
import { LogOut, Mail, User, Calendar, MapPin, Phone, CreditCard, Award, CheckCircle, XCircle, Clock } from "lucide-react"

// Countries list
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

// Country code to name mapping
const COUNTRY_CODES: { [key: string]: string } = {
  "AF": "Afghanistan", "AL": "Albania", "DZ": "Algeria", "AD": "Andorra", "AO": "Angola", "AR": "Argentina",
  "AM": "Armenia", "AU": "Australia", "AT": "Austria", "AZ": "Azerbaijan", "BS": "Bahamas", "BH": "Bahrain",
  "BD": "Bangladesh", "BB": "Barbados", "BY": "Belarus", "BE": "Belgium", "BZ": "Belize", "BJ": "Benin",
  "BT": "Bhutan", "BO": "Bolivia", "BA": "Bosnia and Herzegovina", "BW": "Botswana", "BR": "Brazil",
  "BN": "Brunei", "BG": "Bulgaria", "BF": "Burkina Faso", "BI": "Burundi", "KH": "Cambodia", "CM": "Cameroon",
  "CA": "Canada", "CV": "Cape Verde", "CF": "Central African Republic", "TD": "Chad", "CL": "Chile",
  "CN": "China", "CO": "Colombia", "KM": "Comoros", "CG": "Congo", "CR": "Costa Rica", "HR": "Croatia",
  "CU": "Cuba", "CY": "Cyprus", "CZ": "Czech Republic", "DK": "Denmark", "DJ": "Djibouti", "DM": "Dominica",
  "DO": "Dominican Republic", "TL": "East Timor", "EC": "Ecuador", "EG": "Egypt", "SV": "El Salvador",
  "GQ": "Equatorial Guinea", "ER": "Eritrea", "EE": "Estonia", "ET": "Ethiopia", "FJ": "Fiji", "FI": "Finland",
  "FR": "France", "GA": "Gabon", "GM": "Gambia", "GE": "Georgia", "DE": "Germany", "GH": "Ghana", "GR": "Greece",
  "GD": "Grenada", "GT": "Guatemala", "GN": "Guinea", "GW": "Guinea-Bissau", "GY": "Guyana", "HT": "Haiti",
  "HN": "Honduras", "HK": "Hong Kong", "HU": "Hungary", "IS": "Iceland", "IN": "India", "ID": "Indonesia",
  "IR": "Iran", "IQ": "Iraq", "IE": "Ireland", "IL": "Israel", "IT": "Italy", "CI": "Ivory Coast", "JM": "Jamaica",
  "JP": "Japan", "JO": "Jordan", "KZ": "Kazakhstan", "KE": "Kenya", "KI": "Kiribati", "XK": "Kosovo",
  "KW": "Kuwait", "KG": "Kyrgyzstan", "LA": "Laos", "LV": "Latvia", "LB": "Lebanon", "LS": "Lesotho",
  "LR": "Liberia", "LY": "Libya", "LI": "Liechtenstein", "LT": "Lithuania", "LU": "Luxembourg", "MO": "Macao",
  "MG": "Madagascar", "MW": "Malawi", "MY": "Malaysia", "MV": "Maldives", "ML": "Mali", "MT": "Malta",
  "MH": "Marshall Islands", "MR": "Mauritania", "MU": "Mauritius", "MX": "Mexico", "FM": "Micronesia",
  "MD": "Moldova", "MC": "Monaco", "MN": "Mongolia", "ME": "Montenegro", "MA": "Morocco", "MZ": "Mozambique",
  "MM": "Myanmar", "NA": "Namibia", "NR": "Nauru", "NP": "Nepal", "NL": "Netherlands", "NZ": "New Zealand",
  "NI": "Nicaragua", "NE": "Niger", "NG": "Nigeria", "KP": "North Korea", "MK": "North Macedonia", "NO": "Norway",
  "OM": "Oman", "PK": "Pakistan", "PW": "Palau", "PS": "Palestine", "PA": "Panama", "PG": "Papua New Guinea",
  "PY": "Paraguay", "PE": "Peru", "PH": "Philippines", "PL": "Poland", "PT": "Portugal", "QA": "Qatar",
  "CD": "Republic of the Congo", "RO": "Romania", "RU": "Russia", "RW": "Rwanda", "KN": "Saint Kitts and Nevis",
  "LC": "Saint Lucia", "VC": "Saint Vincent and the Grenadines", "WS": "Samoa", "SM": "San Marino",
  "ST": "Sao Tome and Principe", "SA": "Saudi Arabia", "SN": "Senegal", "RS": "Serbia", "SC": "Seychelles",
  "SL": "Sierra Leone", "SG": "Singapore", "SK": "Slovakia", "SI": "Slovenia", "SB": "Solomon Islands",
  "SO": "Somalia", "ZA": "South Africa", "KR": "South Korea", "SS": "South Sudan", "ES": "Spain",
  "LK": "Sri Lanka", "SD": "Sudan", "SR": "Suriname", "SE": "Sweden", "CH": "Switzerland", "SY": "Syria",
  "TW": "Taiwan", "TJ": "Tajikistan", "TZ": "Tanzania", "TH": "Thailand", "TG": "Togo", "TO": "Tonga",
  "TT": "Trinidad and Tobago", "TN": "Tunisia", "TR": "Turkey", "TM": "Turkmenistan", "TV": "Tuvalu",
  "UG": "Uganda", "UA": "Ukraine", "AE": "United Arab Emirates", "GB": "United Kingdom", "US": "United States",
  "UY": "Uruguay", "UZ": "Uzbekistan", "VU": "Vanuatu", "VA": "Vatican City", "VE": "Venezuela", "VN": "Vietnam",
  "YE": "Yemen", "ZM": "Zambia", "ZW": "Zimbabwe"
}

interface UserProfile {
  id: number
  username: string
  email: string
  first_name: string
  middle_name?: string | null
  last_name: string
  profile_picture?: string | null
  date_of_birth: string
  country: string
  account_type: string
  jampass_sub_type?: string
  academy_sub_type?: string
  phone_number: string
  nrc_number: string
  is_active: boolean
  is_staff: boolean
  date_joined: string
  updated_at: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editError, setEditError] = useState("")
  const [editSuccess, setEditSuccess] = useState("")
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone_number: "",
    date_of_birth: "",
    country: "",
    academy_sub_type: "", // Read-only designation
  })
  const router = useRouter()

  // Helper function to get country name from code
  const getCountryName = (countryCode: string) => {
    if (!countryCode) return 'Not provided'
    return COUNTRY_CODES[countryCode.toUpperCase()] || countryCode
  }

  useEffect(() => {
    fetchProfileData()
  }, [router])

  const fetchProfileData = async () => {
    try {
      setIsLoading(true)

      const accessToken = localStorage.getItem("accessToken")
      const userData = localStorage.getItem("currentUser")

      if (!accessToken || !userData) {
        router.push("/login")
        return
      }

      const parsedUser = JSON.parse(userData)
      const userId = parsedUser.userId || parsedUser.id

      if (!userId) {
        console.error("No userId found in currentUser")
        router.push("/login")
        return
      }

      const response = await fetch(getApiUrl(`users/${userId}/`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API error response:", errorText)
        
        if (response.status === 401 || response.status === 403) {
          router.push("/login")
          return
        }
        
        throw new Error(`Failed to fetch profile: ${response.status}`)
      }

      const profileData = await response.json()
      console.log("Profile data received:", profileData)

      setUser(profileData)
      // Initialize form data with user info
      setFormData({
        first_name: profileData.first_name || "",
        middle_name: profileData.middle_name || "",
        last_name: profileData.last_name || "",
        phone_number: profileData.phone_number || "",
        date_of_birth: profileData.date_of_birth || "",
        country: profileData.country || "",
        academy_sub_type: profileData.academy_sub_type || profileData.jampass_sub_type || "",
      })
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching profile:", err)
      setError(`Failed to load profile data: ${err}`)
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
        first_name: user.first_name || "",
        middle_name: user.middle_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        date_of_birth: user.date_of_birth || "",
        country: user.country || "",
        academy_sub_type: user.academy_sub_type || user.jampass_sub_type || "",
      })
      setEditError("")
      setEditSuccess("")
      setIsEditMode(true)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const accessToken = localStorage.getItem("accessToken")
      const userData = localStorage.getItem("currentUser")

      if (!accessToken || !userData) {
        setEditError("Session expired. Please login again.")
        setIsSaving(false)
        return
      }

      const parsedUser = JSON.parse(userData)
      const userId = parsedUser.userId || parsedUser.id

      if (!userId) {
        setEditError("User ID not found.")
        setIsSaving(false)
        return
      }

      // Prepare update payload
      const updatePayload = {
        first_name: formData.first_name,
        middle_name: formData.middle_name || null,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        date_of_birth: formData.date_of_birth,
        country: formData.country,
      }

      const response = await fetch(getApiUrl(`users/${userId}/`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatePayload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to update profile: ${response.status}`)
      }

      const updatedUser = await response.json()
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
                {user?.account_type === "admin" ? "GECO Academy Admin" : "GECO Academy"}
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
            {user?.account_type === "admin" ? (
              <>
                <Link href="/academy/admin/dashboard" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Dashboard</Link>
                <Link href="/academy/profile" className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm">Profile</Link>
                <Link href="/academy/admin/departments" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Departments</Link>
                <Link href="/academy/admin/courses" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Courses</Link>
                <Link href="/academy/admin/tasks" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Tasks</Link>
                <Link href="/academy/admin/accounts" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Accounts</Link>
              </>
            ) : (
              <>
                <Link href="/academy/dashboard" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Dashboard</Link>
                <Link href="/academy/profile" className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm">Profile</Link>
                <Link href="/academy/courses" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Courses</Link>
                <Link href="/academy/modules" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Modules</Link>
                <Link href="/academy/tasks" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition">Tasks</Link>
              </>
            )}
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
                  {user.first_name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="mb-2">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {user.first_name} {user.last_name}
                  </h1>
                  <p className="text-cyan-600 dark:text-cyan-400 font-semibold capitalize">
                    {user.account_type} {user.jampass_sub_type && `(${user.jampass_sub_type})`}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    @{user.username}
                  </p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Username */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <User className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Username</p>
                    <p className="text-slate-900 dark:text-white font-semibold">@{user.username}</p>
                  </div>
                </div>

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
                    <p className="text-slate-900 dark:text-white font-semibold">{user.phone_number || 'Not provided'}</p>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <Calendar className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Date of Birth</p>
                    <p className="text-slate-900 dark:text-white font-semibold">
                      {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Country */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <MapPin className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Country</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{getCountryName(user.country)}</p>
                  </div>
                </div>

                {/* NRC Number */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <CreditCard className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">NRC Number</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{user.nrc_number || 'Not provided'}</p>
                  </div>
                </div>

                {/* Account Type */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <Award className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Account Type</p>
                    <p className="text-slate-900 dark:text-white font-semibold capitalize">
                      {user.account_type}
                    </p>
                  </div>
                </div>

                {/* Academy Sub-Type */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <Award className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Designation</p>
                    <p className="text-slate-900 dark:text-white font-semibold capitalize">
                      {user.academy_sub_type || user.jampass_sub_type || 'Not assigned'}
                    </p>
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  {user.is_active ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Account Status</p>
                    <p className={`font-semibold ${user.is_active ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>

                {/* Staff Status */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  {user.is_staff ? (
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  )}
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Staff Status</p>
                    <p className={`font-semibold ${user.is_staff ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-400'}`}>
                      {user.is_staff ? 'Staff' : 'Student'}
                    </p>
                  </div>
                </div>

                {/* Date Joined */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <Calendar className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Member Since</p>
                    <p className="text-slate-900 dark:text-white font-semibold">
                      {user.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Last Updated</p>
                    <p className="text-slate-900 dark:text-white font-semibold">
                      {user.updated_at ? new Date(user.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* User ID */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700 md:col-span-2">
                  <User className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">User ID</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{user.id}</p>
                  </div>
                </div>
              </div>

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
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Middle Name
                        </label>
                        <input
                          type="text"
                          name="middle_name"
                          value={formData.middle_name}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
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
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth ? formData.date_of_birth.split('T')[0] : ""}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          required
                        >
                          <option value="">Select a country...</option>
                          {COUNTRIES.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Designation
                        </label>
                        <div className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                          {formData.academy_sub_type || "Not assigned"}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex-1 rounded-lg bg-cyan-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-cyan-700 disabled:bg-cyan-400 disabled:cursor-not-allowed dark:bg-cyan-600 dark:hover:bg-cyan-500"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="flex-1 rounded-lg bg-slate-300 px-6 py-3 text-center font-semibold text-slate-900 transition hover:bg-slate-400 disabled:bg-slate-200 disabled:cursor-not-allowed dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500"
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
