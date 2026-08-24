import React from 'react'
import {
  MapPin, Clock, Key, CheckCircle2, MessageSquare, Star, Bell,
  Check, Archive, Trash2, ArchiveRestore, Lock, Download,
  ArrowUpRight, Sparkles, X, XCircle, Calendar, Wallet
} from 'lucide-react'




// Hook, layouts, constants, services and components
import { useDashboard } from './hooks/useDashboard'
import CaregiverLayout from './layout/CaregiverLayout'
import DashboardHeader from './components/DashboardHeader'
import DashboardStats from './components/DashboardStats'
import IncomingRequests from './components/IncomingRequests'
import CalendarWidget from './components/CalendarWidget'
import EarningsSummary from './components/EarningsSummary'
import RatingCard from './components/RatingCard'
import RequestCard from './components/RequestCard'
import BookingDetailsModal from './components/BookingDetailsModal'
import { payoutHistory, caregiverReviews } from './data/mockDashboardData'
import { CAREGIVER_CONSTANTS } from './constants/dashboardConstants'

export default function CaregiverDashboard({ onNavigate }) {
  const {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    otp,
    setOtp,
    calendarView,
    setCalendarView,
    selectedDay,
    setSelectedDay,
    dayStates,
    setDayStates,
    workingHours,
    setWorkingHours,
    selectedBookingDetails,
    setSelectedBookingDetails,
    notifFilter,
    setNotifFilter,
    notifications,
    setNotifications,
    incomingRequests,
    handleRequestAction,
    handleOtpChange
  } = useDashboard()

  // Calculate unread count for layout notifications indicator
  const unreadNotificationsCount = notifications.filter(n => n.unread && !n.archived).length

  // Confirmed bookings list
  const upcomingBookings = [
    { name: 'Aïcha K.', location: 'Akwa, Douala', time: 'Today · 09:00 – 13:00', status: 'In Progress', statusColor: 'bg-green-50 text-green-700 border-green-200' },
    { name: 'Paul M.', location: 'Bastos, Yaounde', time: 'Today · 15:00 – 17:00', status: 'Awaiting OTP', statusColor: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'The Nkomo Family', location: 'Bonapriso, Douala', time: 'Thu · 08:00 – 12:00', status: 'Scheduled', statusColor: 'bg-gray-50 text-gray-700 border-gray-200' },
    { name: 'Elise F.', location: 'Omnisports, Yaounde', time: 'Fri · 10:00 – 14:00', status: 'Scheduled', statusColor: 'bg-gray-50 text-gray-700 border-gray-200' }
  ]

  const triggerRequestDetailsModal = (r) => {
    const isRecurring = r.id === 'REQ102'
    setSelectedBookingDetails({
      clientName: r.clientName,
      initials: r.initials,
      specialty: r.specialty,
      status: 'Pending Request',
      location: r.location,
      rate: '3,500 XAF',
      hours: '4',
      sessionsCount: isRecurring ? 12 : 1,
      subtotal: isRecurring ? '168,000 XAF' : '14,000 XAF',
      serviceFee: isRecurring ? '8,000 XAF' : '1,000 XAF',
      total: isRecurring ? '160,000 XAF' : '13,000 XAF',
      schedule: isRecurring ? [
        { date: 'Mon Nov 8, 2026', time: '09:00 – 13:00', status: 'Pending' },
        { date: 'Wed Nov 10, 2026', time: '09:00 – 13:00', status: 'Pending' },
        { date: 'Fri Nov 12, 2026', time: '09:00 – 13:00', status: 'Pending' }
      ] : [
        { date: r.date, time: r.time, status: 'Pending' }
      ],
      payoutInfo: isRecurring ? 'Charged weekly & paid on Fridays to your verified wallet' : 'Payout pending approval and completion',
      nextSteps: isRecurring ? [
        'This is a recurring Post-op Care request from M. Fouda for 3 weeks.',
        'Accept the request to confirm the entire 3-week schedule.',
        'You will earn 160,000 XAF net payout upon completing all sessions.'
      ] : [
        `This is an incoming request from ${r.clientName}.`,
        `You can accept or decline this request using the actions in the Requests tab.`,
        `If accepted, the session will be scheduled on ${r.date} from ${r.time}.`
      ]
    })
  }

  return (
    <CaregiverLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      notificationsCount={unreadNotificationsCount}
      onNavigate={onNavigate}
    >
      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <>
          <DashboardHeader />
          <DashboardStats
            pendingCount={incomingRequests.length}
            upcomingCount={upcomingBookings.length}
          />

          <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
            {/* Left Column */}
            <div className="space-y-6">
              <IncomingRequests
                requests={incomingRequests}
                onViewDetails={triggerRequestDetailsModal}
                onDecline={(id) => handleRequestAction(id, 'decline')}
                onAccept={(id) => handleRequestAction(id, 'accept')}
                onViewAllClick={() => setActiveTab('requests')}
              />

              {/* Active Session Card */}
              <div className="bg-[#EDF7F2] border border-green-200/50 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-green-200 flex items-center justify-center text-[#1E4030] shrink-0 shadow-sm">
                    <Key size={18} />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-[#D8ECD8] text-green-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        In Progress
                      </span>
                      <h4 className="font-semibold text-xs text-[#1C1A17]">Session with Aïcha</h4>
                    </div>
                    <p className="text-xs text-[#8A7E74] leading-relaxed">
                      Home Nursing &middot; 09:00 – 13:00 &middot; Enter the arrival OTP shared by the household to start the session.
                    </p>
                  </div>
                </div>

                {/* OTP Digits & Confirm row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(idx, e.target.value, activeTab)}
                        className="w-10 h-10 border border-[#E2D9CF] rounded-full text-center bg-white font-bold text-[#1C1A17] text-sm focus:outline-none focus:ring-1 focus:ring-[#1E4030]"
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setOtp(['', '', '', '', '', ''])}
                      className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-secondary font-semibold text-xs px-3.5 py-2 rounded-xl transition-all"
                    >
                      Resend code
                    </button>
                    <button
                      disabled={otp.some(d => !d)}
                      className="bg-[#1E4030] hover:bg-[#152e22] disabled:opacity-40 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 size={12} />
                      Mark Job Complete
                    </button>
                  </div>
                </div>
              </div>

              {/* Upcoming Bookings Widget */}
              <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-[#1C1A17] text-sm">Upcoming Bookings</h3>
                  <button onClick={() => setActiveTab('bookings')} className="text-xs text-[#1E4030] font-bold flex items-center gap-1 hover:underline">
                    <span>Manage</span>
                  </button>
                </div>

                <div className="divide-y divide-[#EFECE6]">
                  {upcomingBookings.map((b, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-secondary border border-[#E2D9CF] flex items-center justify-center text-[#8A7E74] shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-[#1C1A17]">{b.name}</h4>
                          <p className="text-[10px] text-[#8A7E74]">{b.location} &middot; {b.time}</p>
                        </div>
                      </div>

                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${b.statusColor}`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <CalendarWidget
                onFullViewClick={() => setActiveTab('calendar')}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                dayStates={dayStates}
              />
              <EarningsSummary onViewEarningsClick={() => setActiveTab('earnings')} />
            </div>
          </div>
        </>
      )}

      {/* Requests Tab Content */}
      {activeTab === 'requests' && (
        <div className="max-w-4xl mx-auto space-y-4 pt-4">
          {incomingRequests.map(r => (
            <RequestCard
              key={r.id}
              request={r}
              onViewDetails={triggerRequestDetailsModal}
              onDecline={(id) => handleRequestAction(id, 'decline')}
              onAccept={(id) => handleRequestAction(id, 'accept')}
              isDetailedView={true}
            />
          ))}
          {incomingRequests.length === 0 && (
            <div className="bg-white border border-[#E2D9CF] rounded-3xl p-12 text-center text-[#8A7E74] space-y-2">
              <ClipboardList size={32} className="mx-auto text-[#8A7E74]/50" />
              <p className="text-sm font-semibold">No pending requests</p>
              <p className="text-xs">We'll notify you as soon as a new family requests your care.</p>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab Content */}
      {activeTab === 'bookings' && (
        <div className="max-w-4xl mx-auto space-y-4 pt-4">
          {/* Card 1: Aïcha K. */}
          <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-6 relative">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#EFECE6] border border-[#E2D9CF] text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  AK
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-[#1C1A17]">Aïcha K.</h3>
                    <span className="text-xs bg-secondary text-primary border border-[#E2D9CF] px-2.5 py-0.5 rounded-full font-bold">
                      Home Nursing
                    </span>
                    <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full font-semibold">
                      In Progress
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-[#8A7E74] flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      Today &middot; 09:00 – 13:00
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} />
                      Akwa, Douala
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#1C1A17]">14,000 XAF</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <button className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-secondary font-semibold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5">
                  <MessageSquare size={13} />
                  Message
                </button>
                <button
                  onClick={() => setSelectedBookingDetails({
                    clientName: 'Aïcha K.',
                    initials: 'AK',
                    specialty: 'Home Nursing',
                    status: 'In Progress',
                    location: 'Akwa, Douala',
                    rate: '3,500 XAF',
                    hours: '4',
                    sessionsCount: '1',
                    subtotal: '14,000 XAF',
                    serviceFee: '1,000 XAF',
                    total: '15,000 XAF',
                    schedule: [{ date: 'Today, Nov 2, 2026', time: '09:00 – 13:00', status: 'In Progress' }],
                    payoutInfo: 'Payout pending on Friday via MTN Mobile Money (xxxx 8821)',
                    nextSteps: ['This session is currently running.', 'Upon session completion, mark the job complete to initiate payout process.', 'The client will have 24 hours to confirm or report an issue.']
                  })}
                  className="text-xs font-bold text-[#1E4030] hover:underline pr-2"
                >
                  View details
                </button>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <span className="text-xs text-[#8A7E74]">
                Session running — remember to finalize when done.
              </span>
              <button className="bg-[#1E4030] hover:bg-[#152e22] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 size={13} />
                Mark Job Complete
              </button>
            </div>
          </div>

          {/* Card 2: Paul M. */}
          <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-6 relative">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#EFECE6] border border-[#E2D9CF] text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  PM
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-[#1C1A17]">Paul M.</h3>
                    <span className="text-xs bg-secondary text-primary border border-[#E2D9CF] px-2.5 py-0.5 rounded-full font-bold">
                      Post-op Care
                    </span>
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold">
                      Awaiting OTP
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-[#8A7E74] flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      Today &middot; 15:00 – 17:00
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} />
                      Bastos, Yaounde
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#1C1A17]">6,400 XAF</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <button className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-secondary font-semibold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5">
                  <MessageSquare size={13} />
                  Message
                </button>
                <button
                  onClick={() => setSelectedBookingDetails({
                    clientName: 'Paul M.',
                    initials: 'PM',
                    specialty: 'Post-op Care',
                    status: 'Awaiting OTP',
                    location: 'Bastos, Yaounde',
                    rate: '3,200 XAF',
                    hours: '2',
                    sessionsCount: '1',
                    subtotal: '6,400 XAF',
                    serviceFee: '600 XAF',
                    total: '7,000 XAF',
                    schedule: [{ date: 'Today, Nov 2, 2026', time: '15:00 – 17:00', status: 'Awaiting OTP' }],
                    payoutInfo: 'Payout scheduled for Friday via Orange Money (xxxx 4432)',
                    nextSteps: ['Collect the 6-digit OTP code from Paul M. upon arrival.', 'Enter the code into your app to start the session.', 'The session will run from 15:00 to 17:00.']
                  })}
                  className="text-xs font-bold text-[#1E4030] hover:underline pr-2"
                >
                  View details
                </button>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <Key size={14} className="text-[#8A7E74]" />
                <span className="text-xs text-[#8A7E74] font-medium">Enter arrival OTP</span>
                <div className="flex items-center gap-1.5">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`bookings-otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value, activeTab)}
                      className="w-9 h-9 border border-[#E2D9CF] rounded-full text-center bg-white font-bold text-[#1C1A17] text-xs focus:outline-none focus:ring-1 focus:ring-[#1E4030]"
                    />
                  ))}
                </div>
              </div>
              <button
                disabled={otp.some(d => !d)}
                className="bg-[#1E4030] hover:bg-[#152e22] disabled:opacity-40 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
              >
                Start session
              </button>
            </div>
          </div>

          {/* Card 3: The Nkomo Family */}
          <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm relative">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#EFECE6] border border-[#E2D9CF] text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  NF
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-[#1C1A17]">The Nkomo Family</h3>
                    <span className="text-xs bg-secondary text-primary border border-[#E2D9CF] px-2.5 py-0.5 rounded-full font-bold">
                      Elderly Care
                    </span>
                    <span className="text-xs bg-gray-50 text-gray-700 border border-gray-200 px-2.5 py-0.5 rounded-full font-semibold">
                      Scheduled
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-[#8A7E74] flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      Thu &middot; 08:00 – 12:00
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} />
                      Bonapriso, Douala
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#1C1A17]">12,800 XAF</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <button className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-secondary font-semibold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5">
                  <MessageSquare size={13} />
                  Message
                </button>
                <button
                  onClick={() => setSelectedBookingDetails({
                    clientName: 'The Nkomo Family',
                    initials: 'NF',
                    specialty: 'Elderly Care',
                    status: 'Scheduled',
                    location: 'Bonapriso, Douala',
                    rate: '3,500 XAF',
                    hours: '3',
                    sessionsCount: '3',
                    subtotal: '31,500 XAF',
                    serviceFee: '1,500 XAF',
                    total: '33,000 XAF',
                    schedule: [
                      { date: 'Mon Aug 4, 2026', time: '09:00 – 12:00', status: 'Confirmed' },
                      { date: 'Wed Aug 6, 2026', time: '09:00 – 12:00', status: 'Confirmed' },
                      { date: 'Fri Aug 8, 2026', time: '09:00 – 12:00', status: 'Confirmed' }
                    ],
                    payoutInfo: 'Charged weekly & paid on Fridays to your verified Mobile Money wallet',
                    nextSteps: [
                      'The Monday Aug 4 session is scheduled at 09:00.',
                      'On the morning of each session, obtain the arrival OTP code.',
                      'Confirm completion of each session after service.'
                    ]
                  })}
                  className="text-xs font-bold text-[#1E4030] hover:underline pr-2"
                >
                  View details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Tab Content */}
      {activeTab === 'calendar' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Switcher & Action button row */}
          <div className="flex justify-end items-center gap-3">
            <div className="bg-white p-0.5 rounded-xl border border-[#E2D9CF] flex shadow-2xs">
              <button
                onClick={() => setCalendarView('month')}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                  calendarView === 'month' ? 'bg-[#1E4030] text-white shadow-sm' : 'text-[#8A7E74] hover:text-[#1C1A17]'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setCalendarView('week')}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                  calendarView === 'week' ? 'bg-[#1E4030] text-white shadow-sm' : 'text-[#8A7E74] hover:text-[#1C1A17]'
                }`}
              >
                Week
              </button>
            </div>

            <button className="bg-[#1E4030] hover:bg-[#152e22] text-white text-[11px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all">
              <Sparkles size={12} />
              <span>Add availability</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
            <div className="bg-white border border-[#E2D9CF] rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2">
                <div className="flex items-center gap-3">
                  <button className="text-[#8A7E74] hover:text-[#1C1A17] text-sm font-bold">&lt;</button>
                  <span className="font-bold text-sm text-[#1C1A17]">November 2026</span>
                  <button className="text-[#8A7E74] hover:text-[#1C1A17] text-sm font-bold">&gt;</button>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-[#8A7E74] font-semibold">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#E2D9CF]"></span>
                    Available
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E4030]"></span>
                    Booked
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-100 border border-amber-300"></span>
                    Recurring
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    Blocked
                  </span>
                </div>
              </div>

              {/* Month View Grid */}
              {calendarView === 'month' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-7 text-center text-[10px] text-[#8A7E74] font-bold py-1 border-b border-[#FAF8F5]">
                    <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-[4/3] rounded-2xl bg-[#FAF8F5]/30"></div>
                    ))}

                    {Array.from({ length: 30 }).map((_, idx) => {
                      const dayNum = idx + 1
                      const status = dayStates[dayNum] || 'available'
                      const isSelected = selectedDay === dayNum

                      let dayStyle = 'bg-white text-[#1C1A17] border border-[#E2D9CF]'
                      let labelText = ''

                      if (status === 'booked') {
                        dayStyle = 'bg-[#1E4030] text-white border border-[#1E4030]'
                        if (dayNum === 2) labelText = '09:00'
                        if (dayNum === 5) labelText = '14:00'
                        if (dayNum === 6) labelText = '08:00'
                        if (dayNum === 8) labelText = '10:00'
                      } else if (status === 'recurring') {
                        dayStyle = 'bg-amber-50 text-amber-900 border border-amber-300'
                        labelText = 'Recurring'
                      } else if (status === 'blocked') {
                        dayStyle = 'bg-red-50/10 text-red-700/60 border border-dashed border-red-200 line-through'
                        labelText = 'Blocked'
                      } else {
                        if ([3, 22, 29].includes(dayNum)) {
                          labelText = 'Off'
                          dayStyle = 'bg-[#FAF8F5] text-[#8A7E74] border border-[#EFECE6]'
                        }
                      }

                      if (isSelected) {
                        dayStyle += ' ring-2 ring-amber-500 ring-offset-2'
                      }

                      return (
                        <button
                          key={dayNum}
                          onClick={() => setSelectedDay(dayNum)}
                          className={`aspect-[4/3] rounded-2xl p-2 flex flex-col justify-between items-start text-left transition-all hover:scale-102 ${dayStyle}`}
                        >
                          <span className="text-xs font-bold">{dayNum}</span>
                          {labelText && (
                            <span className="text-[8px] font-bold uppercase tracking-wide opacity-90 flex items-center gap-0.5">
                              {status === 'booked' && <Lock size={8} className="shrink-0 text-white" />}
                              <span>{labelText}</span>
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Week View Grid */}
              {calendarView === 'week' && (
                <div className="overflow-x-auto pt-2">
                  <div className="min-w-[640px] grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-1.5 text-center">
                    <div></div>
                    {['NOV 3', 'NOV 4', 'NOV 5', 'NOV 6', 'NOV 7', 'NOV 8', 'NOV 9'].map(day => (
                      <div key={day} className="text-[10px] font-bold text-[#8A7E74] uppercase py-2 bg-[#FAF8F5] rounded-xl border border-[#E2D9CF]">
                        {day}
                      </div>
                    ))}

                    {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map(hour => {
                      const isBookedHour = ['09:00', '10:00', '11:00', '12:00'].includes(hour)
                      return (
                        <div key={hour} className="contents">
                          <div className="text-[10px] font-bold text-[#8A7E74] flex items-center justify-end pr-2.5">
                            {hour}
                          </div>
                          <div className="h-10 bg-[#FAF8F5] border border-dashed border-[#E2D9CF]/65 rounded-lg"></div>
                          <div className="h-10 bg-red-50/20 border border-dashed border-red-200/50 rounded-lg flex items-center justify-center text-[8px] text-red-400 font-bold line-through">Blocked</div>
                          {isBookedHour ? (
                            <div className="h-10 bg-[#1E4030] border border-[#1E4030] text-white rounded-lg flex items-center justify-center text-[9px] font-bold shadow-sm">
                              {hour === '09:00' ? 'Booked' : ''}
                            </div>
                          ) : (
                            <div className="h-10 bg-white border border-[#E2D9CF] rounded-lg"></div>
                          )}
                          {isBookedHour ? (
                            <div className="h-10 bg-[#1E4030] border border-[#1E4030] text-white rounded-lg flex items-center justify-center text-[9px] font-bold shadow-sm">
                              {hour === '09:00' ? 'Booked' : ''}
                            </div>
                          ) : (
                            <div className="h-10 bg-white border border-[#E2D9CF] rounded-lg"></div>
                          )}
                          <div className="h-10 bg-white border border-[#E2D9CF] rounded-lg"></div>
                          {isBookedHour ? (
                            <div className="h-10 bg-[#1E4030] border border-[#1E4030] text-white rounded-lg flex items-center justify-center text-[9px] font-bold shadow-sm">
                              {hour === '09:00' ? 'Booked' : ''}
                            </div>
                          ) : (
                            <div className="h-10 bg-white border border-[#E2D9CF] rounded-lg"></div>
                          )}
                          <div className="h-10 bg-amber-50/50 border border-amber-200/50 rounded-lg flex items-center justify-center text-[8px] text-amber-800 font-bold uppercase">Recurring</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Selected day details panel */}
            <div className="bg-white border border-[#E2D9CF] rounded-3xl p-5 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] text-[#8A7E74] font-bold tracking-wider uppercase">Selected Day</span>
                <h3 className="text-sm font-extrabold text-[#1C1A17] pt-0.5">November {selectedDay}, 2026</h3>
              </div>

              <div className="space-y-4">
                {dayStates[selectedDay] === 'booked' && (
                  <div className="space-y-4">
                    <span className="text-[10px] text-[#8A7E74] font-bold tracking-wider uppercase">Confirmed Sessions</span>
                    <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-3 relative overflow-hidden">
                      <div className="flex items-center gap-1.5 text-[9px] bg-white border border-[#E2D9CF] text-[#8A7E74] px-2 py-0.5 rounded-full font-bold w-fit">
                        <CheckCircle2 size={10} className="text-[#1D6F42]" />
                        <span>Locked</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#1C1A17]">Aïcha K.</h4>
                        <p className="text-[10px] text-[#8A7E74]">Home Nursing</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#1C1A17] font-semibold">
                        <Clock size={12} className="text-[#8A7E74]" />
                        <span>09:00 – 13:00</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#8A7E74] leading-relaxed">
                      Booked sessions can only be canceled from the booking's page.
                    </p>
                    <button disabled className="w-full bg-[#EFECE6] text-[#8A7E74]/60 font-semibold text-xs py-2.5 rounded-xl transition-all cursor-not-allowed">
                      Block this day
                    </button>
                  </div>
                )}

                {dayStates[selectedDay] === 'blocked' && (
                  <div className="space-y-4">
                    <div className="bg-red-50/50 border border-red-200 text-red-800 rounded-2xl p-4 text-xs font-medium leading-relaxed flex items-start gap-2.5">
                      <XCircle size={14} className="shrink-0 mt-0.5 text-red-650" />
                      <span>No sessions scheduled. This day is currently blocked.</span>
                    </div>
                    <button
                      onClick={() => {
                        const newStates = { ...dayStates }
                        delete newStates[selectedDay]
                        setDayStates(newStates)
                      }}
                      className="w-full border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-secondary font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs"
                    >
                      Mark available
                    </button>
                  </div>
                )}

                {dayStates[selectedDay] === 'recurring' && (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 space-y-2 relative overflow-hidden">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800">Recurring booking</h4>
                      <p className="text-xs text-[#8A7E74] leading-relaxed">
                        Part of a Mon / Wed / Fri series for the Fouda household (3 weeks).
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setDayStates({ ...dayStates, [selectedDay]: 'blocked' })
                      }}
                      className="w-full border border-[#E2D9CF] bg-white text-red-600 hover:bg-red-50 font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs"
                    >
                      Block this day
                    </button>
                  </div>
                )}

                {!dayStates[selectedDay] && (
                  <div className="space-y-4">
                    <div className="bg-[#EDF7F2]/50 border border-green-200 text-[#1E4030] rounded-2xl p-4 text-xs font-semibold leading-relaxed">
                      No sessions scheduled. This day is currently open and available for bookings.
                    </div>
                    <button
                      onClick={() => {
                        setDayStates({ ...dayStates, [selectedDay]: 'blocked' })
                      }}
                      className="w-full border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-secondary font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs"
                    >
                      Block this day
                    </button>
                  </div>
                )}
              </div>

              {/* Working Hours */}
              <div className="space-y-3 pt-3 border-t border-[#EFECE6]">
                <span className="text-[10px] text-[#8A7E74] font-bold tracking-wider uppercase">Working Hours</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: 'morning', label: 'Morning' },
                    { key: 'afternoon', label: 'Afternoon' },
                    { key: 'evening', label: 'Evening' },
                    { key: 'overnight', label: 'Overnight' }
                  ].map(pill => {
                    const isBooked = dayStates[selectedDay] === 'booked'
                    const active = isBooked ? pill.key === 'morning' : workingHours[pill.key]

                    return (
                      <button
                        key={pill.key}
                        disabled={isBooked}
                        onClick={() => {
                          setWorkingHours({ ...workingHours, [pill.key]: !workingHours[pill.key] })
                        }}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                          active
                            ? 'bg-[#EDF7F2] text-[#1E4030] border-green-300'
                            : 'bg-white text-[#8A7E74] border-[#E2D9CF] hover:border-[#8A7E74]'
                        } ${isBooked ? 'opacity-85 cursor-not-allowed' : ''}`}
                      >
                        {pill.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Earnings Tab Content */}
      {activeTab === 'earnings' && (
        <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'PENDING BALANCE', value: '28,400 XAF', subtext: 'Payout on Friday' },
              { label: 'THIS MONTH', value: '182,500 XAF', subtext: '+11% vs last month' },
              { label: 'LIFETIME', value: '1.42M XAF', subtext: 'Since Jan 2025' }
            ].map((card, idx) => (
              <div key={idx} className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-2 relative overflow-hidden">
                <span className="text-[10px] text-[#8A7E74] font-bold tracking-wider uppercase">{card.label}</span>
                <div className="space-y-1">
                  <p className="text-2xl font-extrabold text-[#1C1A17]">{card.value}</p>
                  <p className="text-xs text-[#8A7E74] font-medium">{card.subtext}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <h3 className="font-bold text-base text-[#1C1A17]">Payout history</h3>
                <p className="text-xs text-[#8A7E74] mt-0.5">Automatically sent to your Mobile Money account.</p>
              </div>
              <button className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-secondary text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs">
                <Download size={13} />
                <span>Export</span>
              </button>
            </div>

            <div className="divide-y divide-[#EFECE6] border-t border-[#EFECE6] pt-1">
              {payoutHistory.map((row, idx) => (
                <div key={idx} className="py-4.5 flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#1C1A17]">{row.amount}</p>
                    <p className="text-[10px] text-[#8A7E74] font-medium">{row.date}</p>
                  </div>
                  <div className="text-xs font-semibold text-[#8A7E74] text-center flex-1 hidden md:block">
                    {row.method}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-[#EDF7F2] text-[#1E4030] border border-green-200 text-[10px] font-bold px-3 py-1 rounded-full shrink-0">
                      Paid
                    </span>
                    <button className="w-8 h-8 rounded-full border border-[#E2D9CF] bg-white flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] hover:bg-secondary transition-all">
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab Content */}
      {activeTab === 'reviews' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pt-4">
          <RatingCard />

          <div className="space-y-4">
            {caregiverReviews.map(rev => (
              <div key={rev.id} className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EFECE6] border border-[#E2D9CF] text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {rev.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1C1A17]">{rev.author}</h4>
                      <p className="text-[10px] text-[#8A7E74] font-medium">{rev.date} &middot; Verified CareSession</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i < rev.rating ? "fill-amber-500 text-amber-500" : "text-[#E2D9CF]"}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#8A7E74] leading-relaxed italic bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EFECE6]/50">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Tab Content */}
      {activeTab === 'notifications' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FAF8F5] p-3 rounded-2xl border border-[#E2D9CF]">
            <div className="flex gap-1 bg-white p-0.5 rounded-xl border border-[#E2D9CF]">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'archived', label: 'Archived' }
              ].map(tab => {
                const isActive = notifFilter === tab.id
                const count = tab.id === 'unread'
                  ? notifications.filter(n => n.unread && !n.archived).length
                  : tab.id === 'archived'
                  ? notifications.filter(n => n.archived).length
                  : notifications.filter(n => !n.archived).length

                return (
                  <button
                    key={tab.id}
                    onClick={() => setNotifFilter(tab.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      isActive ? 'bg-[#1E4030] text-white shadow-sm' : 'text-[#8A7E74] hover:text-[#1C1A17]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-secondary text-primary border border-[#E2D9CF]'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                className="text-xs font-bold text-[#8A7E74] hover:text-[#1C1A17] flex items-center gap-1 bg-white border border-[#E2D9CF] px-3 py-1.5 rounded-xl transition-all shadow-xs"
              >
                <Check size={13} />
                <span>Mark all read</span>
              </button>
              <button
                onClick={() => {
                  setNotifications(notifications.map(n => {
                    if (notifFilter === 'unread' && n.unread) return { ...n, archived: true }
                    if (notifFilter === 'all') return { ...n, archived: true }
                    return n
                  }))
                }}
                className="text-xs font-bold text-[#8A7E74] hover:text-[#1C1A17] flex items-center gap-1 bg-white border border-[#E2D9CF] px-3 py-1.5 rounded-xl transition-all shadow-xs"
              >
                <Archive size={13} />
                <span>Archive all</span>
              </button>
              <button
                onClick={() => {
                  if (notifFilter === 'all') {
                    setNotifications([])
                  } else if (notifFilter === 'unread') {
                    setNotifications(notifications.filter(n => !n.unread))
                  } else if (notifFilter === 'archived') {
                    setNotifications(notifications.filter(n => !n.archived))
                  }
                }}
                className="text-xs font-bold text-red-650 hover:text-red-700 flex items-center gap-1 bg-white border border-[#E2D9CF] px-3 py-1.5 rounded-xl transition-all shadow-xs"
              >
                <Trash2 size={13} />
                <span>Clear all</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#E2D9CF] rounded-3xl overflow-hidden shadow-sm divide-y divide-[#EFECE6]">
            {notifications.filter(n => {
              if (notifFilter === 'unread') return n.unread && !n.archived
              if (notifFilter === 'archived') return n.archived
              return !n.archived
            }).map(n => {
              const IconComponent =
                n.type === 'request' ? Calendar :
                n.type === 'payout' ? Wallet :
                n.type === 'message' ? MessageSquare :
                n.type === 'review' ? Star :
                Bell

              const badgeStyle = n.type === 'reminder'
                ? 'bg-[#FAF8F5] border border-[#E2D9CF] text-[#8A7E74]'
                : 'bg-[#1E4030] text-white'

              return (
                <div key={n.id} className="p-5 flex items-center justify-between gap-4 hover:bg-[#FAF8F5]/45 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${badgeStyle}`}>
                      <IconComponent size={16} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-xs text-[#1C1A17]">{n.title}</h4>
                        {n.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1D6F42]" title="Unread"></span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#8A7E74] leading-relaxed">{n.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
                      <button
                        onClick={() => {
                          setNotifications(notifications.map(item =>
                            item.id === n.id ? { ...item, unread: !item.unread } : item
                          ))
                        }}
                        title={n.unread ? "Mark as read" : "Mark as unread"}
                        className="w-7 h-7 rounded-full border border-[#E2D9CF] bg-white flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] hover:bg-secondary transition-all shadow-xs"
                      >
                        <Check size={12} className={n.unread ? "text-[#1D6F42]" : ""} />
                      </button>
                      <button
                        onClick={() => {
                          setNotifications(notifications.map(item =>
                            item.id === n.id ? { ...item, archived: !item.archived } : item
                          ))
                        }}
                        title={n.archived ? "Send to Inbox" : "Archive"}
                        className="w-7 h-7 rounded-full border border-[#E2D9CF] bg-white flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] hover:bg-secondary transition-all shadow-xs"
                      >
                        {n.archived ? <ArchiveRestore size={12} /> : <Archive size={12} />}
                      </button>
                      <button
                        onClick={() => {
                          setNotifications(notifications.filter(item => item.id !== n.id))
                        }}
                        title="Delete"
                        className="w-7 h-7 rounded-full border border-[#E2D9CF] bg-white flex items-center justify-center text-red-650 hover:text-red-700 hover:bg-red-50 transition-all shadow-xs"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <span className="text-[10px] text-[#8A7E74] font-medium min-w-[50px] text-right group-hover:hidden">
                      {n.time}
                    </span>
                  </div>
                </div>
              )
            })}

            {notifications.filter(n => {
              if (notifFilter === 'unread') return n.unread && !n.archived
              if (notifFilter === 'archived') return n.archived
              return !n.archived
            }).length === 0 && (
              <div className="p-12 text-center text-[#8A7E74] space-y-2">
                <Bell size={28} className="mx-auto text-[#8A7E74]/40" />
                <p className="text-xs font-semibold">No notifications found</p>
                <p className="text-[10px]">Your {notifFilter} folder is currently empty.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Details Popup Overlay Modal */}
      <BookingDetailsModal
        details={selectedBookingDetails}
        onClose={() => setSelectedBookingDetails(null)}
      />
    </CaregiverLayout>
  )
}
