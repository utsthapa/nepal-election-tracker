// Geographic Cluster Classification for Nepal Election Simulator
// Groups 165 FPTP constituencies into 4 clusters with different swing multipliers
// National "waves" do not hit every part of Nepal with equal force

/**
 * Cluster Definitions:
 * - Metropolitan: Major cities, high urbanization (>70%), high youth density
 *   Swing Multiplier: 1.8x (High elasticity for new waves)
 *   Examples: Kathmandu, Lalitpur, Bhaktapur, Pokhara, Butwal, Dharan, Biratnagar
 * 
 * - Terai Urban: Urban areas in Terai belt, moderate urbanization (30-70%)
 *   Swing Multiplier: 1.2x
 *   Examples: Birgunj, Janakpur, Nepalgunj, Butwal (Terai side)
 * 
 * - Hilly Rural: Rural hilly areas, low urbanization (<30%), traditional party strongholds
 *   Swing Multiplier: 0.7x
 *   Most hill districts outside major cities
 * 
 * - Mountain: Remote mountain districts, very low urbanization (<15%), isolated
 *   Swing Multiplier: 0.3x
 *   Examples: Solukhumbu, Mustang, Dolpa, Mugu, Humla
 */

import { constituencies } from './constituencies';

// Swing multipliers for each cluster
export const SWING_MULTIPLIERS = {
  metropolitan: 1.8,
  teraiUrban: 1.2,
  hillyRural: 0.7,
  mountain: 0.3,
};

// Geographic cluster classification for all 165 constituencies
export const GEOGRAPHIC_CLUSTERS = {
  // METROPOLITAN: Major cities with high urbanization and youth density
  metropolitan: [
    // Kathmandu District (Province 3)
    'P3-Kathmandu-1',
    'P3-Kathmandu-2',
    'P3-Kathmandu-3',
    'P3-Kathmandu-4',
    'P3-Kathmandu-5',
    'P3-Kathmandu-6',
    'P3-Kathmandu-7',
    'P3-Kathmandu-8',
    'P3-Kathmandu-9',
    'P3-Kathmandu-10',
    // Lalitpur District (Province 3)
    'P3-Lalitpur-1',
    'P3-Lalitpur-2',
    'P3-Lalitpur-3',
    // Bhaktapur District (Province 3)
    'P3-Bhaktapur-1',
    'P3-Bhaktapur-2',
    // Major urban centers in other provinces
    'P1-Biratnagar-1',  // Morang district - major urban center
    'P1-Biratnagar-2',  // Morang district - major urban center
    'P1-Biratnagar-3',  // Morang district - major urban center
    'P1-Biratnagar-4',  // Morang district - major urban center
    'P4-Pokhara-1',    // Kaski district - major urban center
    'P4-Pokhara-2',    // Kaski district - major urban center
    'P5-Butwal-1',     // Rupandehi district - major urban center
    'P5-Butwal-2',     // Rupandehi district - major urban center
    'P2-Birgunj-1',    // Parsa district - major urban center
    'P2-Birgunj-2',    // Parsa district - major urban center
    'P2-Janakpur-1',   // Dhanusha district - major urban center
    'P2-Janakpur-2',   // Dhanusha district - major urban center
    'P5-Nepalgunj-1',  // Banke district - major urban center
    'P5-Nepalgunj-2',  // Banke district - major urban center
  ],

  // TERAI URBAN: Urban areas in Terai belt with moderate urbanization
  teraiUrban: [
    // Province 1 - Terai districts
    'P1-Jhapa-1',
    'P1-Jhapa-2',
    'P1-Jhapa-3',
    'P1-Jhapa-4',
    'P1-Jhapa-5',
    'P1-Morang-1',
    'P1-Morang-2',
    'P1-Morang-3',
    'P1-Morang-4',
    'P1-Sunsari-1',
    'P1-Sunsari-2',
    'P1-Sunsari-3',
    'P1-Sunsari-4',
    
    // Province 2 - Madhesh (all Terai)
    'P2-Saptari-1',
    'P2-Saptari-2',
    'P2-Siraha-1',
    'P2-Siraha-2',
    'P2-Dhanusha-1',
    'P2-Dhanusha-2',
    'P2-Dhanusha-3',
    'P2-Dhanusha-4',
    'P2-Mahottari-1',
    'P2-Mahottari-2',
    'P2-Mahottari-3',
    'P2-Mahottari-4',
    'P2-Sarlahi-1',
    'P2-Sarlahi-2',
    'P2-Sarlahi-3',
    'P2-Sarlahi-4',
    'P2-Rautahat-1',
    'P2-Rautahat-2',
    'P2-Rautahat-3',
    'P2-Rautahat-4',
    'P2-Bara-1',
    'P2-Bara-2',
    'P2-Bara-3',
    'P2-Bara-4',
    'P2-Parsa-1',
    'P2-Parsa-2',
    'P2-Parsa-3',
    'P2-Parsa-4',
    
    // Province 3 - Terai districts
    'P3-Chitwan-1',
    'P3-Chitwan-2',
    'P3-Chitwan-3',
    
    // Province 4 - Terai districts
    'P4-Nawalpur-1',
    'P4-Nawalpur-2',
    
    // Province 5 - Lumbini (mostly Terai)
    'P5-Rupandehi-1',
    'P5-Rupandehi-2',
    'P5-Kapilvastu-1',
    'P5-Kapilvastu-2',
    'P5-Arghakhanchi-1',
    'P5-Arghakhanchi-2',
    'P5-Palpa-1',
    'P5-Palpa-2',
    'P5-Palpa-3',
    'P5-Gulmi-1',
    'P5-Gulmi-2',
    'P5-Pythan-1',
    'P5-Pythan-2',
    'P5-Pythan-3',
    'P5-Syangja-1',
    'P5-Syangja-2',
    
    // Province 7 - Terai districts
    'P7-Kailali-1',
    'P7-Kailali-2',
    'P7-Kailali-3',
    'P7-Kailali-4',
    'P7-Kailali-5',
  ],

  // HILLY RURAL: Rural hilly areas, traditional party strongholds
  hillyRural: [
    // Province 1 - Hill districts
    'P1-Bhojpur-1',
    'P1-Bhojpur-2',
    'P1-Dhankuta-1',
    'P1-Dhankuta-2',
    'P1-Ilam-1',
    'P1-Ilam-2',
    'P1-Khotang-1',
    'P1-Khotang-2',
    'P1-Terhathum-1',
    'P1-Terhathum-2',
    'P1-Sankhuwasabha-1',
    'P1-Sankhuwasabha-2',
    'P1-Solukhumbu-1',
    'P1-Okhaldhunga-1',
    'P1-Udayapur-1',
    'P1-Udayapur-2',
    
    // Province 3 - Hill districts
    'P3-Sindhuli-1',
    'P3-Sindhuli-2',
    'P3-Ramechhap-1',
    'P3-Ramechhap-2',
    'P3-Dolakha-1',
    'P3-Dolakha-2',
    'P3-Sindhupalchok-1',
    'P3-Sindhupalchok-2',
    'P3-Kavrepalanchok-1',
    'P3-Kavrepalanchok-2',
    'P3-Nuwakot-1',
    'P3-Nuwakot-2',
    'P3-Rasuwa-1',
    'P3-Rasuwa-2',
    'P3-Makwanpur-1',
    'P3-Makwanpur-2',
    'P3-Dhading-1',
    'P3-Dhading-2',
    
    // Province 4 - Hill districts
    'P4-Tanahun-1',
    'P4-Tanahun-2',
    'P4-Syangja-1',
    'P4-Syangja-2',
    'P4-Kaski-1',
    'P4-Kaski-2',
    'P4-Lamjung-1',
    'P4-Lamjung-2',
    'P4-Gorkha-1',
    'P4-Gorkha-2',
    'P4-Manang-1',
    'P4-Parbat-1',
    'P4-Myagdi-1',
    'P4-Myagdi-2',
    
    // Province 5 - Hill districts
    'P5-Pythan-1',
    'P5-Pythan-2',
    'P5-Pythan-3',
    'P5-Syangja-1',
    'P5-Syangja-2',
    'P5-Arghakhanchi-1',
    'P5-Arghakhanchi-2',
    'P5-Palpa-1',
    'P5-Palpa-2',
    'P5-Palpa-3',
    'P5-Gulmi-1',
    'P5-Gulmi-2',
    'P5-Parbat-1',
    'P5-Parbat-2',
    
    // Province 7 - Hill districts
    'P7-Dadeldhura-1',
    'P7-Darchula-1',
    'P7-Doti-1',
    'P7-Bajhang-1',
    'P7-Bajura-1',
    'P7-Baitadi-1',
    'P7-Achham-1',
    'P7-Achham-2',
    'P7-Kanchanpur-1',
    'P7-Kanchanpur-2',
    'P7-Kanchanpur-3',
  ],

  // MOUNTAIN: Remote mountain districts with very low urbanization
  mountain: [
    // Province 1 - Mountain districts
    'P1-Taplejung-1',
    'P1-Panchthar-1',
    'P1-Panchthar-2',
    
    // Province 4 - Mountain districts
    'P4-Mustang-1',
    'P4-Manang-1',
    
    // Province 6 - Karnali (all mountain)
    'P6-Dolpa-1',
    'P6-Humla-1',
    'P6-Jumla-1',
    'P6-Kalikot-1',
    'P6-Mugu-1',
    'P6-Rukum East-1',
    'P6-Rukum West-1',
    'P6-Salyan-1',
    'P6-Surkhet-1',
    'P6-Surkhet-2',
    'P6-Jajarkot-1',
    'P6-Jajarkot-2',
  ],
};

// Build reverse lookup: constituency ID -> cluster
export const CONSTITUENCY_TO_CLUSTER = {};
Object.entries(GEOGRAPHIC_CLUSTERS).forEach(([cluster, seats]) => {
  seats.forEach(seatId => {
    CONSTITUENCY_TO_CLUSTER[seatId] = cluster;
  });
});

/**
 * Get the geographic cluster for a constituency
 * @param {string} constituencyId - The constituency ID (e.g., 'P3-Kathmandu-2')
 * @returns {string} The cluster name ('metropolitan', 'teraiUrban', 'hillyRural', 'mountain')
 */
export function getConstituencyCluster(constituencyId) {
  return CONSTITUENCY_TO_CLUSTER[constituencyId] || 'hillyRural';
}

/**
 * Get the swing multiplier for a constituency
 * @param {string} constituencyId - The constituency ID
 * @returns {number} The swing multiplier (1.8, 1.2, 0.7, or 0.3)
 */
export function getSwingMultiplier(constituencyId) {
  const cluster = getConstituencyCluster(constituencyId);
  return SWING_MULTIPLIERS[cluster] || 1.0;
}

/**
 * Get cluster display name
 * @param {string} cluster - The cluster name
 * @returns {string} Display name
 */
export function getClusterDisplayName(cluster) {
  const names = {
    metropolitan: 'Metropolitan',
    teraiUrban: 'Terai Urban',
    hillyRural: 'Hilly Rural',
    mountain: 'Mountain',
  };
  return names[cluster] || cluster;
}

/**
 * Get cluster description
 * @param {string} cluster - The cluster name
 * @returns {string} Description
 */
export function getClusterDescription(cluster) {
  const descriptions = {
    metropolitan: 'Major cities with high urbanization (>70%) and youth density. High elasticity for new waves.',
    teraiUrban: 'Urban areas in Terai belt with moderate urbanization (30-70%).',
    hillyRural: 'Rural hilly areas with low urbanization (<30%). Traditional party strongholds.',
    mountain: 'Remote mountain districts with very low urbanization (<15%). Isolated, low elasticity.',
  };
  return descriptions[cluster] || '';
}

// Export statistics
export const CLUSTER_STATS = {
  metropolitan: GEOGRAPHIC_CLUSTERS.metropolitan.length,
  teraiUrban: GEOGRAPHIC_CLUSTERS.teraiUrban.length,
  hillyRural: GEOGRAPHIC_CLUSTERS.hillyRural.length,
  mountain: GEOGRAPHIC_CLUSTERS.mountain.length,
  total: Object.values(GEOGRAPHIC_CLUSTERS).reduce((sum, seats) => sum + seats.length, 0),
};

export default {
  GEOGRAPHIC_CLUSTERS,
  SWING_MULTIPLIERS,
  CONSTITUENCY_TO_CLUSTER,
  getConstituencyCluster,
  getSwingMultiplier,
  getClusterDisplayName,
  getClusterDescription,
  CLUSTER_STATS,
};
