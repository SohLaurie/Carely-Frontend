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
    location: 'Bastos, Yaounde' 
  }
];

export const initialNotifications = [
  { 
    id: 'N1', 
    title: 'Request Accepted', 
    text: 'Marie-Claire accepted your nursing request.', 
    time: '2 hours ago', 
    unread: true, 
    archived: false, 
    type: 'accepted' 
  },
  { 
    id: 'N2', 
    title: 'Payment Confirmed', 
    text: 'Your escrow payment of 11,500 XAF is secured.', 
    time: '1 day ago', 
    unread: false, 
    archived: false, 
    type: 'payment' 
  },
  { 
    id: 'N3', 
    title: 'Welcome to Carely', 
    text: 'Start exploring verified caregivers in Yaounde and Douala.', 
    time: '3 days ago', 
    unread: false, 
    archived: false, 
    type: 'welcome' 
  }
];
