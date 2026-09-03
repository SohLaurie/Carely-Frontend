import React, { useState } from 'react';
import {
  MapPin, Clock, Eye, Check, X, Send, ArrowDownLeft,
  ArrowUpRight, Hourglass, DollarSign, Calendar, ShieldCheck,
  ChevronLeft, ChevronRight, AlertCircle, MoreHorizontal, MessageSquare, Trash2,
  ClipboardList
} from 'lucide-react';

export default function RequestsTab({
  incomingRequests = [],
  outgoingRequests = [],
  onAccept,
  onDecline,
  onViewDetails,
  onMakePayment,
  onNavigate
}) {
  const [activeSubTab, setActiveSubTab] = useState('job_requests'); // 'my_requests' or 'job_requests'
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [selectedDetailsItem, setSelectedDetailsItem] = useState(null);

  // Fallback / default data matching the screenshot mocks
  const defaultJobRequests = incomingRequests.length > 0 ? incomingRequests : [
    {
      id: 'REQ101',
      clientName: 'The Kamga Family',
      specialty: 'Home Nursing',
      timeLeft: 'Respond within 18h',
      date: 'Wed, Nov 6',
      time: '09:00 — 13:00',
      location: 'Bastos, Yaoundé',
      sessionType: 'One-off session',
      price: '14,000 XAF',
      pricePerHour: 3500,
      initials: 'KF',
      status: 'Pending',
      summary: 'Home clinical nursing care for elderly parent. Post-op mobility support and vitals monitoring.'
    },
    {
      id: 'REQ102',
      clientName: 'M. Fouda',
      specialty: 'Post-op Care',
      timeLeft: 'Respond within 6h',
      date: 'Starts Nov 8 · Recurring',
      time: 'Recurring · Mon / Wed / Fri · 3 weeks',
      location: 'Bonapriso, Douala',
      sessionType: 'Recurring · Mon / Wed / Fri · 3 weeks',
      price: '168,000 XAF total',
      pricePerHour: 4000,
      initials: 'F',
      status: 'Pending',
      summary: 'Post-surgical wound dressing, rehabilitation assistance, and routine physical therapy exercises.'
    },
    {
      id: 'REQ103',
      clientName: 'Mme Onana',
      specialty: 'Elderly Care',
      timeLeft: 'Respond within 1d 4h',
      date: 'Sat, Nov 9',
      time: '08:00 — 17:00',
      location: 'Nlongkak, Yaoundé',
      sessionType: 'One-off session',
      price: '22,500 XAF',
      pricePerHour: 2500,
      initials: 'O',
      status: 'Pending',
      summary: 'Compassionate companionship, meal preparation, and medication administration support.'
    },
    {
      id: 'REQ104',
      clientName: 'Dr. Jean Etoa',
      specialty: 'Home Nursing',
      timeLeft: 'Respond within 2d',
      date: 'Mon, Nov 11',
      time: '10:00 — 14:00',
      location: 'Golf, Yaoundé',
      sessionType: 'One-off session',
      price: '16,000 XAF',
      pricePerHour: 4000,
      initials: 'JE',
      status: 'Pending',
      summary: 'In-home clinical assistance, diabetic checkups, and physical mobility comfort.'
    },
    {
      id: 'REQ105',
      clientName: 'Sandrine Mbida',
      specialty: 'Childcare',
      timeLeft: 'Respond within 12h',
      date: 'Sun, Nov 10',
      time: '14:00 — 18:00',
      location: 'Bonamoussadi, Douala',
      sessionType: 'One-off session',
      price: '15,000 XAF',
      pricePerHour: 3000,
      initials: 'SM',
      status: 'Pending',
      summary: 'Child supervision, educational tutoring activities, and healthy snacks preparation.'
    }
  ];

  const initialOutgoing = outgoingRequests.length > 0 ? outgoingRequests : [
    {
      id: 'R1',
      name: 'Marie-Claire Nkomo',
      specialty: 'Home Nursing',
      sentTime: 'Sent 2h ago',
      location: 'Bastos, Yaounde',
      schedule: 'Mon Aug 4 (09:00 – 12:00)',
      price: '10,500 XAF',
      pricePerHour: 3500,
      initials: 'MN',
      photo: 'https://images.unsplash.com/photo-1627328543975-3f0ba8a823b0?w=400&h=400&fit=crop&auto=format',
      status: 'Accepted',
      summary: 'Elderly patient recovery assistance following knee surgery. Morning medication administration and light physical support.'
    },
    {
      id: 'R2',
      name: 'Fatima Bello',
      specialty: 'Babysitting & Childcare',
      sentTime: 'Sent Yesterday',
      location: 'Akwa, Douala',
      schedule: 'Tue Aug 5 (13:00 – 17:00)',
      price: '12,000 XAF',
      pricePerHour: 3000,
      initials: 'FB',
      photo: 'https://images.unsplash.com/photo-1579255565889-2ac16e9b2950?w=400&h=400&fit=crop&auto=format',
      status: 'Pending',
      summary: 'Afternoon babysitting for 2 young children including active play and homework guidance.'
    },
    {
      id: 'R3',
      name: 'Elise Fouda',
      specialty: 'Domestic Housekeeping',
      sentTime: 'Sent 3 days ago',
      location: 'Omnisports, Yaounde',
      schedule: 'Wed Aug 6 (08:00 – 12:00)',
      price: '10,500 XAF',
      pricePerHour: 2500,
      initials: 'EF',
      photo: 'https://images.unsplash.com/photo-1677195063105-276fd4b95b21?w=400&h=400&fit=crop&auto=format',
      status: 'Declined',
      summary: 'Deep cleaning of 3-bedroom apartment with laundry and kitchen sanitation.'
    },
    {
      id: 'R4',
      name: 'Paul Mbarga',
      specialty: 'Elder Care',
      sentTime: 'Sent 4 days ago',
      location: 'Bastos, Yaounde',
      schedule: 'Thu Aug 7 (09:00 – 15:00)',
      price: '18,000 XAF',
      pricePerHour: 3000,
      initials: 'PM',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format',
      status: 'Pending',
      summary: 'Senior mobility support, grocery errands, and meal prep assistance.'
    },
    {
      id: 'R5',
      name: 'Nadine Mengue',
      specialty: 'Post-op Care',
      sentTime: 'Sent 5 days ago',
      location: 'Bonapriso, Douala',
      schedule: 'Fri Aug 8 (10:00 – 14:00)',
      price: '20,000 XAF',
      pricePerHour: 5000,
      initials: 'NM',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&auto=format',
      status: 'Accepted',
      summary: 'Post-surgical nursing care, medication schedule maintenance, and vitals recording.'
    }
  ];

  const [outgoingList, setOutgoingList] = useState(initialOutgoing);

  const handleDeleteBooking = (id) => {
    setOutgoingList(prev => prev.filter(item => item.id !== id));
  };

  const itemsPerPage = 3;
  const activeList = activeSubTab === 'job_requests' ? defaultJobRequests : outgoingList;
  const totalPages = Math.ceil(activeList.length / itemsPerPage) || 1;
  const paginatedItems = activeList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePayClick = (item) => {
    setActiveDropdownId(null);
    const bookingVal = {
      caregiver: {
        id: item.caregiverId || '1',
        name: item.name || item.clientName || 'Marie-Claire Nkomo',
        photo: item.photo || 'https://images.unsplash.com/photo-1627328543975-3f0ba8a823b0?w=400&h=400&fit=crop&auto=format',
        specialty: item.specialty === 'Home Nursing' ? 'nursing' : (item.specialty === 'Babysitting & Childcare' ? 'babysitting' : 'cleaning'),
        location: item.location || 'Bastos, Yaoundé',
        rating: 4.93,
        pricePerHour: item.pricePerHour || 3500
      },
      sessionType: 'once',
      date: item.schedule ? item.schedule.split('(')[0].trim() : (item.date || 'Mon Aug 4'),
      time: item.schedule && item.schedule.includes('(') ? item.schedule.split('(')[1].replace(')', '').trim() : (item.time || '09:00 – 12:00'),
      totalPrice: item.price
        ? parseInt(String(item.price).replace(/[^0-9]/g, '')) || 10500
        : 10500,
      durationWeeks: 1,
      status: 'Accepted'
    };

    if (onNavigate) {
      onNavigate('payment', { booking: bookingVal });
    } else if (onMakePayment) {
      onMakePayment(item);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn font-sans">
      {/* ─── Page Header ─── */}
      <div className="space-y-1">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1C1A17]">Requests</h2>
        <p className="text-xs md:text-sm text-[#78716C]">
          Everything in one place — the care you've booked, and the jobs households have sent you.
        </p>
      </div>

      {/* ─── Segmented Navigation Bar ─── */}
      <div className="bg-[#EDF5F0] p-1.5 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-2xl w-full sm:w-auto">
        {/* Tab 1: My Requests */}
        <button
          onClick={() => {
            setActiveSubTab('my_requests');
            setCurrentPage(1);
            setActiveDropdownId(null);
          }}
          className={`flex-1 py-3 px-5 rounded-xl text-xs md:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
            activeSubTab === 'my_requests'
              ? 'bg-white text-[#1C1A17] font-bold shadow-sm'
              : 'text-[#5A5248] hover:text-[#1C1A17]'
          }`}
        >
          <Send size={15} className="rotate-45 shrink-0" />
          <span className="whitespace-nowrap">My Requests</span>
          <span className="text-xs text-[#78716C] font-normal whitespace-nowrap">&middot; I requested</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
            activeSubTab === 'my_requests' ? 'bg-[#E2F0E8] text-[#1D6F42]' : 'bg-[#E0DBD5] text-[#5A5248]'
          }`}>
            {outgoingList.length}
          </span>
        </button>

        {/* Tab 2: Job Requests */}
        <button
          onClick={() => {
            setActiveSubTab('job_requests');
            setCurrentPage(1);
            setActiveDropdownId(null);
          }}
          className={`flex-1 py-3 px-5 rounded-xl text-xs md:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
            activeSubTab === 'job_requests'
              ? 'bg-white text-[#1C1A17] font-bold shadow-sm'
              : 'text-[#5A5248] hover:text-[#1C1A17]'
          }`}
        >
          <ArrowDownLeft size={16} className="shrink-0" />
          <span className="whitespace-nowrap">Job Requests</span>
          <span className="text-xs text-[#78716C] font-normal whitespace-nowrap">&middot; sent to me</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
            activeSubTab === 'job_requests' ? 'bg-[#1E4030] text-white' : 'bg-[#E0DBD5] text-[#5A5248]'
          }`}>
            {defaultJobRequests.length} new
          </span>
        </button>
      </div>

      {/* ─── Subheader / Info Bar ─── */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <p className="text-xs text-[#78716C] font-medium">
          {activeSubTab === 'job_requests'
            ? 'Households waiting on your answer — accept the ones you can take.'
            : 'Providers you reached out to, and where each request stands.'}
        </p>
        <span className="text-xs font-semibold bg-[#E2F0E8] text-[#1D6F42] border border-[#C6E4D3] px-3 py-1 rounded-full whitespace-nowrap">
          {activeSubTab === 'job_requests'
            ? `${defaultJobRequests.length} pending`
            : `${outgoingList.length} requests`}
        </span>
      </div>

      {/* ─── Requests List ─── */}
      <div className="space-y-4">
        {/* VIEW 1: JOB REQUESTS (INCOMING) */}
        {activeSubTab === 'job_requests' && (
          <>
            {paginatedItems.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-xs hover:border-[#1E4030]/40 transition-all flex flex-col md:flex-row justify-between md:items-center gap-5"
              >
                {/* Left section: Avatar + Details */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-[#D6EBE0] text-[#1E4030] font-bold text-base flex items-center justify-center shrink-0 shadow-2xs">
                    {r.initials}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-bold text-base md:text-lg text-[#1C1A17]">{r.clientName}</h3>
                      <span className="text-[11px] font-semibold bg-[#EAF3EE] text-[#1E4030] border border-[#D0E5D9] px-2.5 py-0.5 rounded-lg">
                        {r.specialty}
                      </span>
                      <span className="text-[11px] font-medium bg-[#F2F0ED] text-[#78716C] px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <ArrowDownLeft size={11} /> incoming
                      </span>
                    </div>

                    {/* Response Timer Badge */}
                    <div className="bg-[#FEF3C7]/80 text-[#92400E] border border-[#FDE68A] text-xs font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1.5 w-fit">
                      <Hourglass size={12} className="text-[#B45309]" />
                      <span>{r.timeLeft}</span>
                    </div>

                    {/* Location and Schedule */}
                    <div className="flex items-center gap-3 text-xs text-[#78716C] flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-[#8A7E74]" />
                        {r.location}
                      </span>
                      <span>&middot;</span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-[#8A7E74]" />
                        {r.date} {r.time ? `· ${r.time}` : ''}
                      </span>
                    </div>

                    {/* Session Type */}
                    <p className="text-xs text-[#78716C]">{r.sessionType}</p>

                    {/* Price */}
                    <p className="text-sm md:text-base font-extrabold text-[#1C1A17] pt-0.5">
                      {r.price || (r.id === 'REQ102' ? '168,000 XAF total' : '14,000 XAF')}
                    </p>
                  </div>
                </div>

                {/* Right section: Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => {
                      if (onViewDetails) onViewDetails(r);
                      else setSelectedDetailsItem(r);
                    }}
                    className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-[#FAF8F5] text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                  >
                    <Eye size={13} className="text-[#8A7E74]" />
                    View
                  </button>

                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate('discussions');
                    }}
                    className="border border-[#E2D9CF] bg-white text-[#1E4030] hover:bg-[#EDF7F2] text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                  >
                    <MessageSquare size={13} className="text-[#1E4030]" />
                    Message
                  </button>

                  <button
                    onClick={() => onDecline && onDecline(r.id)}
                    className="border border-[#FECDD3] bg-white text-[#E11D48] hover:bg-red-50 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                  >
                    <X size={13} className="text-[#E11D48]" />
                    Decline
                  </button>

                  <button
                    onClick={() => onAccept && onAccept(r.id)}
                    className="bg-[#1E4030] hover:bg-[#152e22] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-sm active:scale-95"
                  >
                    <Check size={14} className="text-white" />
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* VIEW 2: MY REQUESTS (OUTGOING WITH THREE DOTS DROPDOWN) */}
        {activeSubTab === 'my_requests' && (
          <>
            {paginatedItems.map((r) => {
              const showDropdown = activeDropdownId === r.id;
              const statusConfig = (
                r.status === 'Pending'  ? { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400'  } :
                r.status === 'Accepted' ? { bg: 'bg-[#EDF7F2]',  text: 'text-[#1E4030]', border: 'border-green-200',  dot: 'bg-green-500' } :
                                          { bg: 'bg-red-50',     text: 'text-red-700',   border: 'border-red-200',    dot: 'bg-red-400'   }
              );

              return (
                <div
                  key={r.id}
                  className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-xs hover:border-[#1E4030]/40 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4 relative"
                >
                  {/* Left section: Avatar + Details */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E2D9CF] shrink-0 shadow-2xs">
                      {r.photo ? (
                        <img src={r.photo} alt={r.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#D6EBE0] text-[#1E4030] font-bold text-base flex items-center justify-center">
                          {r.initials || 'MN'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-bold text-base md:text-lg text-[#1C1A17]">{r.name}</h3>
                        <span className="text-[11px] font-semibold bg-[#EAF3EE] text-[#1E4030] border border-[#D0E5D9] px-2.5 py-0.5 rounded-lg">
                          {r.specialty}
                        </span>
                      </div>

                      {/* Sent time & Location */}
                      <div className="flex items-center gap-3 text-xs text-[#78716C] flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-[#8A7E74]" />
                          {r.sentTime}
                        </span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-[#8A7E74]" />
                          {r.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right section: Status Pill + Three Dots Button + Dropdown */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    {/* Status Pill with dot */}
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                      {r.status}
                    </span>

                    {/* Three Dots Button */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdownId(showDropdown ? null : r.id)}
                        className="w-9 h-9 rounded-xl hover:bg-[#FAF8F5] border border-transparent hover:border-[#E2D9CF] flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] transition-all cursor-pointer"
                        title="Actions"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* Floating Dropdown Menu */}
                      {showDropdown && (
                        <div className="absolute right-0 top-10 w-44 bg-white border border-[#E2D9CF] rounded-2xl shadow-xl py-1.5 z-50 animate-fadeIn">
                          {r.status === 'Accepted' && (
                            <button
                              onClick={() => handlePayClick(r)}
                              className="w-full px-4 py-2.5 text-xs text-[#1E4030] hover:bg-[#EDF7F2] text-left font-semibold transition-colors cursor-pointer flex items-center gap-2 border-b border-[#F0EBE5]"
                            >
                              <DollarSign size={13} className="text-[#1E4030]" />
                              Make Payment
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              setSelectedDetailsItem(r);
                            }}
                            className="w-full px-4 py-2 text-xs text-[#1C1A17] hover:bg-[#FAF8F5] text-left font-semibold transition-colors cursor-pointer flex items-center gap-2"
                          >
                            <Eye size={13} className="text-[#8A7E74]" />
                            View details
                          </button>
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              if (onNavigate) onNavigate('discussions');
                            }}
                            className="w-full px-4 py-2 text-xs text-[#1E4030] hover:bg-[#EDF7F2] text-left font-semibold transition-colors cursor-pointer flex items-center gap-2"
                          >
                            <MessageSquare size={13} className="text-[#1E4030]" />
                            Message
                          </button>
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              handleDeleteBooking(r.id);
                            }}
                            className="w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left font-semibold transition-colors cursor-pointer flex items-center gap-2"
                          >
                            {r.status === 'Pending' ? (
                              <>
                                <X size={13} className="text-red-600" />
                                Cancel request
                              </>
                            ) : (
                              <>
                                <Trash2 size={13} className="text-red-600" />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
            onClick={() => {
              setCurrentPage(prev => Math.max(1, prev - 1));
              setActiveDropdownId(null);
            }}
            disabled={currentPage === 1}
            className="border border-[#E2D9CF] rounded-xl px-3 py-1.5 text-xs text-[#78716C] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-all"
          >
            <ChevronLeft size={13} /> Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => {
                setCurrentPage(pageNum);
                setActiveDropdownId(null);
              }}
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
            onClick={() => {
              setCurrentPage(prev => Math.min(totalPages, prev + 1));
              setActiveDropdownId(null);
            }}
            disabled={currentPage === totalPages}
            className="border border-[#E2D9CF] rounded-xl px-3 py-1.5 text-xs text-[#1C1A17] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold transition-all"
          >
            Next <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* ─── Exact Client-Style Request Details Modal Popup (Image 2) ─── */}
      {selectedDetailsItem && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E2D9CF] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Dark Green Header */}
            <div className="bg-[#1E4030] text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <ClipboardList size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Request Details</h3>
                  <p className="text-xs text-white/70">
                    ID: {selectedDetailsItem.id || 'R1'} &middot; {selectedDetailsItem.sentTime || selectedDetailsItem.time || 'Sent 2h ago'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetailsItem(null)}
                className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Caregiver Summary Card */}
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-[#E2D9CF] shrink-0 shadow-sm">
                  {selectedDetailsItem.photo ? (
                    <img
                      src={selectedDetailsItem.photo}
                      alt={selectedDetailsItem.name || selectedDetailsItem.clientName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#D6EBE0] text-[#1E4030] font-bold text-lg flex items-center justify-center">
                      {selectedDetailsItem.initials || 'CR'}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-base text-[#1C1A17]">
                      {selectedDetailsItem.name || selectedDetailsItem.clientName}
                    </h4>
                    <span className="text-[11px] bg-[#EDF7F2] text-[#1E4030] border border-green-200 px-2.5 py-0.5 rounded-full font-bold">
                      {selectedDetailsItem.specialty}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A7E74] flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#8A7E74]" />
                    {selectedDetailsItem.location}
                  </p>
                </div>
              </div>

              {/* 2x2 Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* STATUS */}
                <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Status</span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                    selectedDetailsItem.status === 'Accepted'
                      ? 'bg-[#EDF7F2] text-[#1E4030] border border-green-200'
                      : selectedDetailsItem.status === 'Declined'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      selectedDetailsItem.status === 'Accepted'
                        ? 'bg-green-500'
                        : selectedDetailsItem.status === 'Declined'
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                    }`} />
                    {selectedDetailsItem.status || 'Pending'}
                  </span>
                </div>

                {/* SCHEDULE */}
                <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Schedule</span>
                  <span className="text-xs font-bold text-[#1C1A17] flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#1E4030]" />
                    {selectedDetailsItem.schedule || selectedDetailsItem.date || 'Mon Aug 4 (09:00 – 12:00)'}
                  </span>
                </div>

                {/* HOURLY RATE */}
                <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Hourly Rate</span>
                  <span className="text-xs font-bold text-[#1C1A17]">
                    {selectedDetailsItem.pricePerHour ? `${selectedDetailsItem.pricePerHour.toLocaleString()} XAF / hr` : '3,500 XAF / hr'}
                  </span>
                </div>

                {/* TOTAL ESTIMATED FEE */}
                <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Total Estimated Fee</span>
                  <span className="text-xs font-extrabold text-[#1E4030]">
                    {selectedDetailsItem.price || '10,500 XAF'}
                  </span>
                </div>
              </div>

              {/* CARE REQUEST SUMMARY */}
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-1.5">
                <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Care Request Summary</span>
                <p className="text-xs text-[#1C1A17] leading-relaxed">
                  {selectedDetailsItem.summary || 'Elderly patient recovery assistance following knee surgery. Morning medication administration and light physical support.'}
                </p>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-[#FAF8F5] border-t border-[#E2D9CF] flex items-center justify-end gap-2.5">
              <button
                onClick={() => {
                  setSelectedDetailsItem(null);
                  if (onNavigate) onNavigate('discussions');
                }}
                className="px-4 py-2.5 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8] hover:bg-blue-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquare size={13} className="text-[#1D4ED8]" />
                Chat in Discussions
              </button>

              <button
                onClick={() => setSelectedDetailsItem(null)}
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
