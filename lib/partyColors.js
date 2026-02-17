// Static party color mappings for Tailwind CSS
// These are used instead of dynamic class names to ensure JIT compiler picks them up

export const PARTY_BG_COLORS = {
  'nc': 'bg-nc',
  'uml': 'bg-uml',
  'maoist': 'bg-maoist',
  'rsp': 'bg-rsp',
  'rpp': 'bg-rpp',
  'jspn': 'bg-jspn',
  'us': 'bg-us',
  'jp': 'bg-jp',
  'lsp': 'bg-lsp',
  'nup': 'bg-nup',
  'independent': 'bg-independent',
  'nmkp': 'bg-nmkp',
  'janamorcha': 'bg-janamorcha',
  'others': 'bg-others',
};

export const PARTY_TEXT_COLORS = {
  'nc': 'text-nc',
  'uml': 'text-uml',
  'maoist': 'text-maoist',
  'rsp': 'text-rsp',
  'rpp': 'text-rpp',
  'jspn': 'text-jspn',
  'us': 'text-us',
  'jp': 'text-jp',
  'lsp': 'text-lsp',
  'nup': 'text-nup',
  'independent': 'text-independent',
  'nmkp': 'text-nmkp',
  'janamorcha': 'text-janamorcha',
  'others': 'text-others',
};

export const PARTY_BORDER_COLORS = {
  'nc': 'border-nc',
  'uml': 'border-uml',
  'maoist': 'border-maoist',
  'rsp': 'border-rsp',
  'rpp': 'border-rpp',
  'jspn': 'border-jspn',
  'us': 'border-us',
  'jp': 'border-jp',
  'lsp': 'border-lsp',
  'nup': 'border-nup',
  'independent': 'border-independent',
  'nmkp': 'border-nmkp',
  'janamorcha': 'border-janamorcha',
  'others': 'border-others',
};

export const PARTY_SLIDER_CLASSES = {
  'nc': 'slider-nc',
  'uml': 'slider-uml',
  'maoist': 'slider-maoist',
  'rsp': 'slider-rsp',
  'rpp': 'slider-rpp',
  'jspn': 'slider-jspn',
  'us': 'slider-us',
  'jp': 'slider-jp',
  'lsp': 'slider-lsp',
  'nup': 'slider-nup',
  'independent': 'slider-independent',
  'nmkp': 'slider-nmkp',
  'janamorcha': 'slider-janamorcha',
  'others': 'slider-others',
};

/**
 * Get the Tailwind background color class for a party
 * @param {string} party - Party code (e.g., 'NC', 'UML')
 * @returns {string} Tailwind class
 */
export function getPartyBgColor(party) {
  return PARTY_BG_COLORS[party?.toLowerCase()] || 'bg-gray-500';
}

/**
 * Get the Tailwind text color class for a party
 * @param {string} party - Party code (e.g., 'NC', 'UML')
 * @returns {string} Tailwind class
 */
export function getPartyTextColor(party) {
  return PARTY_TEXT_COLORS[party?.toLowerCase()] || 'text-gray-500';
}

/**
 * Get the Tailwind border color class for a party
 * @param {string} party - Party code (e.g., 'NC', 'UML')
 * @returns {string} Tailwind class
 */
export function getPartyBorderColor(party) {
  return PARTY_BORDER_COLORS[party?.toLowerCase()] || 'border-gray-500';
}

/**
 * Get the slider CSS class for a party
 * @param {string} party - Party code (e.g., 'NC', 'UML')
 * @returns {string} CSS class
 */
export function getPartySliderClass(party) {
  return PARTY_SLIDER_CLASSES[party?.toLowerCase()] || 'slider-others';
}
