import React from 'react'
import { MapPin, Clock, Eye } from 'lucide-react'

export default function RequestCard({
  request,
  onViewDetails,
  onDecline,
  onAccept,
  isDetailedView = false
}) {
  const r = request
  return (
    <div className={`bg-white border border-[#E2D9CF] rounded-3xl shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-6 relative overflow-hidden ${isDetailedView ? 'p-6' : 'py-4.5 first:pt-0 last:pb-0 border-none'}`}>
      <div className="flex items-start gap-4">
        {/* Circle badge */}
        <div className={`rounded-full bg-[#EFECE6] border border-[#E2D9CF] text-primary flex items-center justify-center font-bold shrink-0 ${isDetailedView ? 'w-12 h-12 text-sm' : 'w-10 h-10 text-xs'}`}>
          {r.initials}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className={`font-bold text-[#1C1A17] ${isDetailedView ? 'text-base' : 'text-xs'}`}>{r.clientName}</h3>
            <span className="text-[10px] bg-secondary text-primary border border-[#E2D9CF] px-2.5 py-0.5 rounded-full font-bold">
              {r.specialty}
            </span>
            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold">
              {r.timeLeft}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#8A7E74] flex-wrap">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} />
              {r.location}
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-[#1C1A17]">
              <Clock size={13} />
              {r.date} &middot; {r.time}
            </span>
          </div>
          <p className="text-[10px] text-[#8A7E74]">{r.sessionType}</p>
          {isDetailedView && (
            <p className="text-base font-bold text-[#1C1A17] pt-1">
              {r.id === 'REQ102' ? '168,000 XAF total' : '14,000 XAF'}
            </p>
          )}
        </div>
      </div>

      <div className={`flex items-center gap-2 shrink-0 ${isDetailedView ? 'self-end md:self-center' : 'md:self-center'}`}>
        <button
          onClick={() => onViewDetails(r)}
          className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-secondary font-semibold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1"
        >
          <Eye size={12} />
          View
        </button>
        <button
          onClick={() => onDecline(r.id)}
          className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-secondary font-semibold text-xs px-3.5 py-1.5 rounded-xl transition-all"
        >
          Decline
        </button>
        <button
          onClick={() => onAccept(r.id)}
          className="bg-[#1E4030] hover:bg-[#152e22] text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl transition-all"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
