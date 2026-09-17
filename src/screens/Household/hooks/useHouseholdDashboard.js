import React, { useState, useEffect, useCallback } from 'react';
import { CAREGIVERS, SPECIALTY_META } from '../../../data';
import { apiGet, getStoredUser } from '../../../services/api';
import { fetchMyBookings, cancelBooking } from '../../../services/bookingApi';
import {
  fetchDiscussions,
  fetchMessages,
  sendMessageApi,
  getOrCreateDiscussion,
  deleteDiscussionThread,
  clearDiscussionChat as clearDiscussionChatApi,
  deleteDiscussionMessage
} from '../../../services/discussionApi';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsReadApi,
  toggleArchiveNotification,
  deleteNotificationApi
} from '../../../services/notificationsApi';

function formatNotificationTime(dateStr) {
  if (!dateStr) return 'Recently';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export function useHouseholdDashboard(screenParams) {
  const [activeTab, setActiveTab] = useState(screenParams?.defaultTab || 'home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedId, setSelectedId] = useState('1');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterLocation, setFilterLocation] = useState('');
  const [date, setDate] = useState('');
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const [requests, setRequests] = useState([]);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [activeBookingDropdownId, setActiveBookingDropdownId] = useState(null);

  const [notifFilter, setNotifFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);

  // Discussions State
  const [discussions, setDiscussions] = useState([]);
  const [activeDiscussionId, setActiveDiscussionId] = useState(null);

  const loadDiscussions = useCallback(async () => {
    try {
      const user = getStoredUser();
      const currentUserId = user?.id;
      const list = await fetchDiscussions();
      if (Array.isArray(list)) {
        setDiscussions(prev => {
          return list.map(item => {
            const existing = prev.find(p => p.id === item.id);
            const msgs = existing?.messages || (item.lastMessage ? [{
              id: 'last-' + item.id,
              sender: item.lastSenderId === currentUserId ? 'user' : 'caregiver',
              text: item.lastMessage,
              attachmentUrl: item.lastAttachmentUrl,
              attachmentName: item.lastAttachmentName,
              attachmentType: item.lastAttachmentType,
              status: item.lastMessageStatus || 'delivered',
              time: item.lastMessageTime ? new Date(item.lastMessageTime).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'Recently'
            }] : []);

            return {
              ...item,
              messages: msgs
            };
          });
        });
      }
    } catch (err) {
      console.warn('Failed to load discussions:', err.message);
    }
  }, []);

  useEffect(() => {
    loadDiscussions();
    const interval = setInterval(loadDiscussions, 4000);
    return () => clearInterval(interval);
  }, [loadDiscussions]);

  useEffect(() => {
    if (!activeDiscussionId) return;
    let isMounted = true;

    const loadActiveMessages = async () => {
      try {
        const user = getStoredUser();
        const currentUserId = user?.id;
        const msgs = await fetchMessages(activeDiscussionId);
        if (!isMounted) return;

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
            };
          }
          return d;
        }));
      } catch (err) {
        console.warn('Error fetching active messages:', err.message);
      }
    };

    loadActiveMessages();
    const msgInterval = setInterval(loadActiveMessages, 2500);
    return () => {
      isMounted = false;
      clearInterval(msgInterval);
    };
  }, [activeDiscussionId]);

  const loadBookings = useCallback(async () => {
    try {
      const rawList = await fetchMyBookings();
      if (!Array.isArray(rawList)) return;

      const mapped = rawList.map(b => {
        const providerName = b.provider ? `${b.provider.firstName || ''} ${b.provider.lastName || ''}`.trim() : 'Care Provider';
        const profession = b.provider?.profession || b.provider?.professionOther || (Array.isArray(b.provider?.specialties) ? b.provider?.specialties[0] : b.provider?.specialties) || 'Cleaner';
        const specialty = profession;
        const initials = `${(b.provider?.firstName?.[0] || 'N')}${(b.provider?.lastName?.[0] || 'Z')}`.toUpperCase();
        const photo = b.provider?.photoUrl || null;
        const timeFormatted = (b.start_time && b.end_time) ? `${b.start_time.slice(0, 5)} – ${b.end_time.slice(0, 5)}` : '09:00 – 12:00';
        const priceFormatted = `${Number(b.total_price || 0).toLocaleString()} XAF`;
        const pricePerHour = Number(b.provider?.pricePerHour || b.provider?.price_per_hour) || 50;
        const subtotal = Number(b.subtotal || 0);
        const serviceFee = Number(b.service_fee || 5);
        const totalPrice = Number(b.total_price || 0);

        let displayStatus = 'Pending';
        if (b.status === 'accepted') displayStatus = 'Accepted';
        else if (b.status === 'declined') displayStatus = 'Declined';
        else if (b.status === 'confirmed' || b.status === 'in_progress') displayStatus = 'Confirmed';
        else if (b.status === 'completed') displayStatus = 'Completed';
        else if (b.status === 'cancelled') displayStatus = 'Cancelled';

        let dateStr = b.start_date || 'Upcoming';
        if (b.start_date && typeof b.start_date === 'string' && b.start_date.includes('T')) {
          try {
            dateStr = new Date(b.start_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          } catch {}
        }

        return {
          id: b.id,
          name: providerName,
          profession,
          specialty,
          initials,
          date: dateStr,
          time: timeFormatted,
          startTime: b.start_time,
          endTime: b.end_time,
          status: displayStatus,
          rawStatus: b.status,
          timeSent: b.created_at ? new Date(b.created_at).toLocaleDateString() : 'Recently',
          location: b.provider?.location || 'Yaoundé / Douala',
          pricePerHour,
          subtotal,
          serviceFee,
          totalPrice,
          totalPriceFormatted: priceFormatted,
          totalSessions: b.total_sessions || 1,
          durationWeeks: b.duration_weeks || 1,
          patientNotes: b.notes || 'Carely verified booking request',
          photo,
          sessions: b.sessions || [],
          bookingType: b.session_type,
          arrivalOtp: b.sessions?.[0]?.otp_code || '—',
          escrowStatus: b.payment_status === 'paid' ? 'Held in Escrow' : (b.payment_status === 'refunded' ? 'Refunded' : 'Payment Pending'),
          caregiver: {
            id: b.provider_id,
            name: providerName,
            photo,
            initials,
            profession,
            specialty,
            pricePerHour,
            rating: b.provider?.rating || 5.0,
          }
        };
      });

      const reqs = mapped.filter(m => ['pending', 'accepted', 'declined', 'cancelled'].includes(m.rawStatus));
      const bks = mapped.filter(m => ['confirmed', 'in_progress', 'completed'].includes(m.rawStatus));

      setRequests(reqs);
      setBookings(bks);
    } catch (e) {
      console.warn('Could not load real bookings, leaving empty:', e.message);
      setRequests([]);
      setBookings([]);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await fetchNotifications();
      const list = data?.notifications || [];
      if (Array.isArray(list)) {
        setNotifications(list.map(n => ({
          id: n.id,
          type: n.type || 'system',
          title: n.title,
          text: n.body || '',
          description: n.body || '',
          metadata: n.metadata || null,
          unread: !n.is_read,
          archived: !!n.is_archived,
          time: formatNotificationTime(n.created_at),
          createdAt: n.created_at,
          replied: false,
          recipient: n.metadata?.recipient || ''
        })));
      }
    } catch (e) {
      console.warn('Could not load notifications:', e.message);
    }
  }, []);

  // Fetch real bookings and notifications on mount and on poll
  useEffect(() => {
    loadBookings();
    loadNotifications();
    const interval = setInterval(() => {
      loadBookings();
      loadNotifications();
    }, 4000);
    return () => clearInterval(interval);
  }, [loadBookings, loadNotifications]);

  const handleAiRecommend = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult(null);

    try {
      const data = await apiGet('/providers');
      const list = (data?.providers || []).filter(p => p.approval_status === 'approved' && p.subscription_paid);
      const query = aiPrompt.toLowerCase();

      let matched = list[0];
      if (list.length > 0) {
        const found = list.find(p => {
          const prof = (p.profession || '').toLowerCase();
          const spec = (Array.isArray(p.specialties) ? p.specialties.join(' ') : String(p.specialties || '')).toLowerCase();
          const loc = (p.location || p.city || '').toLowerCase();
          const bio = (p.bio || '').toLowerCase();
          return query.split(' ').some(w => w.length > 3 && (prof.includes(w) || spec.includes(w) || loc.includes(w) || bio.includes(w)));
        });
        if (found) matched = found;
      }

      if (matched) {
        const matchedName = `${matched.first_name || ''} ${matched.last_name || ''}`.trim() || 'Verified Provider';
        const matchedProf = matched.profession || 'Care Provider';
        const matchedLoc = matched.location || matched.city || 'Yaoundé';
        const matchedExp = matched.experience || (matched.experience_yrs ? `${matched.experience_yrs} yrs` : 'experienced');
        const reason = `Based on your request, we recommend ${matchedName} (${matchedProf} in ${matchedLoc}, ${matchedExp} experience). Verified and registered on Carely.`;

        setAiLoading(false);
        setAiResult({ matchedId: matched.id, message: reason });
        setSelectedId(matched.id);
        if (matched.specialties?.[0] || matched.profession) {
          setFilterSpecialty((matched.specialties?.[0] || matched.profession).toLowerCase().replace(/\s+/g, '_'));
        }
        if (matched.location || matched.city) {
          setFilterLocation(matched.location || matched.city);
        }
      } else {
        setAiLoading(false);
        setAiResult({ message: 'No registered providers match your query. Explore all verified providers below.' });
      }
    } catch (err) {
      setAiLoading(false);
      setAiResult({ message: 'Unable to match right now. Please explore registered providers below.' });
    }
  };

  const cancelDeleteRequest = async (id) => {
    if (typeof id === 'string' && id.includes('-')) {
      try {
        await cancelBooking(id);
      } catch (err) {
        console.warn('cancelBooking API error:', err.message);
      }
    }
    setRequests(prev => prev.filter(req => req.id !== id));
    setActiveDropdownId(null);
  };

  const archiveToggleNotification = async (id) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, archived: !item.archived } : item))
    );
    if (typeof id === 'string' && id.includes('-')) {
      try {
        await toggleArchiveNotification(id);
      } catch (err) {
        console.warn('toggleArchiveNotification API error:', err.message);
      }
    }
  };

  const readToggleNotification = async (id) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, unread: !item.unread } : item))
    );
    if (typeof id === 'string' && id.includes('-')) {
      try {
        await markNotificationRead(id);
      } catch (err) {
        console.warn('markNotificationRead API error:', err.message);
      }
    }
  };

  const deleteNotification = async (id) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
    if (typeof id === 'string' && id.includes('-')) {
      try {
        await deleteNotificationApi(id);
      } catch (err) {
        console.warn('deleteNotification API error:', err.message);
      }
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    try {
      await markAllNotificationsReadApi();
    } catch (err) {
      console.warn('markAllNotificationsRead API error:', err.message);
    }
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

  const addMessageNotification = ({ recipient, subject, body }) => {
    const newMsg = {
      id: Date.now(),
      type: 'message',
      title: subject || 'New Message',
      text: body || '',
      recipient: recipient || '',
      time: 'Just now',
      unread: false,
      archived: false,
      replied: false,
      sent: true,
    };
    setNotifications(prev => [newMsg, ...prev]);
  };

  const markAsReplied = (id) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, replied: true } : item))
    );
  };

  // Discussions actions
  const sendMessage = async (discussionId, text, attachmentData = null) => {
    if (!text?.trim() && !attachmentData) return;
    const user = getStoredUser();
    const currentUserId = user?.id;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false });

    const tempId = 'temp-' + Date.now();
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
    };

    setDiscussions(prev => prev.map(d => {
      if (d.id === discussionId) {
        return {
          ...d,
          lastMessage: text ? text.trim() : (attachmentData?.attachmentName || 'Attachment'),
          lastMessageTime: now.toISOString(),
          messages: [...(d.messages || []), optimisticMsg]
        };
      }
      return d;
    }));

    try {
      const payload = {
        text: text ? text.trim() : '',
        attachmentUrl: attachmentData?.attachmentUrl,
        attachmentName: attachmentData?.attachmentName,
        attachmentType: attachmentData?.attachmentType,
        attachmentSize: attachmentData?.attachmentSize,
        attachmentMime: attachmentData?.attachmentMime
      };
      const res = await sendMessageApi(discussionId, payload);
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
            };
          }
          return d;
        }));
      }
    } catch (err) {
      console.error('Failed to send message via API:', err);
    }
  };

  const deleteDiscussion = async (discussionId) => {
    try {
      await deleteDiscussionThread(discussionId);
    } catch (err) {
      console.warn('Delete discussion API error:', err);
    }
    setDiscussions(prev => prev.filter(d => d.id !== discussionId));
    if (activeDiscussionId === discussionId) {
      setActiveDiscussionId(null);
    }
  };

  const clearDiscussionChat = async (discussionId) => {
    try {
      await clearDiscussionChatApi(discussionId);
    } catch (err) {
      console.warn('Clear chat API error:', err);
    }
    setDiscussions(prev =>
      prev.map(d => {
        if (d.id === discussionId) {
          return { ...d, messages: [], unreadCount: 0 };
        }
        return d;
      })
    );
  };

  const deleteMessage = async (discussionId, messageId) => {
    try {
      await deleteDiscussionMessage(discussionId, messageId);
    } catch (err) {
      console.warn('Delete message API error:', err);
    }
    setDiscussions(prev =>
      prev.map(d => {
        if (d.id === discussionId) {
          return {
            ...d,
            messages: (d.messages || []).filter(m => m.id !== messageId)
          };
        }
        return d;
      })
    );
  };

  const openDiscussionWithCaregiver = async (caregiverOrName) => {
    let recipientId = caregiverOrName?.userId || caregiverOrName?.user_id || caregiverOrName?.id;
    const targetName = typeof caregiverOrName === 'string' ? caregiverOrName : (caregiverOrName?.name || caregiverOrName?.fullName);

    // If exists in discussions list already
    const existing = discussions.find(d => 
      (recipientId && d.caregiverId === recipientId) ||
      (targetName && d.name && d.name.toLowerCase().includes(targetName.toLowerCase()))
    );

    if (existing) {
      setActiveDiscussionId(existing.id);
      setActiveTab('discussions');
      return;
    }

    // Lookup provider user_id if needed
    if (!recipientId || typeof recipientId !== 'string' || !recipientId.includes('-')) {
      try {
        const data = await apiGet('/providers');
        const list = data?.providers || [];
        const matched = list.find(p => {
          const pName = `${p.first_name || ''} ${p.last_name || ''}`.trim().toLowerCase();
          return targetName && (pName.includes(targetName.toLowerCase()) || targetName.toLowerCase().includes(pName));
        });
        if (matched) {
          recipientId = matched.user_id || matched.id;
        }
      } catch {}
    }

    if (recipientId) {
      try {
        const conv = await getOrCreateDiscussion(recipientId);
        if (conv) {
          setDiscussions(prev => {
            const exists = prev.some(d => d.id === conv.id);
            return exists ? prev : [conv, ...prev];
          });
          setActiveDiscussionId(conv.id);
          setActiveTab('discussions');
          return;
        }
      } catch (err) {
        console.warn('Failed to get or create discussion:', err.message);
      }
    }

    setActiveTab('discussions');
  };

  const unreadCount = notifications.filter(n => n.unread && !n.archived).length;
  const unreadMessagesCount = discussions.reduce((acc, d) => acc + (d.unreadCount || 0), 0);

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
    setRequests,
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
    clearNotifications,
    addMessageNotification,
    markAsReplied,
    // Discussions
    discussions,
    setDiscussions,
    activeDiscussionId,
    setActiveDiscussionId,
    sendMessage,
    deleteDiscussion,
    clearDiscussionChat,
    deleteMessage,
    openDiscussionWithCaregiver,
    unreadMessagesCount,
    loadBookings
  };
}
