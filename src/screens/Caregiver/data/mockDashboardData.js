export const initialNotifications = [
  {
    id: 1,
    title: 'New booking request from Kamga Family',
    description: 'Home Nursing · Wed, Nov 6 · 09:00 – 13:00',
    time: 'Just now',
    unread: true,
    type: 'request',
    archived: false
  },
  {
    id: 2,
    title: 'Payout scheduled',
    description: '28,400 XAF will arrive Friday on your MTN account.',
    time: '2h ago',
    unread: true,
    type: 'payout',
    archived: false
  },
  {
    id: 3,
    title: 'New message from Paul M.',
    description: 'Please arrive 15 minutes earlier if possible.',
    time: '5h ago',
    unread: true,
    type: 'message',
    archived: false
  },
  {
    id: 4,
    title: 'New 5-star review',
    description: '"Marie-Claire was warm, punctual and highly professional."',
    time: 'Yesterday',
    unread: true,
    type: 'review',
    archived: false
  },
  {
    id: 5,
    title: 'Reminder: session today',
    description: 'Aïcha K. · 09:00 – 13:00 · Akwa, Douala',
    time: 'Yesterday',
    unread: false,
    type: 'reminder',
    archived: false
  }
];

export const initialRequests = [
  {
    id: 'REQ101',
    clientName: 'The Kamga Family',
    specialty: 'Home Nursing',
    timeLeft: 'Respond within 18h',
    date: 'Wed, Nov 6',
    time: '09:00 – 13:00',
    location: 'Bastos, Yaounde',
    sessionType: 'One-off session',
    initials: 'KF',
    status: 'Pending'
  },
  {
    id: 'REQ102',
    clientName: 'M. Fouda',
    specialty: 'Post-op Care',
    timeLeft: 'Respond within 6h',
    date: 'Starts Nov 8',
    time: 'Recurring',
    location: 'Bonapriso, Douala',
    sessionType: 'Recurring · Mon / Wed / Fri · 3 weeks',
    initials: 'F',
    status: 'Pending'
  },
  {
    id: 'REQ103',
    clientName: 'Mme Onana',
    specialty: 'Elderly Care',
    timeLeft: 'Respond within 1d 4h',
    date: 'Sat, Nov 9',
    time: '14:00 – 18:00',
    location: 'Omnisports, Yaounde',
    sessionType: 'One-off session',
    initials: 'O',
    status: 'Pending'
  }
];

export const upcomingBookings = [
  { name: 'Aïcha K.', initials: 'AK', location: 'Akwa, Douala', time: 'Today · 09:00 – 13:00', status: 'In Progress', statusColor: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Paul M.', initials: 'PM', location: 'Bastos, Yaounde', time: 'Today · 15:00 – 17:00', status: 'Awaiting OTP', statusColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'The Nkomo Family', initials: 'NF', location: 'Bonapriso, Douala', time: 'Thu · 08:00 – 12:00', status: 'Scheduled', statusColor: 'bg-gray-50 text-gray-700 border-gray-200' },
  { name: 'Elise F.', initials: 'EF', location: 'Omnisports, Yaounde', time: 'Fri · 10:00 – 14:00', status: 'Scheduled', statusColor: 'bg-gray-50 text-gray-700 border-gray-200' }
];

export const initialDayStates = {
  2: 'booked',
  4: 'blocked',
  5: 'booked',
  6: 'booked',
  8: 'booked',
  9: 'recurring',
  11: 'recurring',
  13: 'recurring',
  16: 'recurring',
  18: 'recurring',
  20: 'recurring',
  23: 'recurring',
  25: 'recurring',
  27: 'recurring'
};

export const initialWorkingHours = {
  morning: true,
  afternoon: false,
  evening: false,
  overnight: false
};

export const payoutHistory = [
  { amount: '38,400 XAF', date: 'Nov 1, 2026', method: 'MTN Mobile Money' },
  { amount: '42,000 XAF', date: 'Oct 25, 2026', method: 'MTN Mobile Money' },
  { amount: '31,600 XAF', date: 'Oct 18, 2026', method: 'Orange Money' },
  { amount: '28,800 XAF', date: 'Oct 11, 2026', method: 'MTN Mobile Money' }
];

export const caregiverReviews = [
  {
    id: 1,
    author: 'Njoya Family',
    rating: 5,
    date: 'June 2025',
    initials: 'NF',
    comment: 'Marie-Claire cared for my mother with extraordinary patience and gentleness. I recommend her without hesitation. She is punctual, professional, and truly humane.'
  },
  {
    id: 2,
    author: 'Bernadette K.',
    rating: 5,
    date: 'May 2025',
    initials: 'BK',
    comment: "Excellent nurse. She reassured our family during my father's recovery after surgery. Very competent."
  },
  {
    id: 3,
    author: 'Rodrigue M.',
    rating: 4,
    date: 'April 2025',
    initials: 'RM',
    comment: 'Very professional and available. Communication is clear and she explains every procedure. Slightly late on the first appointment but nothing serious.'
  }
];

export const initialDiscussions = [
  {
    id: 'D1',
    clientId: 'AK',
    name: 'Aïcha K. (Diallo)',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&auto=format',
    status: 'online',
    lastSeen: 'Online',
    unreadCount: 1,
    messages: [
      { id: 'm1', sender: 'caregiver', text: 'Hello Madam Aïcha! I received your booking request for Monday.', time: '09:15', date: 'Today', status: 'read' },
      { id: 'm2', sender: 'user', text: 'Good morning Marie-Claire! Yes, my mother will need post-op wound care and vitals check.', time: '09:20', date: 'Today', status: 'read' },
      { id: 'm3', sender: 'caregiver', text: 'Understood. I have all the sterile dressing kits ready. I will arrive at Bastos at 08:50.', time: '09:25', date: 'Today', status: 'read' },
      { id: 'm4', sender: 'user', text: 'Perfect, I will leave the gate unlocked for you.', time: '09:26', date: 'Today', status: 'unread' }
    ]
  },
  {
    id: 'D2',
    clientId: 'PM',
    name: 'Paul M. (Kamga)',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format',
    status: 'offline',
    lastSeen: 'Last seen today at 14:10',
    unreadCount: 0,
    messages: [
      { id: 'f1', sender: 'user', text: 'Hello Marie-Claire, can you please arrive 15 minutes earlier if possible?', time: '13:40', date: 'Today', status: 'read' },
      { id: 'f2', sender: 'caregiver', text: 'Hi Paul! Sure, I will adjust my schedule to arrive early.', time: '14:05', date: 'Today', status: 'read' }
    ]
  },
  {
    id: 'D3',
    clientId: 'NF',
    name: 'Njoya Family',
    photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&auto=format',
    status: 'offline',
    lastSeen: 'Last seen yesterday',
    unreadCount: 0,
    messages: [
      { id: 'e1', sender: 'user', text: 'Hi Marie-Claire, thank you again for the home care last week. My father is doing much better.', time: '11:00', date: 'Yesterday', status: 'read' },
      { id: 'e2', sender: 'caregiver', text: 'I am so glad to hear that! Please let me know if he needs any more support.', time: '11:30', date: 'Yesterday', status: 'read' }
    ]
  },
  {
    id: 'D4',
    clientId: 'support',
    name: 'Carely Support & Concierge',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&auto=format',
    status: 'online',
    lastSeen: 'Always available',
    unreadCount: 0,
    messages: [
      { id: 's1', sender: 'caregiver', text: 'Welcome to Carely! How can our support team assist you today?', time: '08:00', date: 'Aug 20', status: 'read' },
      { id: 's2', sender: 'user', text: 'Is escrow release automatic after the session is validated with OTP?', time: '08:30', date: 'Aug 20', status: 'read' },
      { id: 's3', sender: 'caregiver', text: 'Yes, once the client inputs your arrival OTP and completes the session, your earnings are credited instantly.', time: '08:32', date: 'Aug 20', status: 'read' }
    ]
  }
];

