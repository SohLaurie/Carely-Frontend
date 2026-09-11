import React, { useState, useEffect } from 'react';
import {
  Key, ShieldCheck, Clock, CheckCircle2, AlertTriangle,
  ArrowLeft, ChevronRight, ArrowRight, User, X, RotateCcw, AlertCircle
} from 'lucide-react';
import { CAREGIVERS, SPECIALTY_META } from '../../../data';
import { verifySessionOtp, fetchBooking } from '../../../services/bookingApi';

export default function OTPArrival({ onNavigate, screenParams }) {
  const booking = screenParams?.booking || {
    caregiver: CAREGIVERS[0],
    sessionType: 'once',
    date: 'Mon Aug 4',
    time: '09:00 – 12:00',
    totalPrice: 11000,
    arrivalOtp: '4829',
    status: 'Confirmed'
  };

  const caregiver = booking.caregiver || CAREGIVERS[0];
  const meta = SPECIALTY_META[caregiver.specialty] || { label: 'Provider' };

  const [otp] = useState(String(booking.arrivalOtp || booking.sessions?.[0]?.otp_code || '4829'));
  const [sessionState, setSessionState] = useState(
    booking.status === 'in_progress' || booking.rawStatus === 'in_progress' ? 'in_progress' : 'waiting_arrival'
  );
  const [noShowModalOpen, setNoShowModalOpen] = useState(false);

  const bookingId = booking.id || screenParams?.activeBookingId;

  // Poll backend booking to detect when provider enters OTP in provider dashboard
  useEffect(() => {
    if (!bookingId || typeof bookingId !== 'string' || !bookingId.includes('-')) return;

    let isMounted = true;
    const checkStatus = async () => {
      try {
        const live = await fetchBooking(bookingId);
        if (!isMounted || !live) return;
        const liveSession = live.sessions?.[0];
        if (
          live.status === 'in_progress' ||
          live.status === 'completed' ||
          liveSession?.status === 'ARRIVED' ||
          liveSession?.status === 'COMPLETED' ||
          liveSession?.status === 'AWAITING_CONFIRMATION'
        ) {
          setSessionState('in_progress');
        }
      } catch (err) {
        console.warn('Check arrival status error:', err.message);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [bookingId]);

  const handleNoShowConfirm = () => {
    setNoShowModalOpen(false);
    setSessionState('no_show');
    setTimeout(() => {
      onNavigate('search');
    }, 2500);
  };

  return (
    <div className="w-full text-[#1C1A17] space-y-6">
      {/* Back Link */}
      <button
        onClick={() => onNavigate('search')}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#8A7E74] hover:text-[#1C1A17] transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      {/* Title Block */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 bg-[#EDF7F2] text-[#1E4030] text-[11px] font-bold px-3 py-1 rounded-full border border-green-200">
          <Key size={13} />
          Step 4: Day of Service & Arrival OTP
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1E4030]">On-Site Arrival Verification</h1>
        <p className="text-xs sm:text-sm text-[#8A7E74]">
          Provide your 4-digit arrival OTP to {caregiver.name?.split(' ')[0] || 'your provider'} upon their arrival to confirm on-site presence.
        </p>
      </div>

      {/* OTP Code Display Box */}
      <div className="bg-white rounded-3xl border border-[#E2D9CF] p-8 shadow-sm text-center space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#8A7E74] uppercase tracking-widest">
            Your 4-Digit Arrival OTP Code
          </span>
          <div className="flex justify-center items-center gap-3">
            {otp.split('').map((digit, idx) => (
              <span
                key={idx}
                className="w-14 h-16 sm:w-16 sm:h-20 bg-[#FAF8F5] border-2 border-[#1E4030] rounded-2xl flex items-center justify-center font-mono font-extrabold text-3xl sm:text-4xl text-[#1E4030] shadow-sm"
              >
                {digit}
              </span>
            ))}
          </div>
          <p className="text-xs text-[#8A7E74] pt-2">
            Keep this screen open. Share this code with {caregiver.name.split(' ')[0]} when they arrive at your door.
          </p>
        </div>

        {/* Current Session Status Badge & Completion Link */}
        <div className="pt-4 border-t border-[#E2D9CF] flex flex-col items-center justify-center gap-3">
          {sessionState === 'waiting_arrival' && (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 text-xs font-bold px-4 py-2 rounded-full border border-amber-200">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                Waiting for Provider Arrival on Site ({booking.time})
              </div>
              <div>
                <button
                  onClick={() => onNavigate('completion', { booking: { ...booking, otpVerified: false } })}
                  className="text-xs text-[#8A7E74] hover:text-[#1E4030] font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Already completed? Confirm session completion directly</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {sessionState === 'in_progress' && (
            <div className="space-y-4 animate-fadeIn flex flex-col items-center">
              <div className="inline-flex items-center gap-2 bg-[#EDF7F2] text-[#1E4030] text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full border border-green-200 shadow-xs">
                <CheckCircle2 size={16} className="text-green-600" />
                <span>Provider has reached &middot; Session in progress</span>
              </div>
              <button
                onClick={() => onNavigate('completion', { booking: { ...booking, otpVerified: true } })}
                className="inline-flex items-center gap-2 bg-[#1E4030] hover:bg-[#152e22] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl shadow-sm transition-all cursor-pointer group"
              >
                <span>Confirm Session Completion</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {sessionState === 'no_show' && (
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-bold px-4 py-2 rounded-full border border-red-200">
              <AlertTriangle size={14} />
              No-Show Flagged &middot; Full Escrow Refund Returned
            </div>
          )}
        </div>
      </div>

        {/* No-Show Confirmation Modal */}
        {noShowModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl border border-[#E2D9CF] p-6 sm:p-8 w-full max-w-sm text-center space-y-4">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-200">
                <AlertCircle size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[#1C1A17]">Confirm Provider No-Show?</h3>
                <p className="text-xs text-[#8A7E74] leading-relaxed">
                  Since the OTP was never entered at arrival time, objective evidence confirms the provider did not arrive. Your escrow payment of <strong className="text-[#1E4030]">{booking.totalPrice?.toLocaleString() || '11,000'} XAF</strong> will be refunded immediately.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setNoShowModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border-2 border-[#E2D9CF] rounded-xl text-xs font-semibold text-[#1C1A17] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Wait More
                </button>
                <button
                  onClick={handleNoShowConfirm}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Confirm No-Show & Refund
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
