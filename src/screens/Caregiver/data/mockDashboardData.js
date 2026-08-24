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
