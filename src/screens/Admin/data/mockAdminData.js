export const initialApplications = [
  {
    id: 'APP101',
    name: 'Marie-Claire Nkomo',
    category: 'Home Nursing',
    location: 'Yaounde',
    idVerified: true,
    certVerified: true,
    refVerified: false,
    submissionTime: 'Mar 16, 2026 · 07:52',
    waitingTime: '8h',
    email: 'marieclaire.n@gmail.com',
    phone: '+237 699 11 22 33',
    bio: 'Registered Nurse (RN) with 6 years of hospital ICU experience. Transitioned to home geriatric and palliative care. Specialized in elderly care, medication management, and post-op rehabilitation.',
    initials: 'MN',
    dob: 'Mar 15, 1990',
    gender: 'Female',
    experience: '6 years',
    availability: 'Mon–Sat, 8am–6pm',
    serviceRadius: '15 km',
    skills: ['Geriatric Care', 'Medication Admin', 'Wound Care', 'Palliative Support']
  },
  {
    id: 'APP102',
    name: 'Florence Etonde',
    category: 'Home Nursing',
    location: 'Yaounde',
    idVerified: true,
    certVerified: true,
    refVerified: true,
    submissionTime: 'Mar 16, 2026 · 07:52',
    waitingTime: '8h',
    email: 'florence.e@gmail.com',
    phone: '+237 699 11 22 33',
    bio: 'Registered Nurse (RN) with 6 years of hospital ICU experience. Transitioned to home geriatric and palliative care.',
    initials: 'FE',
    dob: 'Jan 22, 1989',
    gender: 'Female',
    experience: '7 years',
    availability: 'Mon–Fri, 8am–5pm',
    serviceRadius: '20 km',
    skills: ['Elderly Care', 'Physical Assistance', 'Hygiene Support', 'Meal Prep']
  },
  {
    id: 'APP103',
    name: 'Patrick Nguema',
    category: 'Elderly Care',
    location: 'Douala',
    idVerified: true,
    certVerified: false,
    refVerified: false,
    submissionTime: 'Mar 15, 2026 · 18:31',
    waitingTime: '21h',
    email: 'patrick.n@gmail.com',
    phone: '+237 655 44 33 22',
    bio: 'Compassionate caregiver with specialized training in Alzheimer patient mobility and daily assistance.',
    initials: 'PN',
    dob: 'May 04, 1992',
    gender: 'Male',
    experience: '4 years',
    availability: 'Mon–Sat, 9am–6pm',
    serviceRadius: '10 km',
    skills: ['Mobility Support', 'Alzheimer Care', 'Companionship']
  },
  {
    id: 'APP104',
    name: 'Aïssatou Bello',
    category: 'Babysitting',
    location: 'Yaounde',
    idVerified: true,
    certVerified: true,
    refVerified: false,
    submissionTime: 'Mar 14, 2026 · 14:22',
    waitingTime: '2d 4h',
    email: 'aissatou.b@gmail.com',
    phone: '+237 688 55 66 77',
    bio: 'Nanny with certification in early childhood education. Certified in pediatric first-aid.',
    initials: 'AB',
    dob: 'Sep 10, 1994',
    gender: 'Female',
    experience: '5 years',
    availability: 'Mon–Fri, 7am–5pm',
    serviceRadius: '15 km',
    skills: ['Early Child Education', 'Pediatric First Aid', 'Infant Care']
  },
  {
    id: 'APP105',
    name: 'Jean-Pierre Owona',
    category: 'Post-op Care',
    location: 'Douala',
    idVerified: false,
    certVerified: true,
    refVerified: false,
    submissionTime: 'Mar 14, 2026 · 10:15',
    waitingTime: '2d 9h',
    email: 'jeanpierre.o@gmail.com',
    phone: '+237 677 22 33 44',
    bio: 'Physiotherapist assistant providing home rehabilitation and post-op care services.',
    initials: 'JO',
    dob: 'Nov 30, 1991',
    gender: 'Male',
    experience: '6 years',
    availability: 'Mon–Sat, 8am–7pm',
    serviceRadius: '25 km',
    skills: ['Rehabilitation Assist', 'Post-Surgical Care', 'Pain Management']
  }
];

export const initialDisputes = [
  {
    id: 'BK-20460',
    title: 'The Kamga Family vs Marie-Claire Nkomo',
    description: 'Caregiver arrived 45 min late; household refusing payment.',
    escrowAmount: '14,000 XAF',
    raisedTime: 'Raised 20h ago',
    timeLeft: '4h left',
    status: 'Open',
    urgency: 'high',
    details: 'Household claims caregiver arrived at 09:45 instead of 09:00, missing a critical medication time. Caregiver claims she got stuck in Yaounde traffic and notified the family.'
  },
  {
    id: 'BK-20452',
    title: 'M. Fouda vs Elise Ngo',
    description: 'Session ended early — parties disagree on hours worked.',
    escrowAmount: '22,500 XAF',
    raisedTime: 'Raised 1d 6h ago',
    timeLeft: '18h left',
    status: 'Open',
    urgency: 'medium',
    details: 'Household claims session was cut short by 1.5 hours because of a caregiver personal emergency. Caregiver claims she stayed the full duration and finished all chores.'
  },
  {
    id: 'BK-20431',
    title: 'Mme Onana vs Patrick Nguema',
    description: 'Household reports property damage during session.',
    escrowAmount: '38,000 XAF',
    raisedTime: 'Raised 2d 3h ago',
    timeLeft: 'SLA breached',
    status: 'Open',
    urgency: 'breached',
    details: 'Household claims the caregiver accidentally knocked over and broke an expensive ceramic vase. Caregiver claims it was placed precariously on a wobbly table.'
  }
];

export const initialUsers = [
  {
    id: 'USR001',
    name: 'Aicha Kamga',
    email: 'aicha.k@gmail.com',
    role: 'Household',
    city: 'Yaounde',
    joined: 'Jan 2026',
    status: 'Active',
    initials: 'AK'
  },
  {
    id: 'USR002',
    name: 'Marie-Claire Nkomo',
    email: 'mc.nkomo@gmail.com',
    role: 'Caregiver',
    city: 'Yaounde',
    joined: 'Nov 2025',
    status: 'Active',
    initials: 'MN'
  },
  {
    id: 'USR003',
    name: 'Paul Fouda',
    email: 'paulf@outlook.com',
    role: 'Household',
    city: 'Douala',
    joined: 'Feb 2026',
    status: 'Active',
    initials: 'PF'
  },
  {
    id: 'USR004',
    name: 'Elise Ngo',
    email: 'elise.ngo@gmail.com',
    role: 'Caregiver',
    city: 'Douala',
    joined: 'Sep 2025',
    status: 'Suspended',
    initials: 'EN'
  },
  {
    id: 'USR005',
    name: 'Patrick Nguema',
    email: 'p.nguema@gmail.com',
    role: 'Caregiver',
    city: 'Douala',
    joined: 'Mar 2026',
    status: 'Pending',
    initials: 'PN'
  },
  {
    id: 'USR006',
    name: 'Mme Onana',
    email: 'onana.g@gmail.com',
    role: 'Household',
    city: 'Yaounde',
    joined: 'Dec 2025',
    status: 'Active',
    initials: 'MO'
  },
  {
    id: 'USR007',
    name: 'Serge Ntamack',
    email: 'serge.n@gmail.com',
    role: 'Household',
    city: 'Yaounde',
    joined: 'Oct 2025',
    status: 'Active',
    initials: 'SN'
  }
];

export const initialBookings = [
  {
    id: 'BK-20488',
    client: 'Aïcha Kamga',
    caregiver: 'Marie-Claire Nkomo',
    service: 'Home Nursing',
    amount: '12,800',
    date: 'Today · 09:00',
    status: 'Completed'
  },
  {
    id: 'BK-20487',
    client: 'Paul Fouda',
    caregiver: 'Elise Ngo',
    service: 'Post-op Care',
    amount: '22,500',
    date: 'Today · 15:00',
    status: 'In Progress'
  },
  {
    id: 'BK-20486',
    client: 'Mme Onana',
    caregiver: 'Patrick Nguema',
    service: 'Elderly Care',
    amount: '16,000',
    date: 'Today · 14:00',
    status: 'Scheduled'
  },
  {
    id: 'BK-20481',
    client: 'Serge Ntamack',
    caregiver: 'Claire Mbede',
    service: 'Babysitting',
    amount: '0',
    date: 'Yesterday',
    status: 'Cancelled'
  },
  {
    id: 'BK-20468',
    client: 'The Kamga Family',
    caregiver: 'Marie-Claire Nkomo',
    service: 'Home Nursing',
    amount: '14,000',
    date: 'Wed, Nov 6',
    status: 'Disputed'
  },
  {
    id: 'BK-20452',
    client: 'M. Fouda',
    caregiver: 'Elise Ngo',
    service: 'Post-op Care',
    amount: '22,500',
    date: 'Mon, Nov 4',
    status: 'Disputed'
  }
];

export const initialRecentActivity = [
  {
    id: 'ACT001',
    type: 'booking_completed',
    text: 'Booking BK-20488 completed',
    subtext: 'Aïcha K. → Marie-Claire N. · 12,800 XAF',
    time: '2m',
    iconType: 'completed'
  },
  {
    id: 'ACT002',
    type: 'payout_sent',
    text: 'Payout sent — 184,200 XAF',
    subtext: '12 caregivers · MTN Mobile Money',
    time: '18m',
    iconType: 'payout'
  },
  {
    id: 'ACT003',
    type: 'new_application',
    text: 'New caregiver application',
    subtext: 'Marie-Claire Nkomo · Home Nurse',
    time: '1h',
    iconType: 'application'
  },
  {
    id: 'ACT004',
    type: 'booking_cancelled',
    text: 'Booking BK-20481 cancelled',
    subtext: 'Household cancelled · no fee',
    time: '3h',
    iconType: 'cancelled'
  },
  {
    id: 'ACT005',
    type: 'dispute_opened',
    text: 'Dispute opened on BK-20460',
    subtext: 'Late arrival — payment held',
    time: '20h',
    iconType: 'dispute'
  }
];

export const initialRevenueStats = {
  commission: 'Commission - 18%',
  value: '4.62M XAF',
  comparison: 'This month · +9% vs October',
  bookings: '2,148',
  gmv: '25.7M XAF',
  payoutsSent: '21.1M XAF',
  refunds: '184,500 XAF'
};
