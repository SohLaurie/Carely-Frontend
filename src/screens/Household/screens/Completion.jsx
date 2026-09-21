import React, { useState, useEffect } from 'react';
import {
  Clock, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft,
  ChevronRight, Star, RefreshCw, X, RotateCcw, Calendar, Check,
  AlertTriangle, DollarSign
} from 'lucide-react';
import { CAREGIVERS, SPECIALTY_META } from '../../../data';
import { confirmSession, disputeSession, skipSession, confirmPartialPayment } from '../../../services/bookingApi';

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
  const [escrowState, setEscrowState] = useState('window_open'); // 'window_open' | 'released' | 'partial_released' | 'refunded' | 'disputed'

  const firstSession = Array.isArray(booking.sessions) && booking.sessions.length > 0
    ? booking.sessions[0]
    : null;

  // Interruption status & calculations
  const isInterrupted = firstSession?.status === 'INTERRUPTED' || booking.status === 'interrupted' || booking.rawStatus === 'interrupted';
  const totalAmount = Number(booking.totalPrice || firstSession?.session_amount || 11000);
  const partialAmount = Number(firstSession?.partial_amount || Math.round(totalAmount * 0.5));
  const refundAmount = Math.max(0, totalAmount - partialAmount);
  
  const otpVerifiedAt = firstSession?.otp_verified_at
    ? new Date(firstSession.otp_verified_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : (booking.time?.split('–')[0]?.trim() || '09:00 AM');
    
  const interruptedAt = firstSession?.interrupted_at
    ? new Date(firstSession.interrupted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '11:15 AM';

  // Calculate hours worked for display
  const hoursWorked = firstSession?.otp_verified_at && firstSession?.interrupted_at
    ? Math.max(1, Math.floor((new Date(firstSession.interrupted_at) - new Date(firstSession.otp_verified_at)) / 3600000))
    : 1;

  const interruptionReason = firstSession?.interruption_reason || booking.interruption_reason || '';

  const initialSessions = Array.isArray(booking.sessions) && booking.sessions.length > 0
    ? booking.sessions.map((s, idx) => ({
        id: s.id,
        index: s.session_number || idx + 1,
        week: s.week_number || 1,
        date: s.scheduled_date || 'Upcoming',
        time: `${s.scheduled_start_time?.slice(0, 5) || '09:00'} – ${s.scheduled_end_time?.slice(0, 5) || '12:00'}`,
        price: Number(s.session_amount) || 10500,
        status: s.status === 'COMPLETED' ? 'Completed' : (s.status === 'INTERRUPTED' ? 'Interrupted' : (s.status === 'ARRIVED' ? 'In Progress' : 'Scheduled'))
      }))
    : (booking.scheduleList || []);

  const [recurringSessions, setRecurringSessions] = useState(initialSessions);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeLoading, setDisputeLoading] = useState(false);
  const [disputeError, setDisputeError] = useState('');
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

  // Household explicitly confirms full completion
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

  // Household confirms partial payment for interrupted session
  const handleConfirmPartial = async () => {
    const sessionId = booking.sessions?.[0]?.id;
    if (sessionId && typeof sessionId === 'string' && sessionId.includes('-')) {
      try {
        await confirmPartialPayment(sessionId);
      } catch (err) {
        console.warn('confirmPartialPayment API error:', err.message);
      }
    }
    setEscrowState('partial_released');
    setTimeout(() => {
      onNavigate('review', { caregiver, booking });
    }, 2000);
  };

  // Dispute submission
  const handleDisputeSubmit = async () => {
    if (!disputeReason.trim()) return;
    setDisputeLoading(true);
    setDisputeError('');
    const sessionId = booking.sessions?.[0]?.id;
    try {
      if (sessionId && typeof sessionId === 'string' && sessionId.includes('-')) {
        await disputeSession(sessionId, disputeReason);
      }
      setDisputeModalOpen(false);
      setEscrowState('disputed');
      setNotificationMessage('Dispute lodged. Escrow frozen. Carely mediation team will contact you within 24 hours.');
    } catch (err) {
      setDisputeError(err.message || 'Failed to submit dispute.');
    } finally {
      setDisputeLoading(false);
    }
  };

  // Simulate 24-Hour Timeout based on user specification table
  const handleSimulate24hTimeout = () => {
    if (isInterrupted) {
      setEscrowState('partial_released');
      setNotificationMessage('24-Hour window expired for interrupted session. Partial payout auto-released to provider, remainder refunded to your wallet.');
    } else if (booking.otpVerified) {
      // Per spec: Normal, neither party acts within 24h -> full refund to household (no proof of completion from either side)
      setEscrowState('refunded');
      setNotificationMessage('24-Hour window expired with no completion confirmation from either party. Full refund released back to household.');
    } else {
      // No-show (no OTP) -> automatic full refund
      setEscrowState('refunded');
      setNotificationMessage('24-Hour window expired without verified OTP (No-show). Full refund processed back to household.');
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
            Confirmation Window & Escrow Payout
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1E4030]">
            {isInterrupted ? 'Early Departure & Partial Payment' : 'Service Confirmation & Fund Release'}
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7E74]">
            {isInterrupted
              ? `Your provider reported early departure due to an emergency. Review hours worked and confirm partial payment.`
              : `The scheduled end time has passed. Please confirm that ${caregiver.name.split(' ')[0]} completed the service satisfactorily.`}
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
          {escrowState === 'window_open' && !isInterrupted && (
            <>
              <div className="w-16 h-16 bg-[#EDF7F2] text-[#1E4030] rounded-3xl flex items-center justify-center mx-auto border border-green-200 shadow-sm">
                <Clock size={32} />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-[#8A7E74] uppercase tracking-wider">
                  24-Hour Confirmation Window Open
                </span>
                <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#1E4030]">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <p className="text-xs text-[#8A7E74] max-w-md mx-auto pt-1 leading-relaxed">
                  Please confirm completion once the service is finished. If neither party acts within 24 hours, both buttons disable and escrow funds are fully refunded to the household.
                </p>
              </div>

              {/* Confirm Completion Button */}
              <div className="pt-3 max-w-md mx-auto flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDisputeModalOpen(true)}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle size={15} />
                  <span>Dispute</span>
                </button>
                <button
                  onClick={handleHouseholdConfirm}
                  className="flex-1 w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-3.5 px-6 rounded-2xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <CheckCircle2 size={18} />
                  <span>Confirm Service Completed (Full Release)</span>
                </button>
              </div>
            </>
          )}

          {/* INTERRUPTED STATE (Provider reported unable to complete) */}
          {escrowState === 'window_open' && isInterrupted && (
            <div className="space-y-5 animate-fadeIn">
              <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-3xl flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
                <AlertTriangle size={32} />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Provider Reported Early Departure / Interruption
                </span>
                <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#1C1A17]">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <p className="text-xs text-[#8A7E74] max-w-md mx-auto pt-1 leading-relaxed">
                  Your provider had to leave early due to an emergency. Review the hours worked below and confirm partial payment or dispute.
                </p>
              </div>

              {/* Partial Payment Breakdown Card */}
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-5 max-w-lg mx-auto text-left space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-[#E2D9CF] pb-2.5">
                  <span className="text-[#8A7E74] font-medium">Arrival (OTP Verified)</span>
                  <span className="font-bold text-[#1C1A17]">{otpVerifiedAt}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#E2D9CF] pb-2.5">
                  <span className="text-[#8A7E74] font-medium">Interruption Timestamp</span>
                  <span className="font-bold text-[#1C1A17]">{interruptedAt}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#E2D9CF] pb-2.5">
                  <span className="text-[#8A7E74] font-medium">Calculated Time Worked</span>
                  <span className="font-bold text-[#1E4030]">{hoursWorked} hour(s)</span>
                </div>
                {interruptionReason && (
                  <div className="border-b border-[#E2D9CF] pb-2.5">
                    <span className="text-[#8A7E74] font-medium block mb-0.5">Reason Given:</span>
                    <span className="italic text-[#5A5248]">"{interruptionReason}"</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1 font-bold text-sm">
                  <span className="text-[#1E4030]">Provider Earns (Partial):</span>
                  <span className="text-[#1E4030] font-extrabold">{partialAmount.toLocaleString()} XAF</span>
                </div>
                <div className="flex justify-between items-center font-bold text-sm text-emerald-800 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                  <span>Your Escrow Refund:</span>
                  <span className="font-extrabold">{refundAmount.toLocaleString()} XAF</span>
                </div>
              </div>

              {/* Action Buttons: Confirm Partial vs Dispute */}
              <div className="pt-2 max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDisputeModalOpen(true)}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle size={15} />
                  <span>Dispute Hours</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPartial}
                  className="flex-1 w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-3.5 px-6 rounded-2xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <CheckCircle2 size={16} />
                  <span>Confirm Partial Payment ({partialAmount.toLocaleString()} XAF)</span>
                </button>
              </div>
              <p className="text-[11px] text-[#8A7E74] max-w-sm mx-auto">
                If no action is taken within 24 hours, the partial payout of {partialAmount.toLocaleString()} XAF will be automatically released to the provider.
              </p>
            </div>
          )}

          {escrowState === 'released' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <Check size={32} strokeWidth={3} />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#1E4030]">Escrow Released Successfully!</h2>
              <p className="text-xs text-[#8A7E74]">
                Full payout has been transferred to {caregiver.name.split(' ')[0]}'s mobile wallet. Redirecting to ratings & review...
              </p>
            </div>
          )}

          {escrowState === 'partial_released' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="w-16 h-16 bg-[#1E4030] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <Check size={32} strokeWidth={3} />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#1E4030]">Partial Payment Confirmed!</h2>
              <p className="text-xs text-[#8A7E74]">
                {partialAmount.toLocaleString()} XAF has been disbursed to {caregiver.name.split(' ')[0]} for hours worked. The remaining {refundAmount.toLocaleString()} XAF has been refunded to your wallet. Redirecting to review...
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
                Escrow funds were safely returned to your wallet per platform confirmation policy.
              </p>
            </div>
          )}

          {escrowState === 'disputed' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <AlertTriangle size={28} />
              </div>
              <h2 className="font-display text-2xl font-bold text-red-900">Dispute Under Review</h2>
              <p className="text-xs text-[#5A5248] max-w-md mx-auto">
                Escrow funds are frozen. Our team will review the timestamps, reason, and contact both parties.
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
              Test what happens when the 24-hour confirmation window expires with no user action.
              {isInterrupted
                ? ' For an interrupted session: auto-releases partial payment to provider and refunds remainder.'
                : ' For a normal session: if neither party acts, both buttons disable and full refund goes to household.'}
            </p>
            <button
              onClick={handleSimulate24hTimeout}
              className="bg-white/15 hover:bg-white/25 text-white font-bold py-3 px-5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Simulate 24-Hour Timer Expiration ({isInterrupted ? 'Interrupted Session' : (booking.otpVerified ? 'Normal Session (No Action)' : 'No-Show')})</span>
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

      {/* Dispute Modal */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E2D9CF] space-y-5 animate-scaleUp">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#1C1A17]">Dispute Session</h3>
                  <p className="text-xs text-[#8A7E74]">Escalate to Carely support team</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDisputeModalOpen(false)}
                className="text-[#8A7E74] hover:text-[#1C1A17] p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#5A5248] leading-relaxed">
              Flagging a dispute freezes all escrow funds immediately. Our mediation team will contact both parties within 24 hours.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1A17] block">
                Describe the dispute reason <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="E.g. Provider left earlier than reported, service not performed properly..."
                className="w-full text-xs p-3 rounded-xl border border-[#E2D9CF] focus:outline-none focus:border-red-600 resize-none"
              />
            </div>

            {disputeError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{disputeError}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setDisputeModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-[#E2D9CF] text-xs font-bold text-[#5A5248] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={disputeLoading || disputeReason.trim().length < 5}
                onClick={handleDisputeSubmit}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <AlertTriangle size={14} />
                <span>{disputeLoading ? 'Submitting...' : 'Submit Dispute'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
