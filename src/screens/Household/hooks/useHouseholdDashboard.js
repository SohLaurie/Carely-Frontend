import { useState } from 'react';
import { CAREGIVERS, SPECIALTY_META } from '../../../data';
import {
  initialRequests,
  initialBookings,
  initialNotifications
} from '../data/mockHouseholdData';

export function useHouseholdDashboard(screenParams) {
  // Sidebar state
  const [activeTab, setActiveTab] = useState(screenParams?.defaultTab || 'explore');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Explore tab states
  const [selectedId, setSelectedId] = useState('1');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterLocation, setFilterLocation] = useState('');
  const [date, setDate] = useState('');
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Budget states
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  // AI recommendation states
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Data states
  const [requests, setRequests] = useState(initialRequests);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  const [bookings, setBookings] = useState(initialBookings);
  const [activeBookingDropdownId, setActiveBookingDropdownId] = useState(null);

  const [notifFilter, setNotifFilter] = useState('all'); // 'all', 'unread', 'archived'
  const [notifications, setNotifications] = useState(initialNotifications);

  // AI Matcher logic
  const handleAiRecommend = () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult(null);

    setTimeout(() => {
      const query = aiPrompt.toLowerCase();
      let matched = CAREGIVERS[0];
      let reason = "";

      if (query.includes('nurse') || query.includes('nursing') || query.includes('medical') || query.includes('elder') || query.includes('senior')) {
        matched = CAREGIVERS.find(c => c.specialty === 'nursing') || CAREGIVERS[0];
        reason = `Based on your request for clinical support, we recommend ${matched.name}. She is a certified nurse with ${matched.experience} years of clinical experience in home care, post-surgical support, and geriatric assistance in Bastos, Yaounde.`;
      } else if (query.includes('baby') || query.includes('child') || query.includes('sit') || query.includes('kid') || query.includes('young') || query.includes('school')) {
        matched = CAREGIVERS.find(c => c.specialty === 'babysitting') || CAREGIVERS[1];
        reason = `Based on your childcare needs, we recommend ${matched.name}. She is a certified early childhood educator with ${matched.experience} years of experience supporting kids of all ages with active learning programs in Douala.`;
      } else if (query.includes('clean') || query.includes('house') || query.includes('cook') || query.includes('domestic') || query.includes('maid') || query.includes('iron')) {
        matched = CAREGIVERS.find(c => c.specialty === 'cleaning') || CAREGIVERS[2];
        reason = `Based on your home care/cleaning needs, we recommend ${matched.name}. She is a meticulous housekeeper with ${matched.experience} years of experience in organizing, laundry/ironing, and eco-friendly cleaning.`;
      } else {
        const locMatch = CAREGIVERS.find(c => query.includes(c.location.split(',')[0].toLowerCase()) || query.includes(c.location.split(',')[1].trim().toLowerCase()));
        if (locMatch) {
          matched = locMatch;
          reason = `We found a top-rated caregiver near your specified location: ${matched.name}. She is located in ${matched.location} and specializes in ${SPECIALTY_META[matched.specialty].label}.`;
        } else {
          matched = CAREGIVERS[0];
          reason = `We matched you with our highest-rated caregiver, ${matched.name}. She is located in ${matched.location} and has verified background references checked.`;
        }
      }

      setAiLoading(false);
      setAiResult({
        matchedId: matched.id,
        message: reason
      });
      setSelectedId(matched.id);
      setFilterSpecialty(matched.specialty);
      setFilterLocation(matched.location.split(',')[0].trim());
    }, 1500);
  };

  // Actions
  const cancelDeleteRequest = (id) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    setActiveDropdownId(null);
  };

  const archiveToggleNotification = (id) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, archived: !item.archived } : item))
    );
  };

  const readToggleNotification = (id) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, unread: !item.unread } : item))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const archiveAllNotifications = () => {
    setNotifications(prev =>
      prev.map(n => {
        if (notifFilter === 'unread' && n.unread) return { ...n, archived: true };
        if (notifFilter === 'all') return { ...n, archived: true };
        return n;
      })
    );
  };

  const clearNotifications = () => {
    if (notifFilter === 'all') {
      setNotifications([]);
    } else if (notifFilter === 'unread') {
      setNotifications(prev => prev.filter(n => !n.unread));
    } else if (notifFilter === 'archived') {
      setNotifications(prev => prev.filter(n => !n.archived));
    }
  };

  // Count unread
  const unreadCount = notifications.filter(n => n.unread && !n.archived).length;

  return {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    selectedId,
    setSelectedId,
    filterSpecialty,
    setFilterSpecialty,
    filterLocation,
    setFilterLocation,
    date,
    setDate,
    showMobileDetail,
    setShowMobileDetail,
    showMobileFilters,
    setShowMobileFilters,
    minBudget,
    setMinBudget,
    maxBudget,
    setMaxBudget,
    availableOnly,
    setAvailableOnly,
    aiPrompt,
    setAiPrompt,
    aiLoading,
    aiResult,
    handleAiRecommend,
    requests,
    activeDropdownId,
    setActiveDropdownId,
    bookings,
    activeBookingDropdownId,
    setActiveBookingDropdownId,
    notifFilter,
    setNotifFilter,
    notifications,
    setNotifications,
    unreadCount,
    cancelDeleteRequest,
    archiveToggleNotification,
    readToggleNotification,
    deleteNotification,
    markAllNotificationsRead,
    archiveAllNotifications,
    clearNotifications
  };
}
