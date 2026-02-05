// Party-level metadata for strategic and quota layers

export const PARTY_FEMALE_SHARE = {
  NC: 0.34,
  UML: 0.33,
  Maoist: 0.36,
  RSP: 0.38,
  RPP: 0.28,
  JSPN: 0.30,
  US: 0.35,
  JP: 0.32,
  LSP: 0.30,
  NUP: 0.33,
  Independent: 0.25,
  Others: 0.30,
};

// Ideological coordinates (Economic, Federalism, Geopolitical)
// Values range roughly -1 (left/strong federal/India-tilt) to +1 (right/centralist/China-tilt)
export const IDEOLOGY_COORDS = {
  NC: { econ: 0.10, federal: 0.20, geo: 0.05 },
  UML: { econ: -0.05, federal: -0.10, geo: 0.00 },
  Maoist: { econ: -0.40, federal: -0.20, geo: -0.05 },
  RSP: { econ: 0.15, federal: 0.25, geo: 0.10 },
  RPP: { econ: 0.35, federal: 0.40, geo: 0.20 },
  JSPN: { econ: -0.05, federal: 0.30, geo: 0.05 },
  US: { econ: -0.20, federal: -0.05, geo: -0.10 },
  JP: { econ: -0.10, federal: 0.35, geo: 0.00 },
  LSP: { econ: 0.05, federal: 0.28, geo: 0.05 },
  NUP: { econ: 0.00, federal: 0.32, geo: 0.05 },
  Independent: { econ: 0.05, federal: 0.15, geo: 0.05 },
  Others: { econ: 0.00, federal: 0.00, geo: 0.00 },
};

export const ALTERNATIVE_PARTIES = ['RSP', 'JP', 'Independent', 'NUP'];

