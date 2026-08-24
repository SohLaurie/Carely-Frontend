import React from 'react';
import { BarChart3, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';

export default function AnalyticsTab() {
  const stats = [
    { label: 'GMV (Nov)', value: '25.7M XAF', trend: '+12.4%', isPositive: true },
    { label: 'New Households', value: '412', trend: '+9%', isPositive: true },
    { label: 'New Caregivers', value: '68', trend: '+18%', isPositive: true },
    { label: 'Cancellation Rate', value: '4.2%', trend: '-0.6pp', isPositive: true }, // positive improvement
    { label: 'Avg. Rating', value: '4.82', trend: '+0.03', isPositive: true },
    { label: 'Disputes / 1K Bookings', value: '1.4', trend: '-0.3', isPositive: true }  // positive improvement
  ];

  const serviceMix = [
    { name: 'Home Nursing', percent: 34 },
    { name: 'Elderly Care', percent: 22 },
    { name: 'Babysitting', percent: 18 },
    { name: 'Post-op Care', percent: 14 },
    { name: 'Domestic Help', percent: 12 }
  ];

  return (
    <div className="space-y-6">
      {/* Header section with chart icon */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[#EFECE6] border border-[#E2D9CF] rounded-xl flex items-center justify-center text-[#8A7E74] shrink-0">
          <BarChart3 size={18} />
        </div>
        <div>
          <h2 className="text-[#1C1A17] font-display text-xl font-bold">Analytics</h2>
          <p className="text-xs text-[#8A7E74]">Platform-wide growth, revenue and quality metrics.</p>
        </div>
      </div>

      {/* 3x2 Grid of Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">{stat.label}</span>
              <div className="text-2xl font-bold text-[#1C1A17] font-display">{stat.value}</div>
            </div>
            
            {/* Trend badge */}
            <span className="inline-flex items-center gap-0.5 bg-[#EDF7F2] text-[#1D6F42] border border-green-200 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0">
              {stat.trend.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              {stat.trend}
            </span>
          </div>
        ))}
      </div>

      {/* Main Split Grid */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        
        {/* Left Column: Bookings volume - last 5 months */}
        <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-semibold text-[#1C1A17] text-sm">Bookings volume &middot; last 5 months</h3>
            <p className="text-[10px] text-[#8A7E74]">In hundreds</p>
          </div>

          {/* SVG line chart layout */}
          <div className="h-60 pt-4 flex flex-col justify-between relative">
            <div className="flex-1 w-full relative">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="w-full border-t border-[#EFECE6]/80"></div>
                <div className="w-full border-t border-[#EFECE6]/80"></div>
                <div className="w-full border-t border-[#EFECE6]/80"></div>
                <div className="w-full border-t border-[#EFECE6]/80"></div>
              </div>

              {/* Line Chart Path */}
              <svg className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none">
                {/* Gradient Fill under Line */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E4030" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#1E4030" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Shaded Area */}
                <path
                  d="M 50 150 Q 150 120 250 80 T 450 30 L 450 180 L 50 180 Z"
                  fill="url(#chartGradient)"
                  className="transition-all duration-500"
                />

                {/* Stroke line */}
                <path
                  d="M 50 150 Q 150 120 250 80 T 450 30"
                  fill="none"
                  stroke="#1E4030"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />

                {/* Data Points */}
                <circle cx="50" cy="150" r="4.5" fill="#FFFFFF" stroke="#1E4030" strokeWidth="2.5" />
                <circle cx="150" cy="122" r="4.5" fill="#FFFFFF" stroke="#1E4030" strokeWidth="2.5" />
                <circle cx="250" cy="80" r="4.5" fill="#FFFFFF" stroke="#1E4030" strokeWidth="2.5" />
                <circle cx="350" cy="55" r="4.5" fill="#FFFFFF" stroke="#1E4030" strokeWidth="2.5" />
                <circle cx="450" cy="30" r="4.5" fill="#FFFFFF" stroke="#1E4030" strokeWidth="2.5" />
              </svg>
            </div>

            {/* X-Axis labels matching grid */}
            <div className="flex justify-between text-[10px] font-bold text-[#8A7E74] pt-2 px-6 border-t border-[#EFECE6]">
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
            </div>
          </div>
        </div>

        {/* Right Column: Service mix */}
        <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-semibold text-[#1C1A17] text-sm">Service mix</h3>
            <p className="text-[10px] text-[#8A7E74]">Share of bookings this month</p>
          </div>

          <div className="space-y-4 pt-2">
            {serviceMix.map((mix, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-[#1C1A17]">
                  <span>{mix.name}</span>
                  <span className="text-[#8A7E74]">{mix.percent}%</span>
                </div>
                
                {/* Bar progress indicator */}
                <div className="w-full bg-[#EFECE6] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1E4030] h-full rounded-full transition-all duration-500"
                    style={{ width: `${mix.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
