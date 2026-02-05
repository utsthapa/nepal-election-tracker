// Proxy signals for "no-poll" Bayesian updates
// Captures by-elections, digital sentiment, and demographic priors

// High-quality by-election signals (treated as strong likelihood updates)
export const BY_ELECTION_SIGNALS = [
  {
    id: 'KTM-16-2023',
    constituencyId: 'P3-Kathmandu-10', // Kathmandu-10 approximates KTM metro ward mix
    label: 'Kathmandu-16 by-election (RSP gain)',
    winner: 'RSP',
    voteShare: 0.54,
    turnout: 0.68,
    cluster: 'metropolitan',
    weight: 0.22, // how hard to pull similar metros toward RSP
    note: 'RSP victory with 2,902 vote edge; urban, youth-heavy ward mix.',
  },
  {
    id: 'Tanahun-1-2023',
    constituencyId: 'P4-Tanahun-1',
    label: 'Tanahun-1 by-election (RSP 54%)',
    winner: 'RSP',
    voteShare: 0.54,
    turnout: 0.64,
    cluster: 'urban',
    weight: 0.18,
    note: 'Urban district centre; strong swing from NC/UML to RSP.',
  },
];

export const BY_ELECTION_MAP = BY_ELECTION_SIGNALS.reduce((acc, signal) => {
  acc[signal.id] = signal;
  return acc;
}, {});

// Digital sentiment scores (0-1 where 0.5 is neutral baseline)
export const DIGITAL_SENTIMENT = {
  NC: 0.46,
  UML: 0.44,
  Maoist: 0.41,
  RSP: 0.64,
  RPP: 0.48,
  JSPN: 0.45,
  US: 0.42,
  JP: 0.47,
  LSP: 0.43,
  NUP: 0.50,
  Independent: 0.52,
};

// Youth cohort share (15-24) from Census 2021
export const YOUTH_COHORT_SHARE = 0.2093;

// Default signal presets exposed in the UI
export const RECENT_SIGNAL_PRESETS = [
  { id: 'signal_rsp_byelection', label: 'RSP wins another urban by-election', target: 'RSP', delta: 0.02 },
  { id: 'signal_alt_surge', label: 'Digital buzz for alternative parties', target: 'Alternative', delta: 0.015 },
  { id: 'signal_incumbency_drag', label: 'Rising anti-incumbent sentiment', target: 'IncumbentPenalty', delta: 0.05 },
];

