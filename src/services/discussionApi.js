import { apiGet, apiPost, apiPatch, apiDelete, getAccessToken } from './api';

const API_ORIGIN = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE_URL = `${API_ORIGIN}/api`;

/**
 * List all conversations for the authenticated user
 */
export async function fetchDiscussions(token = getAccessToken()) {
  const res = await apiGet('/discussions', token);
  return res.conversations || [];
}

/**
 * List available contacts (clients & providers) with optional search and role filter
 */
export async function fetchContacts(search = '', role = 'all', token = getAccessToken()) {
  try {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (role && role !== 'all') query.append('role', role);
    const qStr = query.toString() ? `?${query.toString()}` : '';
    const res = await apiGet(`/users/contacts${qStr}`, token);
    return res.contacts || [];
  } catch (err) {
    console.warn('fetchContacts error:', err.message);
    return [];
  }
}

/**
 * Get or create a conversation with a recipient user
 */
export async function getOrCreateDiscussion(recipientId, token = getAccessToken()) {
  const res = await apiPost('/discussions', { recipientId }, token);
  return res.conversation || null;
}

/**
 * Fetch all messages for a specific conversation (marks unread as read)
 */
export async function fetchMessages(discussionId, token = getAccessToken()) {
  const res = await apiGet(`/discussions/${discussionId}/messages`, token);
  return res.messages || [];
}

/**
 * Send a message in a conversation (text and/or attachment)
 */
export async function sendMessageApi(discussionId, payload, token = getAccessToken()) {
  const res = await apiPost(`/discussions/${discussionId}/messages`, payload, token);
  return res.message || null;
}

/**
 * Explicitly mark all incoming messages in a conversation as read
 */
export async function markDiscussionAsRead(discussionId, token = getAccessToken()) {
  return await apiPatch(`/discussions/${discussionId}/read`, {}, token);
}

/**
 * Delete a specific message
 */
export async function deleteDiscussionMessage(discussionId, messageId, token = getAccessToken()) {
  return await apiDelete(`/discussions/${discussionId}/messages/${messageId}`, token);
}

/**
 * Clear chat history of a conversation
 */
export async function clearDiscussionChat(discussionId, token = getAccessToken()) {
  return await apiDelete(`/discussions/${discussionId}/clear`, token);
}

/**
 * Delete a conversation thread
 */
export async function deleteDiscussionThread(discussionId, token = getAccessToken()) {
  return await apiDelete(`/discussions/${discussionId}`, token);
}

/**
 * Upload chat attachment (Image or Document)
 */
export async function uploadChatFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/upload/document`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload attachment');
  }

  const fullUrl = data.url?.startsWith('http') ? data.url : `${API_ORIGIN}${data.url}`;

  return {
    url: fullUrl,
    filename: data.filename,
    originalName: data.originalName,
    size: data.size,
    mimetype: data.mimetype,
    type: data.type || (data.mimetype?.startsWith('image/') ? 'image' : 'document')
  };
}
