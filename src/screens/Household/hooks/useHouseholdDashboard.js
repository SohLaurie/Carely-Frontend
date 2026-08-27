import { useState } from 'react';
import { CAREGIVERS, SPECIALTY_META } from '../../../data';
import {
  initialRequests,
  initialBookings,
  initialNotifications,
  initialDiscussions
} from '../data/mockHouseholdData';

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

  const [requests, setRequests] = useState(initialRequests);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  const [bookings, setBookings] = useState(initialBookings);
  const [activeBookingDropdownId, setActiveBookingDropdownId] = useState(null);

  const [notifFilter, setNotifFilter] = useState('all');
  const [notifications, setNotifications] = useState(initialNotifications);

  // Discussions State
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [activeDiscussionId, setActiveDiscussionId] = useState(null);

  const handleAiRecommend = () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult(null);

    setTimeout(() => {
      const query = aiPrompt.toLowerCase();
      let matched = CAREGIVERS[0];
      let reason = '';

      if (query.includes('nurse') || query.includes('nursing') || query.includes('medical') || query.includes('elder') || query.includes('senior')) {
        matched = CAREGIVERS.find(c => c.specialty === 'nursing') || CAREGIVERS[0];
        reason = `Based on your request for clinical support, we recommend ${matched.name}. She is a certified nurse with ${matched.experience} years of clinical experience in home care, post-surgical support, and geriatric assistance in Bastos, Yaounde.`;
      } else if (query.includes('baby') || query.includes('child') || query.includes('sit') || query.includes('kid') || query.includes('young') || query.includes('school')) {
        matched = CAREGIVERS.find(c => c.specialty === 'babysitting') || CAREGIVERS[1];
        reason = `Based on your childcare needs, we recommend ${matched.name}. She is a certified early childhood educator with ${matched.experience} years of experience supporting kids of all ages with active learning programs in Douala.`;
      } else if (query.includes('clean') || query.includes('house') || query.includes('cook') || query.includes('domestic') || query.includes('maid') || query.includes('iron') || query.includes('laundry')) {
        matched = CAREGIVERS.find(c => c.specialty === 'cleaning') || CAREGIVERS[2];
        reason = `Based on your home care/cleaning needs, we recommend ${matched.name}. She is a meticulous housekeeper with ${matched.experience} years of experience in organizing, laundry/ironing, and eco-friendly cleaning.`;
      } else if (query.includes('garden') || query.includes('lawn') || query.includes('yard') || query.includes('tree') || query.includes('landscape')) {
        matched = CAREGIVERS.find(c => c.specialty === 'gardening') || CAREGIVERS[4] || CAREGIVERS[0];
        reason = `Based on your gardening request, we recommend ${matched.name}. He has ${matched.experience} years of professional landscaping experience in Yaounde.`;
      } else if (query.includes('pet') || query.includes('dog') || query.includes('cat') || query.includes('animal')) {
        matched = CAREGIVERS.find(c => c.specialty === 'pet_care') || CAREGIVERS[5] || CAREGIVERS[0];
        reason = `For pet care, we recommend ${matched.name}. She is a certified vet assistant with ${matched.experience} years of animal sitting experience.`;
      } else if (query.includes('cook') || query.includes('food') || query.includes('meal') || query.includes('kitchen') || query.includes('chef')) {
        matched = CAREGIVERS.find(c => c.specialty === 'cooking') || CAREGIVERS[6] || CAREGIVERS[0];
        reason = `For family nutrition and home cooking, we recommend ${matched.name}. She has ${matched.experience} years of professional culinary experience in Douala.`;
      } else {
        const locMatch = CAREGIVERS.find(c => query.includes(c.location.split(',')[0].toLowerCase()) || query.includes(c.location.split(',')[1].trim().toLowerCase()));
        if (locMatch) {
          matched = locMatch;
          reason = `We found a top-rated caregiver near your specified location: ${matched.name}. She is located in ${matched.location} and specializes in ${SPECIALTY_META[matched.specialty]?.label || 'Care'}.`;
        } else {
          matched = CAREGIVERS[0];
          reason = `We matched you with our highest-rated caregiver, ${matched.name}. She is located in ${matched.location} and has verified background references checked.`;
        }
      }

      setAiLoading(false);
      setAiResult({ matchedId: matched.id, message: reason });
      setSelectedId(matched.id);
      setFilterSpecialty(matched.specialty);
      setFilterLocation(matched.location.split(',')[0].trim());
    }, 1500);
  };

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
  const sendMessage = (discussionId, text) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const userMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      time: timeStr,
      date: 'Today',
      status: 'read'
    };

    setDiscussions(prev =>
      prev.map(d => {
        if (d.id === discussionId) {
          return {
            ...d,
            messages: [...d.messages, userMessage],
            unreadCount: 0
          };
        }
        return d;
      })
    );

    setTimeout(() => {
      const caregiverReplies = [
        "Thank you for the update! I have noted that down.",
        "Perfect! I will be there punctually. Looking forward to assisting your family.",
        "Understood. Please let me know if there are any specific medical or house guidelines to prepare.",
        "Got it! See you then. Have a wonderful day!"
      ];
      const randomReply = caregiverReplies[Math.floor(Math.random() * caregiverReplies.length)];
      const replyTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      const botMessage = {
        id: 'msg-reply-' + Date.now(),
        sender: 'caregiver',
        text: randomReply,
        time: replyTime,
        date: 'Today',
        status: 'read'
      };

      setDiscussions(prev =>
        prev.map(d => {
          if (d.id === discussionId) {
            return {
              ...d,
              messages: [...d.messages, botMessage]
            };
          }
          return d;
        })
      );
    }, 1200);
  };

  const deleteDiscussion = (discussionId) => {
    setDiscussions(prev => prev.filter(d => d.id !== discussionId));
    if (activeDiscussionId === discussionId) {
      setActiveDiscussionId(null);
    }
  };

  const clearDiscussionChat = (discussionId) => {
    setDiscussions(prev =>
      prev.map(d => {
        if (d.id === discussionId) {
          return { ...d, messages: [], unreadCount: 0 };
        }
        return d;
      })
    );
  };

  const deleteMessage = (discussionId, messageId) => {
    setDiscussions(prev =>
      prev.map(d => {
        if (d.id === discussionId) {
          return {
            ...d,
            messages: d.messages.filter(m => m.id !== messageId)
          };
        }
        return d;
      })
    );
  };

  const openDiscussionWithCaregiver = (caregiverOrName) => {
    const targetName = typeof caregiverOrName === 'string' ? caregiverOrName : caregiverOrName?.name;
    const existing = discussions.find(d => 
      (targetName && d.name.toLowerCase().includes(targetName.toLowerCase())) ||
      (caregiverOrName?.id && d.caregiverId === caregiverOrName.id)
    );

    if (existing) {
      setActiveDiscussionId(existing.id);
    } else {
      const newD = {
        id: 'D-' + Date.now(),
        caregiverId: caregiverOrName?.id || 'new',
        name: targetName || 'Caregiver',
        specialty: caregiverOrName?.specialty || 'nursing',
        photo: caregiverOrName?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&auto=format',
        status: 'online',
        lastSeen: 'Online',
        unreadCount: 0,
        messages: [
          { id: 'init-1', sender: 'caregiver', text: `Hello! I am ${targetName || 'your caregiver'}. How can I help you today?`, time: 'Just now', date: 'Today', status: 'read' }
        ]
      };
      setDiscussions(prev => [newD, ...prev]);
      setActiveDiscussionId(newD.id);
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
    unreadMessagesCount
  };
}
