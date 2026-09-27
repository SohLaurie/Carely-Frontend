/**
 * AssistantChat.jsx
 * Main chat pane — shows messages, typing indicator, suggestion chips, and input bar.
 */
import { useEffect, useRef, useState } from 'react'
import { Send, Bot } from 'lucide-react'

const SUGGESTIONS = [
  'How do CareCredits work?',
  'How does escrow payment work?',
  'How do I book a caregiver?',
  'What is the OTP arrival check?',
  'How do I earn CareCredits via referral?',
  'What services does Carely offer?',
]

export default function AssistantChat({ messages, loading, onSend, isExpanded }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    onSend(text)
  }

  const handleSuggestion = (text) => {
    if (loading) return
    onSend(text)
  }

  const showSuggestions = messages.length === 0 || (messages.length === 1 && messages[0].role === 'assistant')

  return (
    <div className="flex flex-col h-full">
      {/* ── Messages area ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF8F5]">
        <div className={`space-y-4 ${isExpanded ? 'max-w-3xl mx-auto' : ''}`}>
          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full pt-12 pb-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1E4030]/10 flex items-center justify-center mb-4">
                <Bot size={32} className="text-[#1E4030]" />
              </div>
              <h3 className="text-base font-semibold text-[#1C1A17] mb-1">How can I help you?</h3>
              <p className="text-sm text-[#8A7E74] max-w-xs">
                I'm your Carely Assistant. Ask me anything about bookings, payments, CareCredits, or how to find the right caregiver.
              </p>
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-[#1E4030] flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[#1E4030] text-white rounded-tr-none shadow-sm'
                    : 'bg-white text-[#1C1A17] border border-[#E2D9CF] rounded-tl-none shadow-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-lg bg-[#1E4030] flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-white border border-[#E2D9CF] rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-[#8A7E74] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#8A7E74] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#8A7E74] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Suggestion chips ─────────────────────────────────────────────── */}
      {showSuggestions && (
        <div className="px-4 sm:px-6 pb-2 pt-1 bg-[#FAF8F5]">
          <div className={`flex flex-wrap gap-2 ${isExpanded ? 'max-w-3xl mx-auto' : ''}`}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                disabled={loading}
                className="bg-white border border-[#E2D9CF] hover:bg-green-50 hover:border-[#1E4030]/40 text-xs text-[#1E4030] font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input bar ────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-[#E2D9CF] bg-white p-3 sm:p-4"
      >
        <div className={`flex gap-3 items-center ${isExpanded ? 'max-w-3xl mx-auto' : ''}`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Carely Assistant anything…"
            disabled={loading}
            className="flex-1 text-sm px-4 py-3 border border-[#E2D9CF] rounded-2xl outline-none focus:ring-2 focus:ring-[#1E4030]/20 focus:border-[#1E4030] bg-[#FAF8F5] text-[#1C1A17] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-[#1E4030] hover:bg-[#152e22] text-white px-4 py-3 rounded-2xl transition-colors disabled:opacity-40 flex items-center gap-2 cursor-pointer shadow-sm font-semibold text-sm"
          >
            <Send size={15} />
          </button>
        </div>
      </form>
    </div>
  )
}
