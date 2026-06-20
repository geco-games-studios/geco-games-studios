"use client"

export type GecoServiceId = "academy" | "developer" | "jampass-player" | "marketplace" | "esports"

export interface GecoService {
  id: GecoServiceId
  name: string
  description: string
  dashboardPath: string
  onboardingPath: string
  legacyTypes: string[]
  legacySubTypes?: string[]
}

export interface CurrentUser {
  email?: string
  type?: string
  account_type?: string
  name?: string
  first_name?: string
  last_name?: string
  userId?: string
  user_id?: string
  id?: string | number
  academy_sub_type?: string | null
  sub_user_type?: string | null
  jampass_sub_type?: string | null
  is_staff?: boolean
  services?: unknown
  service_profiles?: unknown
  profiles?: unknown
  active_service?: string | null
}

export interface AuthPayload {
  access?: string
  refresh?: string
  account_type?: string
  academy_sub_type?: string | null
  sub_user_type?: string | null
  jampass_sub_type?: string | null
  user?: Partial<CurrentUser>
  current_user?: Partial<CurrentUser>
  profile?: Partial<CurrentUser>
  services?: unknown
  service_profiles?: unknown
  profiles?: unknown
  [key: string]: unknown
}

export const GECO_SERVICES: GecoService[] = [
  {
    id: "academy",
    name: "GECO Academy",
    description: "Courses, lessons, trainee profiles, and Academy admin tools.",
    dashboardPath: "/academy/dashboard",
    onboardingPath: "/select-service/academy/onboarding",
    legacyTypes: ["academy", "student", "trainee", "admin"],
    legacySubTypes: ["academy", "student", "trainee", "admin"],
  },
  {
    id: "developer",
    name: "Developer Portal",
    description: "Game submissions, analytics, support, leaderboards, and studio tools.",
    dashboardPath: "/developer/dashboard",
    onboardingPath: "/select-service/developer/onboarding",
    legacyTypes: ["developer"],
  },
  {
    id: "jampass-player",
    name: "JamPass Player",
    description: "Player dashboard, communities, games, leaderboards, and rewards.",
    dashboardPath: "/jampass/player/dashboard",
    onboardingPath: "/select-service/jampass-player/onboarding",
    legacyTypes: ["jampass", "player"],
    legacySubTypes: ["player"],
  },
  {
    id: "marketplace",
    name: "Marketplace",
    description: "Browse and manage marketplace services in the GECO ecosystem.",
    dashboardPath: "/marketplace",
    onboardingPath: "/select-service/marketplace/onboarding",
    legacyTypes: ["market", "marketplace", "customer"],
  },
  {
    id: "esports",
    name: "Esports & Events",
    description: "Tournament, event, and competitive community access.",
    dashboardPath: "/esports",
    onboardingPath: "/select-service/esports/onboarding",
    legacyTypes: ["esports", "gamer"],
  },
]

export function decodeJwt(token: string) {
  try {
    const [, payload] = token.split(".")
    if (!payload) return null

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const decoded = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${("00" + char.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    )

    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export function getStoredUser(): CurrentUser | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem("currentUser")
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem("currentUser")
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("activeGecoService")
}

export function normalizeAuthUser(payload: AuthPayload, emailFallback = ""): CurrentUser {
  const decodedToken = payload.access ? decodeJwt(payload.access) : null
  const nestedUser = payload.current_user || payload.user || payload.profile || {}
  const email = String(nestedUser.email || payload.email || decodedToken?.email || emailFallback || "")
  const accountType = String(
    payload.account_type ||
      nestedUser.account_type ||
      nestedUser.type ||
      decodedToken?.account_type ||
      decodedToken?.user_type ||
      decodedToken?.role ||
      "master"
  )
  const firstName = nestedUser.first_name || payload.first_name || decodedToken?.first_name || ""
  const lastName = nestedUser.last_name || payload.last_name || decodedToken?.last_name || ""
  const displayName =
    nestedUser.name ||
    payload.name ||
    [firstName, lastName].filter(Boolean).join(" ") ||
    email ||
    "GECO User"

  return {
    ...nestedUser,
    email,
    type: accountType,
    account_type: accountType,
    name: String(displayName),
    first_name: firstName ? String(firstName) : undefined,
    last_name: lastName ? String(lastName) : undefined,
    userId: String(
      nestedUser.userId ||
        nestedUser.user_id ||
        nestedUser.id ||
        decodedToken?.user_id ||
        decodedToken?.sub ||
        ""
    ),
    academy_sub_type: payload.academy_sub_type || nestedUser.academy_sub_type || decodedToken?.academy_sub_type || null,
    sub_user_type: payload.sub_user_type || nestedUser.sub_user_type || decodedToken?.sub_user_type || null,
    jampass_sub_type: payload.jampass_sub_type || nestedUser.jampass_sub_type || decodedToken?.jampass_sub_type || null,
    is_staff: Boolean(nestedUser.is_staff || decodedToken?.is_staff || false),
    services: payload.services || nestedUser.services,
    service_profiles: payload.service_profiles || nestedUser.service_profiles,
    profiles: payload.profiles || nestedUser.profiles,
    active_service: (payload.active_service as string) || nestedUser.active_service || null,
  }
}

export function persistAuthSession(payload: AuthPayload, emailFallback = "") {
  if (typeof window === "undefined") return null

  if (payload.access) localStorage.setItem("accessToken", payload.access)
  if (payload.refresh) localStorage.setItem("refreshToken", payload.refresh)

  const user = normalizeAuthUser(payload, emailFallback)
  localStorage.setItem("currentUser", JSON.stringify(user))
  if (user.active_service) localStorage.setItem("activeGecoService", user.active_service)
  return user
}

function getCollection(user: CurrentUser, key: "services" | "service_profiles" | "profiles") {
  const value = user[key]
  if (Array.isArray(value)) return value
  if (value && typeof value === "object") return Object.values(value)
  return []
}

export function hasServiceProfile(user: CurrentUser | null, service: GecoService) {
  if (!user) return false
  const type = String(user.type || user.account_type || "").toLowerCase()
  const subType = String(user.sub_user_type || user.jampass_sub_type || user.academy_sub_type || "").toLowerCase()

  if (service.legacyTypes.includes(type)) {
    if (service.id === "jampass-player") return subType === "player" || type === "player"
    return true
  }

  if (service.legacySubTypes?.includes(subType)) return true

  const profileCollections = [
    ...getCollection(user, "services"),
    ...getCollection(user, "service_profiles"),
    ...getCollection(user, "profiles"),
  ] as any[]

  return profileCollections.some((profile) => {
    const id = String(profile?.id || profile?.service_id || profile?.service || profile?.slug || profile?.type || "").toLowerCase()
    const status = String(profile?.status || profile?.state || "active").toLowerCase()
    return [service.id, service.id.replace("-", "_")].includes(id) && ["active", "approved", "enabled"].includes(status)
  })
}

export function canAccessService(user: CurrentUser | null, serviceId: GecoServiceId) {
  const service = GECO_SERVICES.find((item) => item.id === serviceId)
  if (!service || !user) return false

  if (hasServiceProfile(user, service)) return true

  const activeService =
    typeof window !== "undefined"
      ? localStorage.getItem("activeGecoService") || user.active_service
      : user.active_service

  const normalizedActiveService = String(activeService || "").toLowerCase()
  return [service.id, service.id.replace("-", "_")].includes(normalizedActiveService)
}

export function getDashboardPathForUser(user: CurrentUser | null) {
  if (!user) return "/"
  if (user.is_staff || user.type === "admin" || user.academy_sub_type === "admin") return "/academy/admin/dashboard"
  const service = GECO_SERVICES.find((item) => hasServiceProfile(user, item))
  return service?.dashboardPath || "/select-service"
}

export function setActiveService(serviceId: GecoServiceId) {
  if (typeof window === "undefined") return

  localStorage.setItem("activeGecoService", serviceId)

  const rawUser = localStorage.getItem("currentUser")
  if (!rawUser) return

  try {
    const user = JSON.parse(rawUser)
    localStorage.setItem("currentUser", JSON.stringify({ ...user, active_service: serviceId }))
  } catch {
    // Keep the active service marker even if the stored profile is malformed.
  }
}
