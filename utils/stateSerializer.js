/**
 * State serialization for URL sharing
 * Encodes/decodes simulator state to/from compact URL params
 */

// Fixed party order for compact array encoding
const PARTY_ORDER = ['NC', 'UML', 'Maoist', 'RSP', 'RPP', 'JSPN', 'US', 'JP', 'LSP', 'NUP', 'Others'];

const VERSION = 1;

/**
 * Serialize simulator state to a compact base64url string
 */
export function serializeState({ fptpSliders, prSliders, overrides, allianceConfig, slidersLocked }) {
  const state = { v: VERSION };

  // Encode sliders as ordered arrays (full precision)
  state.f = PARTY_ORDER.map(p => fptpSliders[p] || 0);
  state.p = PARTY_ORDER.map(p => prSliders[p] || 0);

  // Only include non-default values
  if (slidersLocked === false) state.l = 0;

  // Alliance
  if (allianceConfig?.enabled && allianceConfig.parties?.length === 2) {
    state.a = {
      p: allianceConfig.parties,
      h: allianceConfig.handicap,
    };
  }

  // Overrides (only if any exist)
  if (overrides && Object.keys(overrides).length > 0) {
    state.o = {};
    Object.entries(overrides).forEach(([id, shares]) => {
      state.o[id] = PARTY_ORDER.map(p => shares[p] || 0);
    });
  }

  const json = JSON.stringify(state);
  // Use base64url encoding (URL-safe)
  if (typeof window !== 'undefined') {
    return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  return Buffer.from(json).toString('base64url');
}

/**
 * Deserialize state from a base64url string
 * @returns {Object|null} Partial state object or null if invalid
 */
export function deserializeState(encoded) {
  try {
    // Restore base64 padding
    let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';

    let json;
    if (typeof window !== 'undefined') {
      json = atob(b64);
    } else {
      json = Buffer.from(b64, 'base64').toString('utf-8');
    }

    const state = JSON.parse(json);
    if (!state || state.v !== VERSION) return null;

    const result = {};

    // Decode sliders
    if (Array.isArray(state.f) && state.f.length === PARTY_ORDER.length) {
      result.fptpSliders = {};
      PARTY_ORDER.forEach((p, i) => { result.fptpSliders[p] = state.f[i]; });
    }

    if (Array.isArray(state.p) && state.p.length === PARTY_ORDER.length) {
      result.prSliders = {};
      PARTY_ORDER.forEach((p, i) => { result.prSliders[p] = state.p[i]; });
    }

    result.slidersLocked = state.l === 0 ? false : true;

    // Alliance
    if (state.a && Array.isArray(state.a.p) && state.a.p.length === 2) {
      result.allianceConfig = {
        enabled: true,
        parties: state.a.p,
        handicap: state.a.h || 10,
      };
    }

    // Overrides
    if (state.o && typeof state.o === 'object') {
      result.overrides = {};
      Object.entries(state.o).forEach(([id, arr]) => {
        if (Array.isArray(arr) && arr.length === PARTY_ORDER.length) {
          const shares = {};
          PARTY_ORDER.forEach((p, i) => { shares[p] = arr[i]; });
          result.overrides[id] = shares;
        }
      });
    }

    return result;
  } catch {
    return null;
  }
}

/**
 * Build a full shareable URL with encoded state
 */
export function buildShareableUrl(state) {
  const encoded = serializeState(state);
  const base = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : '/simulator';
  return `${base}?s=${encoded}`;
}

/**
 * Read and deserialize state from current URL params
 * @returns {Object|null} Deserialized state or null
 */
export function readStateFromUrl() {
  if (typeof window === 'undefined') return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('s');
    if (!encoded) return null;
    return deserializeState(encoded);
  } catch {
    return null;
  }
}
