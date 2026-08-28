import React from 'react'
import { MapPin, Clock, Eye, Check, X } from 'lucide-react'

export default function RequestCard({
  request,
  onViewDetails,
  onDecline,
  onAccept,
  isDetailedView = false
}) {
  const r = request
  return (
    <div className={`bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl transition-all shadow-2xs flex flex-col md:flex-row justify-between md:items-center gap-4 ${isDetailedView ? 'p-6 sm:p-7 bg-white rounded-3xl' : 'p-4 sm:p-5'}`}>
      <div className="flex items-start gap-4">
        {/* Circle badge */}
        <div className={`rounded-2xl bg-[#EDF7F2] border border-green-200 text-[#1E4030] flex items-center justify-center font-bold shrink-0 shadow-2xs ${isDetailedView ? 'w-13 h-13 text-base' : 'w-11 h-11 text-xs'}`}>
          {r.initials}
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className={`font-bold text-[#1C1A17] ${isDetailedView ? 'text-base' : 'text-sm'}`}>{r.clientName}</h3>
            <span className="text-[10px] bg-white text-[#1E4030] border border-[#E2D9CF] px-2.5 py-0.5 rounded-full font-bold">
              {r.specialty}
            </span>
            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold">
              {r.timeLeft}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#8A7E74] flex-wrap">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#1E4030]" />
              {r.location}
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-[#1C1A17]">
              <Clock size={13} className="text-[#1E4030]" />
              {r.date} &middot; {r.time}
            </span>
          </div>
          <p className="text-[11px] text-[#8A7E74]">{r.sessionType}</p>
          {isDetailedView && (
            <p className="text-base font-extrabold text-[#1E4030] pt-1">
              {r.id === 'REQ102' ? '168,000 XAF total' : '14,000 XAF'}
            </p>
          )}
        </div>
      </div>

      <div className={`flex items-center gap-2 shrink-0 ${isDetailedView ? 'self-end md:self-center' : 'self-end md:self-center'}`}>
        <button
          onClick={() => onViewDetails(r)}
          className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-[#FAF8F5] font-semibold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs"
        >
          <Eye size={12} />
          View
        </button>
        <button
          onClick={() => onDecline(r.id)}
          className="border border-red-200 bg-white text-red-600 hover:bg-red-50 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
        >
          Decline
        </button>
        <button
          onClick={() => onAccept(r.id)}
          className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
