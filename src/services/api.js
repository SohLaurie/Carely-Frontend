/**
 * Carely API service — thin native fetch wrapper
 * Reads tokens from localStorage. No external deps needed.
 * Base URL is configured via VITE_API_URL environment variable.
 */

const API_ORIGIN = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const BASE_URL = `${API_ORIGIN}/api`

// ── Token helpers ──────────────────────────────────────────────────────────────

export function getAccessToken() {
  return localStorage.getItem('carely_access_token')
}

export function getRefreshToken() {
  return localStorage.getItem('carely_refresh_token')
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('carely_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function storeAuth({ accessToken, refreshToken, user }) {
  if (accessToken)  localStorage.setItem('carely_access_token', accessToken)
  if (refreshToken) localStorage.setItem('carely_refresh_token', refreshToken)
  if (user) {
    localStorage.setItem('carely_user', JSON.stringify(user))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('carely_user_updated', { detail: user }))
    }
  }
}

export function clearAuth() {
  localStorage.removeItem('carely_access_token')
  localStorage.removeItem('carely_refresh_token')
  localStorage.removeItem('carely_user')
}

export function getUserInitials(user, fallback = 'U') {
  if (!user) return fallback
  const name = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()
  if (!name) return user.email ? user.email.slice(0, 2).toUpperCase() : fallback
  const parts = name.split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function getUserDisplayName(user, fallback = 'User') {
  if (!user) return fallback
  return user.firstName || (user.name ? user.name.split(' ')[0] : null) || (user.email ? user.email.split('@')[0] : null) || fallback
}

export function getAvatarUrl(url) {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('blob:')) {
    return trimmed
  }
  return `${API_ORIGIN}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`
}


// ── Core request helpers ───────────────────────────────────────────────────────

async function request(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    let message = data.error || data.message || `Request failed with status ${res.status}`
    if (data.details && Array.isArray(data.details) && data.details.length > 0) {
      message = data.details.map(d => (d.field ? `${d.field}: ${d.message}` : d.message)).join(', ')
    }
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

export const apiPost   = (path, body, token) => request('POST',   path, body, token)
export const apiPut    = (path, body, token) => request('PUT',    path, body, token)
export const apiGet    = (path, token)        => request('GET',    path, undefined, token)
export const apiPatch  = (path, body, token)  => request('PATCH',  path, body, token)
export const apiDelete = (path, token)        => request('DELETE', path, undefined, token)

export async function uploadDocument(file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${BASE_URL}/upload/document`, {
    method: 'POST',
    body: formData,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload document')
  }
  return data
}
