const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://7rw0t4vb4i.execute-api.us-east-2.amazonaws.com'

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}

export async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options

  const url = buildUrl(endpoint, params)

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...defaultHeaders,
        ...fetchOptions.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error (${response.status}): ${error || response.statusText}`)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    throw error
  }
}

export const api = {
  get: <T,>(endpoint: string, options?: FetchOptions) =>
    apiCall<T>(endpoint, { ...options, method: 'GET' }),

  post: <T,>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiCall<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T,>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiCall<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T,>(endpoint: string, options?: FetchOptions) =>
    apiCall<T>(endpoint, { ...options, method: 'DELETE' }),
}
