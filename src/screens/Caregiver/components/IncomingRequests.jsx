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
    <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-[#1C1A17] text-sm">Incoming Requests</h3>
        {showViewAll && (
          <button
            onClick={onViewAllClick}
            className="text-xs text-[#1E4030] font-bold flex items-center gap-1 hover:underline"
          >
            <span>View all</span>
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      <div className="divide-y divide-[#E2D9CF]">
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
