import React, { useState } from 'react';
import {
  ArrowLeft, Calendar, Clock, ShieldAlert, Check,
  Stethoscope, Baby, Sparkles, AlertCircle, Repeat,
  ShieldCheck, Info, ChevronRight, User
} from 'lucide-react';
import { CAREGIVERS, SPECIALTY_META } from '../../../data';

const WEEKDAYS = [
  { label: 'Mon', full: 'Monday', id: 0 },
  { label: 'Tue', full: 'Tuesday', id: 1 },
  { label: 'Wed', full: 'Wednesday', id: 2 },
  { label: 'Thu', full: 'Thursday', id: 3 },
  { label: 'Fri', full: 'Friday', id: 4 },
  { label: 'Sat', full: 'Saturday', id: 5 },
  { label: 'Sun', full: 'Sunday', id: 6 },
];

export default function BookingForm({ onNavigate, screenParams }) {
  const caregiver = screenParams?.caregiver || CAREGIVERS[0];
  const meta = SPECIALTY_META[caregiver.specialty] || { label: 'Caregiver', bg: '#EFF6FF', color: '#1D4ED8' };

  // Booking Type: 'once' (Single-Session) or 'recurring' (Multi-week Schedule)
  const [sessionType, setSessionType] = useState('once');
  
  // Single Session States
  const [singleDate, setSingleDate] = useState(screenParams?.date || '2025-08-04');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');

  // Recurring Booking States
  const [recurringStartDate, setRecurringStartDate] = useState('2025-08-04');
  const [selectedDays, setSelectedDays] = useState([0, 2, 4]); // Mon, Wed, Fri
  const [durationWeeks, setDurationWeeks] = useState(3); // 3 weeks default
  const [notes, setNotes] = useState('');

  const toggleDay = (dayId) => {
    if (selectedDays.includes(dayId)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(id => id !== dayId));
      }
    } else {
      setSelectedDays([...selectedDays, dayId].sort((a, b) => a - b));
    }
  };

  // Calculate session hours
  const calculateHours = () => {
    if (!startTime || !endTime) return 3;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const diff = (eh * 60 + em - sh * 60 - sm) / 60;
    return diff > 0 ? diff : 3;
  };

  const hoursPerSession = calculateHours();
  const pricePerHour = caregiver.pricePerHour;
  const serviceFee = 5;

  // Single calculation
  const singleSubtotal = hoursPerSession * pricePerHour;
  const singleTotal = singleSubtotal + serviceFee;

  // Recurring calculation
  const sessionsPerWeek = selectedDays.length;
  const totalSessionsCount = sessionsPerWeek * durationWeeks;
  const weeklySubtotal = sessionsPerWeek * hoursPerSession * pricePerHour;
  const weeklyTotal = weeklySubtotal + serviceFee;
  const overallRecurringTotal = (weeklySubtotal * durationWeeks) + (serviceFee * durationWeeks);

  // Generate resolved sessions schedule
  const generateSchedulePreview = () => {
    const sessions = [];
    const baseDate = new Date(recurringStartDate || '2025-08-04');
    let sessionIndex = 1;

    for (let w = 0; w < durationWeeks; w++) {
      selectedDays.forEach(dayId => {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + (w * 7) + ((dayId - baseDate.getDay() + 7) % 7));
        const dateString = d.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' });
        sessions.push({
          id: `s-${sessionIndex}`,
          index: sessionIndex,
          week: w + 1,
          date: dateString,
          time: `${startTime} – ${endTime}`,
          hours: hoursPerSession,
          price: hoursPerSession * pricePerHour,
          status: 'Scheduled'
        });
        sessionIndex++;
      });
    }
    return sessions;
  };

  const scheduleList = generateSchedulePreview();

  const handleSubmit = (e) => {
    e.preventDefault();

    const bookingPayload = {
      caregiver,
      sessionType,
      date: sessionType === 'once' ? singleDate : recurringStartDate,
      time: `${startTime} – ${endTime}`,
      hours: hoursPerSession,
      notes,
      totalPrice: sessionType === 'once' ? singleTotal : weeklyTotal,
      overallTotal: sessionType === 'once' ? singleTotal : overallRecurringTotal,
      durationWeeks: sessionType === 'once' ? 1 : durationWeeks,
      selectedDays,
      scheduleList,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    onNavigate('pending', { activeRequest: bookingPayload });
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1C1A17] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('search')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#8A7E74] hover:text-[#1C1A17] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Title Block */}
        <div className="mb-8 space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#EDF7F2] text-[#1E4030] text-[11px] font-bold px-3 py-1 rounded-full border border-green-200">
            <ShieldCheck size={13} />
            Carely Escrow Protection
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1E4030]">Book Care Service</h1>
          <p className="text-xs sm:text-sm text-[#8A7E74]">
            Step 1: Select your schedule. No payment is taken until {caregiver.name.split(' ')[0]} reviews and accepts.
          </p>
        </div>

        {/* Booking Form Layout Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 items-start">
          {/* Left Column: Form Setup */}
          <div className="space-y-6">
            {/* Caregiver Summary Pill */}
            <div className="bg-white rounded-3xl border border-[#E2D9CF] p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E2D9CF] shrink-0 shadow-sm">
                  <img src={caregiver.photo} alt={caregiver.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-[#1C1A17]">{caregiver.name}</h3>
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    {meta.label}
                  </span>
                  <p className="text-xs text-[#8A7E74]">{caregiver.location} &middot; {caregiver.pricePerHour.toLocaleString()} XAF / hr</p>
                </div>
              </div>
            </div>

            {/* Step 1: Booking Mode Toggle */}
            <div className="bg-white rounded-3xl border border-[#E2D9CF] p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#1C1A17]">1. Select Booking Type</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSessionType('once')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    sessionType === 'once'
                      ? 'border-[#1E4030] bg-[#EDF7F2]/40 shadow-xs'
                      : 'border-[#E2D9CF] bg-[#FAF8F5] hover:border-[#D4C9BE]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Calendar size={18} className={sessionType === 'once' ? 'text-[#1E4030]' : 'text-[#8A7E74]'} />
                    {sessionType === 'once' && <span className="w-2.5 h-2.5 rounded-full bg-[#1E4030]" />}
                  </div>
                  <h4 className="font-bold text-sm text-[#1C1A17]">Single Session</h4>
                  <p className="text-[11px] text-[#8A7E74] mt-0.5">One-time visit for a specific date and time window.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSessionType('recurring')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    sessionType === 'recurring'
                      ? 'border-[#1E4030] bg-[#EDF7F2]/40 shadow-xs'
                      : 'border-[#E2D9CF] bg-[#FAF8F5] hover:border-[#D4C9BE]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Repeat size={18} className={sessionType === 'recurring' ? 'text-[#1E4030]' : 'text-[#8A7E74]'} />
                    {sessionType === 'recurring' && <span className="w-2.5 h-2.5 rounded-full bg-[#1E4030]" />}
                  </div>
                  <h4 className="font-bold text-sm text-[#1C1A17]">Recurring Booking</h4>
                  <p className="text-[11px] text-[#8A7E74] mt-0.5">Multi-week recurring schedule with weekly billing.</p>
                </button>
              </div>
            </div>

            {/* Step 2: Date & Time Schedule Picker */}
            <div className="bg-white rounded-3xl border border-[#E2D9CF] p-6 shadow-sm space-y-5">
              <h3 className="font-bold text-base text-[#1C1A17]">2. Schedule Details</h3>

              {sessionType === 'once' ? (
                /* Single Date Input */
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Service Date</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                      <input
                        type="date"
                        required
                        value={singleDate}
                        onChange={e => setSingleDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs sm:text-sm text-[#1C1A17] focus:outline-none focus:border-[#1E4030]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Recurring Multi-Week Builder */
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Start Date</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                        <input
                          type="date"
                          required
                          value={recurringStartDate}
                          onChange={e => setRecurringStartDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Duration (Weeks)</label>
                      <select
                        value={durationWeeks}
                        onChange={e => setDurationWeeks(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030]"
                      >
                        <option value={1}>1 Week</option>
                        <option value={2}>2 Weeks</option>
                        <option value={3}>3 Weeks (Recommended)</option>
                        <option value={4}>4 Weeks (1 Month)</option>
                        <option value={8}>8 Weeks (2 Months)</option>
                      </select>
                    </div>
                  </div>

                  {/* Weekday Selection Pills */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Select Days of Week</label>
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                      {WEEKDAYS.map(day => {
                        const selected = selectedDays.includes(day.id);
                        return (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => toggleDay(day.id)}
                            className={`py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                              selected
                                ? 'bg-[#1E4030] text-white shadow-xs'
                                : 'bg-[#FAF8F5] text-[#8A7E74] border border-[#E2D9CF] hover:border-[#1E4030]'
                            }`}
                          >
                            <span className="block text-[10px] font-semibold opacity-70">{day.label}</span>
                            <span className="block text-sm font-extrabold">{day.full.substring(0, 1)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Resolved Schedule Summary */}
                  <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#1E4030]">
                      <span>{totalSessionsCount} Total Sessions Generated</span>
                      <span>{durationWeeks} Weeks &middot; {sessionsPerWeek} days/wk</span>
                    </div>
                    <div className="max-h-36 overflow-y-auto divide-y divide-[#E2D9CF]/60 text-xs text-[#1C1A17]">
                      {scheduleList.map(s => (
                        <div key={s.id} className="py-2 flex items-center justify-between">
                          <span className="font-semibold">Session {s.index}: {s.date}</span>
                          <span className="text-[#8A7E74]">{s.time} ({s.price.toLocaleString()} XAF)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Time Window (Both Modes) */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Start Time</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                    <input
                      type="time"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs sm:text-sm text-[#1C1A17] focus:outline-none focus:border-[#1E4030]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">End Time</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                    <input
                      type="time"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs sm:text-sm text-[#1C1A17] focus:outline-none focus:border-[#1E4030]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Patient Care Notes */}
            <div className="bg-white rounded-3xl border border-[#E2D9CF] p-6 shadow-sm space-y-2">
              <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">3. Care Instructions & Patient Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Mention patient mobility, specific medical prescriptions, allergies, or special housekeeping preferences..."
                className="w-full p-4 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl text-xs sm:text-sm text-[#1C1A17] focus:outline-none focus:border-[#1E4030] resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Right Column: Cost Breakdown & MVP Temporary Hold Box */}
          <div className="bg-white rounded-3xl border border-[#E2D9CF] p-6 shadow-sm space-y-6 lg:sticky lg:top-20">
            <h3 className="font-display text-xl font-bold text-[#1C1A17]">Booking Summary</h3>

            {/* Price Calculations */}
            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-[#8A7E74]">
                <span>Rate per hour</span>
                <span className="font-semibold text-[#1C1A17]">{caregiver.pricePerHour.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between text-[#8A7E74]">
                <span>Hours per session</span>
                <span className="font-semibold text-[#1C1A17]">{hoursPerSession} hrs</span>
              </div>

              {sessionType === 'once' ? (
                <>
                  <div className="flex justify-between text-[#8A7E74]">
                    <span>Single Session Fee</span>
                    <span className="font-semibold text-[#1C1A17]">{singleSubtotal.toLocaleString()} XAF</span>
                  </div>
                  <div className="flex justify-between text-[#8A7E74]">
                    <span>Carely Escrow Protection</span>
                    <span className="font-semibold text-[#1C1A17]">{serviceFee.toLocaleString()} XAF</span>
                  </div>
                  <div className="pt-2 border-t border-[#E2D9CF] flex justify-between font-bold text-sm text-[#1E4030]">
                    <span>Total (Held in Escrow)</span>
                    <span>{singleTotal.toLocaleString()} XAF</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-[#8A7E74]">
                    <span>Sessions per week</span>
                    <span className="font-semibold text-[#1C1A17]">{sessionsPerWeek} sessions</span>
                  </div>
                  <div className="flex justify-between text-[#8A7E74]">
                    <span>Week 1 Escrow Amount</span>
                    <span className="font-semibold text-[#1C1A17]">{weeklyTotal.toLocaleString()} XAF</span>
                  </div>
                  <div className="pt-2 border-t border-[#E2D9CF] flex justify-between font-bold text-sm text-[#1E4030]">
                    <span>Total {durationWeeks}-Week Scope</span>
                    <span>{overallRecurringTotal.toLocaleString()} XAF</span>
                  </div>
                  <p className="text-[10px] text-[#8A7E74] leading-relaxed pt-1">
                    * Billed automatically at the start of each week. Only Week 1 will be charged upon acceptance.
                  </p>
                </>
              )}
            </div>

            {/* Temporary Hold Explainer */}
            <div className="p-4 bg-[#EDF7F2] border border-green-200 rounded-2xl space-y-2 text-xs text-[#1E4030]">
              <div className="flex items-center gap-2 font-bold">
                <Info size={16} />
                <span>Zero Upfront Charge</span>
              </div>
              <p className="text-[11px] text-[#1E4030]/80 leading-relaxed">
                Submitting places a temporary hold on {caregiver.name.split(' ')[0]}'s calendar. You will only approve payment via MoMo PIN after the request is accepted.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-4 px-6 rounded-2xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit Request to {caregiver.name.split(' ')[0]}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
