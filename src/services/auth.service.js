/**
 * Carely Auth Service — wraps login, register, and logout API calls.
 */

import { apiPost, apiGet, apiPatch, storeAuth, clearAuth, getStoredUser, getAccessToken } from './api.js'

// ── Login ──────────────────────────────────────────────────────────────────────

export async function loginUser(email, password) {
  const result = await apiPost('/auth/login', { email, password })
  // If 2FA is required, do NOT store tokens yet (pre-auth phase)
  if (!result.require2FA) {
    storeAuth(result)
  }
  return result
}

// ── Register Client (household) ────────────────────────────────────────────────

export async function registerClient(data) {
  const payload = {
    firstName: data.firstName ? data.firstName.trim() : '',
    lastName:  data.lastName ? data.lastName.trim() : '',
    email:     data.email ? data.email.trim().toLowerCase() : '',
    phone:     data.phone ? data.phone.trim() : '',
    password:  data.password,
  }
  if (data.city && data.city.trim()) {
    payload.city = data.city.trim()
  }
  if (Array.isArray(data.services) && data.services.length > 0) {
    payload.careNeeds = data.services
  }
  if (data.peopleCount) {
    const p = parseInt(data.peopleCount)
    if (!isNaN(p)) payload.householdSize = p
  }
  const result = await apiPost('/auth/register', payload)
  storeAuth(result)
  return result
}


// ── Register Provider ──────────────────────────────────────────────────────────

export async function registerProvider(data) {
  // Map RegisterPro multi-step form to backend schema
  // Step 1: firstName, lastName, dob, gender, phone, city, neighborhood, address
  // Step 2: servicesOffered (→ specialties)
  // Step 3: experienceYears, bio
  // Step 7: hourlyRate, bio, languages
  // Step 8: email, password

  // Main profession determination
  const rawProfession = data.profession === 'Other'
    ? (data.customProfession?.trim() || 'Other')
    : (data.profession || 'Cleaner')
  const mainProfession = rawProfession.trim()

  const professionToSpecialty = {
    'Cleaner':        'cleaning',
    'Gardener':       'gardening',
    'Babysitter':     'babysitting',
    'Elderly carer':  'elderly_care',
    'Housekeeper':    'indoor_cleaning',
    'Laundry worker': 'laundry_ironing',
    'Home nursing':   'nursing',
    'Other':          'other',
  }

  const extraServiceMap = {
    'Indoor cleaning':            'indoor_cleaning',
    'Outdoor cleaning':           'outdoor_cleaning',
    'Laundry / Ironing':          'laundry_ironing',
    'Pet walking':                'pet_care',
    'Moving cleaning':            'cleaning',
    'Child care / Babysitting':   'babysitting',
    'Elder care':                 'elderly_care',
    'Cooking / Meal preparation': 'cooking',
    'Childcare / Babysitting':    'babysitting',
    'Elderly care':               'elderly_care',
    'Home assistance':            'indoor_cleaning',
    'Cleaning':                   'cleaning',
    'Cooking / Meal Prep':        'cooking',
    'Personal Assistance':        'elderly_care',
    'Other':                      'other',
  }

  const primary = professionToSpecialty[data.profession] || 'other'
  const extras = (data.extraServices || data.servicesOffered || [])
    .map(s => extraServiceMap[s])
    .filter(Boolean)

  const specialties = Array.from(new Set([primary, ...extras]))
  if (specialties.length === 0) specialties.push('cleaning')

  const payload = {
    firstName:      data.firstName,
    lastName:       data.lastName,
    email:          data.email,
    phone:          data.phone,
    password:       data.password,
    dateOfBirth:    data.dob       || null,
    gender:         data.gender    || null,
    city:           data.city      || null,
    address:        data.address   || null,
    profession:     mainProfession,
    specialties,
    experience:     data.experienceYears || null,
    experienceYrs:  data.experienceYears ? (parseInt(String(data.experienceYears).replace(/\D/g, '')) || 1) : 1,
    availableDays:  data.availableDays || [],
    bio:            data.bio       || null,
    location:       data.city      || null,
    serviceArea:    data.workingAreas ? data.workingAreas.join(', ') : null,
    serviceRadius:  data.travelDistance || data.serviceRadius || '15 km',
    languages:      data.languages || null,
    pricePerHour:   data.hourlyRate ? parseFloat(data.hourlyRate) || 50 : 50,
    hourlyRate:     data.hourlyRate ? parseFloat(data.hourlyRate) || 50 : 50,
    referenceName:  data.referenceName  || null,
    referencePhone: data.referencePhone || null,
    idDocumentUrl:       data.idDocUrl || null,
    idDocumentName:      data.identityDocName || null,
    policeClearanceUrl:  data.policeClearanceDocUrl || null,
    policeClearanceName: data.policeClearanceDocName || null,
    certificateUrl:      data.certDocUrl || null,
    certificateName:     data.certDocName || null,
  }

  // POST — provider registration (no token needed, fresh registration)
  const result = await apiPost('/auth/register/provider', payload, null)
  return result
}


// ── Logout ─────────────────────────────────────────────────────────────────────

export function logout() {
  clearAuth()
}

// ── Profile Management ────────────────────────────────────────────────────────

export async function fetchCurrentProfile() {
  const token = getAccessToken()
  if (!token) return getStoredUser()
  try {
    const res = await apiGet('/users/me', token)
    const profile = res?.user || res
    if (profile) {
      const stored = getStoredUser() || {}
      const merged = { ...stored, ...profile }
      localStorage.setItem('carely_user', JSON.stringify(merged))
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('carely_user_updated', { detail: merged }))
      }
      return merged
    }
  } catch (err) {
    console.error('Failed to fetch current profile:', err)
  }
  return getStoredUser()
}

export async function updateCurrentProfile(data) {
  const token = getAccessToken()
  if (!token) throw new Error('Not authenticated')
  const res = await apiPatch('/users/me', data, token)
  const updated = res?.user || res
  const stored = getStoredUser() || {}
  const merged = { ...stored, ...updated }
  localStorage.setItem('carely_user', JSON.stringify(merged))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('carely_user_updated', { detail: merged }))
  }
  return merged
}

// ── Password Recovery ──────────────────────────────────────────────────────────

export async function requestPasswordReset(email) {
  return apiPost('/auth/forgot-password', { email: email.trim().toLowerCase() })
}

export async function verifyRecoveryCode(code) {
  return apiPost('/auth/verify-reset-code', { code: String(code).trim() })
}

export async function resetPasswordWithToken(tokenOrCode, newPassword) {
  return apiPost('/auth/reset-password', {
    token: String(tokenOrCode).trim(),
    newPassword,
  })
}

// ── Two-Factor Authentication (2FA) ──────────────────────────────────────────
export async function verifyTwoFactorCode(tempToken, code) {
  const result = await apiPost('/auth/verify-2fa', {
    tempToken,
    code: String(code).trim(),
  })
  // Verification successful: persist complete auth tokens
  storeAuth(result)
  return result
}

export async function resendTwoFactorCode(tempToken) {
  return apiPost('/auth/resend-2fa', { tempToken })
}

// ── Re-exports for convenience ─────────────────────────────────────────────────

export { getStoredUser, getAccessToken }



