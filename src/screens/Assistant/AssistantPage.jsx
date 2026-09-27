/**
 * AssistantPage.jsx
 * Root container for the Carely AI Assistant.
 *
 * Modes:
 *  - Mini (default): compact floating window (w-80 / w-96, h-[480px])
 *  - Fullscreen: covers entire screen with sidebar + chat pane
 *
 * Auth states:
 *  - Logged-in: conversations persisted to DB, sidebar shows history
 *  - Guest: chat works but history lives in local state only, sidebar shows login prompt
 */
import { useState, useEffect, useCallback } from 'react'
import { Bot, X, Maximize2, Minimize2, PanelLeftOpen, PanelLeftClose } from 'lucide-react'
import AssistantChat from './AssistantChat'
import AssistantSidebar from './AssistantSidebar'
import {
  createConversation,
  listConversations,
  getMessages,
  sendMessage,
} from '../../services/assistantApi'
import { getStoredUser } from '../../services/api'

const WELCOME_MSG = {
  id: 'welcome',
  role: 'assistant',
  content: "Hello! I'm Carely Assistant 👋 I can help you with bookings, CareCredits, provider info, and anything else about the Carely platform. How can I help you today?",
}

export default function AssistantPage({ open, expanded, onClose, onToggleExpand, onNavigateLogin }) {
  const user = getStoredUser()
  const isLoggedIn = !!user

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [conversations, setConversations] = useState([])
  const [activeConvoId, setActiveConvoId] = useState(null)
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [loading, setLoading] = useState(false)
  const [convoLoading, setConvoLoading] = useState(false)

  // Load conversations list when opened (logged-in users only)
  useEffect(() => {
    if (open && isLoggedIn && expanded) {
      loadConversations()
    }
  }, [open, isLoggedIn, expanded])

  // Also load when expanding
  useEffect(() => {
    if (expanded && isLoggedIn) {
      loadConversations()
    }
  }, [expanded])

  const loadConversations = async () => {
    try {
      const list = await listConversations()
      setConversations(list)
    } catch {}
  }

  const handleNewChat = () => {
    setActiveConvoId(null)
    setMessages([WELCOME_MSG])
  }

  const handleSelectConvo = async (convo) => {
    if (convo.id === activeConvoId) return
    setConvoLoading(true)
    setActiveConvoId(convo.id)
    try {
      const msgs = await getMessages(convo.id)
      setMessages(msgs.length > 0 ? msgs : [WELCOME_MSG])
    } catch {
      setMessages([WELCOME_MSG])
    } finally {
      setConvoLoading(false)
    }
  }

  const handleSend = useCallback(async (text) => {
    if (loading) return

    // Optimistically add user message
    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: text }
    setMessages(prev => [...prev.filter(m => m.id !== 'welcome'), userMsg])
    setLoading(true)

    try {
      let convoId = activeConvoId
      let reply = null

      if (isLoggedIn) {
        try {
          // Create a new conversation if needed (logged-in users)
          if (!convoId) {
            const convo = await createConversation(text)
            convoId = convo.id
            setActiveConvoId(convoId)
            setConversations(prev => [convo, ...prev])
          }

          // Send via API — backend calls Gemini and persists both messages
          const apiReply = await sendMessage(convoId, text)
          reply = apiReply.content

          // Bump conversation to top
          setConversations(prev => {
            const updated = prev.map(c =>
              c.id === convoId ? { ...c, updated_at: new Date().toISOString() } : c
            )
            return [...updated].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          })
        } catch (authErr) {
          // Auth/conversation error — fall back to stateless guest mode
          console.warn('[Assistant] Authenticated route failed, falling back to guest:', authErr.message)
          reply = await sendGuestMessage(text, messages.filter(m => m.id !== 'welcome'))
        }
      } else {
        // Guest mode
        reply = await sendGuestMessage(text, messages.filter(m => m.id !== 'welcome'))
      }

      if (reply) {
        setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: reply }])
      }
    } catch (err) {
      console.error('[Assistant] Fatal error in handleSend:', err)
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [loading, activeConvoId, isLoggedIn, messages])

  const handleDeleted = (id) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (activeConvoId === id) handleNewChat()
  }

  const handleRenamed = (id, newTitle) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c))
  }

  if (!open) return null

  // ── Fullscreen Layout ────────────────────────────────────────────────────────
  if (expanded) {
    return (
      <div className="fixed inset-0 z-[99999] bg-[#FAF8F5] flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-[#1E4030] text-white flex items-center justify-between px-4 py-3 shadow-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(p => !p)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            >
              {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                Carely Assistant
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Fullscreen</span>
              </h3>
              <span className="text-[10px] text-white/60">Powered by Gemini · Carely AI</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleExpand}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              title="Exit fullscreen"
            >
              <Minimize2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {sidebarOpen && (
            <div className="w-64 sm:w-72 flex-shrink-0 border-r border-[#E2D9CF] overflow-hidden">
              <AssistantSidebar
                conversations={conversations}
                activeId={activeConvoId}
                onSelect={handleSelectConvo}
                onNewChat={handleNewChat}
                onDeleted={handleDeleted}
                onRenamed={handleRenamed}
                isLoggedIn={isLoggedIn}
                onNavigateLogin={onNavigateLogin}
              />
            </div>
          )}
          {/* Chat */}
          <div className="flex-1 overflow-hidden">
            {convoLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex gap-2 items-center text-[#8A7E74] text-sm">
                  <span className="w-2 h-2 bg-[#1E4030] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#1E4030] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#1E4030] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            ) : (
              <AssistantChat
                messages={messages}
                loading={loading}
                onSend={handleSend}
                isExpanded
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Mini (floating window) Layout ────────────────────────────────────────────
  return (
    <div className="w-80 sm:w-96 h-[480px] bg-white border border-[#E2D9CF] rounded-2xl shadow-xl flex flex-col overflow-hidden mb-4 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#1E4030] text-white flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
            <Bot size={16} className="text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Carely Assistant</h3>
            <span className="text-[10px] text-white/60">Powered by Carely AI</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleExpand}
            title="Fullscreen"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={onClose}
            title="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <AssistantChat
          messages={messages}
          loading={loading}
          onSend={handleSend}
          isExpanded={false}
        />
      </div>
    </div>
  )
}

// ── Guest fallback (no auth token) ──────────────────────────────────────────
// Calls the backend without a conversation ID; backend returns a one-off reply.
// For now we do a direct Gemini call via the backend's stateless guest route.
// If that fails, return a helpful canned response.
async function sendGuestMessage(text, history) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/assistant/guest`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, history: history.map(m => ({ role: m.role, content: m.content })) }),
      }
    )
    if (!res.ok) throw new Error()
    const data = await res.json()
    return data.content || data.reply || "I'm here to help! Please log in to get personalised answers."
  } catch {
    return "I'm here to help with Carely questions! Log in to unlock personalised answers about your bookings and CareCredits."
  }
}
