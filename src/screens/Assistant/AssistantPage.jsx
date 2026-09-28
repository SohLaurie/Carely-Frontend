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
  sendGuestMessage,
} from '../../services/assistantApi'
import { getStoredUser } from '../../services/api'

const WELCOME_MSG = {
  id: 'welcome',
  role: 'assistant',
  content: "Hello! I'm Carely Assistant 👋 I can help you with bookings, CareCredits, provider info, and anything else about the Carely platform. How can I help you today?",
}

export default function AssistantPage({ currentUser: propUser, open, expanded, onClose, onToggleExpand, onNavigateLogin }) {
  const [currentUser, setCurrentUser] = useState(() => propUser || getStoredUser())
  const isLoggedIn = !!currentUser

  // Synchronize currentUser with localStorage & auth events
  useEffect(() => {
    const handleAuth = () => {
      setCurrentUser(getStoredUser())
    }
    window.addEventListener('carely_user_updated', handleAuth)
    window.addEventListener('carely_auth_cleared', handleAuth)
    window.addEventListener('storage', handleAuth)
    return () => {
      window.removeEventListener('carely_user_updated', handleAuth)
      window.removeEventListener('carely_auth_cleared', handleAuth)
      window.removeEventListener('storage', handleAuth)
    }
  }, [])

  // Sync if propUser changes
  useEffect(() => {
    if (propUser !== undefined) {
      setCurrentUser(propUser)
    }
  }, [propUser])

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [conversations, setConversations] = useState([])
  const [activeConvoId, setActiveConvoId] = useState(null)
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [loading, setLoading] = useState(false)
  const [convoLoading, setConvoLoading] = useState(false)

  // Critical: Reset chat state completely whenever user identity changes (login, logout, account switch)
  const currentUserId = currentUser?.id || null
  const prevUserIdRef = useRef(currentUserId)

  useEffect(() => {
    if (prevUserIdRef.current !== currentUserId) {
      prevUserIdRef.current = currentUserId
      setActiveConvoId(null)
      setConversations([])
      setMessages([WELCOME_MSG])
      if (currentUserId && open) {
        loadConversations()
      }
    }
  }, [currentUserId, open])

  // Load conversations list when opened (logged-in users only)
  useEffect(() => {
    if (open && isLoggedIn) {
      loadConversations()
    }
  }, [open, isLoggedIn])

  // Also reload when expanding
  useEffect(() => {
    if (expanded && isLoggedIn) {
      loadConversations()
    }
  }, [expanded, isLoggedIn])

  const loadConversations = async () => {
    try {
      const list = await listConversations()
      setConversations(Array.isArray(list) ? list : [])
    } catch {
      setConversations([])
    }
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
            setConversations(prev => [convo, ...prev.filter(c => c.id !== convo.id)])
          }

          let apiReply
          try {
            apiReply = await sendMessage(convoId, text)
          } catch (sendErr) {
            // If the conversation ID belongs to another session or was deleted (404),
            // auto-create a new conversation for this user rather than silently dropping to guest!
            if (sendErr?.status === 404) {
              const freshConvo = await createConversation(text)
              convoId = freshConvo.id
              setActiveConvoId(convoId)
              setConversations(prev => [freshConvo, ...prev.filter(c => c.id !== freshConvo.id)])
              apiReply = await sendMessage(convoId, text)
            } else {
              throw sendErr
            }
          }

          reply = apiReply?.content

          // Bump conversation to top
          setConversations(prev => {
            const updated = prev.map(c =>
              c.id === convoId ? { ...c, updated_at: new Date().toISOString() } : c
            )
            return [...updated].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          })
        } catch (authErr) {
          // If token expired (401), fall back to stateless guest mode
          if (authErr?.status === 401) {
            console.warn('[Assistant] Auth expired, falling back to guest:', authErr.message)
            const guestRes = await sendGuestMessage(text, messages.filter(m => m.id !== 'welcome'))
            reply = guestRes?.content || guestRes?.reply || (typeof guestRes === 'string' ? guestRes : '')
          } else {
            throw authErr
          }
        }
      } else {
        // Guest mode
        const guestRes = await sendGuestMessage(text, messages.filter(m => m.id !== 'welcome'))
        reply = guestRes?.content || guestRes?.reply || (typeof guestRes === 'string' ? guestRes : '')
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
    <div className="fixed bottom-24 right-4 sm:right-6 z-[9999] w-[calc(100vw-2rem)] sm:w-96 h-[520px] max-h-[calc(100vh-7.5rem)] bg-white border border-[#E2D9CF] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
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

