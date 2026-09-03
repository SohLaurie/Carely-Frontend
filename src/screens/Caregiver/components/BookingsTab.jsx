import React, { useState } from 'react';
import {
  Clock, MapPin, ShieldCheck, Key, Eye, Check, X, Send, ArrowDownLeft,
  ChevronLeft, ChevronRight, MessageSquare, Download, CheckCircle2,
  CalendarCheck, User, Calendar
} from 'lucide-react';

export default function BookingsTab({
  clientBookings = [],
  myBookings = [],
  onNavigate,
  onViewDetails
}) {
  const [activeSubTab, setActiveSubTab] = useState('client_bookings'); // 'my_bookings' or 'client_bookings'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBookingModal, setSelectedBookingModal] = useState(null);

  // OTP inputs for client bookings check-in
  const [otpInputs, setOtpInputs] = useState({});
  const [verifiedBookings, setVerifiedBookings] = useState({});

  // Default incoming bookings from clients to this caregiver
  const defaultClientBookings = clientBookings.length > 0 ? clientBookings : [
    {
      id: 'BK-9021',
      clientName: 'Aïcha K.',
      initials: 'AK',
      specialty: 'Home Nursing',
      status: 'In Progress',
      date: 'Today · 09:00 – 13:00',
      location: 'Akwa, Douala',
      price: '14,000 XAF',
      rate: '4 hrs (3,500 XAF/hr)',
      escrowStatus: '100% Funded & Secured',
      needsOtp: true,
      summary: 'Home clinical nursing assistance for recovery comfort and medication administration.'
    },
    {
      id: 'BK-9022',
      clientName: 'Paul M.',
      initials: 'PM',
      specialty: 'Post-op Care',
      status: 'Awaiting OTP',
      date: 'Today · 15:00 – 17:00',
      location: 'Bastos, Yaounde',
      price: '8,000 XAF',
      rate: '2 hrs (4,000 XAF/hr)',
      escrowStatus: '100% Funded & Secured',
      needsOtp: true,
      summary: 'Post-operative mobility support, wound dressing, and vitals recording.'
    },
    {
      id: 'BK-9023',
      clientName: 'The Nkomo Family',
      initials: 'NF',
      specialty: 'Elderly Care',
      status: 'Scheduled',
      date: 'Thu · 08:00 – 12:00',
      location: 'Bonapriso, Douala',
      price: '12,000 XAF',
      rate: '4 hrs (3,000 XAF/hr)',
      escrowStatus: '100% Funded & Secured',
      needsOtp: false,
      summary: 'Companionship, meal assistance, and physical therapy support for senior family member.'
    },
    {
      id: 'BK-9024',
      clientName: 'Elise F.',
      initials: 'EF',
      specialty: 'Childcare & Babysitting',
      status: 'Scheduled',
      date: 'Fri · 10:00 – 14:00',
      location: 'Omnisports, Yaounde',
      price: '10,000 XAF',
      rate: '4 hrs (2,500 XAF/hr)',
      escrowStatus: '100% Funded & Secured',
      needsOtp: false,
      summary: 'Active learning childcare, storytelling, and nutritious lunch supervision.'
    }
  ];

  // Default outgoing bookings to other caregivers
  const defaultMyBookings = myBookings.length > 0 ? myBookings : [
    {
      id: 'BK-4829',
      name: 'Marie-Claire Nkomo',
      specialty: 'Home Nursing',
      status: 'Confirmed',
      date: 'Mon Aug 4 · 09:00 – 12:00',
      location: 'Bastos, Yaoundé',
      price: '10,500 XAF',
      rate: '3,500 XAF / hr',
      arrivalOtp: '4829',
      photo: 'https://images.unsplash.com/photo-1627328543975-3f0ba8a823b0?w=400&h=400&fit=crop&auto=format',
      escrowStatus: '100% Funded & Secured',
      summary: 'Elderly patient recovery assistance following knee surgery. Morning medication administration and light physical support.'
    },
    {
      id: 'BK-5192',
      name: 'Fatima Bello',
      specialty: 'Babysitting & Childcare',
      status: 'In Progress',
      date: 'Tue Aug 5 · 13:00 – 17:00',
      location: 'Akwa, Douala',
      price: '12,000 XAF',
      rate: '3,000 XAF / hr',
      arrivalOtp: '7319',
      photo: 'https://images.unsplash.com/photo-1579255565889-2ac16e9b2950?w=400&h=400&fit=crop&auto=format',
      escrowStatus: '100% Funded & Secured',
      summary: 'Afternoon child supervision and creative play for 2 young children.'
    },
    {
      id: 'BK-6831',
      name: 'Nadine Mengue',
      specialty: 'Post-op Care',
      status: 'Scheduled',
      date: 'Fri Aug 8 · 10:00 – 14:00',
      location: 'Bonapriso, Douala',
      price: '20,000 XAF',
      rate: '5,000 XAF / hr',
      arrivalOtp: '9204',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&auto=format',
      escrowStatus: '100% Funded & Secured',
      summary: 'Post-surgical nursing routine, vitals monitoring, and comfort care.'
    }
  ];

  const itemsPerPage = 3;
  const activeList = activeSubTab === 'client_bookings' ? defaultClientBookings : defaultMyBookings;
  const totalPages = Math.ceil(activeList.length / itemsPerPage) || 1;
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

  const handleVerifyOtp = (bookingId) => {
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
            {defaultMyBookings.length}
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
            {defaultClientBookings.length} active
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
            ? `${defaultClientBookings.length} client bookings`
            : `${defaultMyBookings.length} my bookings`}
        </span>
      </div>

      {/* ─── Bookings Cards List ─── */}
      <div className="space-y-5">
        {/* VIEW 1: CLIENT BOOKINGS (INCOMING) */}
        {activeSubTab === 'client_bookings' && (
          <>
            {paginatedItems.map((b) => {
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
                        if (onNavigate) onNavigate('discussions');
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
            })}
          </>
        )}

        {/* VIEW 2: MY BOOKINGS (OUTGOING) */}
        {activeSubTab === 'my_bookings' && (
          <>
            {paginatedItems.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-7 shadow-xs hover:border-[#1E4030]/40 transition-all space-y-5"
              >
                {/* Top Row: Provider Info + Price */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-[#F0EBE5]">
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E2D9CF] shrink-0 shadow-2xs">
                      <img src={b.photo} alt={b.name} className="w-full h-full object-cover" />
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
                      if (onNavigate) onNavigate('discussions');
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
            ))}
          </>
        )}
      </div>

      {/* ─── Pagination Footer ─── */}
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

      {/* ─── Detailed Booking Modal (Client & Caregiver Specs) ─── */}
      {selectedBookingModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E2D9CF] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#1E4030] text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <CalendarCheck size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Booking Details & Escrow</h3>
                  <p className="text-xs text-white/70">ID: {selectedBookingModal.id} &middot; Escrow Secured</p>
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
                  {selectedBookingModal.photo ? (
                    <img src={selectedBookingModal.photo} alt={selectedBookingModal.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#D6EBE0] text-[#1E4030] font-bold text-lg flex items-center justify-center">
                      {selectedBookingModal.initials || 'BK'}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-base text-[#1C1A17]">
                      {selectedBookingModal.name || selectedBookingModal.clientName}
                    </h4>
                    <span className="text-[11px] bg-[#EDF7F2] text-[#1E4030] border border-green-200 px-2.5 py-0.5 rounded-full font-bold">
                      {selectedBookingModal.specialty}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A7E74] flex items-center gap-1">
                    <MapPin size={12} className="text-[#8A7E74]" />
                    {selectedBookingModal.location}
                  </p>
                </div>
              </div>

              {/* 2x2 Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Booking Status</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-[#EDF7F2] text-[#1E4030] border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {selectedBookingModal.status}
                  </span>
                </div>

                <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Schedule</span>
                  <span className="text-xs font-bold text-[#1C1A17] flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#1E4030]" />
                    {selectedBookingModal.date}
                  </span>
                </div>

                <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Total Escrow Amount</span>
                  <span className="text-xs font-extrabold text-[#1E4030]">
                    {selectedBookingModal.price}
                  </span>
                </div>

                <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Arrival OTP Key</span>
                  <span className="font-mono text-xs font-extrabold text-[#1E4030]">
                    {selectedBookingModal.arrivalOtp || '4829'}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-1.5">
                <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Session Summary</span>
                <p className="text-xs text-[#1C1A17] leading-relaxed">
                  {selectedBookingModal.summary || 'Confirmed booking session on Carely. Escrow funds secured and released upon arrival OTP presence verification and completion window.'}
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
                  setSelectedBookingModal(null);
                  if (onNavigate) onNavigate('discussions');
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
      )}
    </div>
  );
}
