import React from 'react'
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'

export default function CalendarWidget({
  onFullViewClick,
  selectedDay,
  setSelectedDay,
  dayStates = {},
  calendarDate = new Date(),
  onPrevMonth,
  onNextMonth
}) {
  const year = calendarDate.getFullYear()
  const month = calendarDate.getMonth()
  const monthName = calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const firstDayIndex = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()

  return (
    <div className="bg-white border border-[#E2D9CF] rounded-3xl p-5 shadow-sm space-y-4 relative">
      <div className="flex justify-between items-center pb-2 border-b border-[#F0EBE5]">
        <h3 className="font-bold text-[#1C1A17] text-xs uppercase tracking-wider">Calendar</h3>
        <button
          onClick={onFullViewClick}
          className="text-xs text-[#1E4030] font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
        >
          <span>Full view</span>
          <ArrowRight size={12} />
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-[#1C1A17]">{monthName}</h4>
          <div className="flex items-center gap-1">
            <button
              onClick={onPrevMonth}
              title="Previous month"
              className="w-6 h-6 rounded-full border border-[#E2D9CF] bg-[#FAF8F5] text-[#1E4030] flex items-center justify-center hover:bg-[#1E4030] hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={onNextMonth}
              title="Next month"
              className="w-6 h-6 rounded-full border border-[#E2D9CF] bg-[#FAF8F5] text-[#1E4030] flex items-center justify-center hover:bg-[#1E4030] hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
        
        {/* Days label row */}
        <div className="grid grid-cols-7 text-center text-[10px] text-[#8A7E74] font-bold mb-2">
          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
        </div>

        {/* Dynamic Calendar Grid Numbers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <span key={`empty-${i}`} className="py-1 text-[#8A7E74]/20">&middot;</span>
          ))}

          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNum = idx + 1
            const state = dayStates[dayNum] || 'available'
            const isBooked = state === 'booked'
            const isRecurring = state === 'recurring'
            const isBlocked = state === 'blocked'
            const isSelected = selectedDay === dayNum

            let dayStyle = 'text-[#1C1A17] hover:bg-[#FAF8F5]'
            if (isBooked) {
              dayStyle = 'bg-[#1E4030] text-white rounded-full font-bold shadow-xs'
            } else if (isRecurring) {
              dayStyle = 'bg-amber-100 text-amber-900 rounded-full border border-amber-300 font-bold'
            } else if (isBlocked) {
              dayStyle = 'text-red-500/80 line-through'
            }

            if (isSelected) {
              dayStyle += ' ring-2 ring-amber-500'
            }

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(dayNum)}
                className={`py-1 rounded-full transition-all cursor-pointer ${dayStyle}`}
              >
                {dayNum}
              </button>
            )
          })}
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
    </div>
  )
}
