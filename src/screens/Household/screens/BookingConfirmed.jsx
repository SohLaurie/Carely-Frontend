import React, { useEffect } from 'react';
import {
  CheckCircle2, Calendar, Clock, MapPin, Key, ShieldCheck,
  ArrowRight, MessageSquare, Download, Share2, ArrowLeft
} from 'lucide-react';
import { CAREGIVERS, SPECIALTY_META } from '../../../data';

export default function BookingConfirmed({ onNavigate, screenParams, loadBookings }) {
  const booking = screenParams?.booking || {
    caregiver: CAREGIVERS[0],
    sessionType: 'once',
    date: 'Mon Aug 4',
    time: '09:00 – 12:00',
    totalPrice: 11000,
    arrivalOtp: '4829',
    status: 'Confirmed'
  };

  useEffect(() => {
    if (typeof loadBookings === 'function') {
      loadBookings();
    }
  }, [loadBookings]);

  const caregiver = booking.caregiver || CAREGIVERS[0];
  const meta = SPECIALTY_META[caregiver.specialty] || { label: 'Provider' };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1C1A17] pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 space-y-6">
        
        {/* Success Header */}
        <div className="bg-white rounded-3xl border border-[#E2D9CF] p-8 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-[#EDF7F2] text-[#1E4030] rounded-3xl flex items-center justify-center mx-auto border border-green-200 shadow-sm">
            <CheckCircle2 size={36} />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-[#EDF7F2] text-[#1E4030] text-[11px] font-bold px-3 py-1 rounded-full border border-green-200">
              <ShieldCheck size={13} />
              Carely Escrow Secured
            </div>
            <h1 className="font-display text-3xl font-bold text-[#1E4030]">Booking Confirmed & Locked</h1>
            <p className="text-xs sm:text-sm text-[#8A7E74]">
              Your session with {caregiver.name} is permanently locked. Escrow funds are secured.
            </p>
          </div>
        </div>

        {/* Arrival OTP Card */}
        <div className="bg-[#1E4030] text-white rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-3">
          <span className="text-xs font-bold text-green-300 uppercase tracking-widest block">
            Day of Service Arrival OTP
          </span>
          <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-[0.3em] text-white bg-white/10 border border-white/20 py-3 px-4 rounded-2xl max-w-xs mx-auto">
            {booking.arrivalOtp || booking.sessions?.[0]?.otp_code || '4829'}
          </div>
          <p className="text-xs text-white/70 max-w-sm mx-auto">
            Share this verification code with {caregiver.name.split(' ')[0]} when they arrive at your door to start the session.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('otp', { booking })}
              className="bg-white hover:bg-white/90 text-[#1E4030] font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
            >
              Open Arrival Verification Screen &rarr;
            </button>
          </div>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-3xl border border-[#E2D9CF] p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="font-bold text-base text-[#1C1A17] border-b border-[#F0EBE4] pb-3">Session Information</h3>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E2D9CF] shrink-0 flex items-center justify-center">
              {caregiver.photo ? (
                <img src={caregiver.photo} alt={caregiver.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#D6EBE0] text-[#1E4030] font-bold text-lg flex items-center justify-center">
                  {caregiver.initials || 'NZ'}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base text-[#1C1A17]">{caregiver.name}</h4>
                <span className="text-[10px] bg-[#EDF7F2] text-[#1E4030] border border-green-200 px-2 py-0.5 rounded-full font-bold">
                  {caregiver.profession || meta.label || 'Cleaner'}
                </span>
              </div>
              <p className="text-xs text-[#8A7E74] flex items-center gap-1.5">
                <MapPin size={13} className="text-[#1E4030]" />
                {caregiver.location}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3">
              <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Schedule</span>
              <span className="font-bold text-[#1C1A17]">{booking.date} ({booking.time})</span>
            </div>
            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3">
              <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Escrow Amount</span>
              <span className="font-bold text-[#1E4030]">{booking.totalPrice?.toLocaleString() || '11,000'} XAF</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-[#E2D9CF]">
            <button
              onClick={() => onNavigate('discussions')}
              className="flex-1 bg-[#FAF8F5] hover:bg-[#EDF7F2] text-[#1E4030] border border-[#E2D9CF] py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare size={14} />
              <span>Chat in Discussions</span>
            </button>
            <button
              onClick={() => {
                if (typeof loadBookings === 'function') loadBookings();
                onNavigate('bookings');
              }}
              className="flex-1 bg-[#1E4030] hover:bg-[#152e22] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View in My Bookings</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
