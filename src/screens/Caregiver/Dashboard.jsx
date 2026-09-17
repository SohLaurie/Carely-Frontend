import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  MapPin, Clock, Key, CheckCircle2, MessageSquare, Star, Bell,
  Check, Archive, Trash2, ArchiveRestore, Lock, Download,
  ArrowUpRight, Sparkles, X, XCircle, Calendar, Wallet, User,
  Mail, Phone, ShieldCheck, Save, Camera, Globe, Plus, Paperclip,
  Reply, ClipboardList, ArrowRight, Eye, ChevronLeft, ChevronRight, Send, RefreshCw
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
import { payoutHistory } from './data/mockDashboardData'
import { fetchSubscriptionStatus, paySubscription } from '../../services/admin.service.js'
import SubscriptionPaymentModal from './components/SubscriptionPaymentModal'
import { getStoredUser, apiGet } from '../../services/api.js'
import { verifySessionOtp, providerCompleteSession, fetchProviderReviews } from '../../services/bookingApi.js'
import {
  markNotificationRead,
  markAllNotificationsReadApi,
  toggleArchiveNotification,
  deleteNotificationApi
} from '../../services/notificationsApi.js'
import {
  fetchDiscussions,
  fetchMessages,
  sendMessageApi,
  getOrCreateDiscussion,
  deleteDiscussionThread,
  clearDiscussionChat as clearDiscussionChatApi,
  deleteDiscussionMessage
} from '../../services/discussionApi.js'
import {
  fetchMyCalendar,
  blockDateSlot,
  unblockByDate
} from '../../services/availabilityApi.js'

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
    incomingBookings,
    outgoingRequests,
    outgoingBookings,
    handleRequestAction,
    handleOtpChange,
    loadProviderRequests
  } = useDashboard()

  const [confirmDialog, setConfirmDialog] = useState(null)
  const [modalConfig, setModalConfig] = useState(null)
  const [profileSaved, setProfileSaved] = useState(false)

  // Active Session interaction state
  const [activeSessionOtpLoading, setActiveSessionOtpLoading] = useState(false)
  const [activeSessionError, setActiveSessionError] = useState('')
  const [activeSessionSuccess, setActiveSessionSuccess] = useState('')
  const [completingJob, setCompletingJob] = useState(false)

  // Real Reviews state
  const [providerReviews, setProviderReviews] = useState([])
  const [ratingStats, setRatingStats] = useState({ rating: 5.0, count: 0 })

  const loadReviews = useCallback(async () => {
    const user = getStoredUser()
    if (!user?.id) return
    try {
      const data = await fetchProviderReviews(user.id)
      if (data) {
        setRatingStats({
          rating: Number(data.averageRating || 5.0),
          count: Number(data.totalReviews || 0)
        })
        if (Array.isArray(data.reviews)) {
          setProviderReviews(data.reviews.map(r => {
            const author = `${r.reviewer_first_name || ''} ${r.reviewer_last_name || ''}`.trim() || 'Household Client'
            const initials = `${(r.reviewer_first_name?.[0] || 'C')}${(r.reviewer_last_name?.[0] || 'L')}`.toUpperCase()
            const dateFormatted = r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'
            return {
              id: r.id,
              author,
              initials,
              rating: Number(r.rating || 5),
              date: dateFormatted,
              comment: r.comment || 'Verified service completed successfully.'
            }
          }))
        }
      }
    } catch (e) {
      console.warn('Could not load provider reviews:', e.message)
    }
  }, [])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  // ── Subscription Status State ──
  const [subStatus, setSubStatus] = useState(null)
  const [subLoading, setSubLoading] = useState(false)
  const [payMessage, setPayMessage] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const loadSubStatus = async () => {
    try {
      const data = await fetchSubscriptionStatus()
      setSubStatus(data)
      // If approved and not yet paid, inject payment notification into notifications
      if (data && data.approvalStatus === 'approved' && !data.subscriptionPaid) {
        const notifId = 'sub-pay-notif'
        setNotifications(prev => {
          if (prev.some(n => n.id === notifId)) return prev
          return [
            {
              id: notifId,
              title: 'Action Required: Pay Subscription',
              desc: 'Your profile is approved! Pay the 25 XAF subscription via Campay to activate your account and start receiving bookings.',
              time: 'Just now',
              unread: true,
              type: 'payment',
            },
            ...prev
          ]
        })
      }
    } catch {
      // If not logged in as a provider or offline, ignore gracefully
    }
  }

  useEffect(() => {
    loadSubStatus()
  }, [])

  const handlePaySubscription = async () => {
    setSubLoading(true)
    setPayMessage('')
    try {
      const res = await paySubscription()
      setPayMessage(res.message || 'Payment prompt sent to your phone! Please confirm 25 XAF on your phone.')
      setTimeout(loadSubStatus, 4000)
    } catch (err) {
      setPayMessage(err.message || 'Payment initiation failed. Please try again.')
    } finally {
      setSubLoading(false)
    }
  }

  // Dynamic calendar date state (defaults to current date, not hardcoded month)
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [calendarEvents, setCalendarEvents] = useState({})
  const [calendarLoading, setCalendarLoading] = useState(false)
  const [calendarActionLoading, setCalendarActionLoading] = useState(false)
  const [calendarMessage, setCalendarMessage] = useState('')

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))
  }

  // Load calendar data from API with fallback
  const loadCalendarData = useCallback(async (dateToLoad = calendarDate) => {
    const yr = dateToLoad.getFullYear()
    const mo = dateToLoad.getMonth() + 1
    const user = getStoredUser()
    const currentUserId = user?.id

    try {
      setCalendarLoading(true)
      const data = await fetchMyCalendar(yr, mo)
      if (data && data.dayStates) {
        setDayStates(data.dayStates)
      }
      if (data && data.eventsByDay) {
        setCalendarEvents(data.eventsByDay)
      }
    } catch (err) {
      console.warn('Availability API request failed, building from incomingBookings fallback:', err)
      const computedStates = {}
      const computedEvents = {}
      const totalDays = new Date(yr, mo, 0).getDate()
      for (let d = 1; d <= totalDays; d++) {
        computedEvents[d] = []
      }

      // Check incoming bookings for current provider
      incomingBookings.forEach(b => {
        if (b.rawStatus === 'cancelled' || b.rawStatus === 'declined') return
        const bDate = b.startDate ? new Date(b.startDate) : null
        if (bDate && bDate.getFullYear() === yr && (bDate.getMonth() + 1) === mo) {
          const d = bDate.getDate()
          computedStates[d] = b.bookingType === 'recurring' ? 'recurring' : 'booked'
          computedEvents[d]?.push({
            type: 'session',
            id: b.id,
            bookingId: b.id,
            clientName: b.clientName,
            time: b.time,
            status: b.status,
            profession: b.profession
          })
        }
      })

      // Load blocked dates from localStorage
      const storageKey = currentUserId ? `carely_blocked_dates_${currentUserId}` : 'carely_blocked_dates'
      const storedBlocks = JSON.parse(localStorage.getItem(storageKey) || '[]')
      storedBlocks.forEach(bDateStr => {
        const [by, bm, bd] = bDateStr.split('-').map(Number)
        if (by === yr && bm === mo) {
          computedStates[bd] = 'blocked'
          computedEvents[bd]?.push({
            type: 'blocked',
            reason: 'Unavailable'
          })
        }
      })

      setDayStates(computedStates)
      setCalendarEvents(computedEvents)
    } finally {
      setCalendarLoading(false)
    }
  }, [calendarDate, incomingBookings, setDayStates])

  // Load calendar on mount, month change, or tab activation
  useEffect(() => {
    loadCalendarData(calendarDate)
  }, [calendarDate, activeTab, loadCalendarData])

  // Block a day
  const handleBlockDay = async (dayNum) => {
    const yr = calendarDate.getFullYear()
    const mo = String(calendarDate.getMonth() + 1).padStart(2, '0')
    const dayStr = String(dayNum).padStart(2, '0')
    const dateStr = `${yr}-${mo}-${dayStr}`
    const user = getStoredUser()
    const currentUserId = user?.id
    const storageKey = currentUserId ? `carely_blocked_dates_${currentUserId}` : 'carely_blocked_dates'

    setCalendarActionLoading(true)
    setCalendarMessage('')
    try {
      // Optimistic update
      setDayStates(prev => ({ ...prev, [dayNum]: 'blocked' }))
      setCalendarEvents(prev => ({
        ...prev,
        [dayNum]: [...(prev[dayNum] || []), { type: 'blocked', reason: 'Unavailable' }]
      }))

      // Persist in localStorage
      const storedBlocks = JSON.parse(localStorage.getItem(storageKey) || '[]')
      if (!storedBlocks.includes(dateStr)) {
        storedBlocks.push(dateStr)
        localStorage.setItem(storageKey, JSON.stringify(storedBlocks))
      }

      // Call API
      await blockDateSlot(dateStr, dateStr, 'Unavailable')
      setCalendarMessage(`Day ${dayNum} marked as blocked.`)
      await loadCalendarData(calendarDate)
    } catch (err) {
      console.error('Failed to block day:', err)
      setCalendarMessage(err.message || 'Blocked locally.')
    } finally {
      setCalendarActionLoading(false)
    }
  }

  // Unblock a day
  const handleUnblockDay = async (dayNum) => {
    const yr = calendarDate.getFullYear()
    const mo = String(calendarDate.getMonth() + 1).padStart(2, '0')
    const dayStr = String(dayNum).padStart(2, '0')
    const dateStr = `${yr}-${mo}-${dayStr}`
    const user = getStoredUser()
    const currentUserId = user?.id
    const storageKey = currentUserId ? `carely_blocked_dates_${currentUserId}` : 'carely_blocked_dates'

    setCalendarActionLoading(true)
    setCalendarMessage('')
    try {
      // Optimistic update
      setDayStates(prev => {
        const next = { ...prev }
        delete next[dayNum]
        return next
      })
      setCalendarEvents(prev => ({
        ...prev,
        [dayNum]: (prev[dayNum] || []).filter(e => e.type !== 'blocked')
      }))

      // Remove from localStorage
      const storedBlocks = JSON.parse(localStorage.getItem(storageKey) || '[]')
      const filtered = storedBlocks.filter(d => d !== dateStr)
      localStorage.setItem(storageKey, JSON.stringify(filtered))

      // Call API
      await unblockByDate(dateStr)
      setCalendarMessage(`Day ${dayNum} is now open and available.`)
      await loadCalendarData(calendarDate)
    } catch (err) {
      console.error('Failed to unblock day:', err)
      setCalendarMessage(err.message || 'Unblocked locally.')
    } finally {
      setCalendarActionLoading(false)
    }
  }

  // Selected day sessions for side panel
  const selectedDaySessions = useMemo(() => {
    const yr = calendarDate.getFullYear()
    const mo = calendarDate.getMonth() + 1
    const dayNum = selectedDay

    const events = calendarEvents[dayNum] || []
    const sessionEvents = events.filter(e => e.type === 'session')

    // Find in incomingBookings for complete info
    const matchedBookings = incomingBookings.filter(b => {
      if (b.rawStatus === 'cancelled' || b.rawStatus === 'declined') return false
      if (b.startDate) {
        const d = new Date(b.startDate)
        if (d.getFullYear() === yr && (d.getMonth() + 1) === mo && d.getDate() === dayNum) {
          return true
        }
      }
      if (Array.isArray(b.sessions)) {
        return b.sessions.some(s => {
          if (s.scheduled_date) {
            const sd = new Date(s.scheduled_date)
            return sd.getFullYear() === yr && (sd.getMonth() + 1) === mo && sd.getDate() === dayNum
          }
          return false
        })
      }
      return false
    })

    if (matchedBookings.length > 0) {
      return matchedBookings.map(b => ({
        id: b.id,
        bookingId: b.id,
        clientName: b.clientName,
        profession: b.profession || 'Caregiver Service',
        time: b.time,
        location: b.location,
        status: b.status,
        price: b.price
      }))
    }

    if (sessionEvents.length > 0) {
      return sessionEvents.map(s => ({
        id: s.id,
        bookingId: s.bookingId,
        clientName: s.clientName || 'Household Client',
        profession: s.sessionType === 'recurring' ? 'Recurring Care Service' : 'Home Care Service',
        time: s.time,
        location: 'Yaoundé / Douala',
        status: s.status === 'ARRIVED' ? 'In Progress' : 'Confirmed',
        price: 'Secured in Escrow'
      }))
    }

    return []
  }, [calendarDate, selectedDay, calendarEvents, incomingBookings])

  const currentDayStatus = useMemo(() => {
    if (selectedDaySessions.length > 0) return 'booked'
    const state = dayStates[selectedDay]
    if (state === 'blocked') return 'blocked'
    if (state === 'recurring') return 'recurring'
    if (state === 'booked') return 'booked'
    return 'available'
  }, [selectedDay, dayStates, selectedDaySessions])



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

  const [discussions, setDiscussions] = useState([])
  const [activeDiscussionId, setActiveDiscussionId] = useState(null)

  const loadCaregiverDiscussions = async () => {
    try {
      const user = getStoredUser()
      const currentUserId = user?.id
      const list = await fetchDiscussions()
      if (Array.isArray(list)) {
        setDiscussions(prev => {
          return list.map(item => {
            const existing = prev.find(p => p.id === item.id)
            const msgs = existing?.messages || (item.lastMessage ? [{
              id: 'last-' + item.id,
              sender: item.lastSenderId === currentUserId ? 'user' : 'caregiver',
              text: item.lastMessage,
              attachmentUrl: item.lastAttachmentUrl,
              attachmentName: item.lastAttachmentName,
              attachmentType: item.lastAttachmentType,
              status: item.lastMessageStatus || 'delivered',
              time: item.lastMessageTime ? new Date(item.lastMessageTime).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'Recently'
            }] : [])

            return {
              ...item,
              messages: msgs
            }
          })
        })
      }
    } catch (err) {
      console.warn('Failed to load caregiver discussions:', err.message)
    }
  }

  useEffect(() => {
    loadCaregiverDiscussions()
    const interval = setInterval(loadCaregiverDiscussions, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!activeDiscussionId) return
    let isMounted = true

    const loadActiveMessages = async () => {
      try {
        const user = getStoredUser()
        const currentUserId = user?.id
        const msgs = await fetchMessages(activeDiscussionId)
        if (!isMounted) return

        setDiscussions(prev => prev.map(d => {
          if (d.id === activeDiscussionId) {
            return {
              ...d,
              unreadCount: 0,
              messages: msgs.map(m => ({
                ...m,
                sender: (m.senderId === currentUserId || m.sender === 'user') ? 'user' : 'caregiver',
                time: m.time || (m.createdAt ? new Date(m.createdAt).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'Just now')
              }))
            }
          }
          return d
        }))
      } catch (err) {
        console.warn('Error fetching active messages:', err.message)
      }
    }

    loadActiveMessages()
    const msgInterval = setInterval(loadActiveMessages, 2500)
    return () => {
      isMounted = false
      clearInterval(msgInterval)
    }
  }, [activeDiscussionId])

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

  const handleAiRecommend = async () => {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    setAiResult(null)

    try {
      const data = await apiGet('/providers')
      const list = (data?.providers || []).filter(p => p.approval_status === 'approved' && p.subscription_paid)
      const query = aiPrompt.toLowerCase()

      let matched = list[0]
      if (list.length > 0) {
        const found = list.find(p => {
          const prof = (p.profession || '').toLowerCase()
          const spec = (Array.isArray(p.specialties) ? p.specialties.join(' ') : String(p.specialties || '')).toLowerCase()
          const loc = (p.location || p.city || '').toLowerCase()
          const bio = (p.bio || '').toLowerCase()
          return query.split(' ').some(w => w.length > 3 && (prof.includes(w) || spec.includes(w) || loc.includes(w) || bio.includes(w)))
        })
        if (found) matched = found
      }

      if (matched) {
        const matchedName = `${matched.first_name || ''} ${matched.last_name || ''}`.trim() || 'Verified Provider'
        const matchedProf = matched.profession || 'Care Provider'
        const matchedLoc = matched.location || matched.city || 'Yaoundé'
        const matchedExp = matched.experience || (matched.experience_yrs ? `${matched.experience_yrs} yrs` : 'experienced')
        const reason = `Based on your requirements, we recommend ${matchedName} (${matchedProf} in ${matchedLoc}, ${matchedExp} experience). Verified and registered on Carely.`

        setAiLoading(false)
        setAiResult({ matchedId: matched.id, message: reason })
        setSelectedId(matched.id)
        if (matched.specialties?.[0] || matched.profession) {
          setFilterSpecialty((matched.specialties?.[0] || matched.profession).toLowerCase().replace(/\s+/g, '_'))
        }
        if (matched.location || matched.city) {
          setFilterLocation(matched.location || matched.city)
        }
      } else {
        setAiLoading(false)
        setAiResult({ message: 'No registered providers match your query. Explore all verified providers below.' })
      }
    } catch (err) {
      setAiLoading(false)
      setAiResult({ message: 'Unable to match right now. Please explore registered providers below.' })
    }
  }

  const sendMessage = async (discussionId, text, attachmentData = null) => {
    if (!text?.trim() && !attachmentData) return
    const user = getStoredUser()
    const currentUserId = user?.id
    const now = new Date()
    const timeStr = now.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false })

    const tempId = 'temp-' + Date.now()
    const optimisticMsg = {
      id: tempId,
      senderId: currentUserId,
      sender: 'user',
      text: text ? text.trim() : '',
      attachmentUrl: attachmentData?.attachmentUrl,
      attachmentName: attachmentData?.attachmentName,
      attachmentType: attachmentData?.attachmentType,
      attachmentSize: attachmentData?.attachmentSize,
      attachmentMime: attachmentData?.attachmentMime,
      time: timeStr,
      date: 'Today',
      status: 'delivered'
    }

    setDiscussions(prev => prev.map(d => {
      if (d.id === discussionId) {
        return {
          ...d,
          lastMessage: text ? text.trim() : (attachmentData?.attachmentName || 'Attachment'),
          lastMessageTime: now.toISOString(),
          messages: [...(d.messages || []), optimisticMsg]
        }
      }
      return d
    }))

    try {
      const payload = {
        text: text ? text.trim() : '',
        attachmentUrl: attachmentData?.attachmentUrl,
        attachmentName: attachmentData?.attachmentName,
        attachmentType: attachmentData?.attachmentType,
        attachmentSize: attachmentData?.attachmentSize,
        attachmentMime: attachmentData?.attachmentMime
      }
      const res = await sendMessageApi(discussionId, payload)
      if (res) {
        setDiscussions(prev => prev.map(d => {
          if (d.id === discussionId) {
            return {
              ...d,
              messages: (d.messages || []).map(m => m.id === tempId ? {
                ...res,
                sender: 'user',
                time: timeStr
              } : m)
            }
          }
          return d
        }))
      }
    } catch (err) {
      console.error('Failed to send message via API:', err)
    }
  }

  const deleteDiscussion = async (id) => {
    try {
      await deleteDiscussionThread(id)
    } catch (err) {
      console.warn('Delete discussion API error:', err)
    }
    setDiscussions(prev => prev.filter(d => d.id !== id))
    if (activeDiscussionId === id) setActiveDiscussionId(null)
  }

  const clearDiscussionChat = async (id) => {
    try {
      await clearDiscussionChatApi(id)
    } catch (err) {
      console.warn('Clear chat API error:', err)
    }
    setDiscussions(prev => prev.map(d => (d.id === id ? { ...d, messages: [], unreadCount: 0 } : d)))
  }

  const deleteMessage = async (discId, msgId) => {
    try {
      await deleteDiscussionMessage(discId, msgId)
    } catch (err) {
      console.warn('Delete message API error:', err)
    }
    setDiscussions(prev => prev.map(d => (d.id === discId ? { ...d, messages: d.messages.filter(m => m.id !== msgId) } : d)))
  }

  const openDiscussionWithCaregiver = async (caregiver) => {
    let recipientId = caregiver?.userId || caregiver?.user_id || caregiver?.booker_id || caregiver?.provider_id || caregiver?.recipientId || caregiver?.id
    const targetName = typeof caregiver === 'string' ? caregiver : (caregiver?.name || caregiver?.fullName || caregiver?.clientName)

    const existing = discussions.find(d => 
      (recipientId && (d.caregiverId === recipientId || d.participantId === recipientId || d.id === recipientId)) ||
      (targetName && d.name && d.name.toLowerCase().includes(targetName.toLowerCase()))
    )

    if (existing) {
      setActiveDiscussionId(existing.id)
      setActiveTab('discussions')
      return
    }

    if (recipientId) {
      try {
        const conv = await getOrCreateDiscussion(recipientId)
        if (conv) {
          setDiscussions(prev => {
            const exists = prev.some(d => d.id === conv.id)
            return exists ? prev : [conv, ...prev]
          })
          setActiveDiscussionId(conv.id)
          setActiveTab('discussions')
          return
        }
      } catch (err) {
        console.warn('Failed to open discussion:', err.message)
      }
    }

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
    } else if (target === 'discussions' && (params?.recipientId || params?.id || params?.caregiver || params?.booker_id || params?.clientName || params?.name)) {
      openDiscussionWithCaregiver(params?.caregiver || params)
    } else if (['payment', 'confirmed', 'home', 'explore', 'discussions', 'requests', 'bookings', 'calendar', 'earnings', 'reviews', 'notifications', 'refer', 'profile', 'overview'].includes(target)) {
      setActiveTab(target)
    } else if (onNavigate) {
      onNavigate(target, params)
    }
  }

  // Calculate unread count
  const unreadNotificationsCount = notifications.filter(n => n.unread && !n.archived).length
  const unreadMessagesCount = (discussions || []).reduce((acc, d) => acc + (Number(d.unreadCount) || 0), 0)

  // Derive active session: any in_progress session, or the earliest confirmed session awaiting arrival check-in
  const activeBooking = (incomingBookings || []).find(b =>
    b.rawStatus === 'in_progress' ||
    b.sessionStatus === 'ARRIVED' ||
    b.sessionStatus === 'AWAITING_CONFIRMATION'
  ) || (incomingBookings || []).find(b =>
    b.rawStatus === 'confirmed'
  ) || null

  // Confirmed bookings list derived from real incoming bookings, excluding active session
  const upcomingBookings = (incomingBookings || [])
    .filter(b => b.id !== activeBooking?.id && b.rawStatus !== 'completed')
    .map(b => ({
      name: b.clientName || b.name || 'Household Client',
      initials: b.initials || 'HC',
      location: b.location || 'Yaoundé / Douala',
      time: b.date ? `${b.date} · ${b.time}` : (b.time || 'Upcoming Shift'),
      status: b.status || 'Confirmed',
      statusColor: b.status === 'In Progress'
        ? 'bg-green-50 text-green-700 border-green-200'
        : b.status === 'Awaiting OTP'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-gray-50 text-gray-700 border-gray-200'
    }))

  const handleVerifyActiveSessionOtp = async () => {
    if (!activeBooking?.sessionId) return
    const code = otp.join('')
    if (code.length < 4) {
      setActiveSessionError('Please enter the complete 6-digit OTP code.')
      return
    }
    setActiveSessionOtpLoading(true)
    setActiveSessionError('')
    setActiveSessionSuccess('')
    try {
      await verifySessionOtp(activeBooking.sessionId, code)
      setActiveSessionSuccess('OTP verified successfully! Session is now in progress.')
      setOtp(['', '', '', '', '', ''])
      if (loadProviderRequests) await loadProviderRequests()
    } catch (err) {
      setActiveSessionError(err.message || 'Invalid OTP code. Please check with the client.')
    } finally {
      setActiveSessionOtpLoading(false)
    }
  }

  const handleProviderMarkJobComplete = async () => {
    if (!activeBooking?.sessionId) return
    setCompletingJob(true)
    setActiveSessionError('')
    try {
      await providerCompleteSession(activeBooking.sessionId)
      setActiveSessionSuccess('Job marked complete! The client has been notified to release escrow.')
      if (loadProviderRequests) await loadProviderRequests()
    } catch (err) {
      setActiveSessionError(err.message || 'Could not complete session.')
    } finally {
      setCompletingJob(false)
    }
  }

  const triggerRequestDetailsModal = (r) => {
    const rateVal = Number(r.pricePerHour) || 50
    const feeVal = Number(r.serviceFee) || 5
    let hoursVal = 2
    if (r.startTime && r.endTime) {
      const [sh, sm] = r.startTime.split(':').map(Number)
      const [eh, em] = r.endTime.split(':').map(Number)
      if (!isNaN(sh) && !isNaN(eh)) {
        const diff = (eh * 60 + (em || 0)) - (sh * 60 + (sm || 0))
        if (diff > 0) hoursVal = Math.round((diff / 60) * 10) / 10
      }
    }
    const sessions = Number(r.totalSessions) || 1
    const subtotalVal = Number(r.subtotal) || (rateVal * hoursVal * sessions)
    const totalVal = Number(r.totalPrice) || (subtotalVal + feeVal)

    setSelectedBookingDetails({
      clientName: r.clientName || 'Household Client',
      initials: r.initials || 'HC',
      specialty: r.specialty || 'Care Service',
      status: r.status || 'Pending Request',
      location: r.location || 'Yaoundé / Douala',
      rate: `${rateVal.toLocaleString()} XAF / hr`,
      hours: String(hoursVal),
      sessionsCount: sessions,
      subtotal: `${subtotalVal.toLocaleString()} XAF`,
      serviceFee: `${feeVal.toLocaleString()} XAF`,
      total: `${totalVal.toLocaleString()} XAF`,
      schedule: [
        { date: r.date || 'Upcoming', time: r.time || 'Scheduled Slot', status: r.status || 'Pending' }
      ],
      payoutInfo: 'Payout released from escrow upon arrival OTP presence confirmation & completion',
      nextSteps: [
        `This is an incoming request from ${r.clientName || 'the client'}.`,
        `You can accept or decline this request using the actions below or in the Requests tab.`,
        `If accepted, the session will be scheduled on ${r.date || 'the agreed date'}.`
      ]
    })
  }

  // Notification tab helpers
  const markAllNotificationsRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
    try {
      await markAllNotificationsReadApi()
    } catch (err) {
      console.warn('markAllNotificationsRead API error:', err.message)
    }
  }

  const archiveAllNotifications = () => {
    setNotifications(notifications.map(n => ({ ...n, archived: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const deleteNotification = async (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
    if (typeof id === 'string' && id.includes('-')) {
      try {
        await deleteNotificationApi(id)
      } catch (err) {
        console.warn('deleteNotification API error:', err.message)
      }
    }
  }

  const readToggleNotification = async (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: !n.unread } : n))
    if (typeof id === 'string' && id.includes('-')) {
      try {
        await markNotificationRead(id)
      } catch (err) {
        console.warn('markNotificationRead API error:', err.message)
      }
    }
  }

  const archiveToggleNotification = async (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, archived: !n.archived } : n))
    if (typeof id === 'string' && id.includes('-')) {
      try {
        await toggleArchiveNotification(id)
      } catch (err) {
        console.warn('toggleArchiveNotification API error:', err.message)
      }
    }
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
        requestsCount={incomingRequests.length}
        bookingsCount={incomingBookings.length}
        unreadMessagesCount={unreadMessagesCount}
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
        {/* ─── Subscription & Approval Status Banner ─── */}
        {subStatus && !subStatus.accountActive && subStatus.approvalStatus === 'approved' && (
          <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border-2 border-[#1E4030]/20 rounded-2xl p-5 shadow-xs animate-fadeIn space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#1E4030] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-[#1C1A17]">Application Approved! Activate Account</h3>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                      Action Required
                    </span>
                  </div>
                  <p className="text-xs text-[#8A7E74] mt-0.5 leading-relaxed">
                    Your provider profile has been verified and approved by the admin. Pay your <span className="font-bold text-[#1E4030]">25 XAF</span> subscription via Campay to activate your account and start receiving client bookings.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  className="flex-1 sm:flex-none bg-[#1E4030] hover:bg-[#152e22] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Proceed to Payment
                </button>
                <button
                  type="button"
                  onClick={loadSubStatus}
                  className="border border-[#E2D9CF] bg-white hover:bg-[#FAF8F5] text-[#1C1A17] text-xs font-semibold px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                  title="Check if payment was confirmed"
                >
                  Verify Payment
                </button>
              </div>
            </div>
            {payMessage && (
              <div className="text-xs bg-white border border-[#E2D9CF] text-[#1E4030] px-3.5 py-2 rounded-xl font-medium">
                {payMessage}
              </div>
            )}
          </div>
        )}

        {subStatus && subStatus.approvalStatus === 'pending' && (
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 shadow-xs animate-fadeIn flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Clock size={18} />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-blue-900">Application Under Review</h4>
              <p className="text-[11px] text-blue-700 mt-0.5">
                Your caregiver credentials are under review by our admin team. Once approved, you will receive a notification here to pay the 25 XAF subscription and activate your profile.
              </p>
            </div>
          </div>
        )}

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
                {activeBooking ? (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#EDF7F2] border border-green-200 flex items-center justify-center text-[#1E4030] shrink-0 shadow-sm">
                        <Key size={20} />
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 bg-[#EDF7F2] text-[#1E4030] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-green-200">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            {activeBooking.rawStatus === 'in_progress' || activeBooking.sessionStatus === 'ARRIVED' ? 'Active Session In Progress' : 'Ready for Arrival Check-in'}
                          </span>
                          <h4 className="font-bold text-sm text-[#1C1A17]">Session with {activeBooking.clientName}</h4>
                        </div>
                        <p className="text-xs text-[#8A7E74] leading-relaxed">
                          {activeBooking.profession || 'Cleaner'} &middot; {activeBooking.time} &middot; {activeBooking.location}
                        </p>
                      </div>
                    </div>

                    {activeSessionError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                        <XCircle size={14} className="shrink-0" />
                        <span>{activeSessionError}</span>
                      </div>
                    )}
                    {activeSessionSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#1E4030] text-xs rounded-xl flex items-center gap-2 font-medium">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>{activeSessionSuccess}</span>
                      </div>
                    )}

                    {/* If session is SCHEDULED and needs arrival OTP */}
                    {activeBooking.sessionStatus === 'SCHEDULED' && activeBooking.rawStatus !== 'in_progress' ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2D9CF]">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-[#1C1A17] block">Enter Client's Arrival OTP</span>
                          <p className="text-[11px] text-[#8A7E74]">Ask {activeBooking.clientName} for their 6-digit code to start the session.</p>
                          <div className="flex items-center gap-2 pt-1">
                            {otp.map((digit, idx) => (
                              <input
                                key={idx}
                                id={`otp-${idx}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleOtpChange(idx, e.target.value, activeTab)}
                                className="w-9 h-9 sm:w-10 sm:h-10 border border-[#E2D9CF] rounded-xl text-center bg-white font-bold text-[#1C1A17] text-sm focus:outline-none focus:border-[#1E4030] shadow-2xs"
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => { setOtp(['', '', '', '', '', '']); setActiveSessionError(''); }}
                            className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-[#FAF8F5] font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            disabled={otp.some(d => !d) || activeSessionOtpLoading}
                            onClick={handleVerifyActiveSessionOtp}
                            className="bg-[#1E4030] hover:bg-[#152e22] disabled:opacity-40 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                          >
                            <Key size={13} />
                            {activeSessionOtpLoading ? 'Verifying...' : 'Verify Arrival OTP'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* If session is ARRIVED or in_progress: Show Mark Job Complete button */
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 bg-[#EDF7F2]/60 p-4 rounded-2xl border border-green-200">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-[#1E4030] flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-[#1E4030]" />
                            Arrival Confirmed &middot; On-Site Work In Progress
                          </span>
                          <p className="text-[11px] text-[#5A5248]">
                            When service is finished, mark the job complete below.
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={completingJob}
                          onClick={handleProviderMarkJobComplete}
                          className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95 whitespace-nowrap disabled:opacity-50"
                        >
                          <CheckCircle2 size={14} />
                          <span>{completingJob ? 'Completing...' : 'Mark Job Complete'}</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-6 text-center space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#E2D9CF] flex items-center justify-center text-[#8A7E74] mx-auto">
                      <Clock size={18} />
                    </div>
                    <p className="text-xs font-bold text-[#1C1A17]">No active session in progress</p>
                    <p className="text-[11px] text-[#8A7E74] max-w-sm mx-auto">
                      When a confirmed booking arrives, your check-in card and arrival OTP verification will appear here automatically.
                    </p>
                  </div>
                )}
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

                {upcomingBookings.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#8A7E74]">
                    No upcoming bookings confirmed yet. Confirmed visits will show here.
                  </div>
                ) : (
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
                )}
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
          userFirstName={getStoredUser()?.firstName || getStoredUser()?.first_name || 'Caregiver'}
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
          openDiscussionWithCaregiver={openDiscussionWithCaregiver}
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
          clientBookings={incomingBookings}
          myBookings={outgoingBookings}
          onNavigate={handleInternalNavigate}
          onMessageClient={(b) => openDiscussionWithCaregiver({ id: b?.booker_id || b?.booker?.id, name: b?.clientName || b?.name, role: 'client' })}
          onMessageProvider={(b) => openDiscussionWithCaregiver({ id: b?.provider_id || b?.provider?.id, name: b?.name, role: 'provider' })}
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
                      const dayEvents = calendarEvents[dayNum] || []
                      const sessionEvent = dayEvents.find(e => e.type === 'session')
                      const hasSession = !!sessionEvent || incomingBookings.some(b => {
                        if (b.rawStatus === 'cancelled' || b.rawStatus === 'declined') return false
                        if (b.startDate) {
                          const d = new Date(b.startDate)
                          if (d.getFullYear() === calYear && (d.getMonth() + 1) === (calMonth + 1) && d.getDate() === dayNum) return true
                        }
                        if (Array.isArray(b.sessions)) {
                          return b.sessions.some(s => {
                            if (s.scheduled_date) {
                              const sd = new Date(s.scheduled_date)
                              return sd.getFullYear() === calYear && (sd.getMonth() + 1) === (calMonth + 1) && sd.getDate() === dayNum
                            }
                            return false
                          })
                        }
                        return false
                      })

                      const status = hasSession ? (sessionEvent?.sessionType === 'recurring' ? 'recurring' : 'booked') : (dayStates[dayNum] || 'available')
                      const isSelected = selectedDay === dayNum

                      let dayStyle = 'bg-white text-[#1C1A17] border border-[#E2D9CF]'
                      let labelText = ''

                      if (status === 'booked') {
                        dayStyle = 'bg-[#1E4030] text-white border border-[#1E4030] shadow-xs'
                        if (sessionEvent && sessionEvent.time) {
                          labelText = sessionEvent.time.split('–')[0]?.trim() || sessionEvent.time.split('—')[0]?.trim() || 'Booked'
                        } else {
                          const mb = incomingBookings.find(b => {
                            if (b.rawStatus === 'cancelled' || b.rawStatus === 'declined') return false
                            if (b.startDate) {
                              const d = new Date(b.startDate)
                              if (d.getFullYear() === calYear && (d.getMonth() + 1) === (calMonth + 1) && d.getDate() === dayNum) return true
                            }
                            return false
                          })
                          labelText = mb?.startTime?.slice(0, 5) || 'Booked'
                        }
                      } else if (status === 'recurring') {
                        dayStyle = 'bg-amber-50 text-amber-900 border border-amber-300'
                        labelText = 'Recurring'
                      } else if (status === 'blocked') {
                        dayStyle = 'bg-red-50/40 text-red-700/70 border border-dashed border-red-300 line-through'
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
              {calendarView === 'week' && (() => {
                const selDate = new Date(calYear, calMonth, selectedDay)
                const selDayOfWeek = selDate.getDay() // 0 = Sun
                const startOfWeek = new Date(calYear, calMonth, selectedDay - selDayOfWeek)
                const weekDays = Array.from({ length: 7 }).map((_, i) => {
                  const d = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i)
                  return {
                    date: d,
                    dayNum: d.getDate(),
                    month: d.getMonth(),
                    year: d.getFullYear(),
                    weekday: d.toLocaleString('default', { weekday: 'short' }).toUpperCase(),
                    label: `${d.toLocaleString('default', { month: 'short' }).toUpperCase()} ${d.getDate()}`
                  }
                })

                const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']

                return (
                  <div className="overflow-x-auto pt-2">
                    <div className="min-w-[640px] grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2 text-center">
                      <div></div>
                      {weekDays.map(wDay => {
                        const isSel = wDay.dayNum === selectedDay && wDay.month === calMonth
                        return (
                          <button
                            key={wDay.label + wDay.weekday}
                            onClick={() => {
                              if (wDay.month === calMonth) setSelectedDay(wDay.dayNum)
                            }}
                            className={`text-[10px] font-bold uppercase py-2 rounded-xl border transition-all cursor-pointer ${
                              isSel
                                ? 'bg-[#1E4030] text-white border-[#1E4030]'
                                : 'text-[#8A7E74] bg-[#FAF8F5] border-[#E2D9CF] hover:bg-white'
                            }`}
                          >
                            <div>{wDay.weekday}</div>
                            <div className="text-[11px] font-extrabold">{wDay.label}</div>
                          </button>
                        )
                      })}

                      {HOURS.map(hour => {
                        return (
                          <div key={hour} className="contents">
                            <div className="text-[10px] font-bold text-[#8A7E74] flex items-center justify-end pr-2.5">
                              {hour}
                            </div>
                            {weekDays.map(wDay => {
                              const inViewMonth = wDay.month === calMonth && wDay.year === calYear
                              const dayState = inViewMonth ? dayStates[wDay.dayNum] : null
                              const isBlocked = dayState === 'blocked'
                              const events = inViewMonth ? (calendarEvents[wDay.dayNum] || []) : []
                              const hasBookingAtHour = events.some(e => e.type === 'session' && e.time && e.time.startsWith(hour.slice(0, 2))) ||
                                incomingBookings.some(b => {
                                  if (b.rawStatus === 'cancelled' || b.rawStatus === 'declined') return false
                                  const d = b.startDate ? new Date(b.startDate) : null
                                  if (d && d.getFullYear() === wDay.year && d.getMonth() === wDay.month && d.getDate() === wDay.dayNum) {
                                    return b.startTime && b.startTime.startsWith(hour.slice(0, 2))
                                  }
                                  return false
                                })

                              if (isBlocked) {
                                return (
                                  <div
                                    key={wDay.label + hour}
                                    onClick={() => { if (inViewMonth) setSelectedDay(wDay.dayNum) }}
                                    className="h-10 bg-red-50/30 border border-dashed border-red-200 rounded-lg flex items-center justify-center text-[8px] text-red-500 font-bold line-through cursor-pointer"
                                  >
                                    Blocked
                                  </div>
                                )
                              }

                              if (hasBookingAtHour) {
                                return (
                                  <div
                                    key={wDay.label + hour}
                                    onClick={() => { if (inViewMonth) setSelectedDay(wDay.dayNum) }}
                                    className="h-10 bg-[#1E4030] border border-[#1E4030] text-white rounded-lg flex items-center justify-center text-[9px] font-bold shadow-xs cursor-pointer"
                                  >
                                    Booked
                                  </div>
                                )
                              }

                              return (
                                <div
                                  key={wDay.label + hour}
                                  onClick={() => { if (inViewMonth) setSelectedDay(wDay.dayNum) }}
                                  className="h-10 bg-white border border-[#E2D9CF] rounded-lg hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                                ></div>
                              )
                            })}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Selected day details panel */}
            <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8A7E74] font-bold tracking-wider uppercase">Selected Day</span>
                  <h3 className="text-base font-extrabold text-[#1C1A17] pt-0.5">
                    {calMonthName.split(' ')[0]} {selectedDay}, {calYear}
                  </h3>
                </div>
                {calendarLoading && (
                  <RefreshCw size={14} className="text-[#8A7E74] animate-spin" />
                )}
              </div>

              {calendarMessage && (
                <div className="text-xs p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {calendarMessage}
                </div>
              )}

              <div className="space-y-4">
                {currentDayStatus === 'booked' && (
                  <div className="space-y-4">
                    <span className="text-[10px] text-[#8A7E74] font-bold tracking-wider uppercase">Confirmed Sessions</span>
                    {selectedDaySessions.length > 0 ? (
                      selectedDaySessions.map((sess, idx) => (
                        <div key={sess.id || idx} className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-3 relative overflow-hidden">
                          <div className="flex items-center gap-1.5 text-[9px] bg-white border border-[#E2D9CF] text-[#1E4030] px-2.5 py-0.5 rounded-full font-bold w-fit">
                            <CheckCircle2 size={11} className="text-green-600" />
                            <span>Locked Session · {sess.status || 'Confirmed'}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#1C1A17]">{sess.clientName}</h4>
                            <p className="text-xs text-[#8A7E74]">{sess.profession}</p>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-[#1C1A17] font-semibold">
                            <Clock size={13} className="text-[#1E4030]" />
                            <span>{sess.time}</span>
                          </div>
                          {sess.location && (
                            <div className="flex items-center gap-1.5 text-xs text-[#8A7E74]">
                              <MapPin size={12} className="text-[#8A7E74]" />
                              <span>{sess.location}</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 text-xs text-[#8A7E74]">
                        Session details loading...
                      </div>
                    )}
                    <p className="text-[11px] text-[#8A7E74] leading-relaxed">
                      Booked sessions are secured in escrow and can only be managed from the Bookings tab.
                    </p>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="w-full border border-[#1E4030] bg-[#1E4030] text-white hover:bg-[#163024] font-bold text-xs py-3 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>View in Bookings Tab</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}

                {currentDayStatus === 'blocked' && (
                  <div className="space-y-4">
                    <div className="bg-red-50/60 border border-red-200 text-red-800 rounded-2xl p-4 text-xs font-medium leading-relaxed flex items-start gap-2.5">
                      <XCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                      <div>
                        <p className="font-bold text-red-900">Day Blocked (Unavailable)</p>
                        <p className="text-[11px] text-red-700/80 mt-0.5">
                          You have marked this day as unavailable. Clients will not be able to book sessions with you on this date.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnblockDay(selectedDay)}
                      disabled={calendarActionLoading}
                      className="w-full border border-emerald-300 bg-emerald-50 text-[#1E4030] hover:bg-emerald-100 font-bold text-xs py-3 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      {calendarActionLoading ? (
                        <RefreshCw size={13} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={14} className="text-emerald-700" />
                      )}
                      <span>Unblock This Day (Mark Available)</span>
                    </button>
                  </div>
                )}

                {currentDayStatus === 'recurring' && (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 space-y-2 relative overflow-hidden">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800">Recurring Schedule</h4>
                      <p className="text-xs text-[#8A7E74] leading-relaxed">
                        Part of a recurring booking series. Manage ongoing series from the Bookings tab.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="w-full border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 font-bold text-xs py-3 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Manage in Bookings</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}

                {currentDayStatus === 'available' && (
                  <div className="space-y-4">
                    <div className="bg-[#EDF7F2]/60 border border-green-200 text-[#1E4030] rounded-2xl p-4 text-xs font-semibold leading-relaxed flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                      <div>
                        <p className="font-bold text-emerald-900">Day Open & Available</p>
                        <p className="text-[11px] text-[#1E4030]/80 mt-0.5 font-normal">
                          No sessions scheduled. This day is currently open for clients to book sessions.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBlockDay(selectedDay)}
                      disabled={calendarActionLoading}
                      className="w-full border border-red-200 bg-white text-red-600 hover:bg-red-50 font-bold text-xs py-3 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      {calendarActionLoading ? (
                        <RefreshCw size={13} className="animate-spin" />
                      ) : (
                        <XCircle size={14} className="text-red-500" />
                      )}
                      <span>Block This Day (Mark Unavailable)</span>
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
                    const isBooked = currentDayStatus === 'booked'
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
              {payoutHistory.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#8A7E74]">
                  No payout transfers processed yet. Completed sessions will show here automatically.
                </div>
              ) : (
                payoutHistory.map((row, idx) => (
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
                ))
              )}
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

          <RatingCard rating={ratingStats.rating} reviewCount={ratingStats.count} />

          <div className="space-y-4">
            {providerReviews.length === 0 ? (
              <div className="bg-white border border-[#E2D9CF] rounded-3xl p-8 text-center space-y-2">
                <p className="text-sm font-semibold text-[#1C1A17]">No client reviews yet</p>
                <p className="text-xs text-[#8A7E74]">Once you complete confirmed sessions, household reviews and ratings will appear here.</p>
              </div>
            ) : (
              providerReviews.map(rev => (
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
              ))
            )}
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

      {/* Subscription Payment Modal */}
      <SubscriptionPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        initialPhone={subStatus?.phone || getStoredUser()?.phone || ''}
        onPaymentSuccess={(updatedStatus) => {
          setSubStatus(updatedStatus)
          loadSubStatus()
        }}
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
