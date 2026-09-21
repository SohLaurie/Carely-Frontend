// ── Booking Metadata Serializer & Parser ───────────────────────────────────────

export const ALL_EXTRA_TASKS_LABELS = {
  // Indoor Cleaning
  fridge: 'Inside Fridge',
  oven: 'Inside Oven',
  cabinets: 'Inside Cabinets',
  windows: 'Interior Windows',
  walls: 'Interior Walls',
  plants: 'Water Plants',
  ironing: 'Ironing',
  laundry: 'Laundry',
  flatlet: 'Small Flatlet',

  // Outdoor Cleaning
  garden_care: 'Garden Care',
  general_cleaning: 'General Cleaning',
  outside_windows: 'Outside Windows',
  heavy_lifting: 'Heavy Lifting',
  pool_cleaning: 'Pool Cleaning',
  car_washing: 'Car Washing',
  dog_walk_1h: 'Dog Walking (1 hr)',
  dog_walk_30m: 'Dog Walking (30 min)',

  // Babysitting
  looking_after_kids: 'Looking after kids',
  newborn_support: 'Newborn support',
  prep_snacks: 'Preparing snacks & meals',
  playtime: 'Playtime',
  kids_laundry: 'Kids Laundry',
  organising_kids: 'Organising kids rooms',

  // Laundry & Ironing
  machine_wash: 'Machine Wash',
  dry_clean: 'Dry Clean',
  hand_clean: 'Hand Clean',
  bleaching: 'Bleaching / Stain Removal',
  folding: 'Folding & Organising',

  // Elder Care
  light_cleaning: 'Light Cleaning',
  medication_admin: 'Medication Admin',
  trusted_companion: 'Trusted Companion',
  meal_prep: 'Meal Preparation',
  mobility_assistance: 'Mobility Assistance',
};

export const DAY_FULL_LABELS = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
  0: 'Monday',
  1: 'Tuesday',
  2: 'Wednesday',
  3: 'Thursday',
  4: 'Friday',
  5: 'Saturday',
  6: 'Sunday'
};

export function getExtraTaskLabel(id) {
  if (!id) return '';
  return ALL_EXTRA_TASKS_LABELS[id] || id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Serializes booking metadata (questions, per-day extras, elder profile) into a string.
 */
export function serializeBookingNotes({
  notes = '',
  service = null,
  serviceQuestions = null,
  elderProfile = null,
  extras = [],
  selectedDays = null,
}) {
  const metaObj = {
    serviceId: service?.id || (typeof service === 'string' ? service : null),
    serviceLabel: service?.label || null,
    serviceQuestions: serviceQuestions || null,
    elderProfile: elderProfile || null,
    singleExtras: Array.isArray(extras) ? extras : [],
    selectedDays: selectedDays || null, // Per-day schedule & extras object
    userNote: notes ? notes.trim() : ''
  };

  const jsonStr = JSON.stringify(metaObj);
  const userText = notes && notes.trim() ? notes.trim() : '';

  if (userText) {
    return `${userText}\n\n[CARELY_META]${jsonStr}[/CARELY_META]`;
  }
  return `[CARELY_META]${jsonStr}[/CARELY_META]`;
}

/**
 * Parses booking metadata from a booking's notes string.
 */
export function parseBookingMetadata(notesString) {
  const fallback = {
    userNote: notesString ? String(notesString).trim() : '',
    serviceId: null,
    serviceLabel: null,
    serviceQuestions: null,
    elderProfile: null,
    singleExtras: [],
    selectedDays: null,
  };

  if (!notesString || typeof notesString !== 'string') {
    return fallback;
  }

  const metaMatch = notesString.match(/\[CARELY_META\]([\s\S]*?)\[\/CARELY_META\]/);
  if (metaMatch && metaMatch[1]) {
    try {
      const parsed = JSON.parse(metaMatch[1]);
      const cleanNote = notesString.replace(/\[CARELY_META\][\s\S]*?\[\/CARELY_META\]/, '').trim();
      return {
        ...parsed,
        userNote: cleanNote || parsed.userNote || ''
      };
    } catch (e) {
      console.warn('Failed to parse [CARELY_META]:', e);
    }
  }

  // Check if entire notes string is JSON
  if (notesString.trim().startsWith('{') && notesString.trim().endsWith('}')) {
    try {
      const parsed = JSON.parse(notesString);
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          ...parsed,
          userNote: parsed.userNote || ''
        };
      }
    } catch {}
  }

  return fallback;
}
