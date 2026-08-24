import React from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CalendarWidget({
  onFullViewClick,
  selectedDay,
  setSelectedDay,
  dayStates
}) {
  return (
    <div className="bg-white border border-[#E2D9CF] rounded-3xl p-5 shadow-sm space-y-4 relative">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-[#1C1A17] text-xs uppercase tracking-wider">Calendar</h3>
        <button
          onClick={onFullViewClick}
          className="text-xs text-[#1E4030] font-bold flex items-center gap-0.5 hover:underline"
        >
          <span>Full view</span>
          <ArrowRight size={12} />
        </button>
      </div>
      <div>
        <h4 className="text-xs text-[#8A7E74] font-semibold mb-3">November 2026</h4>
        
        {/* Days label row */}
        <div className="grid grid-cols-7 text-center text-[10px] text-[#8A7E74] font-bold mb-2">
          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
        </div>

        {/* Calendar Grid Numbers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
          <span className="text-[#8A7E74]/30 py-1">26</span>
          <span className="text-[#8A7E74]/30 py-1">27</span>
          <span className="text-[#8A7E74]/30 py-1">28</span>
          <span className="text-[#8A7E74]/30 py-1">29</span>
          <span className="text-[#8A7E74]/30 py-1">30</span>
          <span className="text-[#8A7E74]/30 py-1">31</span>
          <span className="py-1 text-[#8A7E74]">1</span>
          
          {/* Highlighted Booked / Blocked / Available days */}
          <span className="py-1 bg-[#EDF7F2] text-[#1E4030] rounded-full border border-green-200">2</span>
          <span className="py-1 text-[#1C1A17]">3</span>
          <span className="py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-300 font-bold">4</span>
          <span className="py-1 bg-[#EDF7F2] text-[#1E4030] rounded-full border border-green-200">5</span>
          <span className="py-1 bg-[#EDF7F2] text-[#1E4030] rounded-full border border-green-200">6</span>
          <span className="py-1 text-[#1C1A17]">7</span>
          <span className="py-1 bg-[#EDF7F2] text-[#1E4030] rounded-full border border-green-200">8</span>
          <span className="py-1 text-[#1C1A17]">9</span>
          <span className="py-1 text-[#1C1A17]">10</span>
          <span className="py-1 text-red-650 line-through">11</span>
          <span className="py-1 bg-[#EDF7F2] text-[#1E4030] rounded-full border border-green-200">12</span>
          <span className="py-1 text-[#1C1A17]">13</span>
          <span className="py-1 bg-[#EDF7F2] text-[#1E4030] rounded-full border border-green-200">14</span>
          <span className="py-1 text-[#1C1A17]">15</span>
          <span className="py-1 text-[#1C1A17]">16</span>
          <span className="py-1 text-[#1C1A17]">17</span>
          <span className="py-1 text-red-650 line-through">18</span>
          <span className="py-1 bg-[#EDF7F2] text-[#1E4030] rounded-full border border-green-200">19</span>
          <span className="py-1 text-[#1C1A17]">20</span>
          <span className="py-1 bg-[#EDF7F2] text-[#1E4030] rounded-full border border-green-200">21</span>
          <span className="py-1 text-[#1C1A17]">22</span>
          <span className="py-1 text-[#1C1A17]">23</span>
          <span className="py-1 text-[#1C1A17]">24</span>
          <span className="py-1 text-red-650 line-through">25</span>
          <span className="py-1 bg-[#EDF7F2] text-[#1E4030] rounded-full border border-green-200">26</span>
          <span className="py-1 text-[#1C1A17]">27</span>
          <span className="py-1 text-[#1C1A17]">28</span>
          <span className="py-1 text-[#1C1A17]">29</span>
          <span className="py-1 text-[#1C1A17]">30</span>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[9px] text-[#8A7E74] font-bold mt-4 pt-3 border-t border-[#EFECE6]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full border border-[#E2D9CF] bg-white"></span>
            Available
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#1E4030]"></span>
            Booked
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            Blocked
          </span>
        </div>
      </div>

      {/* Floating plus action button inside calendar */}
      <button className="absolute bottom-11 right-5 w-8 h-8 rounded-full bg-[#1E4030] text-white hover:bg-[#152e22] flex items-center justify-center shadow-lg transition-transform hover:scale-105">
        <Sparkles size={13} />
      </button>
    </div>
  )
}
