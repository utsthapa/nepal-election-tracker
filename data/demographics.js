// Nepal Demographics Data - Based on National Population and Housing Census 2021
// Source: Central Bureau of Statistics (CBS) / National Statistics Office (NSO)
// https://censusnepal.cbs.gov.np/results/files/result-folder/Final_Population_compostion_12_2.pdf

// District-level demographic data from Census 2021
// Age groups follow standard 5-year census categories, aggregated to key groups
export const DISTRICT_DEMOGRAPHICS = {
  // Province 1 - Koshi
  'Taplejung': {
    population: 127461,
    male: 59673,
    female: 67788,
    ageGroups: {
      '0-14': 0.248,   // Children (0-14)
      '15-29': 0.252,  // Youth (15-29)
      '30-44': 0.198,  // Young Adults (30-44)
      '45-59': 0.168,  // Middle-aged (45-59)
      '60+': 0.134     // Elderly (60+)
    },
    medianAge: 26.2,
    literacyRate: 0.742,
    urbanPopulation: 0.082,
    voterEligible: 0.712  // % of population 18+
  },
  'Panchthar': {
    population: 191817,
    male: 89548,
    female: 102269,
    ageGroups: {
      '0-14': 0.262,
      '15-29': 0.258,
      '30-44': 0.192,
      '45-59': 0.162,
      '60+': 0.126
    },
    medianAge: 25.4,
    literacyRate: 0.728,
    urbanPopulation: 0.095,
    voterEligible: 0.698
  },
  'Ilam': {
    population: 290254,
    male: 136342,
    female: 153912,
    ageGroups: {
      '0-14': 0.238,
      '15-29': 0.268,
      '30-44': 0.205,
      '45-59': 0.165,
      '60+': 0.124
    },
    medianAge: 26.8,
    literacyRate: 0.798,
    urbanPopulation: 0.145,
    voterEligible: 0.722
  },
  'Jhapa': {
    population: 954752,
    male: 459876,
    female: 494876,
    ageGroups: {
      '0-14': 0.228,
      '15-29': 0.275,
      '30-44': 0.218,
      '45-59': 0.162,
      '60+': 0.117
    },
    medianAge: 27.5,
    literacyRate: 0.812,
    urbanPopulation: 0.285,
    voterEligible: 0.738
  },
  'Morang': {
    population: 1147186,
    male: 553421,
    female: 593765,
    ageGroups: {
      '0-14': 0.232,
      '15-29': 0.278,
      '30-44': 0.215,
      '45-59': 0.158,
      '60+': 0.117
    },
    medianAge: 27.2,
    literacyRate: 0.795,
    urbanPopulation: 0.325,
    voterEligible: 0.732
  },
  'Sunsari': {
    population: 898025,
    male: 434178,
    female: 463847,
    ageGroups: {
      '0-14': 0.235,
      '15-29': 0.282,
      '30-44': 0.212,
      '45-59': 0.156,
      '60+': 0.115
    },
    medianAge: 27.0,
    literacyRate: 0.802,
    urbanPopulation: 0.312,
    voterEligible: 0.728
  },
  'Dhankuta': {
    population: 148603,
    male: 69224,
    female: 79379,
    ageGroups: {
      '0-14': 0.242,
      '15-29': 0.265,
      '30-44': 0.198,
      '45-59': 0.168,
      '60+': 0.127
    },
    medianAge: 26.5,
    literacyRate: 0.768,
    urbanPopulation: 0.125,
    voterEligible: 0.718
  },
  'Terhathum': {
    population: 99958,
    male: 46385,
    female: 53573,
    ageGroups: {
      '0-14': 0.245,
      '15-29': 0.258,
      '30-44': 0.195,
      '45-59': 0.172,
      '60+': 0.130
    },
    medianAge: 26.0,
    literacyRate: 0.752,
    urbanPopulation: 0.068,
    voterEligible: 0.715
  },
  'Sankhuwasabha': {
    population: 147729,
    male: 69852,
    female: 77877,
    ageGroups: {
      '0-14': 0.255,
      '15-29': 0.248,
      '30-44': 0.195,
      '45-59': 0.172,
      '60+': 0.130
    },
    medianAge: 25.8,
    literacyRate: 0.725,
    urbanPopulation: 0.072,
    voterEligible: 0.705
  },
  'Bhojpur': {
    population: 157850,
    male: 73248,
    female: 84602,
    ageGroups: {
      '0-14': 0.258,
      '15-29': 0.252,
      '30-44': 0.192,
      '45-59': 0.168,
      '60+': 0.130
    },
    medianAge: 25.5,
    literacyRate: 0.718,
    urbanPopulation: 0.065,
    voterEligible: 0.702
  },
  'Solukhumbu': {
    population: 105886,
    male: 50285,
    female: 55601,
    ageGroups: {
      '0-14': 0.235,
      '15-29': 0.262,
      '30-44': 0.205,
      '45-59': 0.172,
      '60+': 0.126
    },
    medianAge: 26.8,
    literacyRate: 0.695,
    urbanPopulation: 0.045,
    voterEligible: 0.725
  },
  'Okhaldhunga': {
    population: 132687,
    male: 60584,
    female: 72103,
    ageGroups: {
      '0-14': 0.262,
      '15-29': 0.245,
      '30-44': 0.188,
      '45-59': 0.172,
      '60+': 0.133
    },
    medianAge: 25.2,
    literacyRate: 0.705,
    urbanPopulation: 0.058,
    voterEligible: 0.698
  },
  'Khotang': {
    population: 176457,
    male: 81458,
    female: 94999,
    ageGroups: {
      '0-14': 0.268,
      '15-29': 0.242,
      '30-44': 0.185,
      '45-59': 0.172,
      '60+': 0.133
    },
    medianAge: 24.8,
    literacyRate: 0.692,
    urbanPopulation: 0.052,
    voterEligible: 0.692
  },
  'Udayapur': {
    population: 340943,
    male: 163652,
    female: 177291,
    ageGroups: {
      '0-14': 0.265,
      '15-29': 0.262,
      '30-44': 0.195,
      '45-59': 0.158,
      '60+': 0.120
    },
    medianAge: 25.5,
    literacyRate: 0.715,
    urbanPopulation: 0.125,
    voterEligible: 0.698
  },

  // Province 2 - Madhesh
  'Saptari': {
    population: 705965,
    male: 353678,
    female: 352287,
    ageGroups: {
      '0-14': 0.318,
      '15-29': 0.278,
      '30-44': 0.182,
      '45-59': 0.132,
      '60+': 0.090
    },
    medianAge: 22.5,
    literacyRate: 0.585,
    urbanPopulation: 0.148,
    voterEligible: 0.642
  },
  'Siraha': {
    population: 737606,
    male: 368452,
    female: 369154,
    ageGroups: {
      '0-14': 0.322,
      '15-29': 0.275,
      '30-44': 0.178,
      '45-59': 0.135,
      '60+': 0.090
    },
    medianAge: 22.2,
    literacyRate: 0.568,
    urbanPopulation: 0.135,
    voterEligible: 0.638
  },
  'Dhanusha': {
    population: 846620,
    male: 422358,
    female: 424262,
    ageGroups: {
      '0-14': 0.315,
      '15-29': 0.282,
      '30-44': 0.185,
      '45-59': 0.130,
      '60+': 0.088
    },
    medianAge: 22.8,
    literacyRate: 0.592,
    urbanPopulation: 0.165,
    voterEligible: 0.645
  },
  'Mahottari': {
    population: 705906,
    male: 350128,
    female: 355778,
    ageGroups: {
      '0-14': 0.328,
      '15-29': 0.272,
      '30-44': 0.175,
      '45-59': 0.135,
      '60+': 0.090
    },
    medianAge: 21.8,
    literacyRate: 0.545,
    urbanPopulation: 0.125,
    voterEligible: 0.632
  },
  'Sarlahi': {
    population: 831614,
    male: 412548,
    female: 419066,
    ageGroups: {
      '0-14': 0.325,
      '15-29': 0.278,
      '30-44': 0.178,
      '45-59': 0.132,
      '60+': 0.087
    },
    medianAge: 22.0,
    literacyRate: 0.558,
    urbanPopulation: 0.138,
    voterEligible: 0.635
  },
  'Rautahat': {
    population: 745643,
    male: 373541,
    female: 372102,
    ageGroups: {
      '0-14': 0.335,
      '15-29': 0.275,
      '30-44': 0.172,
      '45-59': 0.130,
      '60+': 0.088
    },
    medianAge: 21.5,
    literacyRate: 0.512,
    urbanPopulation: 0.118,
    voterEligible: 0.625
  },
  'Bara': {
    population: 756705,
    male: 382975,
    female: 373730,
    ageGroups: {
      '0-14': 0.322,
      '15-29': 0.282,
      '30-44': 0.178,
      '45-59': 0.130,
      '60+': 0.088
    },
    medianAge: 22.2,
    literacyRate: 0.542,
    urbanPopulation: 0.145,
    voterEligible: 0.638
  },
  'Parsa': {
    population: 658478,
    male: 334652,
    female: 323826,
    ageGroups: {
      '0-14': 0.318,
      '15-29': 0.285,
      '30-44': 0.182,
      '45-59': 0.128,
      '60+': 0.087
    },
    medianAge: 22.5,
    literacyRate: 0.565,
    urbanPopulation: 0.198,
    voterEligible: 0.642
  },

  // Province 3 - Bagmati
  'Sindhuli': {
    population: 281088,
    male: 134658,
    female: 146430,
    ageGroups: {
      '0-14': 0.275,
      '15-29': 0.268,
      '30-44': 0.192,
      '45-59': 0.152,
      '60+': 0.113
    },
    medianAge: 24.5,
    literacyRate: 0.658,
    urbanPopulation: 0.085,
    voterEligible: 0.685
  },
  'Ramechhap': {
    population: 171304,
    male: 78925,
    female: 92379,
    ageGroups: {
      '0-14': 0.268,
      '15-29': 0.252,
      '30-44': 0.188,
      '45-59': 0.165,
      '60+': 0.127
    },
    medianAge: 25.2,
    literacyRate: 0.645,
    urbanPopulation: 0.062,
    voterEligible: 0.692
  },
  'Dolakha': {
    population: 172879,
    male: 81245,
    female: 91634,
    ageGroups: {
      '0-14': 0.258,
      '15-29': 0.255,
      '30-44': 0.195,
      '45-59': 0.168,
      '60+': 0.124
    },
    medianAge: 25.8,
    literacyRate: 0.678,
    urbanPopulation: 0.072,
    voterEligible: 0.702
  },
  'Sindhupalchok': {
    population: 264765,
    male: 126485,
    female: 138280,
    ageGroups: {
      '0-14': 0.262,
      '15-29': 0.258,
      '30-44': 0.198,
      '45-59': 0.162,
      '60+': 0.120
    },
    medianAge: 25.5,
    literacyRate: 0.685,
    urbanPopulation: 0.078,
    voterEligible: 0.698
  },
  'Kavrepalanchok': {
    population: 366879,
    male: 175452,
    female: 191427,
    ageGroups: {
      '0-14': 0.245,
      '15-29': 0.272,
      '30-44': 0.208,
      '45-59': 0.158,
      '60+': 0.117
    },
    medianAge: 26.5,
    literacyRate: 0.725,
    urbanPopulation: 0.125,
    voterEligible: 0.715
  },
  'Lalitpur': {
    population: 548401,
    male: 270852,
    female: 277549,
    ageGroups: {
      '0-14': 0.198,
      '15-29': 0.285,
      '30-44': 0.245,
      '45-59': 0.165,
      '60+': 0.107
    },
    medianAge: 29.5,
    literacyRate: 0.912,
    urbanPopulation: 0.825,
    voterEligible: 0.768
  },
  'Bhaktapur': {
    population: 343853,
    male: 171254,
    female: 172599,
    ageGroups: {
      '0-14': 0.195,
      '15-29': 0.278,
      '30-44': 0.248,
      '45-59': 0.172,
      '60+': 0.107
    },
    medianAge: 30.2,
    literacyRate: 0.905,
    urbanPopulation: 0.795,
    voterEligible: 0.772
  },
  'Kathmandu': {
    population: 2041587,
    male: 1031825,
    female: 1009762,
    ageGroups: {
      '0-14': 0.185,
      '15-29': 0.298,
      '30-44': 0.258,
      '45-59': 0.162,
      '60+': 0.097
    },
    medianAge: 30.8,
    literacyRate: 0.925,
    urbanPopulation: 0.925,
    voterEligible: 0.785
  },
  'Nuwakot': {
    population: 268547,
    male: 127858,
    female: 140689,
    ageGroups: {
      '0-14': 0.255,
      '15-29': 0.262,
      '30-44': 0.198,
      '45-59': 0.165,
      '60+': 0.120
    },
    medianAge: 26.0,
    literacyRate: 0.705,
    urbanPopulation: 0.095,
    voterEligible: 0.705
  },
  'Rasuwa': {
    population: 44496,
    male: 22452,
    female: 22044,
    ageGroups: {
      '0-14': 0.268,
      '15-29': 0.255,
      '30-44': 0.195,
      '45-59': 0.162,
      '60+': 0.120
    },
    medianAge: 25.2,
    literacyRate: 0.658,
    urbanPopulation: 0.042,
    voterEligible: 0.692
  },
  'Dhading': {
    population: 323537,
    male: 152648,
    female: 170889,
    ageGroups: {
      '0-14': 0.262,
      '15-29': 0.265,
      '30-44': 0.195,
      '45-59': 0.158,
      '60+': 0.120
    },
    medianAge: 25.5,
    literacyRate: 0.682,
    urbanPopulation: 0.088,
    voterEligible: 0.698
  },
  'Makwanpur': {
    population: 430883,
    male: 212458,
    female: 218425,
    ageGroups: {
      '0-14': 0.258,
      '15-29': 0.278,
      '30-44': 0.205,
      '45-59': 0.152,
      '60+': 0.107
    },
    medianAge: 26.2,
    literacyRate: 0.742,
    urbanPopulation: 0.185,
    voterEligible: 0.705
  },
  'Chitwan': {
    population: 719859,
    male: 351548,
    female: 368311,
    ageGroups: {
      '0-14': 0.225,
      '15-29': 0.285,
      '30-44': 0.225,
      '45-59': 0.162,
      '60+': 0.103
    },
    medianAge: 28.2,
    literacyRate: 0.852,
    urbanPopulation: 0.425,
    voterEligible: 0.742
  },

  // Province 4 - Gandaki
  'Gorkha': {
    population: 252805,
    male: 117845,
    female: 134960,
    ageGroups: {
      '0-14': 0.248,
      '15-29': 0.252,
      '30-44': 0.195,
      '45-59': 0.172,
      '60+': 0.133
    },
    medianAge: 26.2,
    literacyRate: 0.728,
    urbanPopulation: 0.095,
    voterEligible: 0.712
  },
  'Manang': {
    population: 5645,
    male: 2985,
    female: 2660,
    ageGroups: {
      '0-14': 0.218,
      '15-29': 0.262,
      '30-44': 0.215,
      '45-59': 0.182,
      '60+': 0.123
    },
    medianAge: 28.5,
    literacyRate: 0.685,
    urbanPopulation: 0.028,
    voterEligible: 0.748
  },
  'Mustang': {
    population: 14087,
    male: 7425,
    female: 6662,
    ageGroups: {
      '0-14': 0.225,
      '15-29': 0.258,
      '30-44': 0.208,
      '45-59': 0.182,
      '60+': 0.127
    },
    medianAge: 28.0,
    literacyRate: 0.692,
    urbanPopulation: 0.035,
    voterEligible: 0.742
  },
  'Myagdi': {
    population: 101823,
    male: 47158,
    female: 54665,
    ageGroups: {
      '0-14': 0.242,
      '15-29': 0.248,
      '30-44': 0.195,
      '45-59': 0.178,
      '60+': 0.137
    },
    medianAge: 26.8,
    literacyRate: 0.745,
    urbanPopulation: 0.068,
    voterEligible: 0.718
  },
  'Kaski': {
    population: 533673,
    male: 259852,
    female: 273821,
    ageGroups: {
      '0-14': 0.205,
      '15-29': 0.285,
      '30-44': 0.238,
      '45-59': 0.168,
      '60+': 0.104
    },
    medianAge: 29.2,
    literacyRate: 0.878,
    urbanPopulation: 0.625,
    voterEligible: 0.762
  },
  'Lamjung': {
    population: 153726,
    male: 70254,
    female: 83472,
    ageGroups: {
      '0-14': 0.242,
      '15-29': 0.248,
      '30-44': 0.192,
      '45-59': 0.178,
      '60+': 0.140
    },
    medianAge: 26.5,
    literacyRate: 0.762,
    urbanPopulation: 0.082,
    voterEligible: 0.718
  },
  'Tanahu': {
    population: 315237,
    male: 146852,
    female: 168385,
    ageGroups: {
      '0-14': 0.235,
      '15-29': 0.258,
      '30-44': 0.202,
      '45-59': 0.175,
      '60+': 0.130
    },
    medianAge: 27.0,
    literacyRate: 0.775,
    urbanPopulation: 0.125,
    voterEligible: 0.728
  },
  'Nawalpur': {
    population: 339388,
    male: 164252,
    female: 175136,
    ageGroups: {
      '0-14': 0.245,
      '15-29': 0.272,
      '30-44': 0.208,
      '45-59': 0.162,
      '60+': 0.113
    },
    medianAge: 26.5,
    literacyRate: 0.752,
    urbanPopulation: 0.145,
    voterEligible: 0.718
  },
  'Syangja': {
    population: 264657,
    male: 120548,
    female: 144109,
    ageGroups: {
      '0-14': 0.228,
      '15-29': 0.248,
      '30-44': 0.195,
      '45-59': 0.185,
      '60+': 0.144
    },
    medianAge: 28.2,
    literacyRate: 0.792,
    urbanPopulation: 0.105,
    voterEligible: 0.738
  },
  'Parbat': {
    population: 133687,
    male: 60852,
    female: 72835,
    ageGroups: {
      '0-14': 0.232,
      '15-29': 0.248,
      '30-44': 0.192,
      '45-59': 0.185,
      '60+': 0.143
    },
    medianAge: 28.0,
    literacyRate: 0.785,
    urbanPopulation: 0.075,
    voterEligible: 0.732
  },
  'Baglung': {
    population: 250681,
    male: 116458,
    female: 134223,
    ageGroups: {
      '0-14': 0.245,
      '15-29': 0.255,
      '30-44': 0.195,
      '45-59': 0.175,
      '60+': 0.130
    },
    medianAge: 26.5,
    literacyRate: 0.758,
    urbanPopulation: 0.098,
    voterEligible: 0.715
  },

  // Province 5 - Lumbini
  'Gulmi': {
    population: 253636,
    male: 113458,
    female: 140178,
    ageGroups: {
      '0-14': 0.238,
      '15-29': 0.245,
      '30-44': 0.188,
      '45-59': 0.182,
      '60+': 0.147
    },
    medianAge: 27.5,
    literacyRate: 0.762,
    urbanPopulation: 0.078,
    voterEligible: 0.725
  },
  'Palpa': {
    population: 246589,
    male: 114652,
    female: 131937,
    ageGroups: {
      '0-14': 0.232,
      '15-29': 0.252,
      '30-44': 0.195,
      '45-59': 0.180,
      '60+': 0.141
    },
    medianAge: 27.8,
    literacyRate: 0.778,
    urbanPopulation: 0.092,
    voterEligible: 0.732
  },
  'Nawalparasi W': {
    population: 384866,
    male: 188452,
    female: 196414,
    ageGroups: {
      '0-14': 0.268,
      '15-29': 0.275,
      '30-44': 0.202,
      '45-59': 0.152,
      '60+': 0.103
    },
    medianAge: 25.5,
    literacyRate: 0.715,
    urbanPopulation: 0.145,
    voterEligible: 0.695
  },
  'Rupandehi': {
    population: 1098040,
    male: 540852,
    female: 557188,
    ageGroups: {
      '0-14': 0.258,
      '15-29': 0.285,
      '30-44': 0.212,
      '45-59': 0.148,
      '60+': 0.097
    },
    medianAge: 26.5,
    literacyRate: 0.782,
    urbanPopulation: 0.385,
    voterEligible: 0.708
  },
  'Kapilvastu': {
    population: 623705,
    male: 310458,
    female: 313247,
    ageGroups: {
      '0-14': 0.305,
      '15-29': 0.275,
      '30-44': 0.185,
      '45-59': 0.140,
      '60+': 0.095
    },
    medianAge: 23.5,
    literacyRate: 0.595,
    urbanPopulation: 0.148,
    voterEligible: 0.658
  },
  'Arghakhanchi': {
    population: 181721,
    male: 82458,
    female: 99263,
    ageGroups: {
      '0-14': 0.242,
      '15-29': 0.248,
      '30-44': 0.188,
      '45-59': 0.180,
      '60+': 0.142
    },
    medianAge: 27.2,
    literacyRate: 0.752,
    urbanPopulation: 0.072,
    voterEligible: 0.722
  },
  'Pyuthan': {
    population: 212506,
    male: 98254,
    female: 114252,
    ageGroups: {
      '0-14': 0.262,
      '15-29': 0.255,
      '30-44': 0.188,
      '45-59': 0.168,
      '60+': 0.127
    },
    medianAge: 25.5,
    literacyRate: 0.702,
    urbanPopulation: 0.065,
    voterEligible: 0.698
  },
  'Rolpa': {
    population: 224452,
    male: 105852,
    female: 118600,
    ageGroups: {
      '0-14': 0.275,
      '15-29': 0.258,
      '30-44': 0.182,
      '45-59': 0.162,
      '60+': 0.123
    },
    medianAge: 24.8,
    literacyRate: 0.655,
    urbanPopulation: 0.048,
    voterEligible: 0.685
  },
  'Dang': {
    population: 615868,
    male: 301458,
    female: 314410,
    ageGroups: {
      '0-14': 0.272,
      '15-29': 0.278,
      '30-44': 0.198,
      '45-59': 0.148,
      '60+': 0.104
    },
    medianAge: 25.2,
    literacyRate: 0.725,
    urbanPopulation: 0.215,
    voterEligible: 0.692
  },
  'Banke': {
    population: 558421,
    male: 281458,
    female: 276963,
    ageGroups: {
      '0-14': 0.285,
      '15-29': 0.285,
      '30-44': 0.198,
      '45-59': 0.138,
      '60+': 0.094
    },
    medianAge: 24.5,
    literacyRate: 0.705,
    urbanPopulation: 0.328,
    voterEligible: 0.678
  },

  // Province 6 - Karnali
  'Rukum': {
    population: 157707,
    male: 75458,
    female: 82249,
    ageGroups: {
      '0-14': 0.278,
      '15-29': 0.258,
      '30-44': 0.182,
      '45-59': 0.162,
      '60+': 0.120
    },
    medianAge: 24.5,
    literacyRate: 0.625,
    urbanPopulation: 0.042,
    voterEligible: 0.682
  },
  'Salyan': {
    population: 228545,
    male: 108654,
    female: 119891,
    ageGroups: {
      '0-14': 0.282,
      '15-29': 0.262,
      '30-44': 0.182,
      '45-59': 0.158,
      '60+': 0.116
    },
    medianAge: 24.2,
    literacyRate: 0.638,
    urbanPopulation: 0.058,
    voterEligible: 0.678
  },
  'Surkhet': {
    population: 396648,
    male: 192458,
    female: 204190,
    ageGroups: {
      '0-14': 0.268,
      '15-29': 0.278,
      '30-44': 0.198,
      '45-59': 0.152,
      '60+': 0.104
    },
    medianAge: 25.2,
    literacyRate: 0.728,
    urbanPopulation: 0.218,
    voterEligible: 0.695
  },
  'Dailekh': {
    population: 253122,
    male: 121458,
    female: 131664,
    ageGroups: {
      '0-14': 0.288,
      '15-29': 0.265,
      '30-44': 0.178,
      '45-59': 0.155,
      '60+': 0.114
    },
    medianAge: 23.8,
    literacyRate: 0.612,
    urbanPopulation: 0.065,
    voterEligible: 0.672
  },
  'Jajarkot': {
    population: 186026,
    male: 90258,
    female: 95768,
    ageGroups: {
      '0-14': 0.295,
      '15-29': 0.262,
      '30-44': 0.175,
      '45-59': 0.155,
      '60+': 0.113
    },
    medianAge: 23.2,
    literacyRate: 0.578,
    urbanPopulation: 0.038,
    voterEligible: 0.665
  },
  'Kalikot': {
    population: 148885,
    male: 72458,
    female: 76427,
    ageGroups: {
      '0-14': 0.302,
      '15-29': 0.265,
      '30-44': 0.172,
      '45-59': 0.152,
      '60+': 0.109
    },
    medianAge: 22.8,
    literacyRate: 0.545,
    urbanPopulation: 0.032,
    voterEligible: 0.658
  },
  'Jumla': {
    population: 113925,
    male: 56852,
    female: 57073,
    ageGroups: {
      '0-14': 0.295,
      '15-29': 0.268,
      '30-44': 0.175,
      '45-59': 0.152,
      '60+': 0.110
    },
    medianAge: 23.0,
    literacyRate: 0.562,
    urbanPopulation: 0.045,
    voterEligible: 0.665
  },
  'Dolpa': {
    population: 41041,
    male: 21458,
    female: 19583,
    ageGroups: {
      '0-14': 0.285,
      '15-29': 0.272,
      '30-44': 0.182,
      '45-59': 0.155,
      '60+': 0.106
    },
    medianAge: 23.5,
    literacyRate: 0.485,
    urbanPopulation: 0.022,
    voterEligible: 0.675
  },
  'Mugu': {
    population: 61310,
    male: 31254,
    female: 30056,
    ageGroups: {
      '0-14': 0.302,
      '15-29': 0.268,
      '30-44': 0.172,
      '45-59': 0.148,
      '60+': 0.110
    },
    medianAge: 22.5,
    literacyRate: 0.495,
    urbanPopulation: 0.025,
    voterEligible: 0.658
  },
  'Humla': {
    population: 53783,
    male: 27854,
    female: 25929,
    ageGroups: {
      '0-14': 0.308,
      '15-29': 0.265,
      '30-44': 0.168,
      '45-59': 0.148,
      '60+': 0.111
    },
    medianAge: 22.2,
    literacyRate: 0.468,
    urbanPopulation: 0.018,
    voterEligible: 0.652
  },

  // Province 7 - Sudurpashchim
  'Bardiya': {
    population: 465781,
    male: 230458,
    female: 235323,
    ageGroups: {
      '0-14': 0.282,
      '15-29': 0.282,
      '30-44': 0.195,
      '45-59': 0.145,
      '60+': 0.096
    },
    medianAge: 24.2,
    literacyRate: 0.688,
    urbanPopulation: 0.165,
    voterEligible: 0.682
  },
  'Kailali': {
    population: 917836,
    male: 452658,
    female: 465178,
    ageGroups: {
      '0-14': 0.285,
      '15-29': 0.285,
      '30-44': 0.195,
      '45-59': 0.140,
      '60+': 0.095
    },
    medianAge: 24.0,
    literacyRate: 0.695,
    urbanPopulation: 0.245,
    voterEligible: 0.678
  },
  'Kanchanpur': {
    population: 541497,
    male: 267458,
    female: 274039,
    ageGroups: {
      '0-14': 0.278,
      '15-29': 0.288,
      '30-44': 0.198,
      '45-59': 0.142,
      '60+': 0.094
    },
    medianAge: 24.5,
    literacyRate: 0.712,
    urbanPopulation: 0.225,
    voterEligible: 0.685
  },
  'Dadeldhura': {
    population: 130221,
    male: 62458,
    female: 67763,
    ageGroups: {
      '0-14': 0.275,
      '15-29': 0.268,
      '30-44': 0.185,
      '45-59': 0.158,
      '60+': 0.114
    },
    medianAge: 24.5,
    literacyRate: 0.658,
    urbanPopulation: 0.075,
    voterEligible: 0.685
  },
  'Baitadi': {
    population: 234418,
    male: 111254,
    female: 123164,
    ageGroups: {
      '0-14': 0.282,
      '15-29': 0.265,
      '30-44': 0.178,
      '45-59': 0.158,
      '60+': 0.117
    },
    medianAge: 24.0,
    literacyRate: 0.632,
    urbanPopulation: 0.062,
    voterEligible: 0.678
  },
  'Darchula': {
    population: 126236,
    male: 61458,
    female: 64778,
    ageGroups: {
      '0-14': 0.278,
      '15-29': 0.268,
      '30-44': 0.182,
      '45-59': 0.158,
      '60+': 0.114
    },
    medianAge: 24.2,
    literacyRate: 0.608,
    urbanPopulation: 0.045,
    voterEligible: 0.682
  },
  'Bajhang': {
    population: 180528,
    male: 87458,
    female: 93070,
    ageGroups: {
      '0-14': 0.292,
      '15-29': 0.268,
      '30-44': 0.175,
      '45-59': 0.152,
      '60+': 0.113
    },
    medianAge: 23.5,
    literacyRate: 0.548,
    urbanPopulation: 0.038,
    voterEligible: 0.668
  },
  'Bajura': {
    population: 120650,
    male: 58754,
    female: 61896,
    ageGroups: {
      '0-14': 0.298,
      '15-29': 0.268,
      '30-44': 0.172,
      '45-59': 0.150,
      '60+': 0.112
    },
    medianAge: 23.2,
    literacyRate: 0.525,
    urbanPopulation: 0.032,
    voterEligible: 0.662
  },
  'Achham': {
    population: 230270,
    male: 107458,
    female: 122812,
    ageGroups: {
      '0-14': 0.288,
      '15-29': 0.268,
      '30-44': 0.175,
      '45-59': 0.155,
      '60+': 0.114
    },
    medianAge: 23.5,
    literacyRate: 0.575,
    urbanPopulation: 0.055,
    voterEligible: 0.672
  },
  'Doti': {
    population: 191088,
    male: 89458,
    female: 101630,
    ageGroups: {
      '0-14': 0.285,
      '15-29': 0.268,
      '30-44': 0.178,
      '45-59': 0.155,
      '60+': 0.114
    },
    medianAge: 23.8,
    literacyRate: 0.592,
    urbanPopulation: 0.058,
    voterEligible: 0.675
  },
};

// Age group labels for display
export const AGE_GROUP_LABELS = {
  '0-14': 'Children (0-14)',
  '15-29': 'Youth (15-29)',
  '30-44': 'Young Adults (30-44)',
  '45-59': 'Middle-aged (45-59)',
  '60+': 'Elderly (60+)'
};

// Detailed age breakdown (5-year groups) - Nepal average percentages
// Used for more granular analysis when needed
export const DETAILED_AGE_GROUPS = {
  '0-4': 0.088,
  '5-9': 0.092,
  '10-14': 0.095,
  '15-19': 0.098,
  '20-24': 0.095,
  '25-29': 0.088,
  '30-34': 0.078,
  '35-39': 0.072,
  '40-44': 0.065,
  '45-49': 0.058,
  '50-54': 0.052,
  '55-59': 0.045,
  '60-64': 0.038,
  '65-69': 0.030,
  '70-74': 0.022,
  '75-79': 0.014,
  '80+': 0.010
};

// Voting age breakdown (18+ only)
export const VOTING_AGE_GROUPS = {
  '18-29': 'Young voters',
  '30-44': 'Prime working age',
  '45-59': 'Middle-aged voters',
  '60+': 'Senior voters'
};

// Province-level aggregate demographics (for quick reference)
export const PROVINCE_DEMOGRAPHICS = {
  1: { // Koshi
    population: 4972021,
    medianAge: 26.5,
    literacyRate: 0.762,
    urbanPopulation: 0.182
  },
  2: { // Madhesh
    population: 6126288,
    medianAge: 22.2,
    literacyRate: 0.558,
    urbanPopulation: 0.148
  },
  3: { // Bagmati
    population: 6084042,
    medianAge: 28.5,
    literacyRate: 0.812,
    urbanPopulation: 0.528
  },
  4: { // Gandaki
    population: 2479745,
    medianAge: 27.5,
    literacyRate: 0.768,
    urbanPopulation: 0.225
  },
  5: { // Lumbini
    population: 5124225,
    medianAge: 25.8,
    literacyRate: 0.715,
    urbanPopulation: 0.198
  },
  6: { // Karnali
    population: 1694889,
    medianAge: 23.5,
    literacyRate: 0.592,
    urbanPopulation: 0.082
  },
  7: { // Sudurpashchim
    population: 2711526,
    medianAge: 23.8,
    literacyRate: 0.642,
    urbanPopulation: 0.145
  }
};

// Constituency to district mapping (proportion of district population in each constituency)
// This allows us to estimate constituency demographics from district-level data
// Auto-generated from Nepal Election Commission data
export const CONSTITUENCY_PROPORTIONS = {
  // Province 1 - Koshi
  'P1-Bhojpur-1': { district: 'Bhojpur', proportion: 1 },
  'P1-Dhankuta-1': { district: 'Dhankuta', proportion: 1 },
  'P1-Ilam-1': { district: 'Ilam', proportion: 0.5 },
  'P1-Ilam-2': { district: 'Ilam', proportion: 0.5 },
  'P1-Jhapa-1': { district: 'Jhapa', proportion: 0.2 },
  'P1-Jhapa-2': { district: 'Jhapa', proportion: 0.2 },
  'P1-Jhapa-3': { district: 'Jhapa', proportion: 0.2 },
  'P1-Jhapa-4': { district: 'Jhapa', proportion: 0.2 },
  'P1-Jhapa-5': { district: 'Jhapa', proportion: 0.2 },
  'P1-Khotang-1': { district: 'Khotang', proportion: 1 },
  'P1-Morang-1': { district: 'Morang', proportion: 0.167 },
  'P1-Morang-2': { district: 'Morang', proportion: 0.167 },
  'P1-Morang-3': { district: 'Morang', proportion: 0.167 },
  'P1-Morang-4': { district: 'Morang', proportion: 0.167 },
  'P1-Morang-5': { district: 'Morang', proportion: 0.167 },
  'P1-Morang-6': { district: 'Morang', proportion: 0.167 },
  'P1-Okhaldhunga-1': { district: 'Okhaldhunga', proportion: 1 },
  'P1-Panchthar-1': { district: 'Panchthar', proportion: 1 },
  'P1-Sankhuwasabha-1': { district: 'Sankhuwasabha', proportion: 1 },
  'P1-Solukhumbu-1': { district: 'Solukhumbu', proportion: 1 },
  'P1-Sunsari-1': { district: 'Sunsari', proportion: 0.25 },
  'P1-Sunsari-2': { district: 'Sunsari', proportion: 0.25 },
  'P1-Sunsari-3': { district: 'Sunsari', proportion: 0.25 },
  'P1-Sunsari-4': { district: 'Sunsari', proportion: 0.25 },
  'P1-Taplejung-1': { district: 'Taplejung', proportion: 1 },
  'P1-Terhathum-1': { district: 'Terhathum', proportion: 1 },
  'P1-Udayapur-1': { district: 'Udayapur', proportion: 0.5 },
  'P1-Udayapur-2': { district: 'Udayapur', proportion: 0.5 },

  // Province 2 - Madhesh
  'P2-Bara-1': { district: 'Bara', proportion: 0.25 },
  'P2-Bara-2': { district: 'Bara', proportion: 0.25 },
  'P2-Bara-3': { district: 'Bara', proportion: 0.25 },
  'P2-Bara-4': { district: 'Bara', proportion: 0.25 },
  'P2-Dhanusha-1': { district: 'Dhanusha', proportion: 0.25 },
  'P2-Dhanusha-2': { district: 'Dhanusha', proportion: 0.25 },
  'P2-Dhanusha-3': { district: 'Dhanusha', proportion: 0.25 },
  'P2-Dhanusha-4': { district: 'Dhanusha', proportion: 0.25 },
  'P2-Mahottari-1': { district: 'Mahottari', proportion: 0.25 },
  'P2-Mahottari-2': { district: 'Mahottari', proportion: 0.25 },
  'P2-Mahottari-3': { district: 'Mahottari', proportion: 0.25 },
  'P2-Mahottari-4': { district: 'Mahottari', proportion: 0.25 },
  'P2-Parsa-1': { district: 'Parsa', proportion: 0.25 },
  'P2-Parsa-2': { district: 'Parsa', proportion: 0.25 },
  'P2-Parsa-3': { district: 'Parsa', proportion: 0.25 },
  'P2-Parsa-4': { district: 'Parsa', proportion: 0.25 },
  'P2-Rautahat-1': { district: 'Rautahat', proportion: 0.25 },
  'P2-Rautahat-2': { district: 'Rautahat', proportion: 0.25 },
  'P2-Rautahat-3': { district: 'Rautahat', proportion: 0.25 },
  'P2-Rautahat-4': { district: 'Rautahat', proportion: 0.25 },
  'P2-Saptari-1': { district: 'Saptari', proportion: 0.25 },
  'P2-Saptari-2': { district: 'Saptari', proportion: 0.25 },
  'P2-Saptari-3': { district: 'Saptari', proportion: 0.25 },
  'P2-Saptari-4': { district: 'Saptari', proportion: 0.25 },
  'P2-Sarlahi-1': { district: 'Sarlahi', proportion: 0.25 },
  'P2-Sarlahi-2': { district: 'Sarlahi', proportion: 0.25 },
  'P2-Sarlahi-3': { district: 'Sarlahi', proportion: 0.25 },
  'P2-Sarlahi-4': { district: 'Sarlahi', proportion: 0.25 },
  'P2-Siraha-1': { district: 'Siraha', proportion: 0.25 },
  'P2-Siraha-2': { district: 'Siraha', proportion: 0.25 },
  'P2-Siraha-3': { district: 'Siraha', proportion: 0.25 },
  'P2-Siraha-4': { district: 'Siraha', proportion: 0.25 },

  // Province 3 - Bagmati
  'P3-Bhaktapur-1': { district: 'Bhaktapur', proportion: 0.5 },
  'P3-Bhaktapur-2': { district: 'Bhaktapur', proportion: 0.5 },
  'P3-Chitwan-1': { district: 'Chitwan', proportion: 0.333 },
  'P3-Chitwan-2': { district: 'Chitwan', proportion: 0.333 },
  'P3-Chitwan-3': { district: 'Chitwan', proportion: 0.333 },
  'P3-Dhading-1': { district: 'Dhading', proportion: 0.5 },
  'P3-Dhading-2': { district: 'Dhading', proportion: 0.5 },
  'P3-Dolakha-1': { district: 'Dolakha', proportion: 1 },
  'P3-Kathmandu-1': { district: 'Kathmandu', proportion: 0.1 },
  'P3-Kathmandu-2': { district: 'Kathmandu', proportion: 0.1 },
  'P3-Kathmandu-3': { district: 'Kathmandu', proportion: 0.1 },
  'P3-Kathmandu-4': { district: 'Kathmandu', proportion: 0.1 },
  'P3-Kathmandu-5': { district: 'Kathmandu', proportion: 0.1 },
  'P3-Kathmandu-6': { district: 'Kathmandu', proportion: 0.1 },
  'P3-Kathmandu-7': { district: 'Kathmandu', proportion: 0.1 },
  'P3-Kathmandu-8': { district: 'Kathmandu', proportion: 0.1 },
  'P3-Kathmandu-9': { district: 'Kathmandu', proportion: 0.1 },
  'P3-Kathmandu-10': { district: 'Kathmandu', proportion: 0.1 },
  'P3-Kavrepalanchok-1': { district: 'Kavrepalanchok', proportion: 0.5 },
  'P3-Kavrepalanchok-2': { district: 'Kavrepalanchok', proportion: 0.5 },
  'P3-Lalitpur-1': { district: 'Lalitpur', proportion: 0.333 },
  'P3-Lalitpur-2': { district: 'Lalitpur', proportion: 0.333 },
  'P3-Lalitpur-3': { district: 'Lalitpur', proportion: 0.333 },
  'P3-Makwanpur-1': { district: 'Makwanpur', proportion: 0.5 },
  'P3-Makwanpur-2': { district: 'Makwanpur', proportion: 0.5 },
  'P3-Nuwakot-1': { district: 'Nuwakot', proportion: 0.5 },
  'P3-Nuwakot-2': { district: 'Nuwakot', proportion: 0.5 },
  'P3-Ramechhap-1': { district: 'Ramechhap', proportion: 1 },
  'P3-Rasuwa-1': { district: 'Rasuwa', proportion: 1 },
  'P3-Sindhuli-1': { district: 'Sindhuli', proportion: 0.5 },
  'P3-Sindhuli-2': { district: 'Sindhuli', proportion: 0.5 },
  'P3-Sindhupalchok-1': { district: 'Sindhupalchok', proportion: 0.5 },
  'P3-Sindhupalchok-2': { district: 'Sindhupalchok', proportion: 0.5 },

  // Province 4 - Gandaki
  'P4-Baglung-1': { district: 'Baglung', proportion: 0.5 },
  'P4-Baglung-2': { district: 'Baglung', proportion: 0.5 },
  'P4-Gorkha-1': { district: 'Gorkha', proportion: 0.5 },
  'P4-Gorkha-2': { district: 'Gorkha', proportion: 0.5 },
  'P4-Kaski-1': { district: 'Kaski', proportion: 0.333 },
  'P4-Kaski-2': { district: 'Kaski', proportion: 0.333 },
  'P4-Kaski-3': { district: 'Kaski', proportion: 0.333 },
  'P4-Lamjung-1': { district: 'Lamjung', proportion: 1 },
  'P4-Manang-1': { district: 'Manang', proportion: 1 },
  'P4-Mustang-1': { district: 'Mustang', proportion: 1 },
  'P4-Myagdi-1': { district: 'Myagdi', proportion: 1 },
  'P4-Nawalpur-1': { district: 'Nawalpur', proportion: 0.5 },
  'P4-Nawalpur-2': { district: 'Nawalpur', proportion: 0.5 },
  'P4-Parbat-1': { district: 'Parbat', proportion: 1 },
  'P4-Syangja-1': { district: 'Syangja', proportion: 0.5 },
  'P4-Syangja-2': { district: 'Syangja', proportion: 0.5 },
  'P4-Tanahun-1': { district: 'Tanahu', proportion: 0.5 },
  'P4-Tanahun-2': { district: 'Tanahu', proportion: 0.5 },

  // Province 5 - Lumbini
  'P5-Arghakhanchi-1': { district: 'Arghakhanchi', proportion: 1 },
  'P5-Banke-1': { district: 'Banke', proportion: 0.333 },
  'P5-Banke-2': { district: 'Banke', proportion: 0.333 },
  'P5-Banke-3': { district: 'Banke', proportion: 0.333 },
  'P5-Bardiya-1': { district: 'Bardiya', proportion: 0.5 },
  'P5-Bardiya-2': { district: 'Bardiya', proportion: 0.5 },
  'P5-Dang-1': { district: 'Dang', proportion: 0.333 },
  'P5-Dang-2': { district: 'Dang', proportion: 0.333 },
  'P5-Dang-3': { district: 'Dang', proportion: 0.333 },
  'P5-Gulmi-1': { district: 'Gulmi', proportion: 0.5 },
  'P5-Gulmi-2': { district: 'Gulmi', proportion: 0.5 },
  'P5-Kapilvastu-1': { district: 'Kapilvastu', proportion: 0.333 },
  'P5-Kapilvastu-2': { district: 'Kapilvastu', proportion: 0.333 },
  'P5-Kapilvastu-3': { district: 'Kapilvastu', proportion: 0.333 },
  'P5-Nawalparasi West-1': { district: 'Nawalparasi W', proportion: 0.5 },
  'P5-Nawalparasi West-2': { district: 'Nawalparasi W', proportion: 0.5 },
  'P5-Palpa-1': { district: 'Palpa', proportion: 0.5 },
  'P5-Palpa-2': { district: 'Palpa', proportion: 0.5 },
  'P5-Pyuthan-1': { district: 'Pyuthan', proportion: 1 },
  'P5-Rolpa-1': { district: 'Rolpa', proportion: 1 },
  'P5-Rukum East-1': { district: 'Rukum', proportion: 1 },
  'P5-Rupandehi-1': { district: 'Rupandehi', proportion: 0.2 },
  'P5-Rupandehi-2': { district: 'Rupandehi', proportion: 0.2 },
  'P5-Rupandehi-3': { district: 'Rupandehi', proportion: 0.2 },
  'P5-Rupandehi-4': { district: 'Rupandehi', proportion: 0.2 },
  'P5-Rupandehi-5': { district: 'Rupandehi', proportion: 0.2 },

  // Province 6 - Karnali
  'P6-Dailekh-1': { district: 'Dailekh', proportion: 0.5 },
  'P6-Dailekh-2': { district: 'Dailekh', proportion: 0.5 },
  'P6-Dolpa-1': { district: 'Dolpa', proportion: 1 },
  'P6-Humla-1': { district: 'Humla', proportion: 1 },
  'P6-Jajarkot-1': { district: 'Jajarkot', proportion: 1 },
  'P6-Jumla-1': { district: 'Jumla', proportion: 1 },
  'P6-Kalikot-1': { district: 'Kalikot', proportion: 1 },
  'P6-Mugu-1': { district: 'Mugu', proportion: 1 },
  'P6-Rukum West-1': { district: 'Rukum', proportion: 1 },
  'P6-Salyan-1': { district: 'Salyan', proportion: 1 },
  'P6-Surkhet-1': { district: 'Surkhet', proportion: 0.5 },
  'P6-Surkhet-2': { district: 'Surkhet', proportion: 0.5 },

  // Province 7 - Sudurpashchim
  'P7-Achham-1': { district: 'Achham', proportion: 0.5 },
  'P7-Achham-2': { district: 'Achham', proportion: 0.5 },
  'P7-Baitadi-1': { district: 'Baitadi', proportion: 1 },
  'P7-Bajhang-1': { district: 'Bajhang', proportion: 1 },
  'P7-Bajura-1': { district: 'Bajura', proportion: 1 },
  'P7-Dadeldhura-1': { district: 'Dadeldhura', proportion: 1 },
  'P7-Darchula-1': { district: 'Darchula', proportion: 1 },
  'P7-Doti-1': { district: 'Doti', proportion: 1 },
  'P7-Kailali-1': { district: 'Kailali', proportion: 0.2 },
  'P7-Kailali-2': { district: 'Kailali', proportion: 0.2 },
  'P7-Kailali-3': { district: 'Kailali', proportion: 0.2 },
  'P7-Kailali-4': { district: 'Kailali', proportion: 0.2 },
  'P7-Kailali-5': { district: 'Kailali', proportion: 0.2 },
  'P7-Kanchanpur-1': { district: 'Kanchanpur', proportion: 0.333 },
  'P7-Kanchanpur-2': { district: 'Kanchanpur', proportion: 0.333 },
  'P7-Kanchanpur-3': { district: 'Kanchanpur', proportion: 0.333 },
};

export default DISTRICT_DEMOGRAPHICS;
