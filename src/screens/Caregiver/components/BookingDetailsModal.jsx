import React from 'react'
import { Calendar, Clock, Wallet, ShieldCheck, TrendingUp, X } from 'lucide-react'

export default function BookingDetailsModal({ details, onClose }) {
  if (!details) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#E2D9CF] w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-[#1E4030] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <h3 className="font-display text-base font-bold">Booking Details</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X size={14} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Client Profile Card */}
          <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#EFECE6] border border-[#E2D9CF] text-primary flex items-center justify-center font-bold text-sm shrink-0">
                {details.initials}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C1A17]">{details.clientName}</h4>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[10px] bg-secondary text-primary border border-[#E2D9CF] px-2 py-0.2 rounded-full font-bold">
                    {details.specialty}
                  </span>
                  <span className="text-[10px] text-[#8A7E74] font-medium">&middot; {details.location}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#8A7E74] font-bold block uppercase tracking-wider">Status</span>
              <span className="text-[10px] text-[#1D6F42] font-extrabold bg-[#EDF7F2] border border-green-200 px-2.5 py-0.5 rounded-full mt-0.5 inline-block">
                {details.status}
              </span>
            </div>
          </div>

          {/* Confirmed Schedule Card */}
          <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-2.5">
              <h4 className="font-bold text-xs text-[#1C1A17] flex items-center gap-1.5">
                <Clock size={13} className="text-[#8A7E74]" />
                <span>Confirmed Schedule</span>
              </h4>
              <span className="text-[10px] text-[#8A7E74] font-bold bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E2D9CF]">
                {details.schedule.length} {details.schedule.length === 1 ? 'session' : 'sessions'}
              </span>
            </div>
            
            <div className="space-y-2.5">
              {details.schedule.map((sess, i) => (
                <div key={i} className="flex justify-between items-center bg-[#FAF8F5] p-3 rounded-xl border border-[#EFECE6]/60">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#1E4030] text-white text-[10px] font-extrabold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1C1A17]">{sess.date}</p>
                      <p className="text-[10px] text-[#8A7E74] mt-0.5">{sess.time}</p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.2 rounded-full font-bold">
                    {sess.status || 'Confirmed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payout Breakdown Card */}
          <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 space-y-3.5 shadow-xs">
            <h4 className="font-bold text-xs text-[#1C1A17] border-b border-[#EFECE6] pb-2.5 flex items-center gap-1.5">
              <Wallet size={13} className="text-[#8A7E74]" />
              <span>Payout Breakdown</span>
            </h4>

            <div className="space-y-2 text-xs font-medium text-[#8A7E74]">
              <div className="flex justify-between">
                <span>Rate ({details.rate} x {details.hours}h x {details.sessionsCount} {details.sessionsCount === 1 ? 'session' : 'sessions'})</span>
                <span className="text-[#1C1A17] font-semibold">{details.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Carely Platform Fee</span>
                <span className="text-red-500 font-semibold">- {details.serviceFee}</span>
              </div>
              <div className="flex justify-between border-t border-[#EFECE6] pt-2.5 font-bold text-sm">
                <span className="text-[#1C1A17]">Your Total Payout</span>
                <span className="text-[#1E4030]">{details.total}</span>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E2D9CF] p-3 rounded-xl flex items-start gap-2.5">
              <ShieldCheck size={14} className="text-[#1E4030] shrink-0 mt-0.5" />
              <p className="text-[10px] text-[#8A7E74] leading-relaxed">
                {details.payoutInfo}
              </p>
            </div>
          </div>

          {/* Next Steps Card */}
          <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 space-y-3 shadow-xs">
            <h4 className="font-bold text-xs text-[#1C1A17] border-b border-[#EFECE6] pb-2 flex items-center gap-1.5">
              <TrendingUp size={13} className="text-[#8A7E74]" />
              <span>Next Steps</span>
            </h4>
            <ul className="space-y-2">
              {details.nextSteps.map((step, idx) => (
                <li key={idx} className="flex gap-2.5 text-[10px] text-[#8A7E74] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E4030] shrink-0 mt-1.5"></span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E2D9CF] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            Close details
          </button>
        </div>
      </div>
    </div>
  )
}
