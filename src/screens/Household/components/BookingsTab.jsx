import React, { useState } from 'react';
import {
  CalendarCheck, MoreHorizontal, ChevronRight, X, Key, ShieldCheck,
  Clock, MapPin, MessageSquare, CheckCircle2, User, Phone
} from 'lucide-react';
import { SPECIALTY_META } from '../../../data';

function BookingDetailsModal({ booking, onClose, onNavigate }) {
  if (!booking) return null;
  const meta = SPECIALTY_META[booking.specialty] || { label: 'Provider' };

  const fee = Number(booking.serviceFee) || 5;
  const rawTotal = typeof booking.totalPrice === 'number'
    ? booking.totalPrice
    : parseInt(String(booking.totalPrice || '').replace(/[^0-9]/g, ''), 10) || 0;
  const hourlyRate = Number(booking.pricePerHour) || 50;
  const sessions = Number(booking.totalSessions) || 1;
  const subtotal = Number(booking.subtotal) || (rawTotal > fee ? rawTotal - fee : rawTotal);
  const total = rawTotal || (subtotal + fee);

  let hours = 1;
  if (booking.startTime && booking.endTime) {
    const [sh, sm] = booking.startTime.split(':').map(Number);
    const [eh, em] = booking.endTime.split(':').map(Number);
    const diffMin = (eh * 60 + em) - (sh * 60 + sm);
    if (diffMin > 0) hours = Math.round((diffMin / 60) * 10) / 10;
  } else if (subtotal > 0 && hourlyRate > 0) {
    hours = Math.round((subtotal / (hourlyRate * sessions)) * 10) / 10;
  }
  if (hours <= 0) hours = 1;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#E2D9CF] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#1E4030] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <CalendarCheck size={18} className="text-green-300" />
            <h3 className="font-bold text-base text-white">Booking Details & Escrow Record</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Caregiver Summary */}
          <div className="flex items-center gap-4 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-[#E2D9CF] shrink-0 shadow-sm flex items-center justify-center">
              {booking.photo ? (
                <img src={booking.photo} alt={booking.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#D6EBE0] text-[#1E4030] font-bold text-lg flex items-center justify-center">
                  {booking.initials || 'NZ'}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base text-[#1C1A17]">{booking.name}</h4>
                <span className="text-[10px] bg-white text-[#1E4030] border border-green-200 px-2 py-0.5 rounded-full font-bold">
                  {booking.profession || booking.provider?.profession || meta.label || 'Cleaner'}
                </span>
              </div>
              <p className="text-xs text-[#8A7E74]">Care Provider &middot; ID: {booking.id}</p>
            </div>
          </div>

          {/* Status & Arrival OTP Preview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Booking Status</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E4030]">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>{booking.status}</span>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Arrival OTP</span>
              <div className="font-mono text-sm font-extrabold text-[#1E4030]">
                {booking.arrivalOtp || '—'}
              </div>
            </div>
          </div>

          {/* Schedule & Exact Financial Breakdown */}
          <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-[#E2D9CF] pb-2 font-bold text-[#1C1A17]">
              <span>Price Breakdown</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDF7F2] text-[#1E4030] border border-green-200">
                {booking.escrowStatus || 'Secured in Escrow'}
              </span>
            </div>

            <div className="flex justify-between text-[#8A7E74]">
              <span>Scheduled Date & Time</span>
              <span className="font-semibold text-[#1C1A17]">{booking.date} &middot; {booking.time}</span>
            </div>

            <div className="flex justify-between text-[#8A7E74]">
              <span>Hourly Care Rate</span>
              <span className="font-semibold text-[#1C1A17]">{hourlyRate.toLocaleString()} XAF / hr</span>
            </div>

            <div className="flex justify-between text-[#8A7E74]">
              <span>Session Duration</span>
              <span className="font-semibold text-[#1C1A17]">{hours} hr{hours > 1 ? 's' : ''}</span>
            </div>

            {sessions > 1 && (
              <div className="flex justify-between text-[#8A7E74]">
                <span>Total Sessions</span>
                <span className="font-semibold text-[#1C1A17]">{sessions} sessions</span>
              </div>
            )}

            <div className="flex justify-between text-[#8A7E74]">
              <span>Care Subtotal</span>
              <span className="font-semibold text-[#1C1A17]">{subtotal.toLocaleString()} XAF</span>
            </div>

            <div className="flex justify-between text-[#8A7E74]">
              <span>Platform Fee (Escrow Protection)</span>
              <span className="font-semibold text-[#1E4030]">{fee.toLocaleString()} XAF</span>
            </div>

            <div className="pt-2 border-t border-[#E2D9CF] flex justify-between font-bold text-sm text-[#1E4030]">
              <span className="text-[#1C1A17]">Total Escrow Amount</span>
              <span className="text-base">{total.toLocaleString()} XAF</span>
            </div>
          </div>

          {/* Escrow note */}
          <div className="p-3.5 bg-[#EDF7F2] border border-green-200 rounded-2xl flex items-center gap-2 text-xs text-[#1E4030]">
            <ShieldCheck size={16} className="shrink-0" />
            <span>Escrow guarantee: Funds are only paid out after OTP presence check and 24h completion confirmation.</span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E2D9CF] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              onClose();
              onNavigate('otp', { booking });
            }}
            className="flex-1 bg-[#1E4030] hover:bg-[#152e22] text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Key size={14} />
            <span>Open Arrival OTP Screen</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 border border-[#E2D9CF] hover:bg-white text-xs font-bold text-[#8A7E74] hover:text-[#1C1A17] rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingsTab({
  bookings,
  activeBookingDropdownId,
  setActiveBookingDropdownId,
  onNavigate
}) {
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#EDF7F2] rounded-2xl flex items-center justify-center border border-green-200/60 text-[#1E4030] shadow-sm">
          <CalendarCheck size={20} />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1E4030]">My Bookings</h2>
          <p className="text-sm text-[#8A7E74]">Upcoming visits and your care history.</p>
        </div>
        <div className="ml-auto bg-[#EDF7F2] border border-green-200/60 text-[#1E4030] text-xs font-bold px-3 py-1.5 rounded-full">
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-3">
        {bookings.map(b => {
          const meta = SPECIALTY_META[b.specialty] || { label: 'Provider' };
          const showDropdown = activeBookingDropdownId === b.id;

          return (
            <div
              key={b.id}
              className="bg-white border border-[#E2D9CF] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-[#D4C9BE] transition-all relative"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E2D9CF] shrink-0 shadow-sm flex items-center justify-center">
                  {b.photo ? (
                    <img src={b.photo} alt={b.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#D6EBE0] text-[#1E4030] font-bold text-base flex items-center justify-center">
                      {b.initials || 'NZ'}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="font-bold text-base text-[#1C1A17]">{b.name}</h4>
                    <span className="text-[11px] bg-[#FAF8F5] text-[#1E4030] border border-[#E2D9CF] px-2.5 py-0.5 rounded-full font-semibold">
                      {b.profession || b.provider?.profession || meta.label || 'Cleaner'}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A7E74] font-medium">
                    <CalendarCheck size={11} className="inline mr-1.5 text-[#B0A89E]" />
                    {b.date} &middot; {b.time}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border bg-[#EDF7F2] text-[#1E4030] border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {b.status}
                  </span>

                  <div className="relative">
                    <button
                      onClick={() => setActiveBookingDropdownId(showDropdown ? null : b.id)}
                      className="w-9 h-9 rounded-xl hover:bg-[#FAF8F5] border border-transparent hover:border-[#E2D9CF] flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] transition-all cursor-pointer"
                    >
                      <MoreHorizontal size={17} />
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 top-10 w-48 bg-white border border-[#E2D9CF] rounded-xl shadow-xl py-1.5 z-50 animate-fadeIn">
                        {/* View Details as Modal */}
                        <button
                          onClick={() => {
                            setActiveBookingDropdownId(null);
                            setSelectedBookingForModal(b);
                          }}
                          className="w-full px-4 py-2 text-xs text-[#1C1A17] hover:bg-[#FAF8F5] text-left font-semibold transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <ChevronRight size={13} className="text-[#8A7E74]" />
                          View details
                        </button>
                        <button
                          onClick={() => {
                            setActiveBookingDropdownId(null);
                            onNavigate('otp', { booking: b });
                          }}
                          className="w-full px-4 py-2 text-xs text-[#1E4030] hover:bg-[#EDF7F2] text-left font-semibold transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <Key size={13} className="text-[#1E4030]" />
                          Get OTP
                        </button>
                        <button
                          onClick={() => {
                            setActiveBookingDropdownId(null);
                            onNavigate('completion', { booking: b });
                          }}
                          className="w-full px-4 py-2 text-xs text-[#1D6F42] hover:bg-[#EDF7F2] text-left font-semibold transition-colors cursor-pointer flex items-center gap-2 border-t border-[#F0EBE5]"
                        >
                          <CheckCircle2 size={13} className="text-[#1D6F42]" />
                          Confirm service
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {bookings.length === 0 && (
          <div className="text-center py-16 bg-white border border-[#E2D9CF] rounded-2xl">
            <CalendarCheck size={32} className="mx-auto text-[#8A7E74]/30 mb-3" />
            <p className="text-sm font-semibold text-[#8A7E74]">No bookings yet</p>
            <p className="text-xs text-[#8A7E74]/70 mt-1">Your confirmed bookings will appear here.</p>
          </div>
        )}
      </div>

      {/* Booking Details Modal Popup */}
      <BookingDetailsModal
        booking={selectedBookingForModal}
        onClose={() => setSelectedBookingForModal(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
