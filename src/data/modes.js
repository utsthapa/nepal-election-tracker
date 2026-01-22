/**
 * Political Factor Modes Configuration
 * These modes represent Nepali political figures and their electoral impacts
 * Each mode applies vote share adjustments to political parties
 */

export const FACTOR_MODES = {
  balen: {
    id: 'balen',
    name: 'Balen Factor',
    icon: '🏙️',
    description: 'Kathmandu Mayor effect',
    explanation: 'Balen Shah\'s popularity as Kathmandu Mayor attracts young urban voters to RSP (+8%), taking votes primarily from NC (-4%) and UML (-4%)',
    effects: {
      RSP: 8,
      NC: -4,
      UML: -4,
    },
    color: '#3b82f6', // Blue (RSP color)
  },
  rabi: {
    id: 'rabi',
    name: 'Rabi Factor',
    icon: '📺',
    description: 'TV personality charisma',
    explanation: 'Rabi Lamichhane\'s TV background and charisma boost RSP (+6%), taking votes from NC (-3%) and UML (-3%)',
    effects: {
      RSP: 6,
      NC: -3,
      UML: -3,
    },
    color: '#3b82f6', // Blue (RSP color)
  },
  oli: {
    id: 'oli',
    name: 'Oli Disaster',
    icon: '🔥',
    description: 'Anti-incumbency wave',
    explanation: 'K.P. Oli\'s controversial leadership drives voters away from UML (-7%), with many switching to RSP (+7%)',
    effects: {
      UML: -7,
      RSP: 7,
    },
    color: '#ef4444', // Red (UML color)
  },
  deuba: {
    id: 'deuba',
    name: 'Deuba Disaster',
    icon: '🌧️',
    description: 'Traditional politics fatigue',
    explanation: 'Sher Bahadur Deuba\'s traditional politics approach causes NC to lose votes (-6%), with many switching to RSP (+6%)',
    effects: {
      NC: -6,
      RSP: 6,
    },
    color: '#22c55e', // Green (NC color)
  },
};

export default FACTOR_MODES;
