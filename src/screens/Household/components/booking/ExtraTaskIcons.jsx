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

// 8. Laundry Icon (Washing Machine)
export const LaundryIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <circle cx="12" cy="13" r="5" />
    <circle cx="12" cy="13" r="2" />
    <circle cx="8" cy="6" r="1" fill={color} stroke="none" />
    <circle cx="12" cy="6" r="1" fill={color} stroke="none" />
  </svg>
);

// 9. Small Flatlet Icon (Two houses outline)
export const FlatletIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// ── Outdoor Cleaning Icons ───────────────────────────────────────────────────

// Garden Care (Flower with leaves)
export const GardenCareIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22v-8" />
    <path d="M9 18a3 3 0 0 1 6 0" />
    <path d="M12 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    <path d="M12 8a4 4 0 1 0 4-4" />
    <path d="M12 8a4 4 0 1 0-4-4" />
    <path d="M12 8a4 4 0 1 0 4 4" />
    <path d="M12 8a4 4 0 1 0-4 4" />
  </svg>
);

// General Cleaning (Hand wiping with sparkle stars)
export const GeneralCleaningIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
    <path d="M6 14v-3a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v11a4 4 0 0 0 4 4h8a7 7 0 0 0 7-7v-3" />
    <path d="M20 2v4" />
    <path d="M18 4h4" />
  </svg>
);

// Outside Windows (Window outline)
export const OutsideWindowsIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 12h18" />
    <path d="M12 3v18" />
  </svg>
);

// Heavy Lifting (Barbell / Weight lifting symbol)
export const HeavyLiftingIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v16" />
    <rect x="9" y="8" width="6" height="8" rx="1" />
    <path d="M6 12h12" />
    <circle cx="4" cy="12" r="2" />
    <circle cx="20" cy="12" r="2" />
  </svg>
);

// Pool Cleaning (Swimming pool ladder)
export const PoolCleaningIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 20V4c0-1.1.9-2 2-2h0a2 2 0 0 1 2 2v8" />
    <path d="M16 20V4c0-1.1-.9-2-2-2h0a2 2 0 0 0-2 2v8" />
    <path d="M8 8h8" />
    <path d="M8 13h8" />
    <path d="M2 20c1.5 0 2.5-.5 3-1.5.5 1 1.5 1.5 3 1.5s2.5-.5 3-1.5c.5 1 1.5 1.5 3 1.5s2.5-.5 3-1.5c.5 1 1.5 1.5 3 1.5" />
  </svg>
);

// Car Washing (Front view of a car with spray drops)
export const CarWashingIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="8" rx="2" />
    <path d="M6 11l2-5h8l2 5" />
    <circle cx="8" cy="15" r="1" />
    <circle cx="16" cy="15" r="1" />
    <path d="M12 2v2M8 3v1M16 3v1" />
  </svg>
);

// Dog Walking (Filled pet paw print icon)
export const DogWalkingIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    {/* Main pad */}
    <path d="M12 13.5c-2.2 0-4 1.3-4 3 0 1.8 1.8 3 4 3s4-1.2 4-3c0-1.7-1.8-3-4-3z" />
    {/* 4 Toes */}
    <circle cx="6.5" cy="10" r="1.8" />
    <circle cx="10" cy="6.5" r="2.1" />
    <circle cx="14" cy="6.5" r="2.1" />
    <circle cx="17.5" cy="10" r="1.8" />
  </svg>
);

// ── Babysitting Icons ────────────────────────────────────────────────────────

// Looking after kids (Two child figures)
export const LookingAfterKidsIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Kid 1 */}
    <circle cx="8" cy="7" r="2.5" />
    <path d="M5 17c0-2.2 1.8-4 4-4h0c2.2 0 4 1.8 4 4v4H5v-4z" />
    {/* Kid 2 */}
    <circle cx="16" cy="7" r="2.5" />
    <path d="M13 17c0-2.2 1.8-4 4-4h0c2.2 0 4 1.8 4 4v4h-8v-4z" />
  </svg>
);

// Newborn support (Cute baby pacifier / rattle)
export const NewbornSupportIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="5" />
    <path d="M12 14v5" />
    <circle cx="12" cy="20" r="1.5" />
    <path d="M8.5 9h7" />
  </svg>
);

// Preparing snacks & meals (Sandwich silhouette)
export const PrepSnacksIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8h18l-1.5-4H4.5L3 8z" />
    <path d="M3 16h18v2.5a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 18.5V16z" />
    <path d="M3 10c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-4z" />
    <path d="M5 12h14" />
  </svg>
);

// Playtime (Puzzle piece)
export const PlaytimeIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22v-4M12 6V2M4 12H2M22 12h-2" />
    <path d="M18.6 18.6L15.8 15.8M8.2 8.2L5.4 5.4M18.6 5.4L15.8 8.2M8.2 15.8L5.4 18.6" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

// Kids Laundry (Washing machine outline)
export const KidsLaundryIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <circle cx="12" cy="13" r="5" />
    <circle cx="12" cy="13" r="2" />
    <circle cx="8" cy="6" r="0.5" fill={color} />
    <circle cx="12" cy="6" r="0.5" fill={color} />
  </svg>
);

// Organising kids rooms (Box with toy block sticking out)
export const OrganisingKidsIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="10" width="18" height="11" rx="1" />
    <path d="M3 10l3-5h12l3 5" />
    <path d="M12 10V5" />
  </svg>
);

// ── Elder Care Icons ────────────────────────────────────────────────────────

// Light Cleaning (House outline with small inner box)
export const LightCleaningIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
    <rect x="9" y="11" width="6" height="5" rx="1" />
  </svg>
);

// Medication Admin (Capsule and round tablet)
export const MedicationAdminIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="6" height="14" rx="3" transform="rotate(-30 8 12)" />
    <path d="M6 12l4-2.3" />
    <circle cx="16" cy="14" r="4" />
    <path d="M13.2 11.2l5.6 5.6" />
  </svg>
);

// Trusted Companion (Speech bubble with conversation dots)
export const TrustedCompanionIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="3" />
  </svg>
);

// Meal Preparation (Fork, plate, knife)
export const MealPrepIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Plate */}
    <circle cx="12" cy="12" r="3.8" />
    {/* Fork (Left) */}
    <path d="M4 7v4a1 1 0 0 0 2 0V7" />
    <path d="M5 7v3" />
    <path d="M5 11v6" />
    {/* Knife (Right) */}
    <path d="M18 7v10" />
    <path d="M18 7c-1 0-1.5 1-1.5 2v4h1.5" />
  </svg>
);

// Mobility Assistance (Wheelchair)
export const MobilityAssistanceIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="5.5" r="1.5" fill={color} stroke="none" />
    <path d="M10 7v6.5h5.5l2 4h1.5" />
    <path d="M10 10.5h4.5" />
    <path d="M12.5 12.5a4.5 4.5 0 1 0 .5 5" />
  </svg>
);

export const TASK_ICON_MAP = {
  // Indoor Cleaning
  fridge:   FridgeIcon,
  oven:     OvenIcon,
  cabinets: CabinetsIcon,
  windows:  WindowsIcon,
  walls:    WallsIcon,
  plants:   PlantsIcon,
  ironing:  IroningIcon,
  laundry:  LaundryIcon,
  flatlet:  FlatletIcon,

  // Outdoor Cleaning
  garden_care:      GardenCareIcon,
  general_cleaning: GeneralCleaningIcon,
  outside_windows:  OutsideWindowsIcon,
  heavy_lifting:    HeavyLiftingIcon,
  pool_cleaning:    PoolCleaningIcon,
  car_washing:      CarWashingIcon,
  dog_walk_1h:      DogWalkingIcon,
  dog_walk_30m:     DogWalkingIcon,

  // Babysitting
  looking_after_kids: LookingAfterKidsIcon,
  newborn_support:    NewbornSupportIcon,
  prep_snacks:        PrepSnacksIcon,
  playtime:           PlaytimeIcon,
  kids_laundry:       KidsLaundryIcon,
  organising_kids:    OrganisingKidsIcon,

  // Elder Care
  light_cleaning:      LightCleaningIcon,
  medication_admin:    MedicationAdminIcon,
  trusted_companion:   TrustedCompanionIcon,
  meal_prep:           MealPrepIcon,
  mobility_assistance: MobilityAssistanceIcon,
};
