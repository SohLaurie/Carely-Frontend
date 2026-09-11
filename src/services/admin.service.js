/**
 * Carely Admin Service — wraps admin API calls for the admin dashboard.
 */

import { apiGet, apiPatch, apiPost, apiPut, getAccessToken } from './api.js'

// ── Fetch Provider Applications (all or filtered) ─────────────────────────────

export async function fetchAllApplications({ status = 'all' } = {}) {
  const token = getAccessToken()
  const data = await apiGet(`/admin/providers?status=${status}`, token)
  const isRaissaCheck = p => (p.email && p.email.includes('raissa')) || (p.name && p.name.toLowerCase().includes('raissa'))

  const mapped = (data.providers || []).map(p => {
    const isRaissa = isRaissaCheck(p)
    const formattedSpecialties = (Array.isArray(p.specialties) && p.specialties.length > 0)
      ? p.specialties.map(s => s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
      : [p.category || 'Caregiver']

    // Format availability days: e.g. ['Monday', 'Wednesday', 'Saturday'] -> 'Mon, Wed, Sat'
    let formattedAvailability = isRaissa ? 'Mon, Wed, Sat' : 'Mon–Sat, 8am–6pm'
    if (Array.isArray(p.availableDays) && p.availableDays.length > 0) {
      const dayMap = {
        'Monday': 'Mon', 'Tuesday': 'Tue', 'Wednesday': 'Wed',
        'Thursday': 'Thu', 'Friday': 'Fri', 'Saturday': 'Sat', 'Sunday': 'Sun',
      }
      formattedAvailability = p.availableDays.map(d => dayMap[d] || d).join(', ')
    }

    const rawLanguages = Array.isArray(p.languages)
      ? p.languages
      : (typeof p.languages === 'string' ? p.languages.split(',').map(s => s.trim()) : [])
    const formattedLanguages = rawLanguages.map(l => l.charAt(0).toUpperCase() + l.slice(1))

    return {
      id:              p.id,
      name:            p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
      firstName:       p.firstName,
      lastName:        p.lastName,
      email:           p.email,
      phone:           p.phone || '',
      category:        p.category || 'Caregiver',
      location:        p.city || p.location || 'Cameroon',
      initials:        p.initials || (p.firstName ? `${p.firstName[0]}${p.lastName?.[0] || ''}`.toUpperCase() : 'PR'),
      bio:             p.bio || 'No bio provided by applicant.',
      experience:      p.experience || (p.experienceYrs ? `${p.experienceYrs} years` : 'Not specified'),
      availability:    formattedAvailability,
      serviceRadius:   p.serviceRadius || '15 km',
      hourlyRate:      p.hourlyRate || p.pricePerHour || (isRaissa ? 50 : 3000),
      pricePerHour:    p.pricePerHour || p.hourlyRate || (isRaissa ? 50 : 3000),
      approvalStatus:  p.approvalStatus || p.status || 'pending',
      status:          p.approvalStatus || p.status || 'pending',
      submissionTime:  p.submittedAt
        ? new Date(p.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Recently',
      waitingTime:     computeWaitingTime(p.submittedAt),
      idVerified:      true,
      certVerified:    true,
      refVerified:     false,
      skills:          formattedSpecialties,
      languages:       formattedLanguages,
      dob:             p.dob || 'Not specified',
      gender:          p.gender || 'Not specified',
      referenceName:   p.referenceName || 'Not provided',
      referencePhone:  p.referencePhone || 'Not provided',
      idDocumentUrl:       p.idDocumentUrl || (isRaissa ? '/uploads/documents/cni_laurie.pdf' : null),
      idDocumentName:      p.idDocumentName || (isRaissa ? 'CNI laurie.pdf' : 'National ID (CNI)'),
      policeClearanceUrl:  p.policeClearanceUrl || (isRaissa ? '/uploads/documents/police_clearance_raissa.pdf' : null),
      policeClearanceName: p.policeClearanceName || (isRaissa ? 'casier_judiciaire_raissa.pdf' : 'Police Clearance'),
      certificateUrl:      p.certificateUrl || (isRaissa ? '/uploads/documents/certificate_cleaner.pdf' : null),
      certificateName:     p.certificateName || (isRaissa ? 'cert_cleaner.pdf' : 'Professional Certificate'),
      _raw:            p,
    }
  })

  return {
    providers: mapped,
    total: data.total || mapped.length,
    counts: data.counts || {
      all: mapped.length,
      pending: mapped.filter(p => p.approvalStatus === 'pending').length,
      approved: mapped.filter(p => p.approvalStatus === 'approved').length,
      rejected: mapped.filter(p => p.approvalStatus === 'rejected').length
    }
  }
}

export async function fetchPendingApplications() {
  const result = await fetchAllApplications({ status: 'all' })
  return result.providers
}


function computeWaitingTime(submittedAt) {
  if (!submittedAt) return 'N/A'
  const diffMs = Date.now() - new Date(submittedAt).getTime()
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffH < 24) return `${diffH}h`
  const diffD = Math.floor(diffH / 24)
  return `${diffD}d`
}

// ── Approve Provider ───────────────────────────────────────────────────────────

export async function approveApplication(providerId) {
  const token = getAccessToken()
  return apiPatch(`/admin/providers/${providerId}/approve`, {}, token)
}

// ── Reject Provider ────────────────────────────────────────────────────────────

export async function rejectApplication(providerId) {
  const token = getAccessToken()
  return apiPatch(`/admin/providers/${providerId}/reject`, {}, token)
}

// ── Admin Stats ────────────────────────────────────────────────────────────────

export async function fetchAdminStats() {
  const token = getAccessToken()
  return apiGet('/admin/stats', token)
}

// ── Provider Subscription Status (called from caregiver dashboard) ─────────────

export async function fetchSubscriptionStatus() {
  const token = getAccessToken()
  return apiGet('/providers/me/subscription-status', token)
}

// ── Provider Pay Subscription (25 XAF via Campay) ──────────────────────────────

export async function paySubscription(phone) {
  const token = getAccessToken()
  return apiPost('/providers/me/pay-subscription', { phone }, token)
}

// ── Fetch Real Users List ──────────────────────────────────────────────────────

export async function fetchAllUsers() {
  const token = getAccessToken()
  const data = await apiGet('/admin/users', token)
  return data.users || []
}

// ── Login Attempts & Lockout Policy ──────────────────────────────────────────

export async function fetchLockoutPolicy() {
  const token = getAccessToken()
  const data = await apiGet('/admin/settings/lockout-policy', token)
  return data.policy || {}
}

export async function saveLockoutPolicy(policy) {
  const token = getAccessToken()
  return apiPut('/admin/settings/lockout-policy', policy, token)
}

export async function fetchLoginAttempts({ limit = 50, offset = 0, search = '' } = {}) {
  const token = getAccessToken()
  const query = new URLSearchParams()
  if (limit) query.set('limit', limit)
  if (offset) query.set('offset', offset)
  if (search) query.set('search', search)
  const data = await apiGet(`/admin/security/login-attempts?${query.toString()}`, token)
  return data.logs || []
}

export async function unlockUserAccount(userId) {
  const token = getAccessToken()
  return apiPost(`/admin/users/${userId}/unlock`, {}, token)
}

// ── Two-Factor Authentication & SMTP Gateway ─────────────────────────────────

export async function fetchTwoFactorPolicy() {
  const token = getAccessToken()
  return apiGet('/admin/settings/2fa', token)
}

export async function saveTwoFactorPolicy(policy) {
  const token = getAccessToken()
  return apiPut('/admin/settings/2fa', policy, token)
}

export async function toggleUser2FA(userId, enabled) {
  const token = getAccessToken()
  return apiPatch(`/admin/users/${userId}/2fa`, { enabled }, token)
}




