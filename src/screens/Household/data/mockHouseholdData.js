export const initialRequests = [
  { 
    id: 'R1', 
    name: 'Marie-Claire Nkomo', 
    specialty: 'nursing', 
    date: 'Mon Aug 4', 
    time: '09:00 – 12:00', 
    status: 'Accepted', 
    timeSent: 'Sent 2h ago', 
    location: 'Bastos, Yaounde', 
    pricePerHour: 3500,
    totalPrice: '10,500 XAF',
    patientNotes: 'Elderly patient recovery assistance following knee surgery. Morning medication administration and light physical support.',
    photo: 'https://images.unsplash.com/photo-1627328543975-3f0ba8a823b0?w=400&h=400&fit=crop&auto=format' 
  },
  { 
    id: 'R2', 
    name: 'Fatima Bello', 
    specialty: 'babysitting', 
    date: 'Wed Jul 30', 
    time: '10:00 – 14:00', 
    status: 'Pending', 
    timeSent: 'Sent Yesterday', 
    location: 'Akwa, Douala', 
    pricePerHour: 2800,
    totalPrice: '11,200 XAF',
    patientNotes: 'Caring for two children (3 and 6 years old). Preparing light lunch and educational play in the afternoon.',
    photo: 'https://images.unsplash.com/photo-1579255565889-2ac16e9b2950?w=400&h=400&fit=crop&auto=format' 
  },
  { 
    id: 'R3', 
    name: 'Elise Fouda', 
    specialty: 'cleaning', 
    date: 'Fri Aug 1', 
    time: '09:00 – 12:00', 
    status: 'Declined', 
    timeSent: 'Sent 3 days ago', 
    location: 'Omnisports, Yaounde', 
    pricePerHour: 2200,
    totalPrice: '6,600 XAF',
    patientNotes: 'Deep housekeeping and window sanitizing for 3-bedroom home.',
    photo: 'https://images.unsplash.com/photo-1677195063105-276fd4b95b21?w=400&h=400&fit=crop&auto=format' 
  }
];

export const initialBookings = [
  { 
    id: 'B1', 
    name: 'Marie-Claire Nkomo', 
    specialty: 'nursing', 
    date: 'Mon Aug 4', 
    time: '09:00 – 12:00', 
    status: 'Confirmed', 
    photo: 'https://images.unsplash.com/photo-1627328543975-3f0ba8a823b0?w=400&h=400&fit=crop&auto=format', 
    location: 'Bastos, Yaounde',
    pricePerHour: 3500,
    totalPrice: '10,500 XAF'
  }
];

export const initialNotifications = [
  { 
    id: 'N1', 
    title: 'Request Accepted', 
    text: 'Marie-Claire accepted your nursing request for Mon Aug 4.', 
    time: '2 hours ago', 
    unread: true, 
    archived: false, 
    type: 'accepted',
    caregiverId: '1',
    recipient: 'Marie-Claire Nkomo'
  },
  { 
    id: 'N2', 
    title: 'Payment Confirmed', 
    text: 'Your escrow payment of 11,500 XAF is secured in Carely Escrow.', 
    time: '1 day ago', 
    unread: false, 
    archived: false, 
    type: 'payment',
    caregiverId: '1',
    recipient: 'Carely Billing'
  },
  { 
    id: 'N3', 
    title: 'Welcome to Carely', 
    text: 'Start exploring verified caregivers in Yaounde and Douala.', 
    time: '3 days ago', 
    unread: false, 
    archived: false, 
    type: 'welcome',
    caregiverId: 'support',
    recipient: 'Carely Support'
  }
];

export const initialDiscussions = [
  {
    id: 'D1',
    caregiverId: '1',
    name: 'Marie-Claire Nkomo',
    specialty: 'nursing',
    photo: 'https://images.unsplash.com/photo-1627328543975-3f0ba8a823b0?w=400&h=400&fit=crop&auto=format',
    status: 'online',
    lastSeen: 'Online',
    unreadCount: 1,
    messages: [
      { id: 'm1', sender: 'caregiver', text: 'Hello Madam Aïcha! I received your booking request for Monday.', time: '09:15', date: 'Today', status: 'read' },
      { id: 'm2', sender: 'user', text: 'Good morning Marie-Claire! Yes, my mother will need post-op wound care and vitals check.', time: '09:20', date: 'Today', status: 'read' },
      { id: 'm3', sender: 'caregiver', text: 'Understood. I have all the sterile dressing kits ready. I will arrive at Bastos at 08:50.', time: '09:25', date: 'Today', status: 'read' },
      { id: 'm4', sender: 'caregiver', text: 'Please make sure her medical prescription booklet is on the table.', time: '09:26', date: 'Today', status: 'delivered' }
    ]
  },
  {
    id: 'D2',
    caregiverId: '2',
    name: 'Fatima Bello',
    specialty: 'babysitting',
    photo: 'https://images.unsplash.com/photo-1579255565889-2ac16e9b2950?w=400&h=400&fit=crop&auto=format',
    status: 'offline',
    lastSeen: 'Last seen today at 14:10',
    unreadCount: 0,
    messages: [
      { id: 'f1', sender: 'user', text: 'Hello Fatima, do you have availability this Wednesday for 4 hours?', time: '13:40', date: 'Today', status: 'read' },
      { id: 'f2', sender: 'caregiver', text: 'Hi Aïcha! Yes, I am free from 10:00 to 14:00 in Akwa. I can bring learning flashcards for the little one!', time: '14:05', date: 'Today', status: 'read' },
      { id: 'f3', sender: 'user', text: 'That would be great! I just sent the request.', time: '14:08', date: 'Today', status: 'read' }
    ]
  },
  {
    id: 'D3',
    caregiverId: '3',
    name: 'Elise Fouda',
    specialty: 'cleaning',
    photo: 'https://images.unsplash.com/photo-1677195063105-276fd4b95b21?w=400&h=400&fit=crop&auto=format',
    status: 'offline',
    lastSeen: 'Last seen yesterday',
    unreadCount: 0,
    messages: [
      { id: 'e1', sender: 'user', text: 'Hi Elise, thank you for checking the schedule for Friday.', time: '11:00', date: 'Yesterday', status: 'read' },
      { id: 'e2', sender: 'caregiver', text: 'Hello! Unfortunately I am booked in Omnisports on Friday morning, but Saturday is completely open.', time: '11:30', date: 'Yesterday', status: 'read' }
    ]
  },
  {
    id: 'D4',
    caregiverId: 'support',
    name: 'Carely Support & Concierge',
    specialty: 'admin',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&auto=format',
    status: 'online',
    lastSeen: 'Always available',
    unreadCount: 0,
    messages: [
      { id: 's1', sender: 'caregiver', text: 'Welcome to Carely! How can our support team assist your family today?', time: '08:00', date: 'Aug 20', status: 'read' },
      { id: 's2', sender: 'user', text: 'Thank you! Is escrow release automatic after the session?', time: '08:30', date: 'Aug 20', status: 'read' },
      { id: 's3', sender: 'caregiver', text: 'Yes! Funds are held safely in escrow until you validate the 4-digit arrival OTP and confirm completion.', time: '08:32', date: 'Aug 20', status: 'read' }
    ]
  }
];
