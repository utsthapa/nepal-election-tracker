// 2017 Constituency Election Results - Index
// Source: Election Commission Nepal

import { KOSHI_2017 } from './province1_koshi.js';
import { MADHESH_2017 } from './province2_madhesh.js';
import { BAGMATI_2017 } from './province3_bagmati.js';
import { GANDAKI_2017 } from './province4_gandaki.js';
import { LUMBINI_2017 } from './province5_lumbini.js';
import { KARNALI_2017 } from './province6_karnali.js';
import { SUDURPASHCHIM_2017 } from './province7_sudurpashchim.js';

export const CONSTITUENCIES_2017 = {
  ...KOSHI_2017,
  ...MADHESH_2017,
  ...BAGMATI_2017,
  ...GANDAKI_2017,
  ...LUMBINI_2017,
  ...KARNALI_2017,
  ...SUDURPASHCHIM_2017,
};

export const PROVINCE_DATA_2017 = {
  1: { name: "Koshi", data: KOSHI_2017, seats: 28 },
  2: { name: "Madhesh", data: MADHESH_2017, seats: 32 },
  3: { name: "Bagmati", data: BAGMATI_2017, seats: 33 },
  4: { name: "Gandaki", data: GANDAKI_2017, seats: 18 },
  5: { name: "Lumbini", data: LUMBINI_2017, seats: 26 },
  6: { name: "Karnali", data: KARNALI_2017, seats: 12 },
  7: { name: "Sudurpashchim", data: SUDURPASHCHIM_2017, seats: 16 },
};

export const getConstituency2017 = (constituencyKey) => {
  return CONSTITUENCIES_2017[constituencyKey] || null;
};

export const getProvince2017 = (provinceId) => {
  return PROVINCE_DATA_2017[provinceId] || null;
};

export default {
  CONSTITUENCIES_2017,
  PROVINCE_DATA_2017,
  getConstituency2017,
  getProvince2017,
};
