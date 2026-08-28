import React from 'react'
import { ArrowRight, ClipboardList } from 'lucide-react'
import RequestCard from './RequestCard'

export default function IncomingRequests({
  requests,
  onViewDetails,
  onDecline,
  onAccept,
  onViewAllClick,
  showViewAll = true
}) {
  return (
    <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-[#F0EBE5]">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} className="text-[#1E4030]" />
          <h3 className="font-bold text-[#1C1A17] text-sm">Incoming Requests</h3>
          <span className="text-[10px] bg-[#EDF7F2] text-[#1E4030] font-bold px-2 py-0.5 rounded-full border border-green-200">
            {requests.length} New
          </span>
        </div>
        {showViewAll && (
          <button
            onClick={onViewAllClick}
            className="text-xs text-[#1E4030] font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      <div className="space-y-3.5 pt-1">
        {requests.map(r => (
          <RequestCard
            key={r.id}
            request={r}
            onViewDetails={onViewDetails}
            onDecline={onDecline}
            onAccept={onAccept}
          />
        ))}
        {requests.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xs text-[#8A7E74]">No incoming requests at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
