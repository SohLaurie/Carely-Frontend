import React from 'react'

export default function StatCard({ label, value, subtext, iconBg, Icon }) {
  return (
    <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-2 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <span className="text-[10px] text-[#8A7E74] font-bold tracking-wider uppercase">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${iconBg}`}>
          <Icon size={14} className="fill-current" />
        </div>
      </div>
      <div className="space-y-0.5">
        <p className="text-2xl font-bold text-[#1C1A17]">{value}</p>
        <p className="text-[11px] text-[#8A7E74]">{subtext}</p>
      </div>
    </div>
  )
}
