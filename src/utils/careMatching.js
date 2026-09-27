/**
 * careMatching.js
 * Intelligent Carely matching & qualification ranking algorithms
 * Ensures:
 *  1. Strict service filtering (e.g. babysitting requests NEVER return cleaners)
 *  2. Multi-factor proficiency ranking (Certification, Rating, Experience, Reviews, Location, Budget)
 *  3. Top 5 recommendations in descending order of qualification
 */

export const SERVICE_CATEGORIES = {
  babysitting: {
    id: 'babysitting',
    label: 'Babysitting & Childcare',
    keywords: [
      'baby', 'babysit', 'babysitter', 'babysitting', 'child', 'children', 'kid', 'kids',
      'nanny', 'nounou', 'nourrice', 'garde d\'enfant', 'garde d’enfant', 'infant', 'toddler',
      'pediatric', 'garderie', 'childcare', 'newborn'
    ],
    matchTokens: ['baby', 'child', 'nanny', 'nourrice', 'kid', 'infant', 'toddler', 'garde'],
  },
  nursing: {
    id: 'nursing',
    label: 'Home Nursing',
    keywords: [
      'nurse', 'nursing', 'infirmier', 'infirmière', 'medical', 'soin', 'post-op', 'post-surgery',
      'post-surgical', 'palliative', 'injection', 'vital signs', 'wound', 'dressing', 'health',
      'santé', 'pansement', 'tension', 'perfusion', 'hospital', 'rehabilitation'
    ],
    matchTokens: ['nurse', 'infirm', 'medic', 'soin', 'nursing', 'health'],
  },
  elderly_care: {
    id: 'elderly_care',
    label: 'Elderly Care',
    keywords: [
      'elder', 'elderly', 'senior', 'geriatric', 'vieillesse', 'personne âgée', 'personnes âgées',
      'grand-parent', 'aging', 'companion', 'mobility', 'retraité', 'dementia', 'alzheimer',
      'third age', 'aide aux aînés'
    ],
    matchTokens: ['elder', 'senior', 'geriatric', 'âgé', 'aging', 'companion'],
  },
  cleaning: {
    id: 'cleaning',
    label: 'Domestic Housekeeping',
    keywords: [
      'clean', 'cleaner', 'cleaning', 'housekeep', 'housekeeper', 'housekeeping', 'ménage',
      'femme de ménage', 'nettoyage', 'maid', 'domestic', 'deep clean', 'sweep', 'mop',
      'upkeep', 'entretien', 'indoor clean', 'outdoor clean', 'moving clean'
    ],
    matchTokens: ['clean', 'housekeep', 'ménage', 'nettoy', 'maid', 'domestic'],
  },
  gardening: {
    id: 'gardening',
    label: 'Gardening & Lawn',
    keywords: [
      'garden', 'gardener', 'gardening', 'jardin', 'jardinier', 'lawn', 'mow', 'plants',
      'landscap', 'grass', 'pelouse', 'espace vert', 'arrosage'
    ],
    matchTokens: ['garden', 'jardin', 'lawn', 'plant'],
  },
  pet_care: {
    id: 'pet_care',
    label: 'Pet Care & Walking',
    keywords: [
      'pet', 'dog', 'cat', 'animal', 'chien', 'chat', 'puppy', 'walker', 'veterin',
      'promenade', 'garde d\'animaux', 'sitting'
    ],
    matchTokens: ['pet', 'dog', 'cat', 'animal', 'chien', 'chat'],
  },
  laundry_ironing: {
    id: 'laundry_ironing',
    label: 'Laundry & Ironing',
    keywords: [
      'laundry', 'iron', 'ironing', 'repassage', 'lessive', 'wash clothes', 'linge',
      'blanchisserie'
    ],
    matchTokens: ['laundry', 'iron', 'repass', 'lessiv', 'linge'],
  },
  cooking: {
    id: 'cooking',
    label: 'Cooking & Meal Prep',
    keywords: [
      'cook', 'cooking', 'chef', 'meal', 'repas', 'cuisine', 'cuisinier', 'food',
      'nourriture', 'traiteur', 'kitchen'
    ],
    matchTokens: ['cook', 'chef', 'cuisin', 'meal', 'repas'],
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

/**
 * Parses user free-text query into structured care requirements
 */
export function parseUserNeeds(prompt = '') {
  const text = prompt.toLowerCase();

  // 1. Detect service
  let detectedService = null;
  let highestCount = 0;

  for (const [key, category] of Object.entries(SERVICE_CATEGORIES)) {
    let count = 0;
    for (const kw of category.keywords) {
      if (text.includes(kw)) {
        count += kw.length > 5 ? 2 : 1;
      }
    }
    if (count > highestCount) {
      highestCount = count;
      detectedService = key;
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

  // 3. Detect budget (e.g., "budget 25", "max 30", "under 50", "20 fcfa", "20/hr", "15000")
  let detectedBudget = null;
  const budgetMatch = text.match(/(?:budget|max|under|up to|around|below|hourly)?\s*(\d{1,6})\s*(?:fcfa|xaf|frs|\/hr|fcfa\/hr)?/i);
  if (budgetMatch && budgetMatch[1]) {
    const val = parseInt(budgetMatch[1], 10);
    if (val >= 5 && val <= 100000) {
      detectedBudget = val;
    }
  }

  return {
    serviceKey: detectedService,
    serviceLabel: detectedService ? SERVICE_CATEGORIES[detectedService].label : null,
    location: detectedLocation,
    budget: detectedBudget,
    raw: prompt,
  };
}

/**
 * Checks if a provider strictly offers a given service category.
 * CRITICAL: Prevents recommending cleaners for babysitting or vice-versa!
 */
export function providerOffersService(provider, targetCategoryKey) {
  if (!targetCategoryKey || targetCategoryKey === 'all') return true;

  const category = SERVICE_CATEGORIES[targetCategoryKey];
  if (!category) return false;

  const prof = (provider.profession || '').toLowerCase();
  const specPrimary = (provider.specialty || '').toLowerCase();
  const specList = (Array.isArray(provider.specialties) ? provider.specialties : [])
    .map(s => String(s).toLowerCase());
  const bio = (provider.bio || '').toLowerCase();

  const combinedSearch = `${prof} ${specPrimary} ${specList.join(' ')}`;

  // Strict check: At least one category match token must be in profession or specialties
  const matchesCategoryTokens = category.matchTokens.some(token => combinedSearch.includes(token));

  if (matchesCategoryTokens) {
    return true;
  }

  // Fallback check on bio only if combinedSearch doesn't actively belong to a conflicting service
  const bioMatches = category.keywords.some(kw => bio.includes(kw));
  if (bioMatches) {
    // Make sure provider doesn't strictly belong to a conflicting primary category
    if (targetCategoryKey === 'babysitting' && (prof.includes('cleaner') || prof.includes('ménage')) && !prof.includes('nanny') && !prof.includes('baby')) {
      return false;
    }
    if (targetCategoryKey === 'nursing' && (prof.includes('cleaner') || prof.includes('gardener')) && !prof.includes('nurse')) {
      return false;
    }
    if (targetCategoryKey === 'cleaning' && (prof.includes('nurse') || prof.includes('babysitter')) && !prof.includes('clean')) {
      return false;
    }
    return true;
  }

  return false;
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
  if (context.budget) {
    const maxBudget = Number(context.budget);
    if (provider.pricePerHour <= maxBudget) {
      score += 15;
    } else {
      score -= 10; // penalty if out of requested budget
    }
  }

  // 8. Service exactness
  if (context.serviceKey) {
    const key = context.serviceKey.toLowerCase();
    const prof = (provider.profession || '').toLowerCase();
    if (prof.includes(key)) {
      score += 15;
    }
  }

  return score;
}

/**
 * Core recommendation engine:
 * 1. Strictly filters providers by required service
 * 2. Ranks remaining providers by qualification/proficiency score in descending order
 * 3. Returns top 5 recommendations
 */
export function getTopQualifiedProviders(providers = [], criteria = {}, limit = 5) {
  if (!Array.isArray(providers) || providers.length === 0) return [];

  // Filter approved & paid providers only
  const activeProviders = providers.filter(p => p.approvalStatus === 'approved' && p.subscriptionPaid);

  let candidates = activeProviders;

  // 1. Strict service filtering
  if (criteria.serviceKey && criteria.serviceKey !== 'all') {
    candidates = candidates.filter(p => providerOffersService(p, criteria.serviceKey));

    // Fallback: If no strict matches exist, do NOT return wrong services (e.g. cleaners for babysitting)
    if (candidates.length === 0) {
      return [];
    }
  }

  // 2. Score each candidate
  const scored = candidates.map(p => ({
    ...p,
    proficiencyScore: calculateProficiencyScore(p, criteria),
  }));

  // 3. Sort descending by proficiency score
  scored.sort((a, b) => b.proficiencyScore - a.proficiencyScore);

  // 4. Return top limit (default 5)
  return scored.slice(0, limit);
}
