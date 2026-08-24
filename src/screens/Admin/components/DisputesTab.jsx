import React from 'react';
import { Clock, ShieldAlert, CheckCircle } from 'lucide-react';

export default function DisputesTab({ disputes, setSelectedDispute }) {
  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div>
        <h2 className="text-[#1C1A17] font-display text-xl font-bold flex items-center gap-2">
          Open Disputes
          <span className="bg-red-100 text-[#991B1B] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-red-200">
            {disputes.length} open
          </span>
        </h2>
        <p className="text-xs text-[#8A7E74]">
          Review evidence, contact both parties and release escrow with a resolution note.
        </p>
      </div>

      {/* Disputes Queue */}
      <div className="space-y-4">
        {disputes.length === 0 ? (
          <div className="bg-white border border-[#E2D9CF] rounded-2xl p-12 text-center text-xs text-[#8A7E74] shadow-sm">
            <CheckCircle size={32} className="mx-auto text-green-600 mb-2.5" />
            No open disputes at this time. All escrows have been settled.
          </div>
        ) : (
          disputes.map((disp) => {
            let statusBadge = 'bg-gray-50 text-gray-700 border-gray-200';
            if (disp.urgency === 'high') {
              statusBadge = 'bg-red-50 text-red-700 border-red-200';
            } else if (disp.urgency === 'medium') {
              statusBadge = 'bg-amber-50 text-amber-700 border-amber-200';
            } else if (disp.urgency === 'breached') {
              statusBadge = 'bg-red-100 text-[#991B1B] border-red-200 animate-pulse';
            }

            return (
              <div
                key={disp.id}
                className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[10px] bg-secondary border border-[#E2D9CF] px-2 py-0.5 rounded-md font-mono font-bold text-[#1C1A17]">
                      {disp.id}
                    </span>
                    <h3 className="font-semibold text-xs text-[#1C1A17]">{disp.title}</h3>
                  </div>
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge} flex items-center gap-1 shrink-0`}>
                    <Clock size={10} />
                    {disp.raisedTime} &middot; {disp.timeLeft}
                  </span>
                </div>

                {/* Dispute details description */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-[#1C1A17]">Issue Details</p>
                  <p className="text-xs text-[#8A7E74] leading-relaxed bg-[#FAF8F5] border border-[#EFECE6] p-3.5 rounded-xl">
                    {disp.description}
                  </p>
                </div>

                {/* Bottom line with payout and action */}
                <div className="flex items-center justify-between gap-4 pt-1.5">
                  <div className="text-xs text-[#1C1A17]">
                    Escrow held: <strong className="text-[#1E4030] font-bold">{disp.escrowAmount}</strong>
                  </div>
                  <button
                    onClick={() => setSelectedDispute(disp)}
                    className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert size={12} />
                    Review Dispute
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
