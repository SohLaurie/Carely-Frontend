import React, { useState, useRef, useEffect } from 'react'
import {
  Bell, Check, Reply, MessageSquare, Calendar, Wallet, Star, ArrowRight, X
} from 'lucide-react'

export default function NotificationBell({
  count = 5,
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onReplyClick,
  onViewAll
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const getIcon = (type) => {
    if (type === 'request') return Calendar
    if (type === 'payout') return Wallet
    if (type === 'message') return MessageSquare
    if (type === 'review') return Star
    return Bell
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full border border-[#E2D9CF] flex items-center justify-center text-[#1C1A17] hover:bg-[#FAF8F5] transition-all relative cursor-pointer"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {count > 0 && (
          <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {count}
          </span>
        )}
      </button>

      {/* Notifications Popover Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E2D9CF] rounded-3xl shadow-2xl z-[9999] overflow-hidden animate-fadeIn">
          {/* Popover Header */}
          <div className="p-4 bg-[#1E4030] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-white" />
              <h4 className="font-bold text-sm">Notifications</h4>
              {count > 0 && (
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  {count} unread
                </span>
              )}
            </div>
            {onMarkAllRead && (
              <button
                onClick={() => {
                  onMarkAllRead()
                }}
                className="text-[11px] font-semibold text-white/80 hover:text-white underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Popover Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#F0EBE5]">
            {notifications.slice(0, 6).map(n => {
              const IconComp = getIcon(n.type)
              return (
                <div
                  key={n.id}
                  className={`p-3.5 flex items-start gap-3 transition-colors ${
                    n.unread ? 'bg-[#EDF7F2]/40 hover:bg-[#EDF7F2]/70' : 'bg-white hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E2D9CF] text-[#1E4030] flex items-center justify-center shrink-0 mt-0.5">
                    <IconComp size={14} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="font-bold text-xs text-[#1C1A17] truncate">{n.title}</h5>
                      <span className="text-[9px] text-[#8A7E74] shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#8A7E74] line-clamp-2 leading-relaxed">{n.description || n.text}</p>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {onReplyClick && (
                        <button
                          onClick={() => {
                            setOpen(false)
                            onReplyClick(n)
                          }}
                          className="text-[10px] font-bold text-[#1E4030] bg-[#FAF8F5] border border-[#E2D9CF] hover:bg-[#1E4030] hover:text-white px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Reply size={10} />
                          <span>Reply</span>
                        </button>
                      )}
                      {onMarkRead && (
                        <button
                          onClick={() => onMarkRead(n.id)}
                          className="text-[10px] font-semibold text-[#8A7E74] hover:text-[#1C1A17] flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={11} className={n.unread ? "text-green-600 font-bold" : ""} />
                          <span>{n.unread ? "Mark read" : "Mark unread"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {notifications.length === 0 && (
              <div className="p-8 text-center text-[#8A7E74] space-y-1">
                <Bell size={24} className="mx-auto text-[#8A7E74]/40" />
                <p className="text-xs font-semibold">No notifications</p>
              </div>
            )}
          </div>

          {/* Popover Footer */}
          <div className="p-3 bg-[#FAF8F5] border-t border-[#E2D9CF] text-center">
            <button
              onClick={() => {
                setOpen(false)
                if (onViewAll) onViewAll()
              }}
              className="text-xs font-bold text-[#1E4030] hover:underline flex items-center justify-center gap-1 w-full cursor-pointer"
            >
              <span>View All Notifications</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
