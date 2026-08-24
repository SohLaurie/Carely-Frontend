import React from 'react'
import { TrendingUp } from 'lucide-react'

export default function DashboardHeader() {
  return (
    <div className="flex justify-end shrink-0">
      <div className="flex items-center gap-1 text-[11px] text-[#8A7E74] font-medium bg-white px-3 py-1 rounded-full border border-[#E2D9CF]">
        <TrendingUp size={12} className="text-[#1D6F42]" />
        <span>Profile views up <strong className="text-green-700">+24%</strong> this week</span>
      </div>
    </div>
  )
}
