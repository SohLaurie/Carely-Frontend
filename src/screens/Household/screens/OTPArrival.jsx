import React, { useState } from 'react';
import {
  Key, ShieldCheck, Clock, CheckCircle2, AlertTriangle,
  ArrowLeft, ChevronRight, User, RefreshCw, X, RotateCcw, AlertCircle
} from 'lucide-react';
import { CAREGIVERS, SPECIALTY_META } from '../../../data';

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
  const meta = SPECIALTY_META[caregiver.specialty] || { label: 'Caregiver' };

  const [otp] = useState(booking.arrivalOtp || '4829');
  const [caregiverInputOtp, setCaregiverInputOtp] = useState('');
  const [sessionState, setSessionState] = useState('waiting_arrival'); // 'waiting_arrival' | 'in_progress' | 'no_show'
  const [noShowModalOpen, setNoShowModalOpen] = useState(false);

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (caregiverInputOtp === otp) {
      setSessionState('in_progress');
    } else {
      alert('Invalid OTP code. Please check the 4 digits displayed on the household screen.');
    }
  };

  const handleNoShowConfirm = () => {
    setNoShowModalOpen(false);
    setSessionState('no_show');
    setTimeout(() => {
      onNavigate('search');
    }, 2500);
  };

  const handleEndSessionTimePassed = () => {
    onNavigate('completion', {
      booking: {
        ...booking,
        otpVerified: sessionState === 'in_progress',
        status: 'Awaiting Confirmation'
      }
    });
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
          Provide your 4-digit arrival OTP to {caregiver.name?.split(' ')[0] || 'your caregiver'} upon their arrival to confirm on-site presence.
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

          {/* Current Session Status Badge */}
          <div className="pt-4 border-t border-[#E2D9CF] flex justify-center">
            {sessionState === 'waiting_arrival' && (
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 text-xs font-bold px-4 py-2 rounded-full border border-amber-200">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                Waiting for Caregiver Arrival on Site ({booking.time})
              </div>
            )}

            {sessionState === 'in_progress' && (
              <div className="inline-flex items-center gap-2 bg-[#EDF7F2] text-[#1E4030] text-xs font-bold px-4 py-2 rounded-full border border-green-200">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                OTP Verified &middot; Session In Progress (Active Service)
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

        {/* ─── INTERACTIVE MVP SIMULATION: Caregiver Terminal (Entering OTP / Triggering No-Show) ─── */}
        <div className="bg-gradient-to-r from-[#1E4030] to-[#152e22] text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-green-300 uppercase tracking-wider">
            <RefreshCw size={14} className="animate-spin" />
            <span>Caregiver Terminal Simulation (On-Site Action)</span>
          </div>

          {sessionState === 'waiting_arrival' && (
            <div className="space-y-4">
              <p className="text-xs text-white/80 leading-relaxed">
                When {caregiver.name.split(' ')[0]} reaches your home, they enter the 4-digit OTP to lock in arrival presence. Test below:
              </p>

              <form onSubmit={handleVerifyOtp} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Enter OTP (e.g. 4829)"
                  value={caregiverInputOtp}
                  onChange={e => setCaregiverInputOtp(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 text-xs focus:outline-none focus:bg-white/20 flex-1"
                />
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>Simulate Caregiver Entering OTP ({otp})</span>
                </button>
              </form>

              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-white/60">Caregiver never arrived?</span>
                <button
                  type="button"
                  onClick={() => setNoShowModalOpen(true)}
                  className="text-red-300 font-bold hover:text-red-200 hover:underline cursor-pointer"
                >
                  Report No-Show & Auto-Refund
                </button>
              </div>
            </div>
          )}

          {sessionState === 'in_progress' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-white/10 border border-white/20 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-green-300 text-sm">
                  <Check size={16} />
                  <span>On-Site Presence Confirmed</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">
                  The service is underway. Cancellations are now locked. When the scheduled end time passes, the 24-hour confirmation window opens automatically.
                </p>
              </div>

              <button
                onClick={handleEndSessionTimePassed}
                className="w-full bg-white hover:bg-white/90 text-[#1E4030] font-bold py-3.5 px-6 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Simulate End of Session &rarr; Open Step 5: 24h Confirmation Window</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* No-Show Confirmation Modal */}
        {noShowModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl border border-[#E2D9CF] p-6 sm:p-8 w-full max-w-sm text-center space-y-4">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-200">
                <AlertCircle size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[#1C1A17]">Confirm Caregiver No-Show?</h3>
                <p className="text-xs text-[#8A7E74] leading-relaxed">
                  Since the OTP was never entered at arrival time, objective evidence confirms the caregiver did not arrive. Your escrow payment of <strong className="text-[#1E4030]">{booking.totalPrice?.toLocaleString() || '11,000'} XAF</strong> will be refunded immediately.
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
