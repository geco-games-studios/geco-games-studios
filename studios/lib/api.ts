// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1/test/"
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://system.gecogames.com/api/v1/test/"
// export const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "http://localhost:8000"
export const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "https://system.gecogames.com/"

export function getApiUrl(path: string) {
  const base = API_BASE_URL.replace(/(^['"]|['"]$)/g, "").replace(/\/+$|^\s+|\s+$/g, "")
  const trimmedPath = path.replace(/^\/+/, "")

  return `${base}/${trimmedPath}`
}

export function getRequestUrl(path: string) {
  const trimmed = path.trim()

  if (trimmed.startsWith("/api/")) {
    return trimmed
  }

  return getApiUrl(trimmed)
}

export function getMediaUrl(path: string) {
  if (!path) return ""
  if (path.startsWith("http")) return path // Already a full URL

  const base = MEDIA_BASE_URL.replace(/\/+$|^\s+|\s+$/g, "")
  let trimmedPath = path.replace(/^\/+/, "")

  // If the path doesn't start with 'media/', prepend it
  if (!trimmedPath.startsWith("media/")) {
    trimmedPath = `media/${trimmedPath}`
  }

  return `${base}/${trimmedPath}`
}

export function getAuthHeaders(contentType: string | null = "application/json") {
  const headers: Record<string, string> = {}

  if (contentType) {
    headers["Content-Type"] = contentType
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken")
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
      console.debug("Authorization header set with token")
    } else {
      console.warn("No access token found in localStorage for API request")
    }
  } else {
    console.warn("window is undefined - running in server context")
  }

  return headers
}

let refreshRequest: Promise<boolean> | null = null

export async function refreshAccessToken() {
  if (typeof window === "undefined") return false
  if (refreshRequest) return refreshRequest

  refreshRequest = (async () => {
    const refresh = localStorage.getItem("refreshToken")
    if (!refresh) return false

    try {
      const response = await fetch(getApiUrl("token/refresh/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      })
      if (!response.ok) return false

      const tokens = await response.json() as { access?: string; refresh?: string }
      if (!tokens.access) return false

      localStorage.setItem("accessToken", tokens.access)
      if (tokens.refresh) localStorage.setItem("refreshToken", tokens.refresh)
      window.dispatchEvent(new Event("geco-auth-session-changed"))
      return true
    } catch {
      return false
    }
  })()

  try {
    return await refreshRequest
  } finally {
    refreshRequest = null
  }
}

async function fetchWithAuthRetry(input: RequestInfo | URL, init: RequestInit) {
  let response = await fetch(input, init)
  if (response.status !== 401 || typeof window === "undefined") return response

  if (!(await refreshAccessToken())) return response

  const headers = new Headers(init.headers)
  const accessToken = localStorage.getItem("accessToken")
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`)
  response = await fetch(input, { ...init, headers })
  return response
}

function createApiError(response: Response, data: unknown) {
  const message =
    typeof data === "object" && data !== null && "message" in data
      ? (data as any).message
      : typeof data === "object" && data !== null && "detail" in data
      ? (data as any).detail
      : `API request failed with status ${response.status}`

  const error = new Error(message as string)
  ;(error as any).responseData = data
  ;(error as any).status = response.status
  return error
}

async function readResponseBody(response: Response) {
  const contentType = response.headers.get("content-type") || ""
  const text = await response.text()

  if (!text) return null
  if (!contentType.includes("application/json")) return text

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function clearExpiredSession(response: Response) {
  if (response.status !== 401 || typeof window === "undefined") return

  localStorage.removeItem("currentUser")
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("activeGecoService")
  window.dispatchEvent(new Event("geco-auth-session-changed"))
}

export async function postFormData<T = unknown>(path: string, formData: FormData, init?: Omit<RequestInit, "method" | "body" | "headers">) {
  const response = await fetchWithAuthRetry(getRequestUrl(path), {
    method: "POST",
    headers: getAuthHeaders(null),
    body: formData,
    ...init,
  })

  const data = await readResponseBody(response)
  clearExpiredSession(response)

  if (!response.ok) {
    throw createApiError(response, data)
  }

  return data as T
}

export async function putFormData<T = unknown>(path: string, formData: FormData, init?: Omit<RequestInit, "method" | "body" | "headers">) {
  const response = await fetchWithAuthRetry(getRequestUrl(path), {
    method: "PATCH",
    headers: getAuthHeaders(null),
    body: formData,
    ...init,
  })

  const data = await readResponseBody(response)
  clearExpiredSession(response)

  if (!response.ok) {
    throw createApiError(response, data)
  }

  return data as T
}

export async function fetchJson<T = unknown>(path: string, init?: RequestInit) {
  const response = await fetchWithAuthRetry(getRequestUrl(path), {
    method: "GET",
    headers: getAuthHeaders(),
    ...init,
  })

  const data = await readResponseBody(response)
  clearExpiredSession(response)

  if (!response.ok) {
    console.error(`API Error [${response.status}] at ${path}:`, data)
    throw createApiError(response, data)
  }

  return data as T
}

export async function postJson<T = unknown>(path: string, payload: unknown, init?: Omit<RequestInit, "method" | "body" | "headers">) {
  const response = await fetchWithAuthRetry(getRequestUrl(path), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    ...init,
  })

  const data = await readResponseBody(response)
  clearExpiredSession(response)

  if (!response.ok) {
    throw createApiError(response, data)
  }

  return data as T
}

export async function putJson<T = unknown>(path: string, payload: unknown, init?: Omit<RequestInit, "method" | "body" | "headers">) {
  const response = await fetchWithAuthRetry(getRequestUrl(path), {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    ...init,
  })

  const data = await readResponseBody(response)
  clearExpiredSession(response)

  if (!response.ok) {
    throw createApiError(response, data)
  }

  return data as T
}

export async function patchJson<T = unknown>(path: string, payload: unknown, init?: Omit<RequestInit, "method" | "body" | "headers">) {
  const response = await fetchWithAuthRetry(getRequestUrl(path), {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    ...init,
  })

  const data = await readResponseBody(response)
  clearExpiredSession(response)

  if (!response.ok) {
    throw createApiError(response, data)
  }

  return data as T
}

export async function deleteJson<T = unknown>(path: string, init?: Omit<RequestInit, "method">) {
  const response = await fetchWithAuthRetry(getRequestUrl(path), {
    method: "DELETE",
    headers: getAuthHeaders(),
    ...init,
  })

  const data = await readResponseBody(response)
  clearExpiredSession(response)

  if (!response.ok) {
    throw createApiError(response, data)
  }

  return data as T
}
