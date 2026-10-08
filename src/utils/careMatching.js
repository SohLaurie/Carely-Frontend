/**
 * careMatching.js
 * Intelligent Carely matching & qualification ranking algorithms
 * Ensures:
 *  1. Strict service filtering (e.g. babysitting requests NEVER return cleaners)
 *  2. Multi-factor proficiency ranking (Certification, Rating, Experience, Reviews, Location, Budget)
 *  3. Top 5 recommendations in descending order of qualification
 */

export const SERVICE_CATEGORIES = {
  indoor_cleaning: {
    id: 'indoor_cleaning',
    label: 'Indoor Cleaning',
    keywords: [
      'indoor clean', 'indoor cleaner', 'indoor cleaning', 'appartment', 'apartment',
      'nettoyage intérieur', 'ménage intérieur', 'flat', 'studio', 'living room', 'salon',
      'floor', 'chambre', 'sol', 'inside clean', 'room clean', 'house clean'
    ],
    matchTokens: ['indoor_cleaning', 'clean', 'cleaner'],
  },
  cleaning: {
    id: 'cleaning',
    label: 'Domestic Housekeeping',
    keywords: [
      'clean', 'cleaner', 'cleaning', 'housekeep', 'housekeeper', 'housekeeping', 'ménage',
      'femme de ménage', 'nettoyage', 'maid', 'domestic', 'deep clean', 'sweep', 'mop',
      'upkeep', 'entretien'
    ],
    matchTokens: ['cleaning', 'clean', 'indoor_cleaning'],
  },
  outdoor_cleaning: {
    id: 'outdoor_cleaning',
    label: 'Outdoor Cleaning',
    keywords: [
      'outdoor clean', 'outdoor cleaner', 'outdoor cleaning', 'cour', 'yard', 'compound',
      'nettoyage extérieur', 'gutter', 'patio', 'driveway'
    ],
    matchTokens: ['outdoor_cleaning'],
  },
  babysitting: {
    id: 'babysitting',
    label: 'Babysitting & Childcare',
    keywords: [
      'baby', 'babysit', 'babysitter', 'babysitting', 'child', 'children', 'kid', 'kids',
      'nanny', 'nounou', 'nourrice', 'garde d\'enfant', 'garde d’enfant', 'infant', 'toddler',
      'pediatric', 'garderie', 'childcare', 'newborn'
    ],
    matchTokens: ['babysitting', 'baby', 'child', 'nanny'],
  },
  nursing: {
    id: 'nursing',
    label: 'Home Nursing',
    keywords: [
      'nurse', 'nursing', 'infirmier', 'infirmière', 'medical', 'soin', 'post-op', 'post-surgery',
      'post-surgical', 'palliative', 'injection', 'vital signs', 'wound', 'dressing', 'health',
      'santé', 'pansement', 'tension', 'perfusion', 'hospital', 'rehabilitation'
    ],
    matchTokens: ['nursing', 'nurse', 'medical'],
  },
  elderly_care: {
    id: 'elderly_care',
    label: 'Elderly Care',
    keywords: [
      'elder', 'elderly', 'senior', 'geriatric', 'vieillesse', 'personne âgée', 'personnes âgées',
      'grand-parent', 'aging', 'companion', 'mobility', 'retraité', 'dementia', 'alzheimer',
      'third age', 'aide aux aînés'
    ],
    matchTokens: ['elderly_care', 'elder', 'senior'],
  },
  gardening: {
    id: 'gardening',
    label: 'Gardening & Lawn',
    keywords: [
      'garden', 'gardener', 'gardening', 'jardin', 'jardinier', 'lawn', 'mow', 'plants',
      'landscap', 'grass', 'pelouse', 'espace vert', 'arrosage', 'tonte'
    ],
    matchTokens: ['gardening', 'garden'],
  },
  pet_care: {
    id: 'pet_care',
    label: 'Pet Care & Walking',
    keywords: [
      'pet', 'dog', 'cat', 'animal', 'chien', 'chat', 'puppy', 'walker', 'veterin',
      'promenade', 'garde d\'animaux', 'sitting'
    ],
    matchTokens: ['pet_care', 'pet', 'dog', 'cat'],
  },
  laundry_ironing: {
    id: 'laundry_ironing',
    label: 'Laundry & Ironing',
    keywords: [
      'laundry', 'iron', 'ironing', 'repassage', 'lessive', 'wash clothes', 'linge',
      'blanchisserie', 'washing machine'
    ],
    matchTokens: ['laundry_ironing', 'laundry', 'iron'],
  },
  cooking: {
    id: 'cooking',
    label: 'Cooking & Meal Prep',
    keywords: [
      'cook', 'cooking', 'chef', 'meal', 'repas', 'cuisine', 'cuisinier', 'food',
      'nourriture', 'traiteur', 'kitchen'
    ],
    matchTokens: ['cooking', 'cook', 'chef'],
  },
};

const COMMON_CAMEROON_LOCATIONS = [
  'bastos', 'akwa', 'bonanjo', 'bonapriso', 'bonamoussadi', 'omnisports', 'biyem-assi',
  'mendong', 'ekounou', 'mvan', 'nsam', 'tsinga', 'essos', 'ngousso', 'mimboman',
  'nkolbisson', 'odza', 'messassi', 'emana', 'santa barbara', 'melen', 'ngoa-ekélé',
  'obili', 'etoudi', 'deido', 'new bell', 'makepe', 'kotto', 'logpom', 'ndogbong',
  'bépanda', 'bonaberi', 'yassa', 'molyko', 'bota', 'yaoundé', 'yaounde', 'douala',
  'buea', 'limbe', 'bamenda', 'bafoussam', 'kribi'
];

const DAYS_OF_WEEK = {
  monday: 1, mon: 1, lundi: 1,
  tuesday: 2, tue: 2, tues: 2, mardi: 2,
  wednesday: 3, wed: 3, mercredi: 3,
  thursday: 4, thu: 4, thur: 4, thurs: 4, jeudi: 4,
  friday: 5, fri: 5, vendredi: 5,
  saturday: 6, sat: 6, samedi: 6,
  sunday: 0, sun: 0, dimanche: 0
};

const MONTH_NAMES = {
  january: 1, jan: 1, janvier: 1,
  february: 2, feb: 2, fevrier: 2, février: 2,
  march: 3, mar: 3, mars: 3,
  april: 4, apr: 4, avril: 4,
  may: 5, mai: 5,
  june: 6, jun: 6, juin: 6,
  july: 7, jul: 7, juillet: 7,
  august: 8, aug: 8, aout: 8, août: 8,
  september: 9, sep: 9, sept: 9, septembre: 9,
  october: 10, oct: 10, octobre: 10,
  november: 11, nov: 11, novembre: 11,
  december: 12, dec: 12, decembre: 12, décembre: 12
};

function formatISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Extracts a target scheduled date from user free-text query.
 * Supports:
 * - Relative: "today", "tomorrow", "day after tomorrow", "now", "asap", "demain", "ce jour", etc.
 * - Weekdays: "this friday", "next monday", "on tuesday", "ce vendredi", "lundi", etc.
 * - Explicit: "08/10/2026", "2026-10-08", "8 oct", "8 octobre", etc.
 */
export function parseDateFromPrompt(prompt = '', baseDate = new Date()) {
  if (!prompt || typeof prompt !== 'string') return null;
  const text = prompt.toLowerCase();

  // 1. Explicit full date: YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = text.match(/\b(20\d{2})[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12]\d|3[01])\b/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10);
    const d = parseInt(isoMatch[3], 10);
    const dt = new Date(y, m - 1, d);
    if (!isNaN(dt.getTime())) {
      return {
        date: formatISODate(dt),
        dateText: dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      };
    }
  }

  // 2. Explicit date: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
  const dmyMatch = text.match(/\b(0?[1-9]|[12]\d|3[01])[./-](0?[1-9]|1[0-2])[./-](20\d{2})\b/);
  if (dmyMatch) {
    const d = parseInt(dmyMatch[1], 10);
    const m = parseInt(dmyMatch[2], 10);
    const y = parseInt(dmyMatch[3], 10);
    const dt = new Date(y, m - 1, d);
    if (!isNaN(dt.getTime())) {
      return {
        date: formatISODate(dt),
        dateText: dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      };
    }
  }

  // 3. Short explicit date: DD/MM or DD-MM (assumes current year)
  const dmMatch = text.match(/\b(0?[1-9]|[12]\d|3[01])[/-](0?[1-9]|1[0-2])\b/);
  if (dmMatch) {
    const d = parseInt(dmMatch[1], 10);
    const m = parseInt(dmMatch[2], 10);
    const y = baseDate.getFullYear();
    const dt = new Date(y, m - 1, d);
    if (!isNaN(dt.getTime())) {
      return {
        date: formatISODate(dt),
        dateText: dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      };
    }
  }

  // 4. Month name representations: "8th october", "october 8", "8 octobre", "le 8 oct 2026"
  const monthNamesRegex = Object.keys(MONTH_NAMES).join('|');
  const monthDayMatch = text.match(new RegExp(`\\b(${monthNamesRegex})\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:\\s+(20\\d{2}))?\\b`, 'i')) ||
                        text.match(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?(${monthNamesRegex})(?:\\s+(20\\d{2}))?\\b`, 'i'));
  if (monthDayMatch) {
    let mStr, dStr, yStr;
    if (MONTH_NAMES[monthDayMatch[1]?.toLowerCase()]) {
      mStr = monthDayMatch[1].toLowerCase();
      dStr = monthDayMatch[2];
      yStr = monthDayMatch[3];
    } else {
      dStr = monthDayMatch[1];
      mStr = monthDayMatch[2]?.toLowerCase();
      yStr = monthDayMatch[3];
    }
    const m = MONTH_NAMES[mStr];
    const d = parseInt(dStr, 10);
    const y = yStr ? parseInt(yStr, 10) : baseDate.getFullYear();
    if (m && d >= 1 && d <= 31) {
      const dt = new Date(y, m - 1, d);
      if (!isNaN(dt.getTime())) {
        return {
          date: formatISODate(dt),
          dateText: dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        };
      }
    }
  }

  // 5. Relative day keywords
  // "day after tomorrow", "après-demain", "apres-demain"
  if (/\b(day after tomorrow|après-demain|apres-demain)\b/i.test(text)) {
    const dt = new Date(baseDate);
    dt.setDate(dt.getDate() + 2);
    return {
      date: formatISODate(dt),
      dateText: `Day After Tomorrow (${dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})`
    };
  }

  // "tomorrow", "tmrw", "demain"
  if (/\b(tomorrow|tmrw|demain)\b/i.test(text)) {
    const dt = new Date(baseDate);
    dt.setDate(dt.getDate() + 1);
    return {
      date: formatISODate(dt),
      dateText: `Tomorrow (${dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})`
    };
  }

  // "today", "tonight", "this morning", "this afternoon", "this evening", "now", "asap", "aujourd'hui", "ce jour"
  if (/\b(today|tonight|this morning|this afternoon|this evening|now|asap|aujourd'hui|ce jour)\b/i.test(text)) {
    const dt = new Date(baseDate);
    return {
      date: formatISODate(dt),
      dateText: `Today (${dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})`
    };
  }

  // 6. Day of week expressions: "this friday", "next monday", "on tuesday", "friday", "ce vendredi", etc.
  const dayNamesRegex = Object.keys(DAYS_OF_WEEK).join('|');
  const dayMatch = text.match(new RegExp(`\\b(?:(this|next|ce|cette|le|on|for|pour)\\s+)?(${dayNamesRegex})\\b`, 'i'));
  if (dayMatch) {
    const modifier = (dayMatch[1] || '').toLowerCase();
    const dayKey = dayMatch[2].toLowerCase();
    const targetDayOfWeek = DAYS_OF_WEEK[dayKey];

    if (targetDayOfWeek !== undefined) {
      const currentDayOfWeek = baseDate.getDay(); // 0 = Sun .. 6 = Sat
      let diff = targetDayOfWeek - currentDayOfWeek;

      if (modifier === 'next' || modifier === 'prochain') {
        diff = diff <= 0 ? diff + 7 : diff + 7;
      } else {
        if (diff < 0) {
          diff += 7;
        } else if (diff === 0 && !modifier.includes('this') && !modifier.includes('ce')) {
          diff = 0;
        }
      }

      const dt = new Date(baseDate);
      dt.setDate(dt.getDate() + diff);

      const isToday = diff === 0;
      const isTomorrow = diff === 1;

      return {
        date: formatISODate(dt),
        dateText: isToday
          ? `Today (${dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})`
          : isTomorrow
          ? `Tomorrow (${dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})`
          : `${dt.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`
      };
    }
  }

  return null;
}

/**
 * Parses user free-text query into structured care requirements
 */
export function parseUserNeeds(prompt = '', baseDate = new Date()) {
  const text = prompt.toLowerCase();

  // 1. Detect service
  let detectedService = null;
  let highestCount = 0;

  // Specific check for indoor/outdoor cleaning keywords first
  if (/indoor\s*(?:clean|cleaner|cleaning)|appartment|apartment|flat|studio|living room|salon|chambre/i.test(text)) {
    detectedService = 'indoor_cleaning';
  } else if (/outdoor\s*(?:clean|cleaner|cleaning)|cour|yard|compound/i.test(text)) {
    detectedService = 'outdoor_cleaning';
  } else {
    for (const [key, category] of Object.entries(SERVICE_CATEGORIES)) {
      let count = 0;
      for (const kw of category.keywords) {
        if (text.includes(kw)) {
          count += kw.length > 5 ? (kw.includes(' ') ? 4 : 2) : 1;
        }
      }
      if (count > highestCount) {
        highestCount = count;
        detectedService = key;
      }
    }
  }

  // 2. Detect location
  let detectedLocation = null;
  for (const loc of COMMON_CAMEROON_LOCATIONS) {
    if (text.includes(loc)) {
      detectedLocation = loc.charAt(0).toUpperCase() + loc.slice(1);
      break;
    }
  }

  // 3. Detect budget (Ranges e.g. "min 50fcfa - 75fcfa max", or single budget ceilings)
  let minBudget = null;
  let maxBudget = null;
  let detectedBudget = null;

  // Range detection: "min 50fcfa- 75fcfa max", "50 to 75 fcfa", "between 50 and 75", "de 50 à 75"
  const rangeRegex = /(?:between|de|min(?:imum)?\s*)?(\d{1,6})\s*(?:fcfa|xaf|frs|\/hr|fcfa\/hr)?\s*(?:-|to|à|and|et)\s*(?:max(?:imum)?\s*)?(\d{1,6})\s*(?:fcfa|xaf|frs|\/hr|fcfa\/hr)?(?:\s*max(?:imum)?)?/i;
  const rangeMatch = text.match(rangeRegex);
  if (rangeMatch) {
    const n1 = parseInt(rangeMatch[1], 10);
    const n2 = parseInt(rangeMatch[2], 10);
    if (!isNaN(n1) && !isNaN(n2)) {
      minBudget = Math.min(n1, n2);
      maxBudget = Math.max(n1, n2);
      detectedBudget = maxBudget;
    }
  }

  // Min only: "min 50", "minimum 50", "at least 50", "starting from 50"
  if (!minBudget) {
    const minMatch = text.match(/(?:min(?:imum)?|at least|starting from|au moins)\s*(\d{1,6})\s*(?:fcfa|xaf|frs|\/hr|fcfa\/hr)?/i);
    if (minMatch) {
      minBudget = parseInt(minMatch[1], 10);
    }
  }

  // Max only: "max 75", "under 80", "up to 100", "below 90", "plafond 100", "budget 75"
  if (!maxBudget) {
    const maxMatch = text.match(/(?:max(?:imum)?|under|up to|below|less than|plafond|budget|jusqu'à|max of)\s*(\d{1,6})\s*(?:fcfa|xaf|frs|\/hr|fcfa\/hr)?/i);
    if (maxMatch) {
      maxBudget = parseInt(maxMatch[1], 10);
      detectedBudget = maxBudget;
    }
  }

  // Fallback single budget number: "50 fcfa", "50/hr", "budget 50"
  if (!detectedBudget) {
    const singleMatch = text.match(/(?:budget|hourly)?\s*(\d{1,6})\s*(?:fcfa|xaf|frs|\/hr|fcfa\/hr)/i);
    if (singleMatch) {
      const val = parseInt(singleMatch[1], 10);
      if (val >= 5 && val <= 100000) {
        maxBudget = val;
        detectedBudget = val;
      }
    }
  }

  // 4. Detect requested day / date
  const detectedDate = parseDateFromPrompt(prompt, baseDate);

  return {
    serviceKey: detectedService,
    serviceLabel: detectedService ? (SERVICE_CATEGORIES[detectedService]?.label || 'Service') : null,
    location: detectedLocation,
    budget: detectedBudget,
    minBudget,
    maxBudget,
    date: detectedDate?.date || null,
    dateText: detectedDate?.dateText || null,
    raw: prompt,
  };
}

/**
 * Checks if a provider strictly offers a given service category.
 * Prevents recommending laundry workers or gardeners for indoor cleaning
 * unless they explicitly possess the skill in their specialties.
 */
export function providerOffersService(provider, targetCategoryKey) {
  if (!targetCategoryKey || targetCategoryKey === 'all') return true;

  const prof = (provider.profession || '').toLowerCase().trim();
  const specPrimary = (provider.specialty || '').toLowerCase().trim();
  const specList = (Array.isArray(provider.specialties) ? provider.specialties : [])
    .map(s => String(s).toLowerCase().trim());

  // Check if provider explicitly has the skill in their specialties list or primary specialty
  const hasSpecialty = (key) => specList.includes(key) || specPrimary === key;

  switch (targetCategoryKey) {
    case 'indoor_cleaning': {
      // 1. Explicitly has indoor_cleaning in specialties
      if (hasSpecialty('indoor_cleaning')) return true;
      // 2. Primary profession is Cleaner/Housekeeper (NOT laundry worker, gardener, babysitter)
      if (prof === 'cleaner' || prof.includes('ménage') || prof.includes('housekeep') || prof.includes('maid')) {
        return true;
      }
      return false;
    }

    case 'outdoor_cleaning': {
      if (hasSpecialty('outdoor_cleaning')) return true;
      if (prof.includes('outdoor')) return true;
      return false;
    }

    case 'cleaning': {
      // General housekeeping
      if (hasSpecialty('cleaning') || hasSpecialty('indoor_cleaning')) {
        return true;
      }
      if (prof === 'cleaner' || prof.includes('ménage') || prof.includes('housekeep') || prof.includes('maid')) {
        return true;
      }
      return false;
    }

    case 'gardening': {
      if (hasSpecialty('gardening')) return true;
      if (prof.includes('garden') || prof.includes('jardin')) return true;
      return false;
    }

    case 'laundry_ironing': {
      if (hasSpecialty('laundry_ironing')) return true;
      if (prof.includes('laundry') || prof.includes('repassage') || prof.includes('iron') || prof.includes('lessive') || prof.includes('blanchiss')) {
        return true;
      }
      return false;
    }

    case 'babysitting': {
      if (hasSpecialty('babysitting')) return true;
      if (prof.includes('baby') || prof.includes('child') || prof.includes('nanny') || prof.includes('nounou') || prof.includes('garde d\'enfant') || prof.includes('garde d’enfant')) {
        return true;
      }
      return false;
    }

    case 'elderly_care': {
      if (hasSpecialty('elderly_care') || hasSpecialty('nursing')) return true;
      if (prof.includes('elder') || prof.includes('senior') || prof.includes('âgé') || prof.includes('geriatric') || prof.includes('aide aux aînés')) {
        return true;
      }
      return false;
    }

    case 'nursing': {
      if (hasSpecialty('nursing')) return true;
      if (prof.includes('nurse') || prof.includes('infirmier') || prof.includes('infirmière') || prof.includes('medical')) {
        return true;
      }
      return false;
    }

    case 'pet_care': {
      if (hasSpecialty('pet_care')) return true;
      if (prof.includes('pet') || prof.includes('animal') || prof.includes('chien') || prof.includes('chat')) {
        return true;
      }
      return false;
    }

    case 'cooking': {
      if (hasSpecialty('cooking')) return true;
      if (prof.includes('cook') || prof.includes('cuisin') || prof.includes('chef')) {
        return true;
      }
      return false;
    }

    default: {
      return hasSpecialty(targetCategoryKey) || prof.includes(targetCategoryKey.replace(/_/g, ' '));
    }
  }
}

/**
 * Calculates a comprehensive proficiency/qualification score (0-150+)
 * Higher score = more qualified and better suited for the task.
 */
export function calculateProficiencyScore(provider, context = {}) {
  let score = 0;

  // 1. Two-Tier Trust Model Certification (Certified badge provides highest boost)
  if (provider.isCertified) {
    score += 45;
  }

  // 2. Star Rating (0 to 5) — heavy weight (e.g. 5.0 = 50 pts, 3.5 = 35 pts)
  const rating = parseFloat(provider.rating) || 0;
  score += rating * 10;

  // 3. Experience level (Years in practice)
  const expStr = String(provider.experience || provider.experience_yrs || '').toLowerCase();
  let expYears = 0;
  if (expStr.includes('5+') || expStr.includes('6') || expStr.includes('7') || expStr.includes('8') || expStr.includes('10')) {
    expYears = 5;
  } else if (expStr.includes('3-5') || expStr.includes('4') || expStr.includes('3')) {
    expYears = 4;
  } else if (expStr.includes('1-2') || expStr.includes('2') || expStr.includes('1 year') || expStr.includes('1 yr')) {
    expYears = 2;
  } else if (expStr.includes('less than 1') || expStr.includes('< 1') || expStr.includes('0.')) {
    expYears = 0.5;
  } else {
    const parsed = parseFloat(expStr);
    if (!isNaN(parsed)) expYears = Math.min(parsed, 10);
  }
  score += Math.min(expYears * 4, 25); // Up to 25 pts

  // 4. Verified reviews count
  const reviews = parseInt(provider.reviewCount, 10) || 0;
  score += Math.min(reviews * 2, 20); // Up to 20 pts

  // 5. Verification status
  if (provider.approvalStatus === 'approved') {
    score += 10;
  }

  // 6. Location match bonus
  if (context.location) {
    const locTarget = context.location.toLowerCase();
    const pLoc = `${provider.location || ''} ${provider.city || ''} ${provider.serviceArea || ''}`.toLowerCase();
    if (pLoc.includes(locTarget)) {
      score += 25;
    }
  }

  // 7. Budget match bonus
  const targetMax = context.maxBudget || context.budget;
  if (targetMax) {
    const price = Number(provider.pricePerHour);
    if (price <= targetMax) {
      score += 15;
    } else {
      score -= 20; // heavy penalty if out of requested budget
    }
  }
  if (context.minBudget && Number(provider.pricePerHour) >= context.minBudget) {
    score += 10;
  }

  // 8. Service exactness
  if (context.serviceKey) {
    const key = context.serviceKey.toLowerCase();
    const prof = (provider.profession || '').toLowerCase();
    if (prof.includes(key.replace(/_/g, ' '))) {
      score += 15;
    }
  }

  return score;
}

/**
 * Core recommendation engine:
 * 1. Strictly filters providers by required service
 * 2. Strictly respects budget constraints (minBudget, maxBudget)
 * 3. Ranks remaining candidates by qualification/proficiency score in descending order
 * 4. Returns top limit recommendations (default 5)
 */
export function getTopQualifiedProviders(providers = [], criteria = {}, limit = 5) {
  if (!Array.isArray(providers) || providers.length === 0) return [];

  // Filter approved & paid providers only
  const activeProviders = providers.filter(p => p.approvalStatus === 'approved' && p.subscriptionPaid);

  let candidates = activeProviders;

  // 1. Strict service filtering
  if (criteria.serviceKey && criteria.serviceKey !== 'all') {
    candidates = candidates.filter(p => providerOffersService(p, criteria.serviceKey));

    // If no strict matches exist, return empty array (do NOT recommend irrelevant services)
    if (candidates.length === 0) {
      return [];
    }
  }

  // 2. Strict budget filtering
  // If user specified maximum budget or budget ceiling, candidate pricePerHour MUST be <= maxBudget
  const ceiling = criteria.maxBudget || criteria.budget;
  if (ceiling && typeof ceiling === 'number') {
    const underCeiling = candidates.filter(p => Number(p.pricePerHour) <= ceiling);
    if (underCeiling.length > 0) {
      candidates = underCeiling;
    }
  }

  // If user specified minimum budget, candidate pricePerHour MUST be >= minBudget
  if (criteria.minBudget && typeof criteria.minBudget === 'number') {
    const aboveFloor = candidates.filter(p => Number(p.pricePerHour) >= criteria.minBudget);
    if (aboveFloor.length > 0) {
      candidates = aboveFloor;
    }
  }

  // 3. Score each candidate
  const scored = candidates.map(p => ({
    ...p,
    proficiencyScore: calculateProficiencyScore(p, criteria),
  }));

  // 4. Sort descending by proficiency score
  scored.sort((a, b) => b.proficiencyScore - a.proficiencyScore);

  // 5. Return top limit (default 5)
  return scored.slice(0, limit);
}
