// Nepal District Ethnicity Data - Based on National Population and Housing Census 2021
// Source: Central Bureau of Statistics (CBS) / National Statistics Office (NSO)
// Primary: https://censusnepal.cbs.gov.np/results/files/result-folder/Caste%20Ethnicity_report_NPHC_2021.pdf
// Atlas: https://giwmscdnone.gov.np/media/pdf_upload/Nepal_Atlas_Caste_and_Ethnic_Groups_mkuqof1.pdf
// Reference: https://en.wikipedia.org/wiki/Ethnic_groups_in_Nepal
//
// Categories aggregate 142 census castes into 8 broad groups:
//   brahminChhetri: Khas Arya (Hill Brahmin, Chhetri, Thakuri, Sanyasi/Dasnami)
//   janajati:       Indigenous nationalities (Tamang, Magar, Rai, Limbu, Gurung, Sherpa, etc.)
//                   Excludes Newar and Tharu (counted separately)
//   madhesi:        Terai caste groups (Yadav, Teli, Koiri, Kushwaha, Kurmi, Dhanuk, etc.)
//   dalit:          Hill Dalit (Kami/Bishwakarma, Damai/Pariyar, Sarki) + Madhesi Dalit (Chamar, Musahar, Dusadh, Dom, etc.)
//   tharu:          Tharu (counted separately due to distinct Terai identity)
//   muslim:         Muslim community
//   newar:          Newar (counted separately due to distinct cultural identity)
//   other:          Remaining groups (Marwari, Bangali, Rajbanshi, Gangai, Dhimal, Santal, etc.)
//
// National totals (2021 census validation):
//   brahminChhetri: ~31.2% (Chhetri 16.4% + Brahmin-Hill 11.3% + Thakuri 1.5% + Sanyasi 1.7%)
//   janajati: ~28.1% (Magar 6.9% + Tamang 5.6% + Rai 4.2% + Gurung 2.2% + Limbu 1.4% + Sherpa 0.6% + others)
//   madhesi: ~15.2% (Yadav 4.6% + Teli 1.7% + Koiri 1.1% + Kushwaha 1.0% + Kurmi 0.6% + others)
//   dalit: ~13.1% (Kami 5.0% + Damai 1.7% + Sarki 1.2% + Chamar 1.4% + Musahar 0.8% + Dusadh 0.8% + others)
//   tharu: ~6.2%
//   muslim: ~5.1%
//   newar: ~4.9%
//   other: ~2.2%
//
// Proportions are decimal fractions summing to ~1.0 for each district.
// Where exact district data was not available, estimates were derived from:
//   (a) provincial aggregates, (b) 2011 census district data with 2021 trends applied,
//   (c) language/mother-tongue data as proxy, (d) regional geographic patterns.

export const DISTRICT_ETHNICITY = {
  // =========================================================================
  // PROVINCE 1 - KOSHI (14 districts)
  // Province profile: Chhetri 11.0%, Rai 10.2%, Bahun 8.3%, Limbu 7.8%,
  //   Sherpa 7.3%, Tamang 4.6%, Tharu 4.2%, Muslim 4.1%, Magar 4.0%, Newar 3.6%
  // =========================================================================

  'Taplejung': {
    // Mountain district, Limbu homeland (Limbuwan), some Rai, Sherpa
    brahminChhetri: 0.15,
    janajati: 0.62, // Limbu ~43%, Rai ~8%, Sherpa ~5%, others
    madhesi: 0.01,
    dalit: 0.12,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.03,
    other: 0.07,
  },
  'Panchthar': {
    // Hill district, Limbu majority ~44%, significant Rai
    brahminChhetri: 0.14,
    janajati: 0.63, // Limbu ~44%, Rai ~10%, Tamang ~3%
    madhesi: 0.01,
    dalit: 0.12,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.03,
    other: 0.07,
  },
  'Ilam': {
    // Hill district, diverse - Rai 24%, Limbu 16%, Brahmin 14%, Chhetri 14%
    brahminChhetri: 0.28,
    janajati: 0.42, // Rai ~24%, Limbu ~16%, Tamang ~7%, Magar ~5%
    madhesi: 0.02,
    dalit: 0.12,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.05,
    other: 0.10,
  },
  'Jhapa': {
    // Terai district, very diverse (110 castes), Brahmin/Chhetri largest
    brahminChhetri: 0.28,
    janajati: 0.18, // Limbu, Tamang, Magar, Rai, Rajbanshi
    madhesi: 0.12,
    dalit: 0.15,
    tharu: 0.04,
    muslim: 0.05,
    newar: 0.04,
    other: 0.14, // Rajbanshi, Dhimal, Santal, Gangai
  },
  'Morang': {
    // Terai district, highest diversity index (0.95), very mixed
    brahminChhetri: 0.22,
    janajati: 0.18, // Rai, Tamang, Limbu, Rajbanshi
    madhesi: 0.16,
    dalit: 0.14,
    tharu: 0.06,
    muslim: 0.07,
    newar: 0.04,
    other: 0.13, // Rajbanshi, Dhimal, Santal
  },
  'Sunsari': {
    // Terai district, high diversity (0.94)
    brahminChhetri: 0.20,
    janajati: 0.16, // Rai, Tamang, Limbu
    madhesi: 0.22,
    dalit: 0.13,
    tharu: 0.05,
    muslim: 0.08,
    newar: 0.04,
    other: 0.12,
  },
  'Dhankuta': {
    // Hill district, Rai homeland
    brahminChhetri: 0.28,
    janajati: 0.42, // Rai ~30%, Limbu ~5%, Magar ~4%
    madhesi: 0.02,
    dalit: 0.15,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.06,
    other: 0.06,
  },
  'Terhathum': {
    // Hill district, Limbu ~36%, Rai significant
    brahminChhetri: 0.22,
    janajati: 0.55, // Limbu ~36%, Rai ~12%, Tamang, Magar
    madhesi: 0.01,
    dalit: 0.13,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.04,
    other: 0.05,
  },
  'Sankhuwasabha': {
    // Hill/Mountain district, Rai majority, some Sherpa
    brahminChhetri: 0.22,
    janajati: 0.52, // Rai ~30%, Sherpa ~8%, Tamang ~5%, Limbu ~6%
    madhesi: 0.01,
    dalit: 0.14,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.04,
    other: 0.07,
  },
  'Bhojpur': {
    // Hill district, Rai homeland
    brahminChhetri: 0.28,
    janajati: 0.42, // Rai ~30%, Tamang, Magar
    madhesi: 0.02,
    dalit: 0.16,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.05,
    other: 0.07,
  },
  'Solukhumbu': {
    // Mountain district, Sherpa/Rai area - Rai 17.4%, Sherpa 17.1%, Chhetri 14%
    brahminChhetri: 0.18,
    janajati: 0.62, // Rai ~17%, Sherpa ~17%, Kulung(Rai) ~10%, Tamang ~10%, Magar
    madhesi: 0.01,
    dalit: 0.10,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.04,
    other: 0.05,
  },
  'Okhaldhunga': {
    // Hill district, mixed Rai, Brahmin/Chhetri
    brahminChhetri: 0.32,
    janajati: 0.38, // Rai ~22%, Tamang ~8%, Magar ~5%
    madhesi: 0.01,
    dalit: 0.18,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.05,
    other: 0.06,
  },
  'Khotang': {
    // Hill district, Rai homeland
    brahminChhetri: 0.24,
    janajati: 0.50, // Rai ~35%, Tamang ~8%, Magar ~4%
    madhesi: 0.01,
    dalit: 0.14,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.05,
    other: 0.06,
  },
  'Udayapur': {
    // Inner Terai/Hill district, mixed
    brahminChhetri: 0.26,
    janajati: 0.24, // Rai, Tamang, Magar, Chepang
    madhesi: 0.14,
    dalit: 0.14,
    tharu: 0.06,
    muslim: 0.04,
    newar: 0.04,
    other: 0.08,
  },

  // =========================================================================
  // PROVINCE 2 - MADHESH (8 districts)
  // Province profile: Yadav 14.78%, Muslim 11.58%, Tharu 5.27%, Teli 5.09%
  // Dominated by Madhesi castes and Muslim communities
  // =========================================================================

  'Saptari': {
    // Terai, Madhesi majority, Tharu second-largest, diverse
    brahminChhetri: 0.06,
    janajati: 0.04, // Rajbanshi, Tamang minorities
    madhesi: 0.48, // Yadav, Teli, Koiri, Kushwaha, Kalwar, etc.
    dalit: 0.19, // Madhesi Dalit: Chamar, Musahar, Dusadh, Dom
    tharu: 0.09,
    muslim: 0.10,
    newar: 0.01,
    other: 0.03,
  },
  'Siraha': {
    // Terai, Madhesi dominant
    brahminChhetri: 0.05,
    janajati: 0.04,
    madhesi: 0.46,
    dalit: 0.20,
    tharu: 0.06,
    muslim: 0.12,
    newar: 0.01,
    other: 0.06,
  },
  'Dhanusha': {
    // Terai, Madhesi dominant, Yadav >17%
    brahminChhetri: 0.04,
    janajati: 0.04,
    madhesi: 0.48, // Madhesi non-Dalit 44.6%
    dalit: 0.20, // Madhesi Dalit 18.8%
    tharu: 0.03,
    muslim: 0.13,
    newar: 0.01,
    other: 0.07,
  },
  'Mahottari': {
    // Terai, Madhesi dominant, high Muslim population
    brahminChhetri: 0.04,
    janajati: 0.04,
    madhesi: 0.44,
    dalit: 0.20,
    tharu: 0.03,
    muslim: 0.17, // One of highest Muslim concentration districts
    newar: 0.01,
    other: 0.07,
  },
  'Sarlahi': {
    // Terai, Madhesi dominant, some hill migration
    brahminChhetri: 0.08,
    janajati: 0.06,
    madhesi: 0.42,
    dalit: 0.18,
    tharu: 0.04,
    muslim: 0.14,
    newar: 0.01,
    other: 0.07,
  },
  'Rautahat': {
    // Terai, highest Muslim proportion ~17.2%
    brahminChhetri: 0.05,
    janajati: 0.04,
    madhesi: 0.40,
    dalit: 0.18,
    tharu: 0.04,
    muslim: 0.21, // Highest Muslim % in Nepal
    newar: 0.01,
    other: 0.07,
  },
  'Bara': {
    // Terai, Madhesi dominant, significant Muslim
    brahminChhetri: 0.07,
    janajati: 0.06,
    madhesi: 0.40,
    dalit: 0.17,
    tharu: 0.06,
    muslim: 0.16,
    newar: 0.01,
    other: 0.07,
  },
  'Parsa': {
    // Terai, Madhesi >65%, Muslim >17%
    brahminChhetri: 0.06,
    janajati: 0.05,
    madhesi: 0.38,
    dalit: 0.16,
    tharu: 0.07,
    muslim: 0.20,
    newar: 0.01,
    other: 0.07,
  },

  // =========================================================================
  // PROVINCE 3 - BAGMATI (13 districts)
  // Province profile: Tamang 19.89%, Brahmin-Hill 17.84%, Chhetri 17.41%,
  //   Newar 15.57%, Magar 5.11%, Kami 2.75%, Gurung 2.30%
  // =========================================================================

  'Sindhuli': {
    // Hill/inner Terai, mixed Tamang, Magar, Brahmin/Chhetri
    brahminChhetri: 0.24,
    janajati: 0.36, // Tamang ~18%, Magar ~10%, Rai ~4%
    madhesi: 0.08,
    dalit: 0.14,
    tharu: 0.02,
    muslim: 0.03,
    newar: 0.06,
    other: 0.07,
  },
  'Ramechhap': {
    // Hill district, Tamang significant, mixed
    brahminChhetri: 0.28,
    janajati: 0.40, // Tamang ~25%, Magar ~6%, Rai ~4%
    madhesi: 0.02,
    dalit: 0.14,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.08,
    other: 0.07,
  },
  'Dolakha': {
    // Hill district, Khas 49%, Janajati 42%, Tamang ~17%, Newar significant
    brahminChhetri: 0.32,
    janajati: 0.30, // Tamang ~17%, Sherpa ~6%, Thami ~4%
    madhesi: 0.01,
    dalit: 0.14,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.14,
    other: 0.09,
  },
  'Sindhupalchok': {
    // Hill district, Tamang 34.4%, mixed
    brahminChhetri: 0.22,
    janajati: 0.46, // Tamang ~34%, Sherpa ~3%, Hyolmo ~2%
    madhesi: 0.01,
    dalit: 0.10,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.12,
    other: 0.09,
  },
  'Kavrepalanchok': {
    // Hill district near Kathmandu, Tamang, Newar, Brahmin/Chhetri
    brahminChhetri: 0.26,
    janajati: 0.30, // Tamang ~22%, Magar ~4%
    madhesi: 0.02,
    dalit: 0.14,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.18,
    other: 0.09,
  },
  'Lalitpur': {
    // Kathmandu Valley, Newar heartland, cosmopolitan
    brahminChhetri: 0.30,
    janajati: 0.14, // Tamang ~8%, Magar ~3%
    madhesi: 0.03,
    dalit: 0.07,
    tharu: 0.01,
    muslim: 0.03,
    newar: 0.34,
    other: 0.08,
  },
  'Bhaktapur': {
    // Kathmandu Valley, Newar 36%, Khas 43%
    brahminChhetri: 0.28,
    janajati: 0.12, // Tamang ~7%, Magar ~3%
    madhesi: 0.02,
    dalit: 0.09,
    tharu: 0.00,
    muslim: 0.02,
    newar: 0.40,
    other: 0.07,
  },
  'Kathmandu': {
    // Capital, most cosmopolitan, Newar ~22%, Brahmin ~20%, Chhetri ~18%
    brahminChhetri: 0.30,
    janajati: 0.18, // Tamang ~10%, Magar ~3%, Gurung ~2%, Rai ~1%
    madhesi: 0.04,
    dalit: 0.06,
    tharu: 0.01,
    muslim: 0.04,
    newar: 0.28,
    other: 0.09,
  },
  'Nuwakot': {
    // Hill district, Tamang 43%, mixed
    brahminChhetri: 0.24,
    janajati: 0.46, // Tamang ~43%, Magar ~2%
    madhesi: 0.01,
    dalit: 0.12,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.10,
    other: 0.06,
  },
  'Rasuwa': {
    // Mountain district, Tamang ~70%, lowest diversity index (0.50)
    brahminChhetri: 0.12,
    janajati: 0.74, // Tamang ~70%, Ghale ~4%
    madhesi: 0.00,
    dalit: 0.06,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.02,
    other: 0.06,
  },
  'Dhading': {
    // Hill district, Tamang significant, mixed
    brahminChhetri: 0.28,
    janajati: 0.38, // Tamang ~28%, Magar ~5%, Chepang ~3%
    madhesi: 0.02,
    dalit: 0.14,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.10,
    other: 0.07,
  },
  'Makwanpur': {
    // Inner Terai, Tamang 48.3%, mixed
    brahminChhetri: 0.18,
    janajati: 0.50, // Tamang ~48%, Chepang ~4%, Magar ~3%
    madhesi: 0.05,
    dalit: 0.10,
    tharu: 0.02,
    muslim: 0.02,
    newar: 0.06,
    other: 0.07,
  },
  'Chitwan': {
    // Inner Terai, diverse migrant district
    brahminChhetri: 0.36,
    janajati: 0.16, // Tamang ~6%, Magar ~5%, Gurung ~3%
    madhesi: 0.06,
    dalit: 0.12,
    tharu: 0.14,
    muslim: 0.03,
    newar: 0.06,
    other: 0.07,
  },

  // =========================================================================
  // PROVINCE 4 - GANDAKI (11 districts)
  // Province profile: Khas 53% (Bahun 20%, Chhetri ~15%, Khas Dalit 18%)
  // Gurung, Magar are major Janajati
  // =========================================================================

  'Gorkha': {
    // Hill district, Brahmin/Chhetri, Gurung, Magar
    brahminChhetri: 0.32,
    janajati: 0.34, // Gurung ~20%, Magar ~7%, Tamang ~5%
    madhesi: 0.01,
    dalit: 0.18,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.07,
    other: 0.07,
  },
  'Manang': {
    // Mountain district, Gurung majority ~52%
    brahminChhetri: 0.10,
    janajati: 0.78, // Gurung ~52%, Tibetan groups
    madhesi: 0.00,
    dalit: 0.03,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.02,
    other: 0.07,
  },
  'Mustang': {
    // Mountain district, Tibetan groups, Gurung, Thakali
    brahminChhetri: 0.14,
    janajati: 0.68, // Gurung ~21%, Thakali ~20%, Tibetan groups ~15%
    madhesi: 0.01,
    dalit: 0.08,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.02,
    other: 0.07,
  },
  'Myagdi': {
    // Hill district, Magar significant, mixed Khas
    brahminChhetri: 0.30,
    janajati: 0.32, // Magar ~20%, Gurung ~8%
    madhesi: 0.01,
    dalit: 0.22,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.06,
    other: 0.09,
  },
  'Kaski': {
    // Hill/urban district (Pokhara), mixed cosmopolitan
    brahminChhetri: 0.38,
    janajati: 0.22, // Gurung ~12%, Magar ~5%, Tamang ~3%
    madhesi: 0.03,
    dalit: 0.14,
    tharu: 0.01,
    muslim: 0.04,
    newar: 0.08,
    other: 0.10,
  },
  'Lamjung': {
    // Hill district, Gurung homeland ~31%
    brahminChhetri: 0.26,
    janajati: 0.42, // Gurung ~31%, Tamang ~7%, Magar ~3%
    madhesi: 0.01,
    dalit: 0.18,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.06,
    other: 0.07,
  },
  'Tanahu': {
    // Hill district, mixed Magar, Gurung, Brahmin/Chhetri
    brahminChhetri: 0.32,
    janajati: 0.28, // Magar ~14%, Gurung ~10%, Tamang ~3%
    madhesi: 0.02,
    dalit: 0.20,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.08,
    other: 0.09,
  },
  'Nawalpur': {
    // Inner Terai, mixed with Tharu
    brahminChhetri: 0.30,
    janajati: 0.18, // Magar ~8%, Tamang ~5%, Gurung ~3%
    madhesi: 0.08,
    dalit: 0.14,
    tharu: 0.12,
    muslim: 0.05,
    newar: 0.05,
    other: 0.08,
  },
  'Syangja': {
    // Hill district, Magar, Brahmin/Chhetri, Gurung
    brahminChhetri: 0.34,
    janajati: 0.28, // Magar ~14%, Gurung ~10%
    madhesi: 0.01,
    dalit: 0.22,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.06,
    other: 0.09,
  },
  'Parbat': {
    // Hill district, mixed Gurung, Magar, Brahmin
    brahminChhetri: 0.30,
    janajati: 0.28, // Magar ~14%, Gurung ~10%
    madhesi: 0.01,
    dalit: 0.24,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.06,
    other: 0.11,
  },
  'Baglung': {
    // Hill district, Magar significant
    brahminChhetri: 0.32,
    janajati: 0.28, // Magar ~18%, Gurung ~5%
    madhesi: 0.01,
    dalit: 0.24,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.05,
    other: 0.09,
  },

  // =========================================================================
  // PROVINCE 5 - LUMBINI (12 districts)
  // Province profile: Magar 14.6%, Tharu 14.3%, Chhetri 14.2%,
  //   Brahmin-Hill 11.3%, Muslim 7.1%
  // =========================================================================

  'Gulmi': {
    // Hill district, Magar significant
    brahminChhetri: 0.34,
    janajati: 0.28, // Magar ~22%, Gurung ~3%
    madhesi: 0.01,
    dalit: 0.24,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.04,
    other: 0.08,
  },
  'Palpa': {
    // Hill district, Magar majority area (place names from Magar etymons)
    brahminChhetri: 0.28,
    janajati: 0.34, // Magar ~28%, Gurung ~3%
    madhesi: 0.02,
    dalit: 0.20,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.08,
    other: 0.07,
  },
  'Nawalparasi W': {
    // Inner Terai/Terai, mixed with Tharu
    brahminChhetri: 0.26,
    janajati: 0.14, // Magar ~6%, Tamang ~4%
    madhesi: 0.12,
    dalit: 0.14,
    tharu: 0.14,
    muslim: 0.08,
    newar: 0.04,
    other: 0.08,
  },
  'Rupandehi': {
    // Terai, diverse urban (Butwal/Bhairahawa)
    brahminChhetri: 0.22,
    janajati: 0.10, // Magar ~5%, Tamang ~3%
    madhesi: 0.20,
    dalit: 0.14,
    tharu: 0.08,
    muslim: 0.12,
    newar: 0.04,
    other: 0.10,
  },
  'Kapilvastu': {
    // Terai, Muslim significant, Madhesi, Tharu
    brahminChhetri: 0.10,
    janajati: 0.06,
    madhesi: 0.28,
    dalit: 0.14,
    tharu: 0.10,
    muslim: 0.24, // High Muslim concentration
    newar: 0.01,
    other: 0.07,
  },
  'Arghakhanchi': {
    // Hill district, Magar significant
    brahminChhetri: 0.32,
    janajati: 0.30, // Magar ~24%, Gurung ~3%
    madhesi: 0.01,
    dalit: 0.24,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.04,
    other: 0.09,
  },
  'Pyuthan': {
    // Hill district, Magar significant
    brahminChhetri: 0.32,
    janajati: 0.30, // Magar ~24%
    madhesi: 0.01,
    dalit: 0.24,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.04,
    other: 0.09,
  },
  'Rolpa': {
    // Hill district, Magar majority
    brahminChhetri: 0.26,
    janajati: 0.42, // Magar ~38%
    madhesi: 0.01,
    dalit: 0.22,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.02,
    other: 0.07,
  },
  'Rukum': {
    // Hill district (Rukum East), Magar significant
    brahminChhetri: 0.28,
    janajati: 0.38, // Magar ~32%
    madhesi: 0.01,
    dalit: 0.22,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.03,
    other: 0.08,
  },
  'Dang': {
    // Inner Terai, Tharu 26.4%, Chhetri 26.6%, mixed
    brahminChhetri: 0.28,
    janajati: 0.12, // Magar ~6%, Tamang ~3%
    madhesi: 0.06,
    dalit: 0.16,
    tharu: 0.26,
    muslim: 0.04,
    newar: 0.02,
    other: 0.06,
  },
  'Banke': {
    // Terai, Tharu 16.4%, diverse urban (Nepalgunj)
    brahminChhetri: 0.20,
    janajati: 0.10, // Magar ~5%
    madhesi: 0.14,
    dalit: 0.12,
    tharu: 0.16,
    muslim: 0.18, // Nepalgunj has large Muslim population
    newar: 0.03,
    other: 0.07,
  },
  'Bardiya': {
    // Terai, Tharu majority ~53%
    brahminChhetri: 0.14,
    janajati: 0.06, // Magar ~3%
    madhesi: 0.06,
    dalit: 0.10,
    tharu: 0.48,
    muslim: 0.08,
    newar: 0.01,
    other: 0.07,
  },

  // =========================================================================
  // PROVINCE 6 - KARNALI (10 districts)
  // Province profile: Chhetri 41.9%, Kami 15.8%, Magar 10.9%,
  //   Thakuri 10.3%, Brahmin 8.4%
  // Least diverse province (80 groups), Khas-Arya dominant
  // =========================================================================

  'Rukum W': {
    // Hill district (Rukum West), Khas dominant, some Magar
    brahminChhetri: 0.40,
    janajati: 0.22, // Magar ~18%
    madhesi: 0.00,
    dalit: 0.30,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.02,
    other: 0.06,
  },
  'Salyan': {
    // Hill district, Khas dominant
    brahminChhetri: 0.42,
    janajati: 0.16, // Magar ~12%
    madhesi: 0.01,
    dalit: 0.30,
    tharu: 0.02,
    muslim: 0.01,
    newar: 0.02,
    other: 0.06,
  },
  'Surkhet': {
    // Hill/inner Terai, provincial capital, more diverse
    brahminChhetri: 0.38,
    janajati: 0.14, // Magar ~8%, Tharu ~3%
    madhesi: 0.04,
    dalit: 0.24,
    tharu: 0.08,
    muslim: 0.03,
    newar: 0.03,
    other: 0.06,
  },
  'Dailekh': {
    // Hill district, Khas dominant
    brahminChhetri: 0.46,
    janajati: 0.12, // Magar ~8%
    madhesi: 0.01,
    dalit: 0.30,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.02,
    other: 0.08,
  },
  'Jajarkot': {
    // Hill district, Khas dominant
    brahminChhetri: 0.44,
    janajati: 0.14, // Magar ~10%
    madhesi: 0.01,
    dalit: 0.30,
    tharu: 0.00,
    muslim: 0.02,
    newar: 0.02,
    other: 0.07,
  },
  'Kalikot': {
    // Mountain/Hill district, Khas dominant, Brahmin ~17%
    brahminChhetri: 0.52,
    janajati: 0.06, // Magar small
    madhesi: 0.00,
    dalit: 0.32,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.01,
    other: 0.09,
  },
  'Jumla': {
    // Mountain district, Khas dominant
    brahminChhetri: 0.52,
    janajati: 0.06,
    madhesi: 0.00,
    dalit: 0.32,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.01,
    other: 0.09,
  },
  'Dolpa': {
    // Mountain district, Tibetan groups, some Khas
    brahminChhetri: 0.30,
    janajati: 0.42, // Tibetan/Bhote groups, Magar
    madhesi: 0.00,
    dalit: 0.16,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.01,
    other: 0.11,
  },
  'Mugu': {
    // Mountain district, Khas dominant, some Tibetan groups
    brahminChhetri: 0.42,
    janajati: 0.22, // Tibetan/Bhote groups
    madhesi: 0.00,
    dalit: 0.26,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.01,
    other: 0.09,
  },
  'Humla': {
    // Mountain district, mixed Khas and Tibetan groups
    brahminChhetri: 0.36,
    janajati: 0.30, // Tibetan/Bhote groups, Lama
    madhesi: 0.00,
    dalit: 0.24,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.01,
    other: 0.09,
  },

  // =========================================================================
  // PROVINCE 7 - SUDURPASHCHIM (9 districts)
  // Province profile: Chhetri 44.09%, Tharu 17.15%, Brahmin-Hill 11.90%,
  //   Kami 7.22%, Thakuri 4.40%, Damai 2.56%, Magar 2.18%
  // =========================================================================

  'Bardiya': {
    // NOTE: Bardiya is in Lumbini Province above, NOT Sudurpashchim
    // This entry intentionally left as reference - see Lumbini Province
  },
  'Kailali': {
    // Terai, Tharu ~44%, Chhetri significant
    brahminChhetri: 0.24,
    janajati: 0.04, // Magar ~2%
    madhesi: 0.06,
    dalit: 0.14,
    tharu: 0.38,
    muslim: 0.06,
    newar: 0.02,
    other: 0.06,
  },
  'Kanchanpur': {
    // Terai, Khas 67%, Tharu 26%
    brahminChhetri: 0.34,
    janajati: 0.04,
    madhesi: 0.06,
    dalit: 0.14,
    tharu: 0.26,
    muslim: 0.04,
    newar: 0.02,
    other: 0.10,
  },
  'Dadeldhura': {
    // Hill district, Khas dominant, Brahmin ~16%
    brahminChhetri: 0.48,
    janajati: 0.04, // Magar small
    madhesi: 0.01,
    dalit: 0.36,
    tharu: 0.02,
    muslim: 0.01,
    newar: 0.01,
    other: 0.07,
  },
  'Baitadi': {
    // Hill district, Khas dominant, Brahmin ~19%
    brahminChhetri: 0.52,
    janajati: 0.04,
    madhesi: 0.01,
    dalit: 0.34,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.01,
    other: 0.07,
  },
  'Darchula': {
    // Mountain/Hill district, Khas dominant, Brahmin ~17%
    brahminChhetri: 0.52,
    janajati: 0.06, // Some Byansi/Rang
    madhesi: 0.00,
    dalit: 0.32,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.01,
    other: 0.09,
  },
  'Bajhang': {
    // Mountain/Hill district, Khas dominant
    brahminChhetri: 0.50,
    janajati: 0.04,
    madhesi: 0.00,
    dalit: 0.36,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.01,
    other: 0.08,
  },
  'Bajura': {
    // Mountain/Hill district, Khas dominant
    brahminChhetri: 0.48,
    janajati: 0.04,
    madhesi: 0.00,
    dalit: 0.38,
    tharu: 0.00,
    muslim: 0.00,
    newar: 0.01,
    other: 0.09,
  },
  'Achham': {
    // Hill district, Chhetri predominant, Dalit ~25%
    brahminChhetri: 0.48,
    janajati: 0.04,
    madhesi: 0.01,
    dalit: 0.38,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.01,
    other: 0.07,
  },
  'Doti': {
    // Hill district, Khas-Arya dominant
    brahminChhetri: 0.46,
    janajati: 0.06, // Magar small
    madhesi: 0.01,
    dalit: 0.36,
    tharu: 0.00,
    muslim: 0.01,
    newar: 0.01,
    other: 0.09,
  },
};

// Helper: Get dominant ethnic group for a district
export function getDominantGroup(district) {
  const data = DISTRICT_ETHNICITY[district];
  if (!data) return null;
  const groups = Object.entries(data);
  groups.sort((a, b) => b[1] - a[1]);
  return { group: groups[0][0], proportion: groups[0][1] };
}

// Helper: Get ethnic groups above a threshold for a district
export function getSignificantGroups(district, threshold = 0.10) {
  const data = DISTRICT_ETHNICITY[district];
  if (!data) return [];
  return Object.entries(data)
    .filter(([, val]) => val >= threshold)
    .sort((a, b) => b[1] - a[1])
    .map(([group, proportion]) => ({ group, proportion }));
}

// Ethnic group display labels
export const ETHNIC_GROUP_LABELS = {
  brahminChhetri: 'Brahmin/Chhetri (Khas Arya)',
  janajati: 'Janajati (Indigenous)',
  madhesi: 'Madhesi',
  dalit: 'Dalit',
  tharu: 'Tharu',
  muslim: 'Muslim',
  newar: 'Newar',
  other: 'Other',
};

// Ethnic group colors for charts
export const ETHNIC_GROUP_COLORS = {
  brahminChhetri: '#e74c3c', // Red
  janajati: '#3498db',       // Blue
  madhesi: '#f39c12',        // Orange
  dalit: '#9b59b6',          // Purple
  tharu: '#2ecc71',          // Green
  muslim: '#1abc9c',         // Teal
  newar: '#e67e22',          // Dark Orange
  other: '#95a5a6',          // Gray
};

export default DISTRICT_ETHNICITY;
