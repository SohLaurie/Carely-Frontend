import { apiGet, apiPost, apiPatch, getAccessToken } from './api';

/**
 * Submit a new booking request (Client)
 */
export async function submitBooking(bookingData, token = getAccessToken()) {
  return await apiPost('/bookings', bookingData, token);
}

/**
 * List bookings for currently authenticated user (role-aware: client, provider, admin)
 */
export async function fetchMyBookings(token = getAccessToken()) {
  const res = await apiGet('/bookings', token);
  return res.bookings || [];
}

/**
 * Get detailed booking info including sessions
 */
export async function fetchBooking(bookingId, token = getAccessToken()) {
  const res = await apiGet(`/bookings/${bookingId}`, token);
  return res.booking || null;
}

/**
 * Provider accepts a pending booking
 */
export async function acceptBooking(bookingId, token = getAccessToken()) {
  return await apiPatch(`/bookings/${bookingId}/accept`, {}, token);
}

/**
 * Provider declines a pending booking
 */
export async function declineBooking(bookingId, token = getAccessToken()) {
  return await apiPatch(`/bookings/${bookingId}/decline`, {}, token);
}

/**
 * Client or Provider cancels a booking
 */
export async function cancelBooking(bookingId, token = getAccessToken()) {
  return await apiPatch(`/bookings/${bookingId}/cancel`, {}, token);
}

/**
 * Initiate Escrow Payment via Campay (Client)
 */
export async function initiateEscrowPayment(bookingId, providerName, phoneNumber, token = getAccessToken()) {
  return await apiPost('/payments/initiate', {
    bookingId,
    providerName, // 'mtn' | 'orange'
    phoneNumber
  }, token);
}

/**
 * Verify Campay payment reference
 */
export async function verifyPayment(reference, token = getAccessToken()) {
  return await apiGet(`/payments/verify/${reference}`, token);
}

/**
 * Get payment record for booking
 */
export async function getPaymentByBooking(bookingId, token = getAccessToken()) {
  return await apiGet(`/payments/${bookingId}`, token);
}

/**
 * Provider verifies arrival OTP (starts session)
 */
export async function verifySessionOtp(sessionId, code, token = getAccessToken()) {
  return await apiPost(`/sessions/${sessionId}/verify-otp`, { code: String(code).trim() }, token);
}

/**
 * Provider marks session/job as completed
 */
export async function providerCompleteSession(sessionId, token = getAccessToken()) {
  return await apiPost(`/sessions/${sessionId}/complete`, {}, token);
}

/**
 * Client explicitly confirms session completion (releases escrow for session)
 */
export async function confirmSession(sessionId, token = getAccessToken()) {
  return await apiPost(`/sessions/${sessionId}/confirm`, {}, token);
}

/**
 * Dispute a session
 */
export async function disputeSession(sessionId, reason, token = getAccessToken()) {
  return await apiPost(`/sessions/${sessionId}/dispute`, { reason }, token);
}

/**
 * Skip a scheduled session occurrence
 */
export async function skipSession(sessionId, token = getAccessToken()) {
  return await apiPost(`/sessions/${sessionId}/skip`, {}, token);
}

/**
 * Submit review for completed booking
 */
export async function submitReview(reviewData, token = getAccessToken()) {
  return await apiPost('/reviews', reviewData, token);
}
