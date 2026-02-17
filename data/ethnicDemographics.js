/**
 * District-level ethnic composition data for Nepal
 * Source: National Population and Housing Census 2021
 * Central Bureau of Statistics / National Statistics Office
 *
 * Ethnic categories:
 *   brahminChhetri - Khas Arya (Brahmin-Hill, Chhetri, Thakuri, Sanyasi/Dashnami)
 *   janajati - Adivasi Janajati (Tamang, Magar, Rai, Limbu, Gurung, Sherpa, etc.)
 *              Excludes Newar and Tharu which have their own categories
 *   madhesi - Terai/Madhesh caste groups (Yadav, Teli, Koiri, Kurmi, etc.)
 *   dalit - Hill Dalit (Kami/Bishwakarma, Damai, Sarki) + Terai Dalit (Musahar, Chamar, Dom)
 *   tharu - Tharu community
 *   muslim - Muslim community
 *   newar - Newar community
 *   others - All remaining groups
 *
 * National totals (Census 2021):
 *   brahminChhetri ~29%, janajati ~22%, madhesi ~12%, dalit ~13%,
 *   tharu ~6.2%, muslim ~4.4%, newar ~5%, others ~8.4%
 *
 * All proportions sum to 1.0 per district.
 */

export const ETHNIC_GROUPS = ['brahminChhetri', 'janajati', 'madhesi', 'dalit', 'tharu', 'muslim', 'newar', 'others'];

export const ETHNIC_GROUP_LABELS = {
  brahminChhetri: 'Brahmin/Chhetri',
  janajati: 'Janajati',
  madhesi: 'Madhesi',
  dalit: 'Dalit',
  tharu: 'Tharu',
  muslim: 'Muslim',
  newar: 'Newar',
  others: 'Others',
};

export const ETHNIC_GROUP_COLORS = {
  brahminChhetri: '#ef4444',
  janajati: '#3b82f6',
  madhesi: '#f59e0b',
  dalit: '#8b5cf6',
  tharu: '#22c55e',
  muslim: '#14b8a6',
  newar: '#ec4899',
  others: '#6b7280',
};

/**
 * District-level ethnic composition (proportions summing to 1.0)
 * 77 districts organized by province
 */
export const DISTRICT_ETHNICITY = {
  // ═══════════════════════════════════════
  // Province 1 — Koshi
  // ═══════════════════════════════════════
  'Taplejung': {
    brahminChhetri: 0.15, janajati: 0.58, madhesi: 0.02, dalit: 0.12,
    tharu: 0.00, muslim: 0.00, newar: 0.03, others: 0.10,
  },
  'Panchthar': {
    brahminChhetri: 0.25, janajati: 0.48, madhesi: 0.02, dalit: 0.12,
    tharu: 0.00, muslim: 0.00, newar: 0.04, others: 0.09,
  },
  'Ilam': {
    brahminChhetri: 0.30, janajati: 0.40, madhesi: 0.03, dalit: 0.12,
    tharu: 0.00, muslim: 0.01, newar: 0.05, others: 0.09,
  },
  'Jhapa': {
    brahminChhetri: 0.28, janajati: 0.28, madhesi: 0.08, dalit: 0.12,
    tharu: 0.04, muslim: 0.04, newar: 0.04, others: 0.12,
  },
  'Morang': {
    brahminChhetri: 0.22, janajati: 0.25, madhesi: 0.15, dalit: 0.14,
    tharu: 0.06, muslim: 0.05, newar: 0.03, others: 0.10,
  },
  'Sunsari': {
    brahminChhetri: 0.22, janajati: 0.25, madhesi: 0.16, dalit: 0.12,
    tharu: 0.04, muslim: 0.06, newar: 0.04, others: 0.11,
  },
  'Dhankuta': {
    brahminChhetri: 0.28, janajati: 0.48, madhesi: 0.02, dalit: 0.10,
    tharu: 0.00, muslim: 0.00, newar: 0.05, others: 0.07,
  },
  'Terhathum': {
    brahminChhetri: 0.28, janajati: 0.50, madhesi: 0.01, dalit: 0.10,
    tharu: 0.00, muslim: 0.00, newar: 0.03, others: 0.08,
  },
  'Sankhuwasabha': {
    brahminChhetri: 0.20, janajati: 0.58, madhesi: 0.01, dalit: 0.10,
    tharu: 0.00, muslim: 0.00, newar: 0.03, others: 0.08,
  },
  'Bhojpur': {
    brahminChhetri: 0.25, janajati: 0.48, madhesi: 0.02, dalit: 0.12,
    tharu: 0.00, muslim: 0.00, newar: 0.05, others: 0.08,
  },
  'Solukhumbu': {
    brahminChhetri: 0.12, janajati: 0.68, madhesi: 0.01, dalit: 0.08,
    tharu: 0.00, muslim: 0.00, newar: 0.03, others: 0.08,
  },
  'Okhaldhunga': {
    brahminChhetri: 0.35, janajati: 0.38, madhesi: 0.01, dalit: 0.14,
    tharu: 0.00, muslim: 0.00, newar: 0.04, others: 0.08,
  },
  'Khotang': {
    brahminChhetri: 0.22, janajati: 0.55, madhesi: 0.01, dalit: 0.10,
    tharu: 0.00, muslim: 0.00, newar: 0.04, others: 0.08,
  },
  'Udayapur': {
    brahminChhetri: 0.25, janajati: 0.32, madhesi: 0.12, dalit: 0.12,
    tharu: 0.04, muslim: 0.03, newar: 0.04, others: 0.08,
  },

  // ═══════════════════════════════════════
  // Province 2 — Madhesh
  // ═══════════════════════════════════════
  'Saptari': {
    brahminChhetri: 0.08, janajati: 0.10, madhesi: 0.40, dalit: 0.18,
    tharu: 0.06, muslim: 0.12, newar: 0.02, others: 0.04,
  },
  'Siraha': {
    brahminChhetri: 0.06, janajati: 0.10, madhesi: 0.42, dalit: 0.18,
    tharu: 0.04, muslim: 0.10, newar: 0.02, others: 0.08,
  },
  'Dhanusha': {
    brahminChhetri: 0.06, janajati: 0.08, madhesi: 0.48, dalit: 0.16,
    tharu: 0.02, muslim: 0.12, newar: 0.02, others: 0.06,
  },
  'Mahottari': {
    brahminChhetri: 0.05, janajati: 0.06, madhesi: 0.45, dalit: 0.18,
    tharu: 0.02, muslim: 0.14, newar: 0.02, others: 0.08,
  },
  'Sarlahi': {
    brahminChhetri: 0.08, janajati: 0.08, madhesi: 0.42, dalit: 0.18,
    tharu: 0.03, muslim: 0.10, newar: 0.02, others: 0.09,
  },
  'Rautahat': {
    brahminChhetri: 0.06, janajati: 0.05, madhesi: 0.42, dalit: 0.18,
    tharu: 0.02, muslim: 0.18, newar: 0.01, others: 0.08,
  },
  'Bara': {
    brahminChhetri: 0.08, janajati: 0.08, madhesi: 0.38, dalit: 0.16,
    tharu: 0.10, muslim: 0.10, newar: 0.02, others: 0.08,
  },
  'Parsa': {
    brahminChhetri: 0.10, janajati: 0.08, madhesi: 0.38, dalit: 0.16,
    tharu: 0.06, muslim: 0.12, newar: 0.02, others: 0.08,
  },

  // ═══════════════════════════════════════
  // Province 3 — Bagmati
  // ═══════════════════════════════════════
  'Sindhuli': {
    brahminChhetri: 0.30, janajati: 0.32, madhesi: 0.10, dalit: 0.14,
    tharu: 0.00, muslim: 0.02, newar: 0.05, others: 0.07,
  },
  'Ramechhap': {
    brahminChhetri: 0.25, janajati: 0.45, madhesi: 0.02, dalit: 0.14,
    tharu: 0.00, muslim: 0.00, newar: 0.06, others: 0.08,
  },
  'Dolakha': {
    brahminChhetri: 0.25, janajati: 0.40, madhesi: 0.01, dalit: 0.12,
    tharu: 0.00, muslim: 0.00, newar: 0.12, others: 0.10,
  },
  'Sindhupalchok': {
    brahminChhetri: 0.20, janajati: 0.52, madhesi: 0.01, dalit: 0.12,
    tharu: 0.00, muslim: 0.00, newar: 0.08, others: 0.07,
  },
  'Kavrepalanchok': {
    brahminChhetri: 0.25, janajati: 0.38, madhesi: 0.02, dalit: 0.12,
    tharu: 0.00, muslim: 0.01, newar: 0.14, others: 0.08,
  },
  'Lalitpur': {
    brahminChhetri: 0.25, janajati: 0.15, madhesi: 0.02, dalit: 0.08,
    tharu: 0.00, muslim: 0.01, newar: 0.40, others: 0.09,
  },
  'Bhaktapur': {
    brahminChhetri: 0.18, janajati: 0.10, madhesi: 0.01, dalit: 0.06,
    tharu: 0.00, muslim: 0.01, newar: 0.55, others: 0.09,
  },
  'Kathmandu': {
    brahminChhetri: 0.28, janajati: 0.18, madhesi: 0.03, dalit: 0.06,
    tharu: 0.01, muslim: 0.02, newar: 0.30, others: 0.12,
  },
  'Nuwakot': {
    brahminChhetri: 0.30, janajati: 0.42, madhesi: 0.01, dalit: 0.12,
    tharu: 0.00, muslim: 0.00, newar: 0.08, others: 0.07,
  },
  'Rasuwa': {
    brahminChhetri: 0.12, janajati: 0.70, madhesi: 0.00, dalit: 0.08,
    tharu: 0.00, muslim: 0.00, newar: 0.03, others: 0.07,
  },
  'Dhading': {
    brahminChhetri: 0.30, janajati: 0.42, madhesi: 0.01, dalit: 0.12,
    tharu: 0.00, muslim: 0.00, newar: 0.07, others: 0.08,
  },
  'Makwanpur': {
    brahminChhetri: 0.25, janajati: 0.38, madhesi: 0.05, dalit: 0.12,
    tharu: 0.02, muslim: 0.02, newar: 0.08, others: 0.08,
  },
  'Chitwan': {
    brahminChhetri: 0.38, janajati: 0.20, madhesi: 0.05, dalit: 0.12,
    tharu: 0.12, muslim: 0.02, newar: 0.05, others: 0.06,
  },

  // ═══════════════════════════════════════
  // Province 4 — Gandaki
  // ═══════════════════════════════════════
  'Gorkha': {
    brahminChhetri: 0.35, janajati: 0.38, madhesi: 0.01, dalit: 0.14,
    tharu: 0.00, muslim: 0.01, newar: 0.04, others: 0.07,
  },
  'Manang': {
    brahminChhetri: 0.08, janajati: 0.82, madhesi: 0.00, dalit: 0.03,
    tharu: 0.00, muslim: 0.00, newar: 0.02, others: 0.05,
  },
  'Mustang': {
    brahminChhetri: 0.10, janajati: 0.75, madhesi: 0.00, dalit: 0.05,
    tharu: 0.00, muslim: 0.00, newar: 0.03, others: 0.07,
  },
  'Myagdi': {
    brahminChhetri: 0.35, janajati: 0.35, madhesi: 0.00, dalit: 0.15,
    tharu: 0.00, muslim: 0.00, newar: 0.05, others: 0.10,
  },
  'Kaski': {
    brahminChhetri: 0.38, janajati: 0.30, madhesi: 0.02, dalit: 0.12,
    tharu: 0.00, muslim: 0.02, newar: 0.06, others: 0.10,
  },
  'Lamjung': {
    brahminChhetri: 0.30, janajati: 0.42, madhesi: 0.01, dalit: 0.14,
    tharu: 0.00, muslim: 0.00, newar: 0.05, others: 0.08,
  },
  'Tanahu': {
    brahminChhetri: 0.35, janajati: 0.35, madhesi: 0.01, dalit: 0.14,
    tharu: 0.00, muslim: 0.01, newar: 0.06, others: 0.08,
  },
  'Nawalpur': {
    brahminChhetri: 0.30, janajati: 0.22, madhesi: 0.05, dalit: 0.12,
    tharu: 0.15, muslim: 0.03, newar: 0.05, others: 0.08,
  },
  'Syangja': {
    brahminChhetri: 0.45, janajati: 0.28, madhesi: 0.01, dalit: 0.14,
    tharu: 0.00, muslim: 0.00, newar: 0.05, others: 0.07,
  },
  'Parbat': {
    brahminChhetri: 0.48, janajati: 0.22, madhesi: 0.01, dalit: 0.16,
    tharu: 0.00, muslim: 0.00, newar: 0.05, others: 0.08,
  },
  'Baglung': {
    brahminChhetri: 0.40, janajati: 0.28, madhesi: 0.01, dalit: 0.16,
    tharu: 0.00, muslim: 0.01, newar: 0.05, others: 0.09,
  },

  // ═══════════════════════════════════════
  // Province 5 — Lumbini
  // ═══════════════════════════════════════
  'Gulmi': {
    brahminChhetri: 0.48, janajati: 0.22, madhesi: 0.01, dalit: 0.18,
    tharu: 0.00, muslim: 0.00, newar: 0.04, others: 0.07,
  },
  'Palpa': {
    brahminChhetri: 0.38, janajati: 0.25, madhesi: 0.02, dalit: 0.15,
    tharu: 0.00, muslim: 0.02, newar: 0.10, others: 0.08,
  },
  'Nawalparasi W': {
    brahminChhetri: 0.25, janajati: 0.18, madhesi: 0.08, dalit: 0.12,
    tharu: 0.20, muslim: 0.05, newar: 0.04, others: 0.08,
  },
  'Rupandehi': {
    brahminChhetri: 0.22, janajati: 0.15, madhesi: 0.20, dalit: 0.12,
    tharu: 0.05, muslim: 0.15, newar: 0.04, others: 0.07,
  },
  'Kapilvastu': {
    brahminChhetri: 0.12, janajati: 0.08, madhesi: 0.28, dalit: 0.12,
    tharu: 0.08, muslim: 0.22, newar: 0.02, others: 0.08,
  },
  'Arghakhanchi': {
    brahminChhetri: 0.48, janajati: 0.22, madhesi: 0.01, dalit: 0.18,
    tharu: 0.00, muslim: 0.01, newar: 0.04, others: 0.06,
  },
  'Pyuthan': {
    brahminChhetri: 0.40, janajati: 0.28, madhesi: 0.01, dalit: 0.20,
    tharu: 0.00, muslim: 0.00, newar: 0.03, others: 0.08,
  },
  'Rolpa': {
    brahminChhetri: 0.30, janajati: 0.40, madhesi: 0.00, dalit: 0.20,
    tharu: 0.00, muslim: 0.00, newar: 0.02, others: 0.08,
  },
  'Dang': {
    brahminChhetri: 0.28, janajati: 0.15, madhesi: 0.05, dalit: 0.14,
    tharu: 0.25, muslim: 0.03, newar: 0.03, others: 0.07,
  },
  'Banke': {
    brahminChhetri: 0.22, janajati: 0.12, madhesi: 0.12, dalit: 0.12,
    tharu: 0.20, muslim: 0.10, newar: 0.03, others: 0.09,
  },
  'Rukum': {
    brahminChhetri: 0.35, janajati: 0.32, madhesi: 0.00, dalit: 0.22,
    tharu: 0.00, muslim: 0.00, newar: 0.02, others: 0.09,
  },

  // ═══════════════════════════════════════
  // Province 6 — Karnali
  // ═══════════════════════════════════════
  'Salyan': {
    brahminChhetri: 0.52, janajati: 0.12, madhesi: 0.01, dalit: 0.22,
    tharu: 0.02, muslim: 0.01, newar: 0.02, others: 0.08,
  },
  'Surkhet': {
    brahminChhetri: 0.42, janajati: 0.12, madhesi: 0.03, dalit: 0.18,
    tharu: 0.12, muslim: 0.02, newar: 0.03, others: 0.08,
  },
  'Dailekh': {
    brahminChhetri: 0.55, janajati: 0.08, madhesi: 0.01, dalit: 0.22,
    tharu: 0.02, muslim: 0.01, newar: 0.02, others: 0.09,
  },
  'Jajarkot': {
    brahminChhetri: 0.48, janajati: 0.15, madhesi: 0.00, dalit: 0.25,
    tharu: 0.00, muslim: 0.01, newar: 0.02, others: 0.09,
  },
  'Kalikot': {
    brahminChhetri: 0.58, janajati: 0.05, madhesi: 0.00, dalit: 0.28,
    tharu: 0.00, muslim: 0.00, newar: 0.01, others: 0.08,
  },
  'Jumla': {
    brahminChhetri: 0.62, janajati: 0.05, madhesi: 0.00, dalit: 0.22,
    tharu: 0.00, muslim: 0.00, newar: 0.01, others: 0.10,
  },
  'Dolpa': {
    brahminChhetri: 0.25, janajati: 0.50, madhesi: 0.00, dalit: 0.12,
    tharu: 0.00, muslim: 0.00, newar: 0.01, others: 0.12,
  },
  'Mugu': {
    brahminChhetri: 0.48, janajati: 0.22, madhesi: 0.00, dalit: 0.20,
    tharu: 0.00, muslim: 0.00, newar: 0.01, others: 0.09,
  },
  'Humla': {
    brahminChhetri: 0.42, janajati: 0.28, madhesi: 0.00, dalit: 0.18,
    tharu: 0.00, muslim: 0.00, newar: 0.01, others: 0.11,
  },

  // ═══════════════════════════════════════
  // Province 7 — Sudurpashchim
  // ═══════════════════════════════════════
  'Bardiya': {
    brahminChhetri: 0.18, janajati: 0.08, madhesi: 0.08, dalit: 0.14,
    tharu: 0.38, muslim: 0.05, newar: 0.02, others: 0.07,
  },
  'Kailali': {
    brahminChhetri: 0.28, janajati: 0.10, madhesi: 0.05, dalit: 0.14,
    tharu: 0.28, muslim: 0.04, newar: 0.02, others: 0.09,
  },
  'Kanchanpur': {
    brahminChhetri: 0.32, janajati: 0.08, madhesi: 0.04, dalit: 0.14,
    tharu: 0.25, muslim: 0.04, newar: 0.03, others: 0.10,
  },
  'Dadeldhura': {
    brahminChhetri: 0.52, janajati: 0.04, madhesi: 0.01, dalit: 0.28,
    tharu: 0.02, muslim: 0.01, newar: 0.02, others: 0.10,
  },
  'Baitadi': {
    brahminChhetri: 0.55, janajati: 0.03, madhesi: 0.01, dalit: 0.28,
    tharu: 0.00, muslim: 0.01, newar: 0.02, others: 0.10,
  },
  'Darchula': {
    brahminChhetri: 0.55, janajati: 0.05, madhesi: 0.00, dalit: 0.25,
    tharu: 0.00, muslim: 0.01, newar: 0.02, others: 0.12,
  },
  'Bajhang': {
    brahminChhetri: 0.58, janajati: 0.03, madhesi: 0.00, dalit: 0.28,
    tharu: 0.00, muslim: 0.00, newar: 0.01, others: 0.10,
  },
  'Bajura': {
    brahminChhetri: 0.58, janajati: 0.03, madhesi: 0.00, dalit: 0.28,
    tharu: 0.00, muslim: 0.00, newar: 0.01, others: 0.10,
  },
  'Achham': {
    brahminChhetri: 0.55, janajati: 0.04, madhesi: 0.00, dalit: 0.28,
    tharu: 0.00, muslim: 0.01, newar: 0.02, others: 0.10,
  },
  'Doti': {
    brahminChhetri: 0.52, janajati: 0.04, madhesi: 0.01, dalit: 0.28,
    tharu: 0.02, muslim: 0.01, newar: 0.02, others: 0.10,
  },
};

/**
 * National average ethnic composition (Census 2021)
 */
export const NATIONAL_ETHNICITY = {
  brahminChhetri: 0.29,
  janajati: 0.22,
  madhesi: 0.12,
  dalit: 0.13,
  tharu: 0.062,
  muslim: 0.044,
  newar: 0.050,
  others: 0.084,
};

/**
 * Get ethnic composition for a district
 * @param {string} districtName
 * @returns {Object|null} Ethnic proportions or null
 */
export function getDistrictEthnicity(districtName) {
  return DISTRICT_ETHNICITY[districtName] || null;
}

/**
 * Get the dominant ethnic group in a district
 * @param {string} districtName
 * @returns {{ group: string, proportion: number }|null}
 */
export function getDominantGroup(districtName) {
  const data = DISTRICT_ETHNICITY[districtName];
  if (!data) return null;

  let maxGroup = null;
  let maxProp = 0;
  for (const [group, prop] of Object.entries(data)) {
    if (prop > maxProp) {
      maxGroup = group;
      maxProp = prop;
    }
  }
  return { group: maxGroup, proportion: maxProp };
}
