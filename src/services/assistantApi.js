/**
 * assistantApi.js — API calls for Carely Assistant
 * All requests use the existing api.js helpers (auth token auto-attached).
 */
import { apiGet, apiPost, apiPatch, apiDelete } from './api'

const BASE = '/assistant/conversations'

// Create a new conversation (optionally pre-title it with first message text)
export async function createConversation(firstMessage = '') {
  return apiPost(BASE, { firstMessage })
}

// List all conversations for the current user (most recent first)
export async function listConversations() {
  return apiGet(BASE)
}

// Get all messages in a conversation
export async function getMessages(conversationId) {
  return apiGet(`${BASE}/${conversationId}/messages`)
}

// Send a message and get the assistant reply
export async function sendMessage(conversationId, content) {
  return apiPost(`${BASE}/${conversationId}/messages`, { content })
}

// Delete a conversation (and all its messages via cascade)
export async function deleteConversation(conversationId) {
  return apiDelete(`${BASE}/${conversationId}`)
}

// Rename a conversation
export async function renameConversation(conversationId, title) {
  return apiPatch(`${BASE}/${conversationId}`, { title })
}
