import React from 'react';
import {
  X, Calendar, Clock, MapPin, ShieldCheck, Wallet, User, CheckCircle2,
  AlertTriangle, ArrowUpRight, Phone, CreditCard
} from 'lucide-react';

export default function AdminBookingModal({ booking, onClose, onSelectUser }) {
  if (!booking) return null;

  let badgeStyle = 'bg-gray-100 text-gray-700 border-gray-200';
  if (booking.status === 'Completed') {
    badgeStyle = 'bg-[#EDF7F2] text-[#1D6F42] border-green-200';
  } else if (booking.status === 'In Progress') {
    badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (booking.status === 'Scheduled') {
    badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';
  } else if (booking.status === 'Cancelled') {
    badgeStyle = 'bg-red-50 text-red-600 border-red-200';
  } else if (booking.status === 'Disputed') {
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#E2D9CF] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E2D9CF] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EDF7F2] rounded-xl flex items-center justify-center text-[#1E4030] border border-green-200 shadow-xs">
              <Calendar size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-[#1C1A17]">Booking {booking.id}</h3>
                <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
                  {booking.status}
                </span>
              </div>
              <p className="text-xs text-[#8A7E74]">Full transaction breakdown and escrow state</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E2D9CF] text-[#8A7E74] hover:text-[#1C1A17] flex items-center justify-center hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Parties Cards (Household & Caregiver) */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Household Client Card */}
            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-2">
              <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider block">Household Client</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E4030] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {booking.client ? booking.client.charAt(0) : 'H'}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1C1A17]">{booking.client}</h4>
                  <p className="text-[11px] text-[#8A7E74] flex items-center gap-1">
                    <Phone size={11} className="text-[#1E4030]" />
                    {booking.clientPhone || '+237 6 99 12 34 56'}
                  </p>
                </div>
              </div>
              {onSelectUser && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectUser({ name: booking.client, role: 'Household', city: 'Yaounde', initials: booking.client.charAt(0) });
                  }}
                  className="text-[11px] font-bold text-[#1E4030] hover:underline pt-1 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View User Profile</span>
                  <ArrowUpRight size={11} />
                </button>
              )}
            </div>

            {/* Provider Card */}
            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-2">
              <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider block">Assigned Provider</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EDF7F2] border border-green-200 text-[#1E4030] flex items-center justify-center font-bold text-sm shadow-xs">
                  {booking.caregiver ? booking.caregiver.charAt(0) : 'P'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-[#1C1A17]">{booking.caregiver}</h4>
                    <ShieldCheck size={13} className="text-[#1D6F42]" />
                  </div>
                  <p className="text-[11px] text-[#8A7E74] flex items-center gap-1">
                    <Phone size={11} className="text-[#1E4030]" />
                    {booking.caregiverPhone || '+237 6 99 22 33 44'}
                  </p>
                </div>
              </div>
              {onSelectUser && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectUser({ name: booking.caregiver, role: 'Provider', city: 'Douala', initials: booking.caregiver.charAt(0) });
                  }}
                  className="text-[11px] font-bold text-[#1E4030] hover:underline pt-1 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View Provider Profile</span>
                  <ArrowUpRight size={11} />
                </button>
              )}
            </div>
          </div>

          {/* Service & Schedule Details */}
          <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 space-y-3 shadow-xs">
            <h4 className="font-bold text-xs text-[#1C1A17] border-b border-[#F0EBE4] pb-2">Session Specifications</h4>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider block">Service Category</span>
                <strong className="text-[#1C1A17] font-semibold">{booking.service || 'Home Nursing'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider block">Schedule</span>
                <strong className="text-[#1C1A17] font-semibold">{booking.date}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider block">Duration & Rate</span>
                <strong className="text-[#1C1A17] font-semibold">{booking.hours || '4 hrs'} &middot; {booking.rate || '3,500 XAF/hr'}</strong>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-xs text-[#8A7E74]">
              <MapPin size={13} className="text-[#1E4030] shrink-0" />
              <span>{booking.location || 'Bastos, Yaounde, Cameroon'}</span>
            </div>
          </div>

          {/* Financial & Escrow Breakdown */}
          <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2D9CF] pb-2">
              <h4 className="font-bold text-xs text-[#1C1A17] flex items-center gap-1.5">
                <Wallet size={14} className="text-[#1E4030]" />
                <span>Financial & Escrow Summary</span>
              </h4>
              <span className="text-[10px] font-bold text-[#1E4030] bg-[#EDF7F2] px-2.5 py-0.5 rounded-full border border-green-200">
                {booking.paymentMethod || 'MTN Mobile Money'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#8A7E74]">
                <span>Gross Booking Subtotal</span>
                <span className="font-semibold text-[#1C1A17]">{booking.grossAmount || `${booking.amount} XAF`}</span>
              </div>
              <div className="flex justify-between text-[#8A7E74]">
                <span>Platform Commission (18%)</span>
                <span className="font-semibold text-[#1E4030]">{booking.commission || '2,520 XAF'}</span>
              </div>
              <div className="border-t border-[#E2D9CF] pt-2 flex justify-between font-bold text-sm">
                <span className="text-[#1C1A17]">Provider Payout</span>
                <span className="text-[#1E4030]">{booking.netPayout || `${booking.amount} XAF`}</span>
              </div>
            </div>

            <div className="p-3 bg-white border border-[#E2D9CF] rounded-xl flex items-center gap-2 text-xs">
              <CreditCard size={14} className="text-[#1E4030] shrink-0" />
              <div className="text-[11px] text-[#8A7E74]">
                <strong className="text-[#1C1A17]">Escrow State:</strong> {booking.escrowStatus || 'Secured in Escrow'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-t border-[#E2D9CF] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
