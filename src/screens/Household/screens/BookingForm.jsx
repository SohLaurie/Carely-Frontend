import { useState } from 'react'
import {
  ArrowLeft, Calendar, Clock, ShieldAlert, Check,
  Stethoscope, Baby, Sparkles, AlertCircle
} from 'lucide-react'
import { CAREGIVERS, SPECIALTY_META } from '../../../data'

const CAREGIVER = CAREGIVERS[0]
const SPECIALTY_ICON_MAP = { nursing: Stethoscope, babysitting: Baby, cleaning: Sparkles }

const WEEKDAYS = [
  { label: 'Mon', full: 'Monday', id: 0 },
  { label: 'Tue', full: 'Tuesday', id: 1 },
  { label: 'Wed', full: 'Wednesday', id: 2 },
  { label: 'Thu', full: 'Thursday', id: 3 },
  { label: 'Fri', full: 'Friday', id: 4 },
  { label: 'Sat', full: 'Saturday', id: 5 },
  { label: 'Sun', full: 'Sunday', id: 6 },
]

export default function BookingForm({ onNavigate }) {
  const c = CAREGIVER
  const meta = SPECIALTY_META[c.specialty]
  const SpecialtyIcon = SPECIALTY_ICON_MAP[c.specialty]

  // Form states
  const [sessionType, setSessionType] = useState('once') // 'once' or 'recurring'
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('12:00')
  
  // Recurring states
  const [selectedDays, setSelectedDays] = useState([0, 2, 4]) // Mon, Wed, Fri default
  const [durationWeeks, setDurationWeeks] = useState(3) // 3 weeks default
  
  // Common states
  const [notes, setNotes] = useState('')

  // Toggle days
  const handleDayToggle = (dayId) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter(id => id !== dayId))
    } else {
      setSelectedDays([...selectedDays, dayId].sort((a, b) => a - b))
    }
  }

  // Calculate single session hours
  const hours = (() => {
    if (!startTime || !endTime) return 0
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    const diff = (eh * 60 + em - sh * 60 - sm) / 60
    return diff > 0 ? diff : 0
  })()

  // Calculated costs
  const pricePerHour = c.pricePerHour
  const serviceFee = 500

  // 1st Week / Total calculation
  const subtotal = sessionType === 'once'
    ? hours * pricePerHour
    : selectedDays.length * hours * pricePerHour

  const total = subtotal + serviceFee

  // Selected days text list
  const selectedDaysText = selectedDays.length > 0
    ? selectedDays.map(id => WEEKDAYS.find(w => w.id === id).full).join(', ')
    : 'None selected'

  const selectedDaysShortText = selectedDays.length > 0
    ? selectedDays.map(id => WEEKDAYS.find(w => w.id === id).label).join(', ')
    : '—'

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1C1A17] pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 pt-6">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('profile')}
          className="inline-flex items-center gap-2 text-sm text-[#8A7E74] hover:text-[#1C1A17] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to profile
        </button>

        {/* Title Block */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-[#1E4030] mb-2">Book a service</h1>
          <p className="text-sm text-[#8A7E74]">
            No payment is charged before the provider accepts your request.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 items-start">
          
          {/* Left Column - Forms */}
          <div className="space-y-6">
            
            {/* Caregiver Profile Card */}
            <div className="bg-white rounded-2xl border border-[#E2D9CF] p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-secondary shrink-0 border border-[#E2D9CF]">
                  <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-[#1C1A17]">{c.name}</h3>
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full mt-1.5"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    <SpecialtyIcon size={10} />
                    {meta.label}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-lg text-[#1E4030]">{pricePerHour.toLocaleString()}</div>
                <div className="text-xs text-[#8A7E74]">XAF/h</div>
              </div>
            </div>

            {/* Session Type Switcher */}
            <div className="bg-white rounded-2xl border border-[#E2D9CF] p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[#8A7E74] uppercase tracking-wider mb-4">Session type</h3>
              <div className="bg-[#FAF8F5] p-1 rounded-xl flex gap-1 border border-[#E2D9CF]">
                <button
                  onClick={() => setSessionType('once')}
                  className={`flex-1 text-sm font-medium py-3 rounded-lg transition-all ${
                    sessionType === 'once'
                      ? 'bg-white shadow-sm text-[#1E4030] font-semibold border border-[#E2D9CF]/40'
                      : 'text-[#8A7E74] hover:text-[#1C1A17]'
                  }`}
                >
                  One-time session
                </button>
                <button
                  onClick={() => setSessionType('recurring')}
                  className={`flex-1 text-sm font-medium py-3 rounded-lg transition-all ${
                    sessionType === 'recurring'
                      ? 'bg-white shadow-sm text-[#1E4030] font-semibold border border-[#E2D9CF]/40'
                      : 'text-[#8A7E74] hover:text-[#1C1A17]'
                  }`}
                >
                  Recurring schedule
                </button>
              </div>
            </div>

            {/* Configurable Date & Time Card */}
            {sessionType === 'once' ? (
              <div className="bg-white rounded-2xl border border-[#E2D9CF] p-5 shadow-sm space-y-5">
                <h3 className="text-sm font-semibold text-[#8A7E74] uppercase tracking-wider">Date and hours</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-2">Date of the session</label>
                  <div className="relative">
                    <Calendar size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4030] bg-[#FAF8F5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-2">Start time</label>
                    <div className="relative">
                      <Clock size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                      <input
                        type="time"
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4030] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-2">End time</label>
                    <div className="relative">
                      <Clock size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                      <input
                        type="time"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4030] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E2D9CF] text-sm text-[#8A7E74]">
                  Duration: <strong className="text-[#1C1A17] font-semibold">{hours}h</strong>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E2D9CF] p-5 shadow-sm space-y-5">
                <h3 className="text-sm font-semibold text-[#8A7E74] uppercase tracking-wider">Recurring schedule</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-2">Start date</label>
                  <div className="relative">
                    <Calendar size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4030] bg-[#FAF8F5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-2">Days of the week</label>
                  <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                    {WEEKDAYS.map(day => {
                      const active = selectedDays.includes(day.id)
                      return (
                        <button
                          key={day.id}
                          onClick={() => handleDayToggle(day.id)}
                          className={`w-11 h-11 rounded-full text-xs font-medium border flex items-center justify-center shrink-0 transition-all ${
                            active
                              ? 'bg-[#1E4030] border-[#1E4030] text-white shadow-sm'
                              : 'bg-white border-[#E2D9CF] text-[#1C1A17] hover:border-[#1E4030]'
                          }`}
                        >
                          {day.label}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-[#8A7E74] italic">{selectedDaysText}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-2">Start</label>
                    <div className="relative">
                      <Clock size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                      <input
                        type="time"
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4030] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-2">End</label>
                    <div className="relative">
                      <Clock size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                      <input
                        type="time"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4030] bg-[#FAF8F5]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-2">
                    <span>Total duration</span>
                    <span className="text-[#1C1A17] font-semibold">{durationWeeks} weeks</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={durationWeeks}
                    onChange={e => setDurationWeeks(Number(e.target.value))}
                    className="w-full h-1 bg-[#E2D9CF] rounded-lg appearance-none cursor-pointer accent-[#1E4030]"
                  />
                  <div className="flex justify-between text-[10px] text-[#8A7E74] mt-1.5">
                    <span>1 week</span>
                    <span>12 weeks</span>
                  </div>
                </div>
              </div>
            )}

            {/* Notes for Caregiver */}
            <div className="bg-white rounded-2xl border border-[#E2D9CF] p-5 shadow-sm">
              <label className="block text-sm font-semibold text-[#8A7E74] uppercase tracking-wider mb-3">
                Notes for the caregiver <span className="font-normal lowercase italic">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Useful details: allergies, pets, entry code, specific needs of the child or the elderly..."
                rows={4}
                className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4030] bg-[#FAF8F5] resize-none"
              />
            </div>

          </div>

          {/* Right Column - Summary & Escrow Guarantee */}
          <div className="space-y-4 lg:sticky lg:top-20">
            
            {/* Summary Box */}
            <div className="bg-white rounded-2xl border border-[#E2D9CF] p-6 shadow-sm">
              <h3 className="text-base font-semibold text-[#1C1A17] mb-5">Summary</h3>
              
              <div className="space-y-3.5 text-sm pb-5 border-b border-[#E2D9CF]">
                <div className="flex justify-between">
                  <span className="text-[#8A7E74]">Caregiver</span>
                  <span className="font-medium text-[#1C1A17]">{c.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A7E74]">Type</span>
                  <span className="font-medium text-[#1C1A17]">{meta.label}</span>
                </div>
                {sessionType === 'once' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-[#8A7E74]">Date</span>
                      <span className="font-medium text-[#1C1A17]">{date || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8A7E74]">Hours</span>
                      <span className="font-medium text-[#1C1A17]">
                        {startTime} - {endTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8A7E74]">Duration</span>
                      <span className="font-medium text-[#1C1A17]">{hours}h</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-[#8A7E74]">Sessions</span>
                      <span className="font-medium text-[#1C1A17]">—</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8A7E74]">Days</span>
                      <span className="font-medium text-[#1C1A17]">{selectedDaysShortText}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8A7E74]">Duration</span>
                      <span className="font-medium text-[#1C1A17]">{durationWeeks} weeks</span>
                    </div>
                  </>
                )}
              </div>

              {/* Fee Breakdown */}
              <div className="space-y-3 text-sm py-5 border-b border-[#E2D9CF]">
                <div className="flex justify-between">
                  <span className="text-[#8A7E74]">
                    {pricePerHour.toLocaleString()} XAF &times; {hours}h
                  </span>
                  <span className="font-medium text-[#1C1A17]">
                    {sessionType === 'once' ? '—' : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A7E74]">Service fee</span>
                  <span className="font-medium text-[#1C1A17]">{serviceFee} XAF</span>
                </div>

                {/* Recurring Warning Alert Banner */}
                {sessionType === 'recurring' && (
                  <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3 text-xs text-[#8A7E74] flex gap-2 items-start mt-2">
                    <AlertCircle size={14} className="text-[#8A7E74] shrink-0 mt-0.5" />
                    <span>Weekly payment — nothing charged in advance.</span>
                  </div>
                )}
              </div>

              {/* Total Block */}
              <div className="flex justify-between items-baseline pt-5 mb-6">
                <span className="font-semibold text-[#1C1A17]">
                  {sessionType === 'once' ? 'Total' : '1st week'}
                </span>
                <span className="font-display text-2xl font-bold text-[#1E4030]">
                  {total.toLocaleString()} XAF
                </span>
              </div>

              <button
                onClick={() => onNavigate('pending')}
                disabled={!date || (sessionType === 'recurring' && selectedDays.length === 0)}
                className="w-full bg-[#1E4030] text-white font-semibold py-4 rounded-xl hover:bg-[#152e22] transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Send request
              </button>

              <p className="text-center text-xs text-[#8A7E74] mt-3">
                Payment is only charged after the caregiver's acceptance
              </p>
            </div>

            {/* Escrow Guarantee Banner */}
            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 flex gap-3 shadow-sm">
              <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 border border-amber-200">
                🔒
              </div>
              <p className="text-xs text-[#8A7E74] leading-relaxed">
                Your funds are held in escrow and only released to the caregiver after confirmation of the service.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
