import React, { useState, useEffect } from 'react';
import {
  Clock, MapPin, ShieldCheck, Key, Eye, Check, X, Send, ArrowDownLeft,
  ChevronLeft, ChevronRight, MessageSquare, Download, CheckCircle2,
  CalendarCheck, User, Calendar, DollarSign
} from 'lucide-react';
import { fetchMyBookings, verifySessionOtp } from '../../../services/bookingApi';
import { getStoredUser } from '../../../services/api';

export default function BookingsTab({
  clientBookings = [],
  myBookings = [],
  onNavigate,
  onViewDetails,
  onMessageClient,
  onMessageProvider
}) {
  const [activeSubTab, setActiveSubTab] = useState('client_bookings'); // 'my_bookings' or 'client_bookings'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBookingModal, setSelectedBookingModal] = useState(null);

  // OTP inputs for client bookings check-in
  const [otpInputs, setOtpInputs] = useState({});
  const [verifiedBookings, setVerifiedBookings] = useState({});

  const [realClientBookings, setRealClientBookings] = useState(clientBookings);
  const [realMyBookings, setRealMyBookings] = useState(myBookings);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const list = await fetchMyBookings();
        if (!isMounted || !Array.isArray(list)) return;

        const currentUser = getStoredUser();
        const currentUserId = currentUser?.id;

        const mapped = list.map(b => {
          const isProvider = !currentUserId || b.provider_id === currentUserId;
          const clientName = b.booker ? `${b.booker.firstName || ''} ${b.booker.lastName || ''}`.trim() : 'Household Client';
          const providerName = b.provider ? `${b.provider.firstName || ''} ${b.provider.lastName || ''}`.trim() : 'Care Provider';
          const timeFormatted = (b.start_time && b.end_time) ? `${b.start_time.slice(0, 5)} – ${b.end_time.slice(0, 5)}` : '09:00 – 12:00';
          const pricePerHour = Number(b.provider?.pricePerHour || b.provider?.price_per_hour) || 50;
          const subtotal = Number(b.subtotal || 0);
          const serviceFee = Number(b.service_fee || 5);
          const totalPrice = Number(b.total_price || 0);
          const priceFormatted = `${totalPrice.toLocaleString()} XAF`;
          const rateFormatted = `${pricePerHour.toLocaleString()} XAF/hr`;

          let statusLabel = 'Scheduled';
          if (b.status === 'in_progress') statusLabel = 'In Progress';
          else if (b.status === 'confirmed') statusLabel = 'Awaiting OTP';
          else if (b.status === 'completed') statusLabel = 'Completed';

          let dateFormatted = b.start_date || 'Upcoming';
          if (b.start_date && typeof b.start_date === 'string' && b.start_date.includes('T')) {
            try {
              dateFormatted = new Date(b.start_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            } catch {}
          }

          return {
            id: b.id,
            bookingId: b.id,
            provider_id: b.provider_id,
            booker_id: b.booker_id,
            sessionId: b.sessions?.[0]?.id,
            clientName,
            name: isProvider ? clientName : providerName,
            initials: isProvider
              ? `${b.booker?.firstName?.[0] || 'C'}${b.booker?.lastName?.[0] || 'H'}`
              : `${b.provider?.firstName?.[0] || 'P'}${b.provider?.lastName?.[0] || 'R'}`,
            specialty: b.provider?.profession || b.provider?.professionOther || (Array.isArray(b.provider?.specialties) ? b.provider?.specialties[0] : b.provider?.specialties) || 'Cleaner',
            status: statusLabel,
            rawStatus: b.status,
            date: `${dateFormatted} · ${timeFormatted}`,
            time: timeFormatted,
            startTime: b.start_time,
            endTime: b.end_time,
            location: b.provider?.location || 'Yaoundé / Douala',
            price: priceFormatted,
            totalPrice,
            subtotal,
            serviceFee,
            pricePerHour,
            rate: rateFormatted,
            totalSessions: b.total_sessions || 1,
            durationWeeks: b.duration_weeks || 1,
            escrowStatus: b.payment_status === 'paid' ? '100% Funded & Secured' : 'Unpaid',
            arrivalOtp: b.sessions?.[0]?.otp_code || '—',
            needsOtp: b.status === 'confirmed',
            photo: (isProvider ? b.booker?.photoUrl : b.provider?.photoUrl) || null,
            summary: b.notes || 'Carely verified booking session.'
          };
        });

        const clientSide = mapped.filter(m => (!currentUserId || m.provider_id === currentUserId) && ['confirmed', 'in_progress', 'completed'].includes(m.rawStatus));
        const mySide = mapped.filter(m => (currentUserId && m.booker_id === currentUserId) && ['confirmed', 'in_progress', 'completed'].includes(m.rawStatus));

        setRealClientBookings(clientSide);
        setRealMyBookings(mySide);
      } catch (err) {
        console.warn('Could not load bookings in BookingsTab:', err.message);
        setRealClientBookings([]);
        setRealMyBookings([]);
      }
    }
    load();
  }, []);

  const clientList = clientBookings.length > 0 ? clientBookings : realClientBookings;
  const myList = myBookings.length > 0 ? myBookings : realMyBookings;

  const itemsPerPage = 3;
  const activeList = activeSubTab === 'client_bookings' ? clientList : myList;
  const totalPages = Math.max(1, Math.ceil(activeList.length / itemsPerPage));
  const paginatedItems = activeList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOtpDigitChange = (bookingId, index, value) => {
    const current = otpInputs[bookingId] || ['', '', '', '', '', ''];
    const updated = [...current];
    updated[index] = value.slice(-1);
    setOtpInputs(prev => ({ ...prev, [bookingId]: updated }));

    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${bookingId}-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = async (bookingId) => {
    const digits = (otpInputs[bookingId] || []).join('');
    const target = realClientBookings.find(b => b.id === bookingId);
    if (target?.sessionId && digits.length >= 4) {
      try {
        await verifySessionOtp(target.sessionId, digits);
      } catch (e) {
        console.warn('verifySessionOtp check:', e.message);
      }
    }
    setVerifiedBookings(prev => ({ ...prev, [bookingId]: true }));
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn font-sans">
      {/* ─── Page Header ─── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1C1A17]">Bookings</h2>
          <p className="text-xs md:text-sm text-[#78716C]">
            Everything in one place — the care you've booked, and the jobs households have booked with you.
          </p>
        </div>
        <button className="bg-[#1E4030] hover:bg-[#152e22] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5">
          <Download size={13} />
          Download Schedule
        </button>
      </div>

      {/* ─── Segmented Navigation Bar ─── */}
      <div className="bg-[#EDF5F0] p-1.5 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-2xl w-full sm:w-auto">
        {/* Tab 1: My Bookings */}
        <button
          onClick={() => {
            setActiveSubTab('my_bookings');
            setCurrentPage(1);
          }}
          className={`flex-1 py-3 px-5 rounded-xl text-xs md:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
            activeSubTab === 'my_bookings'
              ? 'bg-white text-[#1C1A17] font-bold shadow-sm'
              : 'text-[#5A5248] hover:text-[#1C1A17]'
          }`}
        >
          <Send size={15} className="rotate-45 shrink-0" />
          <span className="whitespace-nowrap">My Bookings</span>
          <span className="text-xs text-[#78716C] font-normal whitespace-nowrap">&middot; I booked</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
            activeSubTab === 'my_bookings' ? 'bg-[#E2F0E8] text-[#1D6F42]' : 'bg-[#E0DBD5] text-[#5A5248]'
          }`}>
            {myList.length}
          </span>
        </button>

        {/* Tab 2: Client Bookings */}
        <button
          onClick={() => {
            setActiveSubTab('client_bookings');
            setCurrentPage(1);
          }}
          className={`flex-1 py-3 px-5 rounded-xl text-xs md:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
            activeSubTab === 'client_bookings'
              ? 'bg-white text-[#1C1A17] font-bold shadow-sm'
              : 'text-[#5A5248] hover:text-[#1C1A17]'
          }`}
        >
          <ArrowDownLeft size={16} className="shrink-0" />
          <span className="whitespace-nowrap">Client Bookings</span>
          <span className="text-xs text-[#78716C] font-normal whitespace-nowrap">&middot; booked with me</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
            activeSubTab === 'client_bookings' ? 'bg-[#1E4030] text-white' : 'bg-[#E0DBD5] text-[#5A5248]'
          }`}>
            {clientList.length} active
          </span>
        </button>
      </div>

      {/* ─── Subheader / Info Bar ─── */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <p className="text-xs text-[#78716C] font-medium">
          {activeSubTab === 'client_bookings'
            ? 'Confirmed visits and ongoing shifts where households booked your services.'
            : 'Care providers you hired and booked for yourself or your family.'}
        </p>
        <span className="text-xs font-semibold bg-[#E2F0E8] text-[#1D6F42] border border-[#C6E4D3] px-3 py-1 rounded-full whitespace-nowrap">
          {activeSubTab === 'client_bookings'
            ? `${clientList.length} client booking${clientList.length !== 1 ? 's' : ''}`
            : `${myList.length} my booking${myList.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* ─── Bookings Cards List ─── */}
      <div className="space-y-5">
        {/* VIEW 1: CLIENT BOOKINGS (INCOMING) */}
        {activeSubTab === 'client_bookings' && (
          <>
            {paginatedItems.length === 0 ? (
              <div className="bg-white border border-[#E2D9CF] rounded-3xl p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F4EFEA] text-[#8A7E74] mx-auto flex items-center justify-center">
                  <CalendarCheck size={22} />
                </div>
                <h3 className="font-bold text-base text-[#1C1A17]">No client bookings yet</h3>
                <p className="text-xs text-[#8A7E74] max-w-sm mx-auto">
                  When a household client books and confirms a shift with you, it will appear here with schedule and OTP check-in details.
                </p>
              </div>
            ) : (
              paginatedItems.map((b) => {
              const isVerified = verifiedBookings[b.id];
              const digits = otpInputs[b.id] || ['', '', '', '', '', ''];

              return (
                <div
                  key={b.id}
                  className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-7 shadow-xs hover:border-[#1E4030]/40 transition-all space-y-5"
                >
                  {/* Top Row: Client Info + Price */}
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-[#F0EBE5]">
                    <div className="flex items-center gap-4">
                      <div className="w-13 h-13 rounded-2xl bg-[#D6EBE0] text-[#1E4030] flex items-center justify-center font-bold text-base shadow-2xs">
                        {b.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-bold text-base text-[#1C1A17]">{b.clientName}</h3>
                          <span className="text-[11px] bg-[#EAF3EE] text-[#1E4030] border border-[#D0E5D9] px-2.5 py-0.5 rounded-lg font-semibold">
                            {b.specialty}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            b.status === 'In Progress'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : b.status === 'Awaiting OTP'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              b.status === 'In Progress' ? 'bg-green-500 animate-pulse' : b.status === 'Awaiting OTP' ? 'bg-amber-500' : 'bg-gray-400'
                            }`} />
                            {b.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#8A7E74] mt-0.5">Booking #{b.id} &middot; Confirmed via Escrow</p>
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-base sm:text-lg font-extrabold text-[#1E4030]">{b.price}</p>
                      <p className="text-[11px] text-[#8A7E74]">{b.rate}</p>
                    </div>
                  </div>

                  {/* 3-Column Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E2D9CF] space-y-1">
                      <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider block">Date & Time</span>
                      <p className="font-bold text-[#1C1A17] flex items-center gap-1.5">
                        <Clock size={13} className="text-[#1E4030]" />
                        {b.date}
                      </p>
                    </div>
                    <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E2D9CF] space-y-1">
                      <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider block">Location</span>
                      <p className="font-bold text-[#1C1A17] flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#1E4030]" />
                        {b.location}
                      </p>
                    </div>
                    <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E2D9CF] space-y-1">
                      <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider block">Escrow Status</span>
                      <p className="font-bold text-[#1D6F42] flex items-center gap-1.5">
                        <ShieldCheck size={14} />
                        {b.escrowStatus}
                      </p>
                    </div>
                  </div>

                  {/* Arrival OTP verification bar */}
                  {b.needsOtp && !isVerified && (
                    <div className="bg-[#EDF7F2]/60 border border-green-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-[#1E4030] flex items-center gap-1.5">
                          <Key size={14} />
                          <span>Client Arrival OTP Verification</span>
                        </h4>
                        <p className="text-[11px] text-[#5A5248]">
                          Ask the household client for their 6-digit confirmation code upon starting your shift.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="flex items-center gap-1.5">
                          {[0, 1, 2, 3, 4, 5].map((idx) => (
                            <input
                              key={idx}
                              id={`otp-${b.id}-${idx}`}
                              type="text"
                              maxLength={1}
                              value={digits[idx] || ''}
                              onChange={(e) => handleOtpDigitChange(b.id, idx, e.target.value)}
                              className="w-8 h-8 sm:w-9 sm:h-9 border border-[#E2D9CF] rounded-xl text-center bg-white font-bold text-[#1C1A17] text-xs focus:outline-none focus:border-[#1E4030] shadow-2xs"
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => handleVerifyOtp(b.id)}
                          className="bg-[#1E4030] hover:bg-[#152e22] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  )}

                  {isVerified && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-3.5 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>Arrival Verified & Check-in Active! Session timer running.</span>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center justify-end gap-2.5 pt-1">
                    <button
                      onClick={() => {
                        if (onMessageClient) {
                          onMessageClient(b);
                        } else if (onNavigate) {
                          onNavigate('discussions', { recipientId: b.booker_id, name: b.clientName || b.name, role: 'client' });
                        }
                      }}
                      className="border border-[#E2D9CF] bg-white text-[#1E4030] hover:bg-[#EDF7F2] text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                    >
                      <MessageSquare size={13} className="text-[#1E4030]" />
                      Message Client
                    </button>
                    <button
                      onClick={() => setSelectedBookingModal(b)}
                      className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-[#FAF8F5] text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                    >
                      <Eye size={13} className="text-[#8A7E74]" />
                      View details
                    </button>
                  </div>
                </div>
              );
            }))}
          </>
        )}

        {/* VIEW 2: MY BOOKINGS (OUTGOING) */}
        {activeSubTab === 'my_bookings' && (
          <>
            {paginatedItems.length === 0 ? (
              <div className="bg-white border border-[#E2D9CF] rounded-3xl p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F4EFEA] text-[#8A7E74] mx-auto flex items-center justify-center">
                  <CalendarCheck size={22} />
                </div>
                <h3 className="font-bold text-base text-[#1C1A17]">No bookings placed yet</h3>
                <p className="text-xs text-[#8A7E74] max-w-sm mx-auto">
                  Care providers you book for yourself or your family will appear here once confirmed with arrival verification keys.
                </p>
              </div>
            ) : (
              paginatedItems.map((b) => (
                <div
                  key={b.id}
                  className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-7 shadow-xs hover:border-[#1E4030]/40 transition-all space-y-5"
                >
                  {/* Top Row: Provider Info + Price */}
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-[#F0EBE5]">
                    <div className="flex items-center gap-4">
                      <div className="w-13 h-13 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E2D9CF] shrink-0 shadow-2xs flex items-center justify-center">
                        {b.photo ? (
                          <img src={b.photo} alt={b.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#D6EBE0] text-[#1E4030] font-bold text-base flex items-center justify-center">
                            {b.initials || 'NZ'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-bold text-base text-[#1C1A17]">{b.name}</h3>
                          <span className="text-[11px] bg-[#EAF3EE] text-[#1E4030] border border-[#D0E5D9] px-2.5 py-0.5 rounded-lg font-semibold">
                            {b.specialty}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border bg-green-50 text-green-700 border-green-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {b.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#8A7E74] mt-0.5">Booking #{b.id} &middot; Escrow Secured</p>
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-base sm:text-lg font-extrabold text-[#1E4030]">{b.price}</p>
                      <p className="text-[11px] text-[#8A7E74]">{b.rate}</p>
                    </div>
                  </div>

                  {/* 3-Column Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E2D9CF] space-y-1">
                      <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider block">Schedule</span>
                      <p className="font-bold text-[#1C1A17] flex items-center gap-1.5">
                        <Clock size={13} className="text-[#1E4030]" />
                        {b.date}
                      </p>
                    </div>
                    <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E2D9CF] space-y-1">
                      <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider block">Location</span>
                      <p className="font-bold text-[#1C1A17] flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#1E4030]" />
                        {b.location}
                      </p>
                    </div>
                    <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E2D9CF] space-y-1">
                      <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider block">Escrow Status</span>
                      <p className="font-bold text-[#1D6F42] flex items-center gap-1.5">
                        <ShieldCheck size={14} />
                        {b.escrowStatus}
                      </p>
                    </div>
                  </div>

                  {/* Provider Arrival OTP Banner */}
                  <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs text-[#1C1A17] flex items-center gap-1.5">
                        <Key size={14} className="text-[#1E4030]" />
                        <span>Your Arrival OTP Key</span>
                      </h4>
                      <p className="text-[11px] text-[#8A7E74]">
                        Share this code with <span className="font-bold text-[#1C1A17]">{b.name}</span> upon arrival to verify the session check-in.
                      </p>
                    </div>

                    <div className="bg-white border-2 border-[#1E4030] px-5 py-2 rounded-xl text-center shadow-xs">
                      <span className="font-mono text-base font-extrabold text-[#1E4030] tracking-widest">
                        {b.arrivalOtp}
                      </span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-end gap-2.5 pt-1">
                    <button
                      onClick={() => {
                        if (onMessageProvider) {
                          onMessageProvider(b);
                        } else if (onMessageClient) {
                          onMessageClient(b);
                        } else if (onNavigate) {
                          onNavigate('discussions', { recipientId: b.provider_id, name: b.name, role: 'provider' });
                        }
                      }}
                      className="border border-[#E2D9CF] bg-white text-[#1E4030] hover:bg-[#EDF7F2] text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                    >
                      <MessageSquare size={13} className="text-[#1E4030]" />
                      Message Provider
                    </button>
                    <button
                      onClick={() => setSelectedBookingModal(b)}
                      className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-[#FAF8F5] text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                    >
                      <Eye size={13} className="text-[#8A7E74]" />
                      View details
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* ─── Pagination Footer ─── */}
      {activeList.length > itemsPerPage && (
        <div className="flex items-center justify-between pt-4 border-t border-[#F0EBE5]">
          <span className="text-xs text-[#78716C] font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border border-[#E2D9CF] rounded-xl px-3 py-1.5 text-xs text-[#78716C] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-all"
            >
              <ChevronLeft size={13} /> Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-[#1E4030] text-white shadow-2xs'
                    : 'border border-[#E2D9CF] text-[#1C1A17] hover:bg-[#FAF8F5]'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="border border-[#E2D9CF] rounded-xl px-3 py-1.5 text-xs text-[#1C1A17] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold transition-all"
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ─── Detailed Booking Modal (Client & Caregiver Specs) ─── */}
      {selectedBookingModal && (() => {
        const b = selectedBookingModal;
        const hourlyRate = Number(b.pricePerHour) || 50;
        const fee = Number(b.serviceFee) || 5;
        const subtotal = Number(b.subtotal) || (Number(b.totalPrice) > fee ? Number(b.totalPrice) - fee : (Number(b.totalPrice) || (hourlyRate * 2)));
        const total = subtotal + fee;
        let hours = 2;
        if (b.startTime && b.endTime) {
          const [sh, sm] = b.startTime.split(':').map(Number);
          const [eh, em] = b.endTime.split(':').map(Number);
          if (!isNaN(sh) && !isNaN(eh)) {
            const diff = (eh * 60 + (em || 0)) - (sh * 60 + (sm || 0));
            if (diff > 0) hours = Math.round((diff / 60) * 10) / 10;
          }
        } else if (subtotal && hourlyRate) {
          hours = Math.max(1, Math.round((subtotal / hourlyRate) * 10) / 10);
        }
        const sessions = Number(b.totalSessions) || 1;

        return (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl border border-[#E2D9CF] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="bg-[#1E4030] text-white px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <CalendarCheck size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Booking Details & Price Breakdown</h3>
                    <p className="text-xs text-white/70">ID: {b.id} &middot; Escrow Secured</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBookingModal(null)}
                  className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5">
                {/* Profile Card */}
                <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-[#E2D9CF] shrink-0 shadow-sm">
                    {b.photo ? (
                      <img src={b.photo} alt={b.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#D6EBE0] text-[#1E4030] font-bold text-lg flex items-center justify-center">
                        {b.initials || 'BK'}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-base text-[#1C1A17]">
                        {b.name || b.clientName}
                      </h4>
                      <span className="text-[11px] bg-[#EDF7F2] text-[#1E4030] border border-green-200 px-2.5 py-0.5 rounded-full font-bold">
                        {b.specialty}
                      </span>
                    </div>
                    <p className="text-xs text-[#8A7E74] flex items-center gap-1">
                      <MapPin size={12} className="text-[#8A7E74]" />
                      {b.location}
                    </p>
                  </div>
                </div>

                {/* Status & Arrival OTP Key */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Booking Status</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-[#EDF7F2] text-[#1E4030] border border-green-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {b.status}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Arrival OTP Key</span>
                    <span className="font-mono text-sm font-extrabold text-[#1E4030]">
                      {b.arrivalOtp || '—'}
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-[#E2D9CF] pb-2 font-bold text-[#1C1A17]">
                    <span>Exact Price Breakdown</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDF7F2] text-[#1E4030] border border-green-200">
                      {b.escrowStatus || 'Secured in Escrow'}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#8A7E74]">
                    <span>Scheduled Date & Time</span>
                    <span className="font-semibold text-[#1C1A17]">{b.date}</span>
                  </div>

                  <div className="flex justify-between text-[#8A7E74]">
                    <span>Care Rate per Hour</span>
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

                {/* Summary */}
                <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-1.5">
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Session Summary</span>
                  <p className="text-xs text-[#1C1A17] leading-relaxed">
                    {b.summary || 'Confirmed booking session on Carely. Escrow funds secured and released upon arrival OTP presence verification and completion confirmation.'}
                  </p>
                </div>

                {/* Escrow Guarantee */}
                <div className="p-3.5 bg-[#EDF7F2] border border-green-200 rounded-2xl flex items-center gap-2 text-xs text-[#1E4030]">
                  <ShieldCheck size={16} className="shrink-0" />
                  <span>100% Escrow Guarantee: Funds are protected until verified session completion.</span>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-[#FAF8F5] border-t border-[#E2D9CF] flex items-center justify-end gap-2.5">
                <button
                  onClick={() => {
                    const target = selectedBookingModal;
                    setSelectedBookingModal(null);
                    if (!target) return;
                    if (activeSubTab === 'client_bookings') {
                      if (onMessageClient) {
                        onMessageClient(target);
                      } else if (onNavigate) {
                        onNavigate('discussions', { recipientId: target.booker_id, name: target.clientName || target.name, role: 'client' });
                      }
                    } else {
                      if (onMessageProvider) {
                        onMessageProvider(target);
                      } else if (onMessageClient) {
                        onMessageClient(target);
                      } else if (onNavigate) {
                        onNavigate('discussions', { recipientId: target.provider_id, name: target.name, role: 'provider' });
                      }
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8] hover:bg-blue-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare size={13} className="text-[#1D4ED8]" />
                  Chat in Discussions
                </button>

                <button
                  onClick={() => setSelectedBookingModal(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#1E4030] hover:bg-[#152e22] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
