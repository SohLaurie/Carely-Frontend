import { useState } from 'react'
import {
  ArrowLeft, Check, Clock, MapPin, Calendar, ChevronRight,
  AlertCircle, PartyPopper, XCircle
} from 'lucide-react'
import { CAREGIVERS, SPECIALTY_META } from '../../../data'

function CountdownRing({ hoursLeft, totalHours }) {
  const pct = hoursLeft / totalHours
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct)
  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r={r} fill="none" stroke="#E2D9CF" strokeWidth="6" />
      <circle
        cx="55" cy="55" r={r}
        fill="none"
        stroke="#1E4030"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 55 55)"
      />
      <text x="55" y="51" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1C1A17">{hoursLeft}h</text>
      <text x="55" y="67" textAnchor="middle" fontSize="10" fill="#8A7E74">remaining</text>
    </svg>
  )
}

export default function RequestPending({ onNavigate, screenParams }) {
  // Read request parameter or default to Marie-Claire
  const request = screenParams?.activeRequest || {
    id: 'R1',
    name: 'Marie-Claire Nkomo',
    specialty: 'nursing',
    date: 'Mon Jul 28',
    time: '09:00 – 12:00',
    status: 'Accepted',
    timeSent: 'Sent 2h ago',
    location: 'Bastos, Yaounde',
    photo: 'https://images.unsplash.com/photo-1627328543975-3f0ba8a823b0?w=400&h=400&fit=crop&auto=format'
  }

  // Derive caregiver info
  const c = CAREGIVERS.find(item => item.name === request.name) || CAREGIVERS[0]
  
  // Calculate dynamic fees based on caregiver price per hour
  const hours = 3
  const baseFee = c.pricePerHour * hours
  const serviceFee = Math.round(baseFee * 0.05)
  const totalFee = baseFee + serviceFee
  
  // Determine screen state based on status: 'Pending' -> 'pending', 'Accepted' -> 'accepted', 'Declined' -> 'declined'
  const state = request.status.toLowerCase()

  // Get specialty label
  const specialtyLabel = SPECIALTY_META[c.specialty]?.label || 'Caregiver'

  // Alternatives to display in case of Declined status
  // Show Marie-Claire Nkomo and Fatima Bello as the alternatives
  const alternatives = CAREGIVERS.filter(item => item.name === 'Marie-Claire Nkomo' || item.name === 'Fatima Bello')

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1C1A17]">
      <div className="max-w-lg mx-auto px-4 py-12">
        <button
          onClick={() => onNavigate('search', { defaultTab: 'requests' })}
          className="inline-flex items-center gap-2 text-sm text-[#8A7E74] hover:text-[#1C1A17] transition-colors mb-8 font-semibold"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        {state === 'pending' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-[#E2D9CF] p-6 text-center shadow-sm">
              <div className="flex justify-center mb-4">
                <CountdownRing hoursLeft={18} totalHours={24} />
              </div>
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-amber-200">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                Awaiting response
              </div>
              <h1 className="font-display text-xl font-bold text-[#1E4030] mb-2">Request Sent!</h1>
              <p className="text-[#8A7E74] text-xs leading-relaxed">
                Your request has been sent to <strong>{c.name}</strong>. They have 24 hours to accept or decline.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2D9CF] p-4 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary shrink-0">
                <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#1C1A17] truncate">{c.name}</p>
                <p className="text-xs text-[#8A7E74]">{specialtyLabel} &middot; {c.rating} stars</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-[#8A7E74] mb-1 flex items-center gap-1 justify-end font-medium">
                  <Calendar size={11} />
                  Booked for
                </div>
                <div className="text-xs font-bold text-[#1C1A17]">{request.date || 'Mon Jul 28'}</div>
                <div className="text-[10px] text-[#8A7E74] flex items-center gap-1 justify-end">
                  <Clock size={10} />
                  {request.time || '09:00 – 12:00'}
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 space-y-3.5 shadow-sm">
              <div className="flex justify-between text-xs">
                <span className="text-[#8A7E74] font-medium">Service</span>
                <span className="font-bold text-[#1C1A17]">{specialtyLabel} &middot; {hours}h</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#8A7E74] font-medium">Total Amount</span>
                <span className="font-bold text-sm text-[#1E4030]">{totalFee.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between text-xs pt-3 border-t border-[#E2D9CF]">
                <span className="text-[#8A7E74] font-medium">Payment</span>
                <span className="text-[#8A7E74] italic">After acceptance</span>
              </div>
            </div>

            <div className="bg-white border border-[#E2D9CF] rounded-xl p-4 text-xs text-[#8A7E74] leading-relaxed flex gap-2 shadow-sm">
              <AlertCircle size={14} className="text-[#8A7E74] shrink-0 mt-0.5" />
              <span>If {c.name.split(' ')[0]} does not respond within 24 hours, your request will be automatically cancelled at no charge and we will suggest an alternative.</span>
            </div>
          </div>
        )}

        {state === 'accepted' && (
          <div className="space-y-5">
            <div className="bg-[#EDF7F2] rounded-2xl border border-green-200 p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-[#D8ECD8] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PartyPopper size={28} className="text-green-800" />
              </div>
              <div className="inline-flex items-center gap-2 bg-[#D8ECD8] text-green-900 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                <Check size={11} strokeWidth={3} />
                Request Accepted
              </div>
              <h1 className="font-display text-xl font-bold text-[#1E4030] mb-2">
                {c.name.split(' ')[0]} accepted your request!
              </h1>
              <p className="text-[#8A7E74] text-xs leading-relaxed">
                Your session is confirmed. Proceed to payment to finalize the booking.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2D9CF] p-4 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-[#1C1A17]">{c.name}</p>
                <p className="text-xs font-semibold text-green-700 flex items-center gap-1 mt-0.5">
                  <Calendar size={12} />
                  {request.date || 'Mon Jul 28'} &middot; {request.time || '09:00 – 12:00'}
                </p>
                <p className="text-xs text-[#8A7E74] mt-0.5">{specialtyLabel} &middot; {hours}h</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('payment')}
              className="w-full bg-[#1E4030] text-white font-semibold py-4 rounded-xl hover:bg-[#152e22] transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
            >
              Proceed to Payment — {totalFee.toLocaleString()} XAF
            </button>
          </div>
        )}

        {state === 'declined' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-[#E2D9CF] p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-[#FDF1F0] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircle size={28} className="text-red-500" />
              </div>
              <div className="inline-flex items-center gap-2 bg-[#FDF1F0] text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-red-200">
                <XCircle size={11} />
                Request Declined
              </div>
              <h1 className="font-display text-xl font-bold text-[#1E4030] mb-2">
                {c.name.split(' ')[0]} is not available
              </h1>
              <p className="text-[#8A7E74] text-xs leading-relaxed">
                No charges have been made. Our algorithm has selected the best alternatives for you.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#8A7E74] mb-3">Suggested Alternatives</p>
              {alternatives.map(alt => (
                <div
                  key={alt.id}
                  onClick={() => onNavigate('profile')}
                  className="bg-white rounded-2xl border border-[#E2D9CF] p-4 flex items-center gap-4 mb-3 cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <img src={alt.photo} alt={alt.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#1C1A17] truncate">{alt.name}</p>
                    <p className="text-xs text-[#8A7E74]">{alt.rating} stars &middot; {alt.pricePerHour.toLocaleString()} XAF/hr</p>
                  </div>
                  <ChevronRight size={16} className="text-[#8A7E74]" />
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('search')}
              className="w-full border border-[#1E4030] text-[#1E4030] font-semibold py-3.5 rounded-xl hover:bg-secondary transition-all text-sm flex items-center justify-center gap-1.5"
            >
              View All Available Caregivers
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
