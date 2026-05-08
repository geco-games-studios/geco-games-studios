export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1/test/"
export const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "http://localhost:8000"

export function getApiUrl(path: string) {
  const base = API_BASE_URL.replace(/\/+$|^\s+|\s+$/g, "")
  const trimmedPath = path.replace(/^\/+/, "")

  return `${base}/${trimmedPath}`
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

export async function postFormData<T = unknown>(path: string, formData: FormData, init?: Omit<RequestInit, "method" | "body" | "headers">) {
  const response = await fetch(getApiUrl(path), {
    method: "POST",
    headers: getAuthHeaders(null),
    body: formData,
    ...init,
  })

  const contentType = response.headers.get("content-type") || ""
  const data = contentType.includes("application/json") ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.message || data?.detail || "API request failed")
  }

  return data as T
}

export async function putFormData<T = unknown>(path: string, formData: FormData, init?: Omit<RequestInit, "method" | "body" | "headers">) {
  const response = await fetch(getApiUrl(path), {
    method: "PATCH",
    headers: getAuthHeaders(null),
    body: formData,
    ...init,
  })

  const contentType = response.headers.get("content-type") || ""
  const data = contentType.includes("application/json") ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.message || data?.detail || "API request failed")
  }

  return data as T
}

export async function fetchJson<T = unknown>(path: string, init?: RequestInit) {
  const response = await fetch(getApiUrl(path), {
    method: "GET",
    headers: getAuthHeaders(),
    ...init,
  })

  const contentType = response.headers.get("content-type") || ""
  const data = contentType.includes("application/json") ? await response.json() : null

  if (!response.ok) {
    console.error(`API Error [${response.status}] at ${path}:`, data)
    throw new Error(data?.message || data?.detail || `API request failed with status ${response.status}`)
  }

  return data as T
}

export async function postJson<T = unknown>(path: string, payload: unknown, init?: Omit<RequestInit, "method" | "body" | "headers">) {
  const response = await fetch(getApiUrl(path), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    ...init,
  })

  const contentType = response.headers.get("content-type") || ""
  const data = contentType.includes("application/json") ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.message || data?.detail || "API request failed")
  }

  return data as T
}

export async function putJson<T = unknown>(path: string, payload: unknown, init?: Omit<RequestInit, "method" | "body" | "headers">) {
  const response = await fetch(getApiUrl(path), {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    ...init,
  })

  const contentType = response.headers.get("content-type") || ""
  const data = contentType.includes("application/json") ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.message || data?.detail || "API request failed")
  }

  return data as T
}

export async function patchJson<T = unknown>(path: string, payload: unknown, init?: Omit<RequestInit, "method" | "body" | "headers">) {
  const response = await fetch(getApiUrl(path), {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    ...init,
  })

  const contentType = response.headers.get("content-type") || ""
  const data = contentType.includes("application/json") ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.message || data?.detail || "API request failed")
  }

  return data as T
}

export async function deleteJson<T = unknown>(path: string, init?: Omit<RequestInit, "method">) {
  const response = await fetch(getApiUrl(path), {
    method: "DELETE",
    headers: getAuthHeaders(),
    ...init,
  })

  const contentType = response.headers.get("content-type") || ""
  const data = contentType.includes("application/json") ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.message || data?.detail || "API request failed")
  }

  return data as T
}
