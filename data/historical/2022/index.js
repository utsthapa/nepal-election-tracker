// 2022 Constituency Election Results - Index
// Aggregates all province data

import { KOSHI_2022 } from './province1_koshi.js';
import { MADHESH_2022 } from './province2_madhesh.js';
import { BAGMATI_2022 } from './province3_bagmati.js';
import { GANDAKI_2022 } from './province4_gandaki.js';
import { LUMBINI_2022 } from './province5_lumbini.js';
import { KARNALI_2022 } from './province6_karnali.js';
import { SUDURPASHCHIM_2022 } from './province7_sudurpashchim.js';

export const CONSTITUENCIES_2022 = {
  ...KOSHI_2022,
  ...MADHESH_2022,
  ...BAGMATI_2022,
  ...GANDAKI_2022,
  ...LUMBINI_2022,
  ...KARNALI_2022,
  ...SUDURPASHCHIM_2022,
};

export const PROVINCE_DATA_2022 = {
  1: { name: "Koshi", data: KOSHI_2022, seats: 28 },
  2: { name: "Madhesh", data: MADHESH_2022, seats: 32 },
  3: { name: "Bagmati", data: BAGMATI_2022, seats: 33 },
  4: { name: "Gandaki", data: GANDAKI_2022, seats: 18 },
  5: { name: "Lumbini", data: LUMBINI_2022, seats: 26 },
  6: { name: "Karnali", data: KARNALI_2022, seats: 12 },
  7: { name: "Sudurpashchim", data: SUDURPASHCHIM_2022, seats: 16 },
};

export const getConstituency2022 = (constituencyKey) => {
  return CONSTITUENCIES_2022[constituencyKey] || null;
};

export const getProvince2022 = (provinceId) => {
  return PROVINCE_DATA_2022[provinceId] || null;
};

export default {
  CONSTITUENCIES_2022,
  PROVINCE_DATA_2022,
  getConstituency2022,
  getProvince2022,
};
