import React, { useState, useRef } from 'react'
import {
  MapPin, Clock, Key, CheckCircle2, MessageSquare, Star, Bell,
  Check, Archive, Trash2, ArchiveRestore, Lock, Download,
  ArrowUpRight, Sparkles, X, XCircle, Calendar, Wallet, User,
  Mail, Phone, ShieldCheck, Save, Camera, Globe, Plus, Paperclip,
  Reply, ClipboardList, ArrowRight, Eye, ChevronLeft, ChevronRight, Send
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
import BookingDetailsModal from './components/BookingDetailsModal'
import ProfileTab from './components/ProfileTab'
import RequestsTab from './components/RequestsTab'
import BookingsTab from './components/BookingsTab'
import HomeTab from '../Household/components/HomeTab'
import ExploreTab from '../Household/components/ExploreTab'
import DiscussionsTab from '../Household/components/DiscussionsTab'
import ReferEarnTab from '../Household/components/ReferEarnTab'
import BookingWizard from '../Household/components/booking/BookingWizard'
import Payment from '../Household/screens/Payment'
import BookingConfirmed from '../Household/screens/BookingConfirmed'
import { CAREGIVERS, SPECIALTY_META } from '../../data'
import { initialDiscussions as defaultClientDiscussions } from '../Household/data/mockHouseholdData'
import { payoutHistory, caregiverReviews, initialDiscussions } from './data/mockDashboardData'
import { CAREGIVER_CONSTANTS } from './constants/dashboardConstants'

// ── Confirmation Modal ──
function ConfirmModal({ dialog, onClose }) {
  if (!dialog) return null
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#E2D9CF] p-6 w-full max-w-sm space-y-4">
        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
          <Trash2 size={22} className="text-red-600" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-bold text-base text-[#1C1A17]">{dialog.title}</h3>
          <p className="text-xs text-[#8A7E74] leading-relaxed">{dialog.message}</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-[#E2D9CF] rounded-xl text-xs font-semibold text-[#1C1A17] hover:bg-[#FAF8F5] transition-all cursor-pointer">Cancel</button>
          <button onClick={dialog.onConfirm} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm">Confirm</button>
        </div>
      </div>
    </div>
  )
}

// ── New Message / Reply Modal ──
function MessageModal({ title = "New Message", initialRecipient = "", initialSubject = "", onClose, onSend }) {
  const [recipient, setRecipient] = useState(initialRecipient)
  const [subject, setSubject]     = useState(initialSubject)
  const [body, setBody]           = useState('')
  const [attachments, setAttachments] = useState([])
  const fileRef = useRef()

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    setAttachments(prev => [...prev, ...files].slice(0, 5))
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!recipient.trim() || !subject.trim() || !body.trim()) return
    onSend({ recipient, subject, body, attachments })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl shadow-2xl border border-[#E2D9CF] flex flex-col max-h-[90vh] rounded-t-3xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E4030]/20 bg-[#1E4030] text-white">
          <div className="flex items-center gap-2.5">
            <MessageSquare size={18} className="text-white" />
            <h3 className="font-bold text-base text-white">{title}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-all cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSend} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-3 border-b border-[#F0EBE4] flex items-center gap-3">
              <span className="text-xs font-bold text-[#8A7E74] w-16 shrink-0 uppercase tracking-wide">To</span>
              <input type="text" required value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Client or family name..." className="flex-1 text-xs sm:text-sm text-[#1C1A17] bg-transparent outline-none placeholder:text-[#C5BCBA]" />
            </div>
            <div className="px-6 py-3 border-b border-[#F0EBE4] flex items-center gap-3">
              <span className="text-xs font-bold text-[#8A7E74] w-16 shrink-0 uppercase tracking-wide">Subject</span>
              <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject of your message..." className="flex-1 text-xs sm:text-sm text-[#1C1A17] bg-transparent outline-none placeholder:text-[#C5BCBA]" />
            </div>
            <div className="px-6 py-4">
              <textarea required value={body} onChange={e => setBody(e.target.value)} placeholder="Write your message here..." rows={6} className="w-full text-xs sm:text-sm text-[#1C1A17] bg-transparent outline-none placeholder:text-[#C5BCBA] resize-none leading-relaxed" />
            </div>
            {attachments.length > 0 && (
              <div className="px-6 pb-4 space-y-1.5">
                {attachments.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl px-3 py-2">
                    <Paperclip size={12} className="text-[#8A7E74] shrink-0" />
                    <span className="text-xs text-[#1C1A17] truncate flex-1">{f.name}</span>
                    <span className="text-[10px] text-[#8A7E74]">{(f.size/1024).toFixed(0)} KB</span>
                    <button type="button" onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))} className="text-[#8A7E74] hover:text-red-600 transition-colors cursor-pointer"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-[#E2D9CF] bg-[#FAF8F5] flex items-center justify-between gap-3">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={attachments.length >= 5} className="flex items-center gap-1.5 text-xs font-semibold text-[#8A7E74] hover:text-[#1E4030] disabled:opacity-40 transition-colors cursor-pointer">
              <Paperclip size={14} />Attach {attachments.length > 0 && `(${attachments.length}/5)`}
            </button>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles} />
            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-[#8A7E74] hover:text-[#1C1A17] cursor-pointer">Discard</button>
              <button type="submit" className="flex items-center gap-2 bg-[#1E4030] hover:bg-[#152e22] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm">
                <Send size={13} />Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

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

  const [confirmDialog, setConfirmDialog] = useState(null)
  const [modalConfig, setModalConfig] = useState(null)
  const [profileSaved, setProfileSaved] = useState(false)

  // Dynamic calendar date state
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 10, 1))

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))
  }

  // Caregiver Profile Form Data
  const [caregiverProfile, setCaregiverProfile] = useState({
    fullName: 'Marie-Claire Nkomo',
    email: 'marieclaire.nkomo@carely.cm',
    phone: '+237 6 99 22 33 44',
    secondaryPhone: '+237 6 77 11 22 33',
    location: 'Bastos, Yaoundé, Cameroon',
    emergencyContact: 'Dr. Joseph Nkomo (+237 6 55 44 33 22)',
    preferredLanguage: 'French & English',
    specialty: 'Home Nursing & Post-op Care',
    hourlyRate: '3,500',
    experienceYears: '6',
    certifications: 'Registered Nurse (RN), BLS/CPR Certified, Post-Op Care Specialization',
    bio: 'Certified state nurse with 6 years of clinical experience in hospitals and home health care. Dedicated to providing compassionate, reliable, and hygienic nursing care for post-surgical recovery and elderly comfort.'
  })

  const handleProfileSave = (e) => {
    e.preventDefault()
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  // ── Client Feature States (Home, Explore, Discussions, Refer & Earn, Booking Wizard) ──
  const [selectedId, setSelectedId] = useState('1')
  const [filterSpecialty, setFilterSpecialty] = useState('all')
  const [filterLocation, setFilterLocation] = useState('')
  const [date, setDate] = useState('')
  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [minBudget, setMinBudget] = useState('')
  const [maxBudget, setMaxBudget] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)

  const [aiPrompt, setAiPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)

  const [discussions, setDiscussions] = useState(defaultClientDiscussions)
  const [activeDiscussionId, setActiveDiscussionId] = useState(null)

  // Booking Wizard State
  const [wizardOpen, setWizardOpen] = useState(false)
  const [wizardParams, setWizardParams] = useState({})

  const openBookingWizard = (params = {}) => {
    setWizardParams(params)
    setWizardOpen(true)
  }

  const handleWizardComplete = (bookingData) => {
    setWizardOpen(false)
    setActiveTab('bookings')
  }

  const handleAiRecommend = () => {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    setAiResult(null)

    setTimeout(() => {
      const query = aiPrompt.toLowerCase()
      let matched = CAREGIVERS[0]
      let reason = ''

      if (query.includes('nurse') || query.includes('nursing') || query.includes('medical') || query.includes('elder') || query.includes('senior')) {
        matched = CAREGIVERS.find(c => c.specialty === 'nursing') || CAREGIVERS[0]
        reason = `Based on your request for clinical support, we recommend ${matched.name}. She is a certified nurse with ${matched.experience} years of clinical experience in home care, post-surgical support, and geriatric assistance in Bastos, Yaounde.`
      } else if (query.includes('baby') || query.includes('child') || query.includes('sit') || query.includes('kid') || query.includes('young') || query.includes('school')) {
        matched = CAREGIVERS.find(c => c.specialty === 'babysitting') || CAREGIVERS[1]
        reason = `Based on your childcare needs, we recommend ${matched.name}. She is a certified early childhood educator with ${matched.experience} years of experience supporting kids of all ages with active learning programs in Douala.`
      } else if (query.includes('clean') || query.includes('house') || query.includes('cook') || query.includes('domestic') || query.includes('maid') || query.includes('iron') || query.includes('laundry')) {
        matched = CAREGIVERS.find(c => c.specialty === 'cleaning') || CAREGIVERS[2]
        reason = `Based on your home care/cleaning needs, we recommend ${matched.name}. She is a meticulous housekeeper with ${matched.experience} years of experience in organizing, laundry/ironing, and eco-friendly cleaning.`
      } else if (query.includes('garden') || query.includes('lawn') || query.includes('yard') || query.includes('tree') || query.includes('landscape')) {
        matched = CAREGIVERS.find(c => c.specialty === 'gardening') || CAREGIVERS[4] || CAREGIVERS[0]
        reason = `Based on your gardening request, we recommend ${matched.name}. He has ${matched.experience} years of professional landscaping experience in Yaounde.`
      } else if (query.includes('pet') || query.includes('dog') || query.includes('cat') || query.includes('animal')) {
        matched = CAREGIVERS.find(c => c.specialty === 'pet_care') || CAREGIVERS[5] || CAREGIVERS[0]
        reason = `For pet care, we recommend ${matched.name}. She is a certified vet assistant with ${matched.experience} years of animal sitting experience.`
      } else if (query.includes('cook') || query.includes('food') || query.includes('meal') || query.includes('kitchen') || query.includes('chef')) {
        matched = CAREGIVERS.find(c => c.specialty === 'cooking') || CAREGIVERS[6] || CAREGIVERS[0]
        reason = `For family nutrition and home cooking, we recommend ${matched.name}. She has ${matched.experience} years of professional culinary experience in Douala.`
      } else {
        const locMatch = CAREGIVERS.find(c => query.includes(c.location.split(',')[0].toLowerCase()) || query.includes(c.location.split(',')[1].trim().toLowerCase()))
        if (locMatch) {
          matched = locMatch
          reason = `We found a top-rated caregiver near your specified location: ${matched.name}. She is located in ${matched.location} and specializes in ${SPECIALTY_META[matched.specialty]?.label || 'Care'}.`
        } else {
          matched = CAREGIVERS[0]
          reason = `We matched you with our highest-rated caregiver, ${matched.name}. She is located in ${matched.location} and has verified background references checked.`
        }
      }

      setAiLoading(false)
      setAiResult({ matchedId: matched.id, message: reason })
      setSelectedId(matched.id)
      setFilterSpecialty(matched.specialty)
      setFilterLocation(matched.location.split(',')[0].trim())
    }, 1500)
  }

  const sendMessage = (discussionId, text) => {
    const timeStr = new Date().toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false })
    setDiscussions(prev => prev.map(d => {
      if (d.id === discussionId) {
        return {
          ...d,
          messages: [
            ...d.messages,
            { id: 'm' + Date.now(), sender: 'user', text, time: timeStr, date: 'Today', status: 'delivered' }
          ]
        }
      }
      return d
    }))

    setTimeout(() => {
      let replyText = "Thank you for reaching out! I am available to support your family."
      if (discussionId === 'D4') {
        replyText = "Carely concierge here. How may we assist your booking today?"
      }
      setDiscussions(prev => prev.map(d => {
        if (d.id === discussionId) {
          return {
            ...d,
            messages: [
              ...d.messages,
              { id: 'm_reply_' + Date.now(), sender: 'caregiver', text: replyText, time: timeStr, date: 'Today', status: 'read' }
            ]
          }
        }
        return d
      }))
    }, 1800)
  }

  const deleteDiscussion = (id) => {
    setDiscussions(prev => prev.filter(d => d.id !== id))
    if (activeDiscussionId === id) setActiveDiscussionId(null)
  }

  const clearDiscussionChat = (id) => {
    setDiscussions(prev => prev.map(d => (d.id === id ? { ...d, messages: [] } : d)))
  }

  const deleteMessage = (discId, msgId) => {
    setDiscussions(prev => prev.map(d => (d.id === discId ? { ...d, messages: d.messages.filter(m => m.id !== msgId) } : d)))
  }

  const openDiscussionWithCaregiver = (caregiver) => {
    let existing = discussions.find(d => d.caregiverId === caregiver.id || d.name === caregiver.name)
    if (!existing) {
      const newDisc = {
        id: 'D_' + Date.now(),
        caregiverId: caregiver.id,
        name: caregiver.name,
        specialty: caregiver.specialty,
        photo: caregiver.photo,
        status: 'online',
        lastSeen: 'Online',
        unreadCount: 0,
        messages: [
          {
            id: 'm_init_' + Date.now(),
            sender: 'caregiver',
            text: `Hello! Thank you for contacting me. I specialize in ${SPECIALTY_META[caregiver.specialty]?.label || 'care'}. How can I assist you?`,
            time: 'Just now',
            date: 'Today',
            status: 'read'
          }
        ]
      }
      setDiscussions(prev => [newDisc, ...prev])
      existing = newDisc
    }
    setActiveDiscussionId(existing.id)
    setActiveTab('discussions')
  }

  const [workflowParams, setWorkflowParams] = useState(null)

  const handleInternalNavigate = (target, params) => {
    if (params) {
      setWorkflowParams(params)
    }
    if (target === 'search') {
      setActiveTab('explore')
    } else if (target === 'booking_wizard' || target === 'booking') {
      openBookingWizard(params)
    } else if (['payment', 'confirmed', 'home', 'explore', 'discussions', 'requests', 'bookings', 'calendar', 'earnings', 'reviews', 'notifications', 'refer', 'profile', 'overview'].includes(target)) {
      setActiveTab(target)
    } else if (onNavigate) {
      onNavigate(target, params)
    }
  }

  // Calculate unread count
  const unreadNotificationsCount = notifications.filter(n => n.unread && !n.archived).length

  // Confirmed bookings list
  const upcomingBookings = [
    { name: 'Aïcha K.', initials: 'AK', location: 'Akwa, Douala', time: 'Today · 09:00 – 13:00', status: 'In Progress', statusColor: 'bg-green-50 text-green-700 border-green-200' },
    { name: 'Paul M.', initials: 'PM', location: 'Bastos, Yaounde', time: 'Today · 15:00 – 17:00', status: 'Awaiting OTP', statusColor: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'The Nkomo Family', initials: 'NF', location: 'Bonapriso, Douala', time: 'Thu · 08:00 – 12:00', status: 'Scheduled', statusColor: 'bg-gray-50 text-gray-700 border-gray-200' },
    { name: 'Elise F.', initials: 'EF', location: 'Omnisports, Yaounde', time: 'Fri · 10:00 – 14:00', status: 'Scheduled', statusColor: 'bg-gray-50 text-gray-700 border-gray-200' }
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

  // Notification tab helpers
  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
  }

  const archiveAllNotifications = () => {
    setNotifications(notifications.map(n => ({ ...n, archived: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const readToggleNotification = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: !n.unread } : n))
  }

  const archiveToggleNotification = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, archived: !n.archived } : n))
  }

  const addMessageNotification = ({ recipient, subject, body }) => {
    const newNotif = {
      id: Date.now(),
      title: `Message to ${recipient}: ${subject}`,
      description: body,
      time: 'Just now',
      unread: false,
      type: 'message',
      archived: false,
      replied: true,
      recipient
    }
    setNotifications([newNotif, ...notifications])
  }

  const notifTabs = [
    { id: 'all',      label: 'All',      count: notifications.filter(n => !n.archived).length },
    { id: 'unread',   label: 'Unread',   count: notifications.filter(n => n.unread && !n.archived).length },
    { id: 'archived', label: 'Archived', count: notifications.filter(n => n.archived).length },
    { id: 'reply',    label: 'Reply',    count: notifications.filter(n => n.replied || n.type === 'message').length },
  ]

  const filteredNotifications = notifications.filter(n => {
    if (notifFilter === 'unread')   return n.unread && !n.archived
    if (notifFilter === 'archived') return n.archived
    if (notifFilter === 'reply')    return n.replied || n.type === 'message'
    return !n.archived
  })

  // Dynamic calendar values
  const calYear = calendarDate.getFullYear()
  const calMonth = calendarDate.getMonth()
  const calMonthName = calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  const calFirstDayIndex = new Date(calYear, calMonth, 1).getDay()
  const calTotalDays = new Date(calYear, calMonth + 1, 0).getDate()

  return (
    <>
      <CaregiverLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        notificationsCount={unreadNotificationsCount}
        notifications={notifications}
        onMarkRead={readToggleNotification}
        onMarkAllRead={markAllNotificationsRead}
        onReplyClick={(n) => setModalConfig({
          title: `Reply to ${n.recipient || n.title}`,
          initialRecipient: n.recipient || n.title,
          initialSubject: `Re: ${n.title}`,
        })}
        onNavigate={handleInternalNavigate}
      >
      {/* ─── 1. OVERVIEW TAB ─── */}
      {activeTab === 'overview' && (
        <div className="w-full space-y-6 animate-fadeIn">
          <DashboardHeader />
          <DashboardStats
            pendingCount={incomingRequests.length}
            upcomingCount={upcomingBookings.length}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 items-start">
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
              <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDF7F2] border border-green-200 flex items-center justify-center text-[#1E4030] shrink-0 shadow-sm">
                    <Key size={20} />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 bg-[#EDF7F2] text-[#1E4030] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-green-200">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Active Session In Progress
                      </span>
                      <h4 className="font-bold text-sm text-[#1C1A17]">Session with Aïcha K.</h4>
                    </div>
                    <p className="text-xs text-[#8A7E74] leading-relaxed">
                      Home Nursing &middot; 09:00 – 13:00 &middot; Enter the arrival OTP code provided by the client to verify session and secure escrow payout.
                    </p>
                  </div>
                </div>

                {/* OTP Digits & Confirm row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2D9CF]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#8A7E74] uppercase tracking-wider mr-1">OTP:</span>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(idx, e.target.value, activeTab)}
                        className="w-10 h-10 border border-[#E2D9CF] rounded-xl text-center bg-white font-bold text-[#1C1A17] text-sm focus:outline-none focus:border-[#1E4030] shadow-xs"
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setOtp(['', '', '', '', '', ''])}
                      className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-[#FAF8F5] font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      disabled={otp.some(d => !d)}
                      className="bg-[#1E4030] hover:bg-[#152e22] disabled:opacity-40 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                    >
                      <CheckCircle2 size={13} />
                      Mark Job Complete
                    </button>
                  </div>
                </div>
              </div>

              {/* Upcoming Bookings Widget */}
              <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-[#1C1A17] text-sm flex items-center gap-2">
                    <Calendar size={16} className="text-[#1E4030]" />
                    <span>Upcoming Bookings</span>
                  </h3>
                  <button onClick={() => setActiveTab('bookings')} className="text-xs text-[#1E4030] font-bold flex items-center gap-1 hover:underline cursor-pointer">
                    <span>Manage All</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                <div className="divide-y divide-[#F0EBE5]">
                  {upcomingBookings.map((b, idx) => (
                    <div key={idx} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E2D9CF] flex items-center justify-center text-[#1E4030] font-bold text-xs shrink-0">
                          {b.initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#1C1A17]">{b.name}</h4>
                          <p className="text-[10px] text-[#8A7E74]">{b.location} &middot; {b.time}</p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full border shrink-0 ${b.statusColor}`}>
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
                calendarDate={calendarDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
              <EarningsSummary onViewEarningsClick={() => setActiveTab('earnings')} />
            </div>
          </div>
        </div>
      )}

      {/* ─── 0. HOME TAB (Client Experience) ─── */}
      {activeTab === 'home' && (
        <HomeTab
          onNavigate={handleInternalNavigate}
          openBookingWizard={openBookingWizard}
          userFirstName="Marie-Claire"
        />
      )}

      {/* ─── 1. EXPLORE TAB (Client Experience) ─── */}
      {activeTab === 'explore' && (
        <ExploreTab
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          filterSpecialty={filterSpecialty}
          setFilterSpecialty={setFilterSpecialty}
          filterLocation={filterLocation}
          setFilterLocation={setFilterLocation}
          date={date}
          setDate={setDate}
          showMobileDetail={showMobileDetail}
          setShowMobileDetail={setShowMobileDetail}
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
          minBudget={minBudget}
          setMinBudget={setMinBudget}
          maxBudget={maxBudget}
          setMaxBudget={setMaxBudget}
          availableOnly={availableOnly}
          setAvailableOnly={setAvailableOnly}
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          aiLoading={aiLoading}
          aiResult={aiResult}
          handleAiRecommend={handleAiRecommend}
          onNavigate={handleInternalNavigate}
          openDiscussionWithCaregiver={openDiscussionWithCaregiver}
          openBookingWizard={openBookingWizard}
        />
      )}

      {/* ─── 2. DISCUSSIONS TAB (Client Experience) ─── */}
      {(activeTab === 'discussions' || activeTab === 'discussion') && (
        <DiscussionsTab
          discussions={discussions}
          activeDiscussionId={activeDiscussionId}
          setActiveDiscussionId={setActiveDiscussionId}
          sendMessage={sendMessage}
          deleteDiscussion={deleteDiscussion}
          clearDiscussionChat={clearDiscussionChat}
          deleteMessage={deleteMessage}
          onNavigate={handleInternalNavigate}
        />
      )}

      {/* ─── 2. REQUESTS TAB (FULL WIDTH) ─── */}
      {/* ─── 3. REQUESTS TAB (MATCHING USER SCREENSHOT DESIGN) ─── */}
      {activeTab === 'requests' && (
        <RequestsTab
          incomingRequests={incomingRequests}
          onAccept={(id) => handleRequestAction(id, 'accept')}
          onDecline={(id) => handleRequestAction(id, 'decline')}
          onViewDetails={triggerRequestDetailsModal}
          onNavigate={handleInternalNavigate}
        />
      )}

      {/* ─── 4. BOOKINGS TAB (TOGGLE BETWEEN CLIENT BOOKINGS & MY BOOKINGS) ─── */}
      {activeTab === 'bookings' && (
        <BookingsTab
          onNavigate={handleInternalNavigate}
        />
      )}

      {/* ─── 4. CALENDAR TAB (FULL WIDTH & PREMIUM) ─── */}
      {activeTab === 'calendar' && (
        <div className="w-full space-y-6 animate-fadeIn">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1E4030]">Care Calendar & Availability</h2>
              <p className="text-sm text-[#8A7E74]">Manage your working hours, open days, and confirmed client sessions.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-2xl border border-[#E2D9CF] flex shadow-xs">
                <button
                  onClick={() => setCalendarView('month')}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    calendarView === 'month' ? 'bg-[#1E4030] text-white shadow-sm' : 'text-[#8A7E74] hover:text-[#1C1A17]'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setCalendarView('week')}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    calendarView === 'week' ? 'bg-[#1E4030] text-white shadow-sm' : 'text-[#8A7E74] hover:text-[#1C1A17]'
                  }`}
                >
                  Week
                </button>
              </div>

              <button className="bg-[#1E4030] hover:bg-[#152e22] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
                <Sparkles size={14} />
                <span>Add Availability</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px] gap-6 items-start">
            {/* Calendar Grid Box */}
            <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#F0EBE5]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevMonth}
                    title="Previous month"
                    className="w-8 h-8 rounded-full border border-[#E2D9CF] bg-[#FAF8F5] text-[#1E4030] flex items-center justify-center text-sm font-bold hover:bg-[#1E4030] hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-display font-bold text-base text-[#1C1A17]">{calMonthName}</span>
                  <button
                    onClick={handleNextMonth}
                    title="Next month"
                    className="w-8 h-8 rounded-full border border-[#E2D9CF] bg-[#FAF8F5] text-[#1E4030] flex items-center justify-center text-sm font-bold hover:bg-[#1E4030] hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-[#8A7E74] font-semibold flex-wrap">
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
                  <div className="grid grid-cols-7 text-center text-[11px] text-[#8A7E74] font-bold py-1">
                    <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: calFirstDayIndex }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-[4/3] rounded-2xl bg-[#FAF8F5]/40 opacity-40"></div>
                    ))}

                    {Array.from({ length: calTotalDays }).map((_, idx) => {
                      const dayNum = idx + 1
                      const isCurrentMonth = calMonth === new Date().getMonth() && calYear === new Date().getFullYear()
                      const status = (isCurrentMonth && dayStates[dayNum]) || 'available'
                      const isSelected = selectedDay === dayNum

                      let dayStyle = 'bg-white text-[#1C1A17] border border-[#E2D9CF]'
                      let labelText = ''

                      if (status === 'booked') {
                        dayStyle = 'bg-[#1E4030] text-white border border-[#1E4030] shadow-xs'
                        labelText = '09:00'
                      } else if (status === 'recurring') {
                        dayStyle = 'bg-amber-50 text-amber-900 border border-amber-300'
                        labelText = 'Recurring'
                      } else if (status === 'blocked') {
                        dayStyle = 'bg-red-50/20 text-red-700/60 border border-dashed border-red-200 line-through'
                        labelText = 'Blocked'
                      }

                      if (isSelected) {
                        dayStyle += ' ring-2 ring-amber-500 ring-offset-2'
                      }

                      return (
                        <button
                          key={dayNum}
                          onClick={() => setSelectedDay(dayNum)}
                          className={`aspect-[4/3] rounded-2xl p-2 flex flex-col justify-between items-start text-left transition-all hover:scale-102 cursor-pointer ${dayStyle}`}
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
                  <div className="min-w-[640px] grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2 text-center">
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
                            <div className="h-10 bg-[#1E4030] border border-[#1E4030] text-white rounded-lg flex items-center justify-center text-[9px] font-bold shadow-xs">
                              {hour === '09:00' ? 'Booked' : ''}
                            </div>
                          ) : (
                            <div className="h-10 bg-white border border-[#E2D9CF] rounded-lg"></div>
                          )}
                          {isBookedHour ? (
                            <div className="h-10 bg-[#1E4030] border border-[#1E4030] text-white rounded-lg flex items-center justify-center text-[9px] font-bold shadow-xs">
                              {hour === '09:00' ? 'Booked' : ''}
                            </div>
                          ) : (
                            <div className="h-10 bg-white border border-[#E2D9CF] rounded-lg"></div>
                          )}
                          <div className="h-10 bg-white border border-[#E2D9CF] rounded-lg"></div>
                          {isBookedHour ? (
                            <div className="h-10 bg-[#1E4030] border border-[#1E4030] text-white rounded-lg flex items-center justify-center text-[9px] font-bold shadow-xs">
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
            <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] text-[#8A7E74] font-bold tracking-wider uppercase">Selected Day</span>
                <h3 className="text-base font-extrabold text-[#1C1A17] pt-0.5">November {selectedDay}, 2026</h3>
              </div>

              <div className="space-y-4">
                {dayStates[selectedDay] === 'booked' && (
                  <div className="space-y-4">
                    <span className="text-[10px] text-[#8A7E74] font-bold tracking-wider uppercase">Confirmed Sessions</span>
                    <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-3 relative overflow-hidden">
                      <div className="flex items-center gap-1.5 text-[9px] bg-white border border-[#E2D9CF] text-[#1E4030] px-2.5 py-0.5 rounded-full font-bold w-fit">
                        <CheckCircle2 size={11} className="text-green-600" />
                        <span>Locked Session</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1C1A17]">Aïcha K.</h4>
                        <p className="text-xs text-[#8A7E74]">Home Nursing</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#1C1A17] font-semibold">
                        <Clock size={13} className="text-[#1E4030]" />
                        <span>09:00 – 13:00</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#8A7E74] leading-relaxed">
                      Booked sessions are secured in escrow and can only be managed from the Bookings tab.
                    </p>
                  </div>
                )}

                {dayStates[selectedDay] === 'blocked' && (
                  <div className="space-y-4">
                    <div className="bg-red-50/50 border border-red-200 text-red-800 rounded-2xl p-4 text-xs font-medium leading-relaxed flex items-start gap-2.5">
                      <XCircle size={15} className="shrink-0 mt-0.5 text-red-600" />
                      <span>No sessions scheduled. This day is currently marked as blocked/unavailable.</span>
                    </div>
                    <button
                      onClick={() => {
                        const newStates = { ...dayStates }
                        delete newStates[selectedDay]
                        setDayStates(newStates)
                      }}
                      className="w-full border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-[#FAF8F5] font-bold text-xs py-3 rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Mark Available
                    </button>
                  </div>
                )}

                {dayStates[selectedDay] === 'recurring' && (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 space-y-2 relative overflow-hidden">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800">Recurring Schedule</h4>
                      <p className="text-xs text-[#8A7E74] leading-relaxed">
                        Part of a Mon / Wed / Fri recurring series for the Fouda household (3 weeks).
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setDayStates({ ...dayStates, [selectedDay]: 'blocked' })
                      }}
                      className="w-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs py-3 rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Block This Day
                    </button>
                  </div>
                )}

                {!dayStates[selectedDay] && (
                  <div className="space-y-4">
                    <div className="bg-[#EDF7F2]/60 border border-green-200 text-[#1E4030] rounded-2xl p-4 text-xs font-semibold leading-relaxed">
                      No sessions scheduled. This day is open and available for instant bookings.
                    </div>
                    <button
                      onClick={() => {
                        setDayStates({ ...dayStates, [selectedDay]: 'blocked' })
                      }}
                      className="w-full border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-[#FAF8F5] font-bold text-xs py-3 rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Block This Day
                    </button>
                  </div>
                )}
              </div>

              {/* Working Hours */}
              <div className="space-y-3 pt-3 border-t border-[#F0EBE5]">
                <span className="text-[10px] text-[#8A7E74] font-bold tracking-wider uppercase">Working Hours Range</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'morning', label: 'Morning (08:00 – 12:00)' },
                    { key: 'afternoon', label: 'Afternoon (12:00 – 16:00)' },
                    { key: 'evening', label: 'Evening (16:00 – 20:00)' },
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
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          active
                            ? 'bg-[#1E4030] text-white border-[#1E4030] shadow-xs'
                            : 'bg-[#FAF8F5] text-[#8A7E74] border-[#E2D9CF] hover:border-[#1E4030] hover:text-[#1C1A17]'
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

      {/* ─── 5. EARNINGS TAB (FULL WIDTH) ─── */}
      {activeTab === 'earnings' && (
        <div className="w-full space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1E4030]">Provider Earnings & Escrow Payouts</h2>
              <p className="text-sm text-[#8A7E74]">Track completed sessions, pending balances, and automatic Mobile Money transfers.</p>
            </div>
            <button className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-[#FAF8F5] text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer">
              <Download size={14} />
              <span>Export Statements</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'PENDING ESCROW', value: '28,400 XAF', subtext: 'Scheduled for Friday' },
              { label: 'THIS MONTH', value: '182,500 XAF', subtext: '+18% vs last month' },
              { label: 'LAST MONTH', value: '164,000 XAF', subtext: 'Completed 22 sessions' },
              { label: 'LIFETIME PAYOUT', value: '1,420,000 XAF', subtext: 'Since Jan 2025' }
            ].map((card, idx) => (
              <div key={idx} className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-2">
                <span className="text-[10px] text-[#8A7E74] font-bold tracking-wider uppercase">{card.label}</span>
                <div className="space-y-1">
                  <p className="text-2xl font-extrabold text-[#1E4030]">{card.value}</p>
                  <p className="text-xs text-[#8A7E74] font-medium">{card.subtext}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <h3 className="font-bold text-base text-[#1C1A17]">Payout & Transfer History</h3>
                <p className="text-xs text-[#8A7E74] mt-0.5">Funds are automatically deposited to your verified Mobile Money wallet upon session completion.</p>
              </div>
            </div>

            <div className="divide-y divide-[#F0EBE5] border-t border-[#F0EBE5]">
              {payoutHistory.map((row, idx) => (
                <div key={idx} className="py-4.5 flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#1C1A17]">{row.amount}</p>
                    <p className="text-[11px] text-[#8A7E74] font-medium">{row.date}</p>
                  </div>
                  <div className="text-xs font-semibold text-[#8A7E74] hidden md:block">
                    {row.method}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-[#EDF7F2] text-[#1E4030] border border-green-200 text-[10px] font-bold px-3 py-1 rounded-full shrink-0">
                      Paid & Verified
                    </span>
                    <button className="w-8 h-8 rounded-full border border-[#E2D9CF] bg-white flex items-center justify-center text-[#8A7E74] hover:text-[#1E4030] hover:bg-[#FAF8F5] transition-all cursor-pointer">
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── 6. REVIEWS TAB (FULL WIDTH) ─── */}
      {activeTab === 'reviews' && (
        <div className="w-full space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1E4030]">Client Reviews & Trust Score</h2>
              <p className="text-sm text-[#8A7E74]">Ratings and verified feedback left by households you have cared for.</p>
            </div>
          </div>

          <RatingCard />

          <div className="space-y-4">
            {caregiverReviews.map(rev => (
              <div key={rev.id} className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#EDF7F2] border border-green-200 text-[#1E4030] flex items-center justify-center font-bold text-xs shrink-0">
                      {rev.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1C1A17]">{rev.author}</h4>
                      <p className="text-[11px] text-[#8A7E74] font-medium">{rev.date} &middot; Verified Household Client</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 bg-[#FAF8F5] px-3 py-1 rounded-xl border border-[#E2D9CF]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-[#E2D9CF]"}
                      />
                    ))}
                    <span className="text-xs font-bold text-[#1C1A17] ml-1">{rev.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-[#5A5248] leading-relaxed bg-[#FAF8F5] p-4 rounded-2xl border border-[#F0EBE5]">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 7. NOTIFICATIONS TAB (EXACTLY LIKE HOUSEHOLD) ─── */}
      {activeTab === 'notifications' && (
        <div className="w-full space-y-5 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#EDF7F2] rounded-2xl flex items-center justify-center border border-green-200/60 text-[#1E4030] shadow-sm">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-[#1E4030]">Notifications</h2>
                <p className="text-sm text-[#8A7E74]">Stay updated on your care requests, payouts, client messages and schedule alerts.</p>
              </div>
            </div>
            <button
              onClick={() => setModalConfig({ title: "New Message", initialRecipient: "", initialSubject: "" })}
              className="flex items-center gap-2 bg-[#1E4030] hover:bg-[#152e22] text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer hover:shadow-md"
            >
              <Plus size={16} />New Message
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white border border-[#E2D9CF] rounded-2xl p-3 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E2D9CF]">
                {notifTabs.map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setNotifFilter(tab.id)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${notifFilter === tab.id ? 'bg-[#1E4030] text-white shadow-sm' : 'text-[#8A7E74] hover:text-[#1C1A17] hover:bg-white'}`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold min-w-[16px] text-center ${notifFilter === tab.id ? 'bg-white/20 text-white' : 'bg-white text-[#1E4030] border border-[#E2D9CF]'}`}>{tab.count}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button onClick={markAllNotificationsRead} type="button" className="text-[11px] font-bold text-[#8A7E74] hover:text-[#1C1A17] flex items-center gap-1 bg-[#FAF8F5] border border-[#E2D9CF] px-3 py-1.5 rounded-xl transition-all cursor-pointer hover:border-[#D4C9BE]">
                  <Check size={12} /><span>Mark all read</span>
                </button>
                <button onClick={archiveAllNotifications} type="button" className="text-[11px] font-bold text-[#8A7E74] hover:text-[#1C1A17] flex items-center gap-1 bg-[#FAF8F5] border border-[#E2D9CF] px-3 py-1.5 rounded-xl transition-all cursor-pointer hover:border-[#D4C9BE]">
                  <Archive size={12} /><span>Archive all</span>
                </button>
                <button onClick={() => setConfirmDialog({
                  title: 'Clear All Notifications',
                  message: 'This will permanently delete all notifications from this view.',
                  onConfirm: () => { clearNotifications(); setConfirmDialog(null); }
                })} type="button" className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer">
                  <Trash2 size={12} /><span>Clear all</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-2">
            {filteredNotifications.map(n => {
              const IconComponent =
                n.type === 'request' ? Calendar :
                n.type === 'payout' ? Wallet :
                n.type === 'message' ? MessageSquare :
                n.type === 'review' ? Star :
                n.type === 'accepted' ? CheckCircle2 :
                Bell

              const iconStyle =
                n.type === 'message' ? 'bg-blue-50 border border-blue-200 text-blue-600' :
                n.type === 'reminder' ? 'bg-[#FAF8F5] border border-[#E2D9CF] text-[#8A7E74]' :
                n.type === 'payout' ? 'bg-amber-50 border border-amber-200 text-amber-700' :
                'bg-[#1E4030] text-white'

              return (
                <div key={n.id} className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all group ${n.unread ? 'border-[#1E4030]/20 bg-[#EDF7F2]/20' : 'border-[#E2D9CF]'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconStyle}`}>
                      <IconComponent size={16} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-bold text-sm ${n.unread ? 'text-[#1C1A17]' : 'text-[#3A3634]'}`}>{n.title}</h4>
                        {n.unread && <span className="w-2 h-2 rounded-full bg-[#1E4030]"></span>}
                        {n.type === 'message' && <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">Message</span>}
                      </div>
                      <p className="text-xs text-[#8A7E74] leading-relaxed">{n.description || n.text}</p>
                      {n.recipient && <p className="text-[10px] text-[#8A7E74]/70">To: {n.recipient}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-[#8A7E74] font-medium group-hover:hidden">{n.time}</span>
                      <div className="hidden group-hover:flex items-center gap-1">
                        {/* Mark Read */}
                        <button onClick={() => readToggleNotification(n.id)} title={n.unread ? 'Mark as read' : 'Mark as unread'} className="w-7 h-7 rounded-full border border-[#E2D9CF] bg-white flex items-center justify-center text-[#8A7E74] hover:text-[#1E4030] hover:border-[#1E4030] transition-all cursor-pointer shadow-xs">
                          <Check size={12} className={n.unread ? 'text-[#1E4030]' : ''} />
                        </button>

                        {/* Reply modal */}
                        <button onClick={() => setModalConfig({
                          title: `Reply to ${n.recipient || n.title}`,
                          initialRecipient: n.recipient || n.title,
                          initialSubject: `Re: ${n.title}`,
                        })} title="Reply" className="w-7 h-7 rounded-full border border-[#E2D9CF] bg-white flex items-center justify-center text-[#8A7E74] hover:text-[#1E4030] hover:border-[#1E4030] transition-all cursor-pointer shadow-xs">
                          <Reply size={12} />
                        </button>

                        {/* Archive toggle */}
                        <button onClick={() => archiveToggleNotification(n.id)} title={n.archived ? 'Unarchive' : 'Archive'} className="w-7 h-7 rounded-full border border-[#E2D9CF] bg-white flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] hover:border-[#C9C0B8] transition-all cursor-pointer shadow-xs">
                          {n.archived ? <ArchiveRestore size={12} /> : <Archive size={12} />}
                        </button>

                        {/* Delete */}
                        <button onClick={() => setConfirmDialog({
                          title: 'Delete Notification',
                          message: 'Are you sure you want to delete this notification? This cannot be undone.',
                          onConfirm: () => { deleteNotification(n.id); setConfirmDialog(null); }
                        })} title="Delete" className="w-7 h-7 rounded-full border border-red-200 bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-xs">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredNotifications.length === 0 && (
              <div className="py-16 text-center bg-white border border-[#E2D9CF] rounded-2xl">
                <Bell size={28} className="mx-auto text-[#8A7E74]/30 mb-3 animate-pulse" />
                <p className="text-sm font-bold text-[#8A7E74]">No notifications found</p>
                <p className="text-xs text-[#8A7E74]/70 mt-1">Your {notifFilter} folder is currently empty.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── REFER & EARN TAB ─── */}
      {activeTab === 'refer' && (
        <ReferEarnTab />
      )}

      {/* ─── 8. PROFILE TAB (MATCHING HOUSEHOLD PROFILE) ─── */}
      {activeTab === 'profile' && (
        <ProfileTab onNavigate={handleInternalNavigate} />
      )}

      {/* ─── PAYMENT SCREEN (Authorize Mobile Money Escrow) ─── */}
      {activeTab === 'payment' && (
        <Payment
          onNavigate={handleInternalNavigate}
          screenParams={workflowParams}
        />
      )}

      {/* ─── BOOKING CONFIRMED SCREEN ─── */}
      {activeTab === 'confirmed' && (
        <BookingConfirmed
          onNavigate={handleInternalNavigate}
          screenParams={workflowParams}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal dialog={confirmDialog} onClose={() => setConfirmDialog(null)} />

      {/* New Message / Reply Modal */}
      {modalConfig && (
        <MessageModal
          title={modalConfig.title}
          initialRecipient={modalConfig.initialRecipient}
          initialSubject={modalConfig.initialSubject}
          onClose={() => setModalConfig(null)}
          onSend={addMessageNotification}
        />
      )}

      {/* Booking Details Popup Overlay Modal */}
      <BookingDetailsModal
        details={selectedBookingDetails}
        onClose={() => setSelectedBookingDetails(null)}
      />
    </CaregiverLayout>

    {/* ── Booking Wizard Overlay ─────────────────────────── */}
    {wizardOpen && (
      <BookingWizard
        {...wizardParams}
        onClose={() => setWizardOpen(false)}
        onComplete={handleWizardComplete}
      />
    )}
  </>
  )
}
