import React, { useState, useEffect } from 'react';
import {
  Clock, ShieldCheck, ArrowLeft, CheckCircle2, XCircle,
  AlertCircle, ChevronRight, User, RefreshCw, X, MessageSquare, Phone
} from 'lucide-react';
import { CAREGIVERS, SPECIALTY_META } from '../../../data';
import { fetchBooking, cancelBooking } from '../../../services/bookingApi';

export default function RequestPending({ onNavigate, screenParams }) {
  const request = screenParams?.activeRequest || screenParams?.booking || {
    caregiver: CAREGIVERS[0],
    sessionType: 'once',
    date: 'Mon Aug 4',
    time: '09:00 – 12:00',
    totalPrice: 11000,
    status: 'Pending',
    notes: 'Morning home care assistance'
  };

  const bookingId = screenParams?.activeBookingId || request.bookingId || request.id;

  const caregiver = request.caregiver || CAREGIVERS[0];
  const meta = SPECIALTY_META[caregiver.specialty] || { label: 'Caregiver' };

  // 24-Hour Response Window Countdown Simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 58, seconds: 45 });
  const [status, setStatus] = useState(request.status === 'Accepted' ? 'accepted' : 'pending'); // 'pending' | 'accepted' | 'declined' | 'cancelled'
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Poll backend booking status if valid booking ID is provided
  useEffect(() => {
    if (!bookingId || typeof bookingId !== 'string' || !bookingId.includes('-')) return;

    let isMounted = true;
    const pollInterval = setInterval(async () => {
      try {
        const liveBooking = await fetchBooking(bookingId);
        if (!isMounted || !liveBooking) return;

        if (liveBooking.status === 'accepted') {
          clearInterval(pollInterval);
          setStatus('accepted');
          setTimeout(() => {
            onNavigate('payment', {
              booking: {
                ...request,
                ...liveBooking,
                id: liveBooking.id,
                totalPrice: Number(liveBooking.total_price) || request.totalPrice,
                status: 'Accepted',
                caregiver: {
                  ...caregiver,
                  name: liveBooking.provider ? `${liveBooking.provider.firstName || ''} ${liveBooking.provider.lastName || ''}`.trim() : caregiver.name,
                }
              }
            });
          }, 1200);
        } else if (liveBooking.status === 'cancelled') {
          clearInterval(pollInterval);
          setStatus('declined');
        }
      } catch (e) {
        console.warn('Polling booking status error:', e.message);
      }
    }, 6000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [bookingId]);

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

  const alternativeCaregivers = CAREGIVERS.filter(c => c.id !== caregiver.id).slice(0, 2);

  const handleSimulateAccept = () => {
    setStatus('accepted');
    setTimeout(() => {
      onNavigate('payment', {
        booking: {
          ...request,
          id: bookingId,
          status: 'Accepted'
        }
      });
    }, 1200);
  };

  const handleSimulateDecline = () => {
    setStatus('declined');
  };

  const handleCancelRequest = async () => {
    if (bookingId && typeof bookingId === 'string' && bookingId.includes('-')) {
      try {
        await cancelBooking(bookingId);
      } catch (err) {
        console.warn('Backend cancel error:', err.message);
      }
    }
    setStatus('cancelled');
    setCancelModalOpen(false);
    setTimeout(() => {
      onNavigate('search');
    }, 1500);
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

        {/* Status Card Header */}
        <div className="bg-white rounded-3xl border border-[#E2D9CF] p-6 sm:p-8 shadow-sm text-center space-y-4">
          {status === 'pending' && (
            <>
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto border border-amber-200 shadow-sm animate-pulse">
                <Clock size={32} />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  Temporary Hold Active on Calendar
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1C1A17]">Request Sent to {caregiver.name.split(' ')[0]}</h1>
                <p className="text-xs sm:text-sm text-[#8A7E74] max-w-lg mx-auto leading-relaxed">
                  Caregiver has a 24-hour window to accept your request. No charge has occurred.
                </p>
              </div>

              {/* 24h Countdown Box */}
              <div className="inline-flex items-center gap-3 bg-[#FAF8F5] border border-[#E2D9CF] px-5 py-2.5 rounded-2xl text-xs font-bold text-[#1E4030]">
                <span>Response Window Closes in:</span>
                <span className="font-mono text-sm bg-white px-2 py-0.5 rounded-lg border border-[#E2D9CF] text-[#1C1A17]">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </>
          )}

          {status === 'accepted' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="w-16 h-16 bg-[#EDF7F2] text-[#1E4030] rounded-3xl flex items-center justify-center mx-auto border border-green-200 shadow-sm">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#1E4030]">Request Accepted!</h2>
              <p className="text-xs text-[#8A7E74]">Proceeding to Escrow Mobile Money payment approval...</p>
            </div>
          )}

          {status === 'declined' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto border border-red-200 shadow-sm">
                <XCircle size={32} />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#1C1A17]">Caregiver Unavailable</h2>
              <p className="text-xs text-[#8A7E74] max-w-md mx-auto">
                {caregiver.name.split(' ')[0]} could not accommodate this specific slot. Temporary hold has been cleared and zero fees were charged.
              </p>
            </div>
          )}

          {status === 'cancelled' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="w-16 h-16 bg-[#FAF8F5] text-[#8A7E74] rounded-3xl flex items-center justify-center mx-auto border border-[#E2D9CF] shadow-sm">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#1C1A17]">Request Cancelled</h2>
              <p className="text-xs text-[#8A7E74]">Your request was cancelled freely before acceptance. Redirecting...</p>
            </div>
          )}
        </div>

        {/* Request Overview Card */}
        <div className="bg-white rounded-3xl border border-[#E2D9CF] p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#1C1A17] border-b border-[#F0EBE4] pb-3">Requested Care Details</h3>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E2D9CF] shrink-0 shadow-sm">
              <img src={caregiver.photo} alt={caregiver.name} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base text-[#1C1A17]">{caregiver.name}</h4>
              <span className="text-xs font-bold text-[#1E4030] bg-[#EDF7F2] border border-green-200 px-2.5 py-0.5 rounded-full inline-block">
                {meta.label}
              </span>
              <p className="text-xs text-[#8A7E74]">{caregiver.location} &middot; {request.date} ({request.time})</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3">
              <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Booking Type</span>
              <span className="font-bold text-[#1C1A17]">{request.sessionType === 'once' ? 'Single Session' : 'Recurring Schedule'}</span>
            </div>
            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3">
              <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Escrow Amount</span>
              <span className="font-bold text-[#1E4030]">{request.totalPrice?.toLocaleString() || '11,000'} XAF</span>
            </div>
            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Payment Status</span>
              <span className="font-bold text-amber-700">Pending Acceptance</span>
            </div>
          </div>

          {/* Cancellation before acceptance button */}
          {status === 'pending' && (
            <div className="pt-4 border-t border-[#E2D9CF] flex justify-between items-center">
              <span className="text-xs text-[#8A7E74]">Change your mind? Cancel anytime for free.</span>
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
              >
                Cancel Request
              </button>
            </div>
          )}
        </div>



        {/* Alternative Caregiver Suggestions (Displayed when declined/timeout) */}
        {status === 'declined' && (
          <div className="bg-white rounded-3xl border border-[#E2D9CF] p-6 shadow-sm space-y-4 animate-fadeIn">
            <h3 className="font-bold text-base text-[#1C1A17]">Recommended Alternative Caregivers</h3>
            <p className="text-xs text-[#8A7E74]">Available verified caregivers in your neighborhood for the same time window:</p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {alternativeCaregivers.map(alt => (
                <div key={alt.id} className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#E2D9CF] shrink-0">
                      <img src={alt.photo} alt={alt.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1C1A17]">{alt.name}</h4>
                      <p className="text-xs text-[#8A7E74]">{alt.location} &middot; {alt.pricePerHour.toLocaleString()} XAF/hr</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('booking', { caregiver: alt })}
                    className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Re-Book with {alt.name.split(' ')[0]}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Free Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E2D9CF] p-6 w-full max-w-sm space-y-4 text-center">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-700">
              <AlertCircle size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#1C1A17]">Cancel Care Request?</h3>
              <p className="text-xs text-[#8A7E74] leading-relaxed">
                Since {caregiver.name.split(' ')[0]} has not accepted yet, zero fees will be charged and the hold will be released immediately.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 px-4 py-2.5 border-2 border-[#E2D9CF] rounded-xl text-xs font-semibold text-[#1C1A17] hover:bg-[#FAF8F5] transition-all cursor-pointer"
              >
                Keep Request
              </button>
              <button
                onClick={handleCancelRequest}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Yes, Cancel Free
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
