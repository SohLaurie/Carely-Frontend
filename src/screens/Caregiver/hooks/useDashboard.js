import { useState, useEffect, useCallback } from 'react';
import {
  initialNotifications,
  initialDayStates,
  initialWorkingHours
} from '../data/mockDashboardData';
import { fetchMyBookings, acceptBooking, declineBooking } from '../../../services/bookingApi';
import { getStoredUser } from '../../../services/api';

export function useDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // Calendar states
  const [calendarView, setCalendarView] = useState('month');
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [dayStates, setDayStates] = useState(initialDayStates);
  const [workingHours, setWorkingHours] = useState(initialWorkingHours);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  // Notifications state
  const [notifFilter, setNotifFilter] = useState('all'); // 'all', 'unread', 'archived'
  const [notifications, setNotifications] = useState(initialNotifications);

  // Requests and Bookings state (No mock data!)
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [incomingBookings, setIncomingBookings] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [outgoingBookings, setOutgoingBookings] = useState([]);

  // Load real incoming and outgoing booking requests
  const loadProviderRequests = useCallback(async () => {
    try {
      const rawList = await fetchMyBookings();
      if (!Array.isArray(rawList)) {
        setIncomingRequests([]);
        setIncomingBookings([]);
        setOutgoingRequests([]);
        setOutgoingBookings([]);
        return;
      }

      const currentUser = getStoredUser();
      const currentUserId = currentUser?.id;

      const mappedIncoming = [];
      const mappedIncomingBookings = [];
      const mappedOutgoing = [];
      const mappedOutgoingBookings = [];

      rawList.forEach(b => {
        const isProvider = !currentUserId || b.provider_id === currentUserId;
        const isBooker = currentUserId && b.booker_id === currentUserId;

        const clientName = b.booker
          ? `${b.booker.firstName || ''} ${b.booker.lastName || ''}`.trim() || 'Household Client'
          : 'Household Client';
        const providerName = b.provider
          ? `${b.provider.firstName || ''} ${b.provider.lastName || ''}`.trim() || 'Care Provider'
          : 'Care Provider';

        const initials = isProvider
          ? `${(b.booker?.firstName?.[0] || 'C')}${(b.booker?.lastName?.[0] || 'H')}`
          : `${(b.provider?.firstName?.[0] || 'P')}${(b.provider?.lastName?.[0] || 'R')}`;

        const timeFormatted = (b.start_time && b.end_time)
          ? `${b.start_time.slice(0, 5)} — ${b.end_time.slice(0, 5)}`
          : '09:00 — 12:00';

        let dateFormatted = b.start_date || 'Upcoming';
        if (b.start_date && typeof b.start_date === 'string' && b.start_date.includes('T')) {
          try {
            dateFormatted = new Date(b.start_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          } catch {}
        }

        const priceFormatted = `${Number(b.total_price || 0).toLocaleString()} XAF`;
        const pricePerHour = Number(b.provider?.pricePerHour || b.provider?.price_per_hour) || 50;
        const subtotal = Number(b.subtotal || 0);
        const serviceFee = Number(b.service_fee || 5);
        const totalPrice = Number(b.total_price || 0);

        const item = {
          id: b.id,
          bookingId: b.id,
          booker_id: b.booker_id,
          provider_id: b.provider_id,
          booker: b.booker,
          provider: b.provider,
          sessionId: b.sessions?.[0]?.id,
          clientName,
          name: isProvider ? clientName : providerName,
          profession: b.provider?.profession || b.provider?.professionOther || (Array.isArray(b.provider?.specialties) ? b.provider?.specialties[0] : b.provider?.specialties) || 'Cleaner',
          specialty: b.provider?.profession || b.provider?.professionOther || (Array.isArray(b.provider?.specialties) ? b.provider?.specialties[0] : b.provider?.specialties) || 'Cleaner',
          timeLeft: 'Respond within 24h',
          date: dateFormatted,
          startDate: b.start_date,
          time: timeFormatted,
          startTime: b.start_time,
          endTime: b.end_time,
          location: b.provider?.location || 'Yaoundé / Douala',
          sessionType: b.session_type === 'once' ? 'One-off session' : `Recurring · ${b.duration_weeks || 1} weeks`,
          bookingType: b.session_type,
          price: priceFormatted,
          pricePerHour,
          subtotal,
          serviceFee,
          totalPrice,
          totalSessions: b.total_sessions || 1,
          durationWeeks: b.duration_weeks || 1,
          initials,
          status: b.status === 'pending' ? 'Pending' : (b.status === 'accepted' ? 'Accepted' : (b.status === 'declined' ? 'Declined' : (b.status === 'confirmed' ? 'Confirmed' : (b.status === 'in_progress' ? 'In Progress' : (b.status === 'completed' ? 'Completed' : b.status))))),
          rawStatus: b.status,
          sessionStatus: b.sessions?.[0]?.status || 'SCHEDULED',
          sessions: b.sessions || [],
          rate: `${pricePerHour.toLocaleString()} XAF/hr`,
          escrowStatus: b.payment_status === 'paid' ? '100% Funded & Secured' : (b.status === 'accepted' ? 'Awaiting Payment' : 'Unpaid'),
          arrivalOtp: b.sessions?.[0]?.otp_code || '—',
          needsOtp: b.status === 'confirmed' && b.sessions?.[0]?.status === 'SCHEDULED',
          summary: b.notes || 'Household booking request submitted via Carely.',
          photo: (isProvider ? b.booker?.photoUrl : b.provider?.photoUrl) || null,
          sentTime: b.created_at ? new Date(b.created_at).toLocaleDateString() : 'Recently'
        };

        if (isProvider) {
          if (b.status === 'pending') {
            mappedIncoming.push(item);
          } else if (['confirmed', 'in_progress', 'completed'].includes(b.status)) {
            mappedIncomingBookings.push(item);
          }
        }

        if (isBooker) {
          if (['pending', 'accepted', 'declined', 'cancelled'].includes(b.status)) {
            mappedOutgoing.push(item);
          } else if (['confirmed', 'in_progress', 'completed'].includes(b.status)) {
            mappedOutgoingBookings.push(item);
          }
        }
      });

      setIncomingRequests(mappedIncoming);
      setIncomingBookings(mappedIncomingBookings);
      setOutgoingRequests(mappedOutgoing);
      setOutgoingBookings(mappedOutgoingBookings);
    } catch (e) {
      console.warn('Could not load provider bookings:', e.message);
      setIncomingRequests([]);
      setIncomingBookings([]);
      setOutgoingRequests([]);
      setOutgoingBookings([]);
    }
  }, []);

  useEffect(() => {
    loadProviderRequests();
    const interval = setInterval(loadProviderRequests, 4000);
    return () => clearInterval(interval);
  }, [loadProviderRequests]);

  const handleRequestAction = async (id, action) => {
    if (typeof id === 'string' && id.includes('-')) {
      try {
        if (action === 'accept') {
          await acceptBooking(id);
        } else if (action === 'decline') {
          await declineBooking(id);
        }
        await loadProviderRequests();
      } catch (err) {
        console.warn(`handleRequestAction ${action} error:`, err.message);
      }
    }
    setIncomingRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleOtpChange = (index, val, activeTabInput) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Focus next element if filled
    if (val && index < 5) {
      const prefix = activeTabInput === 'bookings' ? 'bookings-otp-' : 'otp-';
      const nextInput = document.getElementById(`${prefix}${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return {
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
    setIncomingRequests,
    incomingBookings,
    setIncomingBookings,
    outgoingRequests,
    setOutgoingRequests,
    outgoingBookings,
    setOutgoingBookings,
    loadProviderRequests,
    handleRequestAction,
    handleOtpChange
  };
}
