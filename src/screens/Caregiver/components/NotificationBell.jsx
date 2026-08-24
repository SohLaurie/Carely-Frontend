import React from 'react'
import { Bell } from 'lucide-react'

export default function NotificationBell({ count = 5, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full border border-[#E2D9CF] flex items-center justify-center text-[#1C1A17] hover:bg-secondary transition-all relative"
    >
      <Bell size={18} />
      {count > 0 && (
        <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
          {count}
        </span>
      )}
    </button>
  )
}
