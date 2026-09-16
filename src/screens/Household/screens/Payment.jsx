import React, { useState } from 'react';
import {
  ArrowLeft, ShieldCheck, Lock, Smartphone, CheckCircle2,
  AlertCircle, ChevronRight, Check, RefreshCw, X, RotateCcw
} from 'lucide-react';
import { CAREGIVERS, SPECIALTY_META } from '../../../data';
import { initiateEscrowPayment, verifyPayment, fetchBooking, cancelBooking } from '../../../services/bookingApi';

export default function Payment({ onNavigate, screenParams, loadBookings }) {
  const booking = screenParams?.booking || {
    caregiver: CAREGIVERS[0],
    sessionType: 'once',
    date: 'Mon Aug 4',
    time: '09:00 – 12:00',
    totalPrice: 11000,
    durationWeeks: 1,
    status: 'Accepted'
  };

  const caregiver = booking.caregiver || CAREGIVERS[0];
  const meta = SPECIALTY_META[caregiver.specialty] || { label: 'Provider' };

  const [provider, setProvider] = useState('mtn'); // 'mtn' | 'orange'
  const [phoneNumber, setPhoneNumber] = useState('+237 6 99 12 34 56');
  const [loading, setLoading] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [refundStatus, setRefundStatus] = useState(null);

  const amountToCharge = booking.totalPrice || 11000;

  const handleStartPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowPinModal(true);

    const bookingId = booking.id;
    const isRealBooking = bookingId && typeof bookingId === 'string' && bookingId.includes('-');

    if (isRealBooking) {
      try {
        const cleanPhone = phoneNumber.replace(/\s+/g, '');
        const initRes = await initiateEscrowPayment(bookingId, provider, cleanPhone);

        // If sandbox test payment was immediately confirmed by backend:
        if (initRes?.confirmed) {
          setLoading(false);
          setShowPinModal(false);
          setPaymentSuccess(true);
          if (typeof loadBookings === 'function') loadBookings();

          const updatedBooking = await fetchBooking(bookingId);
          const realOtp = updatedBooking?.sessions?.[0]?.otp_code || '4829';

          setTimeout(() => {
            onNavigate('confirmed', {
              booking: {
                ...booking,
                ...updatedBooking,
                id: bookingId,
                paymentStatus: 'Escrow Secured',
                arrivalOtp: realOtp,
                status: 'Confirmed',
                sessions: updatedBooking?.sessions || [],
              }
            });
          }, 1200);
          return;
        }

        // REAL PAYMENT: Wait for user to approve USSD prompt on their phone!
        // Poll payment status until confirmed on phone or max timeout
        let attempts = 0;
        const maxAttempts = 30; // 30 * 3s = 90s
        const pollTimer = setInterval(async () => {
          attempts++;
          try {
            if (initRes?.campayRef) {
              await verifyPayment(initRes.campayRef).catch(() => {});
            }

            const updatedBooking = await fetchBooking(bookingId);
            if (updatedBooking?.payment_status === 'paid' || updatedBooking?.status === 'confirmed') {
              clearInterval(pollTimer);
              setLoading(false);
              setShowPinModal(false);
              setPaymentSuccess(true);
              if (typeof loadBookings === 'function') loadBookings();

              const realOtp = updatedBooking?.sessions?.[0]?.otp_code || '4829';

              setTimeout(() => {
                onNavigate('confirmed', {
                  booking: {
                    ...booking,
                    ...updatedBooking,
                    id: bookingId,
                    paymentStatus: 'Escrow Secured',
                    arrivalOtp: realOtp,
                    status: 'Confirmed',
                    sessions: updatedBooking?.sessions || [],
                  }
                });
              }, 1200);
            } else if (attempts >= maxAttempts) {
              clearInterval(pollTimer);
              setLoading(false);
              setShowPinModal(false);
              alert('Payment authorization timed out. If you already authorized the prompt on your phone, your booking will be confirmed shortly.');
            }
          } catch (pollErr) {
            console.warn('Payment poll status check:', pollErr.message);
          }
        }, 3000);
      } catch (err) {
        setLoading(false);
        setShowPinModal(false);
        alert(err.message || 'Unable to initiate payment. Please verify your phone number and try again.');
      }
    }
  };

  const handlePreSessionCancel = async () => {
    const bookingId = booking.id;
    if (bookingId && typeof bookingId === 'string' && bookingId.includes('-')) {
      try {
        await cancelBooking(bookingId);
      } catch (err) {
        console.warn('Cancel payment booking warning:', err.message);
      }
    }
    setCancelModalOpen(false);
    setRefundStatus('refunded');
    setTimeout(() => {
      onNavigate('search');
    }, 2000);
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
          <Lock size={12} />
          Step 3: Escrow Payment Authorization
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1E4030]">Authorize Mobile Money Escrow</h1>
        <p className="text-xs sm:text-sm text-[#8A7E74]">
          Funds are held securely in Carely Escrow. The slot permanently locks on {caregiver.name?.split(' ')[0] || 'your provider'}'s calendar.
        </p>
      </div>

      {/* Success Alert */}
      {paymentSuccess && (
        <div className="bg-[#EDF7F2] border-2 border-green-300 rounded-3xl p-6 shadow-md text-center space-y-2 animate-fadeIn">
          <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Check size={28} strokeWidth={3} />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#1E4030]">Escrow Payment Secured!</h2>
          <p className="text-xs text-[#1E4030]/80">
            {amountToCharge.toLocaleString()} XAF has moved into Carely Escrow. Permanent calendar slot locked.
          </p>
        </div>
      )}

      {/* Refund Status Notification */}
      {refundStatus === 'refunded' && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 text-center space-y-2 animate-fadeIn">
          <div className="w-14 h-14 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto">
            <RotateCcw size={24} />
          </div>
          <h2 className="font-display text-xl font-bold text-amber-900">Pre-Session Cancellation Refunded</h2>
          <p className="text-xs text-amber-800">
            Full amount of {amountToCharge.toLocaleString()} XAF returned from escrow to your mobile wallet. Calendar slot released.
          </p>
        </div>
      )}

      {/* Main Grid: Payment Options & Booking Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 items-start w-full">
        
        {/* Payment Method Form */}
        <form onSubmit={handleStartPayment} className="bg-white rounded-3xl border border-[#E2D9CF] p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-bold text-base text-[#1C1A17]">Select Mobile Wallet</h3>

            {/* Provider Selector */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setProvider('mtn')}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  provider === 'mtn'
                    ? 'border-amber-400 bg-amber-50/50 shadow-2xs'
                    : 'border-[#E2D9CF] bg-[#FAF8F5]'
                }`}
              >
                <div className="w-10 h-10 bg-amber-400 text-black font-extrabold text-sm rounded-xl flex items-center justify-center mb-2">
                  MTN
                </div>
                <h4 className="font-bold text-xs text-[#1C1A17]">MTN Mobile Money</h4>
                <p className="text-[10px] text-[#8A7E74]">Instant prompt &middot; *126#</p>
              </button>

              <button
                type="button"
                onClick={() => setProvider('orange')}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  provider === 'orange'
                    ? 'border-orange-500 bg-orange-50/50 shadow-2xs'
                    : 'border-[#E2D9CF] bg-[#FAF8F5]'
                }`}
              >
                <div className="w-10 h-10 bg-orange-500 text-white font-extrabold text-sm rounded-xl flex items-center justify-center mb-2">
                  OM
                </div>
                <h4 className="font-bold text-xs text-[#1C1A17]">Orange Money</h4>
                <p className="text-[10px] text-[#8A7E74]">Instant prompt &middot; #150#</p>
              </button>
            </div>

            {/* Phone Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Mobile Money Phone Number</label>
              <div className="relative">
                <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs sm:text-sm text-[#1C1A17] focus:outline-none focus:border-[#1E4030]"
                />
              </div>
            </div>

            {/* Recurring Billing Explanation (If recurring) */}
            {booking.sessionType === 'recurring' && (
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-2 text-xs">
                <span className="font-bold text-[#1E4030] block">Recurring Weekly Billing Cycle:</span>
                <p className="text-[#8A7E74] leading-relaxed text-[11px]">
                  Week 1 amount ({amountToCharge.toLocaleString()} XAF) is charged now into escrow. Weeks 2–{booking.durationWeeks || 3} will send an automated weekly payment prompt before their respective week starts.
                </p>
              </div>
            )}

            {/* Pay into Escrow Button */}
            <button
              type="submit"
              className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-4 px-6 rounded-2xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock size={15} />
              <span>Approve {amountToCharge.toLocaleString()} XAF to Escrow</span>
            </button>

            {/* Pre-Session Cancellation Notice */}
            <div className="pt-3 border-t border-[#E2D9CF] flex justify-between items-center text-xs">
              <span className="text-[#8A7E74]">Need to cancel before session date?</span>
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="font-bold text-red-600 hover:underline cursor-pointer"
              >
                Pre-Session Cancellation
              </button>
            </div>
          </form>

          {/* Right Summary Card */}
          <div className="bg-white rounded-3xl border border-[#E2D9CF] p-6 shadow-sm space-y-5">
            <h3 className="font-display text-lg font-bold text-[#1C1A17]">Booking Locked</h3>

            <div className="flex items-center gap-3 pb-3 border-b border-[#F0EBE4]">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E2D9CF] shrink-0">
                <img src={caregiver.photo} alt={caregiver.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C1A17]">{caregiver.name}</h4>
                <p className="text-xs text-[#8A7E74]">{booking.date} &middot; {booking.time}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#8A7E74]">
                <span>Type</span>
                <span className="font-semibold text-[#1C1A17]">{booking.sessionType === 'once' ? 'Single Session' : 'Recurring Schedule'}</span>
              </div>
              <div className="flex justify-between text-[#8A7E74]">
                <span>Escrow Held Amount</span>
                <span className="font-bold text-[#1E4030]">{amountToCharge.toLocaleString()} XAF</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#EDF7F2] border border-green-200 rounded-2xl space-y-1.5 text-[11px] text-[#1E4030]">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck size={14} />
                <span>How Escrow Payout Works</span>
              </div>
              <p className="leading-relaxed text-[#1E4030]/80">
                Funds are held in escrow and ONLY released to the provider after the on-site arrival OTP is verified and the 24h completion window confirms.
              </p>
            </div>
          </div>
        </div>

      {/* Campay USSD Processing Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#1E4030] p-6 sm:p-8 w-full max-w-sm text-center space-y-6">
            
            {/* Spinning Loader */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-[#1E4030]/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#1E4030] border-t-transparent rounded-full animate-spin"></div>
              <Smartphone size={32} className="text-[#1E4030] animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg text-[#1C1A17]">Processing Payment...</h3>
              <p className="text-xs text-[#8A7E74] leading-relaxed">
                Campay USSD request sent to your phone.
              </p>
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 text-xs text-[#5A5248] leading-relaxed text-left space-y-2 mt-2">
                <p>
                  1. Check your phone for the <strong>{provider === 'mtn' ? 'MTN MoMo' : 'Orange Money'}</strong> authorization prompt.
                </p>
                <p>
                  2. Enter your MoMo PIN on your phone to authorize <strong>{amountToCharge.toLocaleString()} XAF</strong>.
                </p>
                <p className="text-[10px] text-[#8A7E74] italic">
                  Do not close this page. The system will automatically detect approval once authorized.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowPinModal(false);
                setLoading(false);
              }}
              className="w-full py-3 border border-[#E2D9CF] rounded-xl text-xs font-semibold text-[#8A7E74] hover:bg-[#FAF8F5] transition-all cursor-pointer"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      )}

      {/* Pre-Session Cancellation & Full Refund Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E2D9CF] p-6 w-full max-w-sm space-y-4 text-center">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-700">
              <RotateCcw size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#1C1A17]">Cancel & Refund from Escrow?</h3>
              <p className="text-xs text-[#8A7E74] leading-relaxed">
                Since the session date has not arrived yet, cancelling will release the provider slot and immediately refund <strong className="text-[#1E4030]">{amountToCharge.toLocaleString()} XAF</strong> back to your mobile money wallet.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 px-4 py-2.5 border-2 border-[#E2D9CF] rounded-xl text-xs font-semibold text-[#1C1A17] hover:bg-[#FAF8F5] transition-all cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={handlePreSessionCancel}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Refund & Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
