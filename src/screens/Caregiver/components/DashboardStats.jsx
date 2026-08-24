import React from 'react'
import { ClipboardList, Calendar, Wallet, Star } from 'lucide-react'
import StatCard from './StatCard'

export default function DashboardStats({ pendingCount = 3, upcomingCount = 5 }) {
  const metrics = [
    { label: 'PENDING REQUESTS', value: String(pendingCount), subtext: '2 respond today', iconBg: 'bg-amber-50 text-amber-700 border-amber-200', Icon: ClipboardList },
    { label: 'UPCOMING SESSIONS', value: String(upcomingCount), subtext: 'This week', iconBg: 'bg-green-50 text-[#1D6F42] border-green-200', Icon: Calendar },
    { label: "THIS WEEK'S EARNINGS", value: '42,800 XAF', subtext: '+18% vs last week', iconBg: 'bg-[#EDF7F2] text-[#1E4030] border-green-200', Icon: Wallet },
    { label: 'RATING', value: '4.9', subtext: '47 reviews', iconBg: 'bg-amber-50 text-amber-700 border-amber-200', Icon: Star }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
      {metrics.map((metric, idx) => (
        <StatCard
          key={idx}
          label={metric.label}
          value={metric.value}
          subtext={metric.subtext}
          iconBg={metric.iconBg}
          Icon={metric.Icon}
        />
      ))}
    </div>
  )
}
