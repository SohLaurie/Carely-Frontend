import { useState } from 'react';
import {
  initialNotifications,
  initialRequests,
  initialDayStates,
  initialWorkingHours
} from '../data/mockDashboardData';

export function useDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // Calendar states
  const [calendarView, setCalendarView] = useState('month');
  const [selectedDay, setSelectedDay] = useState(2);
  const [dayStates, setDayStates] = useState(initialDayStates);
  const [workingHours, setWorkingHours] = useState(initialWorkingHours);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  // Notifications state
  const [notifFilter, setNotifFilter] = useState('all'); // 'all', 'unread', 'archived'
  const [notifications, setNotifications] = useState(initialNotifications);

  // Requests state
  const [incomingRequests, setIncomingRequests] = useState(initialRequests);

  const handleRequestAction = (id, action) => {
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
    handleRequestAction,
    handleOtpChange
  };
}
