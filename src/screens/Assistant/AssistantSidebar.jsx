/**
 * AssistantSidebar.jsx
 * Collapsible left sidebar listing conversation history.
 * Only visible / functional for authenticated users.
 */
import { useState } from 'react'
import { Plus, Trash2, Pencil, Check, X, MessageSquare, LogIn } from 'lucide-react'
import { renameConversation, deleteConversation } from '../../services/assistantApi'

export default function AssistantSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDeleted,
  onRenamed,
  isLoggedIn,
  onNavigateLogin,
}) {
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const startRename = (convo, e) => {
    e.stopPropagation()
    setRenamingId(convo.id)
    setRenameValue(convo.title)
  }

  const confirmRename = async (id, e) => {
    e?.stopPropagation()
    if (!renameValue.trim()) return
    try {
      await renameConversation(id, renameValue.trim())
      onRenamed(id, renameValue.trim())
    } catch {}
    setRenamingId(null)
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    setDeletingId(id)
    try {
      await deleteConversation(id)
      onDeleted(id)
    } catch {}
    setDeletingId(null)
  }

  return (
    <div className="flex flex-col h-full bg-[#1E4030] text-white w-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center gap-3 py-8">
            <MessageSquare size={28} className="text-white/40" />
            <p className="text-xs text-white/60 leading-relaxed">
              Log in to save and access your conversation history
            </p>
            <button
              onClick={onNavigateLogin}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <LogIn size={14} />
              Log in
            </button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center py-8">
            <MessageSquare size={28} className="text-white/40 mb-2" />
            <p className="text-xs text-white/60">No conversations yet. Start a new chat!</p>
          </div>
        ) : (
          conversations.map((convo) => (
            <div
              key={convo.id}
              onClick={() => onSelect(convo)}
              className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer mb-1 transition-colors ${
                activeId === convo.id
                  ? 'bg-white/20 text-white'
                  : 'hover:bg-white/10 text-white/80'
              }`}
            >
              {renamingId === convo.id ? (
                <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmRename(convo.id)
                      if (e.key === 'Escape') setRenamingId(null)
                    }}
                    className="flex-1 bg-white/10 border border-white/30 text-white text-xs rounded-lg px-2 py-1 outline-none min-w-0"
                  />
                  <button onClick={(e) => confirmRename(convo.id, e)} className="text-green-300 hover:text-green-100 cursor-pointer">
                    <Check size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setRenamingId(null) }} className="text-red-300 hover:text-red-100 cursor-pointer">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <MessageSquare size={14} className="flex-shrink-0 text-white/50" />
                  <span className="text-xs flex-1 truncate">{convo.title}</span>
                  {/* Hover action buttons */}
                  <div className="hidden group-hover:flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => startRename(convo, e)}
                      className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white cursor-pointer transition-colors"
                      title="Rename"
                    >
                      <Pencil size={11} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(convo.id, e)}
                      disabled={deletingId === convo.id}
                      className="w-6 h-6 rounded-md bg-white/10 hover:bg-red-500/60 flex items-center justify-center text-white/70 hover:text-white cursor-pointer transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer branding */}
      <div className="p-4 border-t border-white/10">
        <p className="text-[10px] text-white/40 text-center">Carely Assistant · Powered by Gemini</p>
      </div>
    </div>
  )
}
