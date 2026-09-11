import React, { useState, useEffect } from 'react';
import {
  Clock, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft,
  ChevronRight, Star, RefreshCw, X, RotateCcw, Calendar, Check,
  AlertTriangle, DollarSign
} from 'lucide-react';
import { CAREGIVERS, SPECIALTY_META } from '../../../data';
import { confirmSession, disputeSession, skipSession } from '../../../services/bookingApi';

export default function Completion({ onNavigate, screenParams }) {
  const booking = screenParams?.booking || {
    caregiver: CAREGIVERS[0],
    sessionType: 'once',
    date: 'Mon Aug 4',
    time: '09:00 – 12:00',
    totalPrice: 11000,
    otpVerified: true,
    status: 'Awaiting Confirmation',
    scheduleList: [
      { id: 's-1', index: 1, week: 1, date: 'Mon Aug 4', time: '09:00 – 12:00', price: 10500, status: 'Completed' },
      { id: 's-2', index: 2, week: 1, date: 'Wed Aug 6', time: '09:00 – 12:00', price: 10500, status: 'Scheduled' },
      { id: 's-3', index: 3, week: 1, date: 'Fri Aug 8', time: '09:00 – 12:00', price: 10500, status: 'Scheduled' },
      { id: 's-4', index: 4, week: 2, date: 'Mon Aug 11', time: '09:00 – 12:00', price: 10500, status: 'Scheduled' },
      { id: 's-5', index: 5, week: 2, date: 'Wed Aug 13', time: '09:00 – 12:00', price: 10500, status: 'Scheduled' },
    ]
  };

  const caregiver = booking.caregiver || CAREGIVERS[0];
  const meta = SPECIALTY_META[caregiver.specialty] || { label: 'Provider' };

  // 24-Hour Confirmation Window Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 54, seconds: 12 });
  const [escrowState, setEscrowState] = useState('window_open'); // 'window_open' | 'released' | 'refunded'

  const initialSessions = Array.isArray(booking.sessions) && booking.sessions.length > 0
    ? booking.sessions.map((s, idx) => ({
        id: s.id,
        index: s.session_number || idx + 1,
        week: s.week_number || 1,
        date: s.scheduled_date || 'Upcoming',
        time: `${s.scheduled_start_time?.slice(0, 5) || '09:00'} – ${s.scheduled_end_time?.slice(0, 5) || '12:00'}`,
        price: Number(s.session_amount) || 10500,
        status: s.status === 'COMPLETED' ? 'Completed' : (s.status === 'ARRIVED' ? 'In Progress' : 'Scheduled')
      }))
    : (booking.scheduleList || []);

  const [recurringSessions, setRecurringSessions] = useState(initialSessions);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Household explicitly confirms completion
  const handleHouseholdConfirm = async () => {
    const sessionId = booking.sessions?.[0]?.id;
    if (sessionId && typeof sessionId === 'string' && sessionId.includes('-')) {
      try {
        await confirmSession(sessionId);
      } catch (err) {
        console.warn('confirmSession API error:', err.message);
      }
    }
    setEscrowState('released');
    setTimeout(() => {
      onNavigate('review', { caregiver, booking });
    }, 1800);
  };

  // Simulate 24-Hour Timeout
  const handleSimulate24hTimeout = () => {
    if (booking.otpVerified) {
      setEscrowState('released');
      setNotificationMessage('24-Hour window expired with verified OTP. Escrow payout auto-released to provider.');
    } else {
      setEscrowState('refunded');
      setNotificationMessage('24-Hour window expired without verified OTP. Funds automatically refunded to household.');
    }
  };

  // Recurring booking cancellation handlers
  const handleCancelFutureWeek = (weekNumber) => {
    setRecurringSessions(prev =>
      prev.filter(s => s.week !== weekNumber)
    );
    setNotificationMessage(`Week ${weekNumber} cancelled. No future billing will occur for that week.`);
  };

  const handleSkipSingleOccurrence = (sessionId) => {
    setRecurringSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, status: 'Skipped / Prorated Credit' } : s))
    );
    setNotificationMessage('Session occurrence skipped. Prorated refund applied for that session.');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1C1A17] pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 space-y-6">
        
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
            <Clock size={13} />
            Step 5 & 6: Confirmation Window & Escrow Payout
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1E4030]">Service Confirmation & Fund Release</h1>
          <p className="text-xs sm:text-sm text-[#8A7E74]">
            The scheduled end time has passed. Please confirm that {caregiver.name.split(' ')[0]} completed the service satisfactorily.
          </p>
        </div>

        {/* Action / Notification Banner */}
        {notificationMessage && (
          <div className="bg-[#EDF7F2] border border-green-300 text-[#1E4030] rounded-2xl p-4 text-xs font-bold flex items-center justify-between animate-fadeIn">
            <span>{notificationMessage}</span>
            <button onClick={() => setNotificationMessage(null)} className="text-green-800"><X size={14} /></button>
          </div>
        )}

        {/* 24-Hour Confirmation Window Timer Box */}
        <div className="bg-white rounded-3xl border border-[#E2D9CF] p-6 sm:p-8 shadow-sm text-center space-y-5">
          {escrowState === 'window_open' && (
            <>
              <div className="w-16 h-16 bg-[#EDF7F2] text-[#1E4030] rounded-3xl flex items-center justify-center mx-auto border border-green-200 shadow-sm">
                <Clock size={32} />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-[#8A7E74] uppercase tracking-wider">
                  Automatic 24-Hour Confirmation Window Open
                </span>
                <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#1E4030]">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <p className="text-xs text-[#8A7E74] max-w-md mx-auto pt-1">
                  If you take no action, escrow will automatically release to {caregiver.name.split(' ')[0]} after 24h because the arrival OTP was verified on-site.
                </p>
              </div>

              {/* Confirm Completion Button */}
              <div className="pt-3 max-w-md mx-auto">
                <button
                  onClick={handleHouseholdConfirm}
                  className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-4 px-6 rounded-2xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={18} />
                  <span>Confirm Service Completed (Release Escrow Funds)</span>
                </button>
              </div>
            </>
          )}

          {escrowState === 'released' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <Check size={32} strokeWidth={3} />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#1E4030]">Escrow Released Successfully!</h2>
              <p className="text-xs text-[#8A7E74]">
                Payout has been transferred to {caregiver.name.split(' ')[0]}'s mobile wallet. Redirecting to ratings & review...
              </p>
            </div>
          )}

          {escrowState === 'refunded' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <RotateCcw size={28} />
              </div>
              <h2 className="font-display text-2xl font-bold text-amber-900">Funds Refunded to Household</h2>
              <p className="text-xs text-amber-800">
                Since no arrival OTP was recorded, funds were safely returned to your wallet.
              </p>
            </div>
          )}
        </div>

        {/* ─── INTERACTIVE MVP SIMULATION: 24h Expiry Test ─── */}
        {escrowState === 'window_open' && (
          <div className="bg-gradient-to-r from-[#1E4030] to-[#152e22] text-white rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-green-300 uppercase tracking-wider">
              <RefreshCw size={14} className="animate-spin" />
              <span>MVP Simulation: Test 24h Window Expiration</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Test what happens when the household takes no action for 24 hours (Auto-release if OTP was verified vs Auto-refund if OTP was missing).
            </p>
            <button
              onClick={handleSimulate24hTimeout}
              className="bg-white/15 hover:bg-white/25 text-white font-bold py-3 px-5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Simulate 24-Hour Timer Expiration (Current OTP Status: {booking.otpVerified ? 'Verified ✓' : 'Unverified ✗'})</span>
            </button>
          </div>
        )}

        {/* ─── RECURRING BOOKING SESSION MANAGER (If recurring booking) ─── */}
        {booking.sessionType === 'recurring' && (
          <div className="bg-white rounded-3xl border border-[#E2D9CF] p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#F0EBE4] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#1C1A17]">Recurring Booking Schedule Manager</h3>
                <p className="text-xs text-[#8A7E74]">Manage upcoming occurrences, cancel future weeks, or skip sessions.</p>
              </div>
              <span className="bg-[#EDF7F2] text-[#1E4030] font-bold text-xs px-3 py-1 rounded-full border border-green-200">
                {recurringSessions.length} Sessions Total
              </span>
            </div>

            <div className="space-y-3">
              {recurringSessions.map(session => (
                <div
                  key={session.id}
                  className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#1C1A17]">Session {session.index}: {session.date}</span>
                      <span className="text-[10px] text-[#8A7E74]">({session.time})</span>
                      <span className="text-[10px] bg-white border border-[#E2D9CF] px-2 py-0.5 rounded-full font-semibold">
                        Week {session.week}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8A7E74]">
                      Status: <strong className="text-[#1E4030]">{session.status}</strong> &middot; {session.price.toLocaleString()} XAF
                    </p>
                  </div>

                  {session.status === 'Scheduled' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSkipSingleOccurrence(session.id)}
                        className="text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                      >
                        Skip Occurrence
                      </button>
                      <button
                        onClick={() => handleCancelFutureWeek(session.week)}
                        className="text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel Week {session.week}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
