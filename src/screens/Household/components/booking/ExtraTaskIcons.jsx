import React from 'react';

// 1. Inside Fridge Icon (Refrigerator outline with shelf lines)
export const FridgeIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M5 10h14" />
    <path d="M15 6v2" />
    <path d="M15 14v4" />
  </svg>
);

// 2. Inside Oven Icon (Oven cooker outline with window and controls)
export const OvenIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="7" y="9" width="10" height="8" rx="1" />
    <circle cx="7" cy="6.5" r="0.5" fill={color} />
    <circle cx="12" cy="6.5" r="0.5" fill={color} />
    <circle cx="17" cy="6.5" r="0.5" fill={color} />
  </svg>
);

// 3. Inside Cabinets Icon (Drawers block)
export const CabinetsIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
    <path d="M11 6h2" />
    <path d="M11 12h2" />
    <path d="M11 18h2" />
  </svg>
);

// 4. Interior Windows Icon (4-pane window)
export const WindowsIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 12h18" />
    <path d="M12 3v18" />
  </svg>
);

// 5. Interior Walls Icon (Brick layout)
export const WallsIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
    <path d="M9 3v6" />
    <path d="M15 3v6" />
    <path d="M6 9v6" />
    <path d="M12 9v6" />
    <path d="M18 9v6" />
    <path d="M9 15v6" />
    <path d="M15 15v6" />
  </svg>
);

// 6. Water Plants Icon (Sprout in a pot)
export const PlantsIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 11h10l-1.5 8h-7L7 11z" />
    <path d="M12 2v9" />
    <path d="M12 5a3 3 0 0 1 3 3" />
    <path d="M12 4a4 4 0 0 0-4 4" />
  </svg>
);

// 7. Ironing Icon (Clothes Iron outline)
export const IroningIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 18h16a1 1 0 0 0 1-1v-2.5a5.5 5.5 0 0 0-5.5-5.5H8.5A5.5 5.5 0 0 0 3 14v3a1 1 0 0 0 1 1z" />
    <path d="M9 9h5v2" />
  </svg>
);

// 8. Laundry Icon (T-shirt hanger)
export const LaundryIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.37 8.91l-7.5-5.5a1.27 1.27 0 0 0-1.74 0l-7.5 5.5a1 1 0 0 0-.37.8V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9.71a1 1 0 0 0-.37-.8z" />
    <path d="M12 9v7" />
    <circle cx="12" cy="13" r="2" />
  </svg>
);

// 9. Small Flatlet Icon (Two houses outline)
export const FlatletIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const TASK_ICON_MAP = {
  fridge:   FridgeIcon,
  oven:     OvenIcon,
  cabinets: CabinetsIcon,
  windows:  WindowsIcon,
  walls:    WallsIcon,
  plants:   PlantsIcon,
  ironing:  IroningIcon,
  laundry:  LaundryIcon,
  flatlet:  FlatletIcon,
};
