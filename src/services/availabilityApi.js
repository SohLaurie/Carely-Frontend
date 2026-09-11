import { apiGet, apiPost, apiDelete, getAccessToken } from './api'

/**
 * Fetch calendar data for the logged-in provider
 * Returns { year, month, totalDays, dayStates, eventsByDay, totalSessions, totalBlockedDays }
 */
export async function fetchMyCalendar(year, month) {
  const token = getAccessToken()
  const res = await apiGet(`/availability/my-calendar?year=${year}&month=${month}`, token)
  return res.calendar || res
}

/**
 * Block a single day or date range
 * startDate: 'YYYY-MM-DD'
 * endDate: 'YYYY-MM-DD' (optional, defaults to startDate)
 * reason: string (optional)
 */
export async function blockDateSlot(startDate, endDate, reason = 'Unavailable') {
  const token = getAccessToken()
  const payload = {
    startDate,
    endDate: endDate || startDate,
    reason: reason || 'Unavailable'
  }
  const res = await apiPost('/availability/block', payload, token)
  return res.slot || res
}

/**
 * Unblock a slot by block ID
 */
export async function unblockDateSlot(blockId) {
  const token = getAccessToken()
  return await apiDelete(`/availability/block/${blockId}`, token)
}

/**
 * Unblock all slots covering a specific date
 * dateStr: 'YYYY-MM-DD'
 */
export async function unblockByDate(dateStr) {
  const token = getAccessToken()
  return await apiDelete(`/availability/block-date/${dateStr}`, token)
}

/**
 * List all blocked slots for current provider
 */
export async function listMyBlockedSlots() {
  const token = getAccessToken()
  const res = await apiGet('/availability/blocked-slots', token)
  return res.blockedSlots || []
}
