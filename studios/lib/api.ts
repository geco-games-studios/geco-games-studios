export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://system.gecogames.com/api/v1/test/"

export function getApiUrl(path: string) {
  const base = API_BASE_URL.replace(/\/+$|^\s+|\s+$/g, "")
  const trimmedPath = path.replace(/^\/+/, "")

  return `${base}/${trimmedPath}`
}

export function getAuthHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
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
