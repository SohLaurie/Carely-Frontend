import React from 'react'
import { Wallet, ArrowRight } from 'lucide-react'

export default function EarningsSummary({ onViewEarningsClick }) {
  return (
    <div className="bg-white border border-[#E2D9CF] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-semibold text-[#1C1A17] text-xs uppercase tracking-wider">Earnings</h3>
          <p className="text-[10px] text-[#8A7E74] font-medium">Pending payout</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
          <Wallet size={14} />
        </div>
      </div>

      <div className="space-y-1 pb-3.5 border-b border-[#EFECE6]">
        <p className="text-2xl font-bold text-[#1C1A17]">28,400 <span className="text-xs text-[#8A7E74] font-medium">XAF</span></p>
        <p className="text-[10px] text-[#8A7E74]">Payout on Friday &middot; Mobile Money</p>
      </div>

      <div className="space-y-2.5">
        <div className="flex justify-between text-xs font-semibold text-[#8A7E74]">
          <span>This month</span>
          <span className="text-[#1C1A17]">182,500 XAF</span>
        </div>
        <div className="flex justify-between text-xs font-semibold text-[#8A7E74]">
          <span>Last month</span>
          <span className="text-[#1C1A17]">164,000 XAF</span>
        </div>
        <div className="flex justify-between text-xs font-semibold text-[#8A7E74]">
          <span>Lifetime</span>
          <span className="text-[#1C1A17]">1.42M XAF</span>
        </div>
      </div>

      <button
        onClick={onViewEarningsClick}
        className="w-full border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-secondary font-semibold text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 mt-2"
      >
        <span>View earnings</span>
        <ArrowRight size={12} />
      </button>
    </div>
  )
}
