import { apiGet, apiPatch, apiDelete, getAccessToken } from './api';

/**
 * Fetch all notifications for the current user.
 * Returns { notifications: [...], unreadCount: N }
 */
export async function fetchNotifications(token = getAccessToken()) {
  const res = await apiGet('/notifications', token);
  return res || { notifications: [], unreadCount: 0 };
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationRead(id, token = getAccessToken()) {
  return await apiPatch(`/notifications/${id}/read`, {}, token);
}

/**
 * Mark ALL notifications as read.
 */
export async function markAllNotificationsReadApi(token = getAccessToken()) {
  return await apiPatch('/notifications/read-all', {}, token);
}

/**
 * Toggle archive state on a notification.
 */
export async function toggleArchiveNotification(id, token = getAccessToken()) {
  return await apiPatch(`/notifications/${id}/archive`, {}, token);
}

/**
 * Delete a notification permanently.
 */
export async function deleteNotificationApi(id, token = getAccessToken()) {
  return await apiDelete(`/notifications/${id}`, token);
}
