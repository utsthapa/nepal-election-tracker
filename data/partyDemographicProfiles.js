/**
 * Party Demographic Profiles
 * Defines where each party's support is concentrated based on demographics
 * Used for realistic seat projections in custom scenarios
 */

// Demographic affinity scores (0-1) for each party
// Higher = stronger support in that demographic
export const PARTY_DEMOGRAPHIC_PROFILES = {
  RSP: {
    // RSP: Urban, educated, young professionals - concentrated in cities
    urbanAffinity: 0.85, // Very strong in urban areas
    educationAffinity: 0.8, // Strong with educated voters
    youthAffinity: 0.75, // Strong with youth (18-35)
    middleClassAffinity: 0.8, // Strong middle class appeal
    // Geographic concentration - Kathmandu Valley, major cities
    keyDistricts: ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kaski', 'Rupandehi', 'Morang'],
    voteEfficiency: 1.4, // Votes are concentrated where they matter
    description:
      'Urban, educated, young professionals - concentrated in Kathmandu Valley and major cities',
  },
  NC: {
    // NC: Broad-based but rural/traditional strongholds
    urbanAffinity: 0.35, // Weak in urban areas
    educationAffinity: 0.45, // Moderate with educated
    youthAffinity: 0.4, // Weak with youth
    middleClassAffinity: 0.45, // Moderate middle class
    // Traditional strongholds - Terai, rural hills
    keyDistricts: ['Dhanusa', 'Mahottari', 'Sarlahi', 'Rautahat', 'Chitwan', 'Nawalparasi'],
    voteEfficiency: 0.85, // Votes spread thin
    description: 'Traditional party with rural Terai and hill strongholds',
  },
  UML: {
    // UML: Urban working class, some rural pockets
    urbanAffinity: 0.55, // Moderate urban
    educationAffinity: 0.5, // Moderate education
    youthAffinity: 0.55, // Moderate youth (party organization)
    middleClassAffinity: 0.5, // Moderate
    keyDistricts: ['Jhapa', 'Ilam', 'Jhapa', 'Surkhet', 'Dang'],
    voteEfficiency: 0.9,
    description: 'Urban working class and organized rural pockets',
  },
  Maoist: {
    // Maoist: Rural, remote areas, some youth appeal
    urbanAffinity: 0.25, // Weak urban
    educationAffinity: 0.35, // Weak educated
    youthAffinity: 0.5, // Some youth appeal (revolutionary legacy)
    middleClassAffinity: 0.3, // Weak middle class
    keyDistricts: ['Rolpa', 'Rukum', 'Salyan', 'Dolpa', 'Jajarkot'],
    voteEfficiency: 0.8,
    description: 'Rural remote areas, former conflict zones',
  },
  RPP: {
    // RPP: Urban elite, some Terai pockets
    urbanAffinity: 0.6, // Moderate-strong urban
    educationAffinity: 0.55, // Moderate educated
    youthAffinity: 0.35, // Weak youth
    middleClassAffinity: 0.6, // Moderate-strong middle class
    keyDistricts: ['Kathmandu', 'Rupandehi', 'Kaski'],
    voteEfficiency: 0.85,
    description: 'Urban elite, monarchist sympathizers',
  },
  JSPN: {
    // JSPN: Madhesh-specific
    urbanAffinity: 0.4,
    educationAffinity: 0.35,
    youthAffinity: 0.45,
    middleClassAffinity: 0.35,
    keyDistricts: ['Dhanusa', 'Mahottari', 'Sarlahi', 'Rautahat', 'Bara', 'Parsa'],
    voteEfficiency: 0.75,
    description: 'Madhesh-specific party',
  },
  JP: {
    // Janamat: Madhesh, some youth
    urbanAffinity: 0.35,
    educationAffinity: 0.4,
    youthAffinity: 0.55,
    middleClassAffinity: 0.4,
    keyDistricts: ['Saptari', 'Siraha', 'Dhanusa'],
    voteEfficiency: 0.8,
    description: 'Madhesh with youth appeal',
  },
  Others: {
    urbanAffinity: 0.4,
    educationAffinity: 0.4,
    youthAffinity: 0.4,
    middleClassAffinity: 0.4,
    keyDistricts: [],
    voteEfficiency: 0.7,
    description: 'Scattered support',
  },
};

// Constituency types based on demographics
export const CONSTITUENCY_TYPES = {
  URBAN_CORE: 'urban_core', // High urban, high education (KTM valley)
  URBAN_PERIPHERY: 'urban_periphery', // Moderate urban
  RURAL_HILL: 'rural_hill', // Low urban, hill districts
  RURAL_TERAI: 'rural_terai', // Low urban, Terai
  MIXED: 'mixed', // Average demographics
};

// Thresholds for constituency classification
export const DEMOGRAPHIC_THRESHOLDS = {
  HIGH_URBAN: 0.5, // 50%+ urban
  HIGH_EDUCATION: 0.75, // 75%+ literacy
  HIGH_YOUTH: 0.35, // 35%+ youth (15-29)
  MODERATE_URBAN: 0.25, // 25%+ urban
};

/**
 * Calculate vote efficiency multiplier for a party at given national vote share
 * RSP at 40% should win more seats than NC at 40% due to concentration
 */
export function calculateVoteEfficiency(party, nationalVoteShare) {
  const profile = PARTY_DEMOGRAPHIC_PROFILES[party];
  if (!profile) return 1.0;

  // Base efficiency from profile
  let efficiency = profile.voteEfficiency;

  // Efficiency changes with vote share (non-linear)
  // At low vote shares, concentrated parties overperform
  // At high vote shares, spread-out parties catch up
  if (nationalVoteShare < 20) {
    // Small parties benefit from concentration
    efficiency *= 1.2;
  } else if (nationalVoteShare > 35) {
    // Large parties - efficiency normalizes
    efficiency *= 0.9;
  }

  return efficiency;
}

/**
 * Get expected seats based on vote share and demographic profile
 * Uses cube law relationship adjusted for vote efficiency
 */
export function projectSeatsFromVoteShare(party, nationalVoteShare, totalSeats = 165) {
  const profile = PARTY_DEMOGRAPHIC_PROFILES[party];
  if (!profile) {
    // Default cube law for unknown parties
    return Math.round(totalSeats * Math.pow(nationalVoteShare / 100, 3));
  }

  const efficiency = calculateVoteEfficiency(party, nationalVoteShare);

  // Cube law: seats ∝ votes³, adjusted for efficiency
  // RSP at 40% with 1.4 efficiency should get ~50-60 seats, not 30-40
  const baseRatio = nationalVoteShare / 100;
  const seatRatio = Math.pow(baseRatio, 2.5) * efficiency; // Slightly less than cube for realism

  return Math.round(totalSeats * seatRatio);
}

/**
 * Calculate constituency-level expected vote based on demographics
 */
export function calculateConstituencyVote(party, constituencyDemographics, nationalVoteShare) {
  const profile = PARTY_DEMOGRAPHIC_PROFILES[party];
  if (!profile) return nationalVoteShare;

  const { urbanPopulation = 0.3, literacyRate = 0.65, ageGroups = {} } = constituencyDemographics;
  const youthShare = ageGroups['15-29'] || 0.25;

  // Calculate demographic bonus/penalty
  let demographicMultiplier = 1.0;

  // Urban bonus/penalty
  if (urbanPopulation > DEMOGRAPHIC_THRESHOLDS.HIGH_URBAN) {
    demographicMultiplier += (profile.urbanAffinity - 0.5) * 0.6;
  } else if (urbanPopulation < 0.15) {
    demographicMultiplier -= (profile.urbanAffinity - 0.5) * 0.4;
  }

  // Education bonus/penalty
  if (literacyRate > DEMOGRAPHIC_THRESHOLDS.HIGH_EDUCATION) {
    demographicMultiplier += (profile.educationAffinity - 0.5) * 0.4;
  }

  // Youth bonus/penalty
  if (youthShare > DEMOGRAPHIC_THRESHOLDS.HIGH_YOUTH) {
    demographicMultiplier += (profile.youthAffinity - 0.5) * 0.3;
  }

  // Clamp multiplier
  demographicMultiplier = Math.max(0.3, Math.min(2.5, demographicMultiplier));

  return nationalVoteShare * demographicMultiplier;
}

export default {
  PARTY_DEMOGRAPHIC_PROFILES,
  CONSTITUENCY_TYPES,
  DEMOGRAPHIC_THRESHOLDS,
  calculateVoteEfficiency,
  projectSeatsFromVoteShare,
  calculateConstituencyVote,
};
