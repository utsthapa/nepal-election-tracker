/**
 * State serialization for URL sharing
 * Encodes/decodes simulator state to/from compact URL params
 */

// Fixed party order for compact array encoding
const PARTY_ORDER = [
  'NC',
  'UML',
  'Maoist',
  'RSP',
  'RPP',
  'JSPN',
  'US',
  'JP',
  'LSP',
  'NUP',
  'Others',
];

const VERSION = 1;
const DEFAULT_ALLIANCE = { enabled: false, parties: [], handicap: 10 };
const MAX_OVERRIDES = 200;
const TOTAL_TOLERANCE = 1e-6;

const isPlainObject = value => value && typeof value === 'object' && !Array.isArray(value);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalizeMap = (raw, maxValue, preserveIfValid = false) => {
  if (!isPlainObject(raw)) {
    return null;
  }

  const map = {};
  PARTY_ORDER.forEach(party => {
    const num = Number(raw[party]);
    map[party] = Number.isFinite(num) ? clamp(num, 0, maxValue) : 0;
  });

  const total = Object.values(map).reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    return null;
  }

  if (preserveIfValid && Math.abs(total - maxValue) <= TOTAL_TOLERANCE) {
    return map;
  }

  PARTY_ORDER.forEach(party => {
    map[party] = (map[party] / total) * maxValue;
  });

  return map;
};

const sanitizeAlliance = rawAlliance => {
  if (!isPlainObject(rawAlliance) || !rawAlliance.enabled) {
    return { ...DEFAULT_ALLIANCE };
  }
  const parties = Array.isArray(rawAlliance.parties) ? rawAlliance.parties.slice(0, 2) : [];
  if (parties.length !== 2) {
    return { ...DEFAULT_ALLIANCE };
  }
  const handicap = Number(rawAlliance.handicap);
  return {
    enabled: true,
    parties,
    handicap: Number.isFinite(handicap) ? clamp(handicap, 0, 100) : DEFAULT_ALLIANCE.handicap,
  };
};

const sanitizeOverrides = rawOverrides => {
  if (!isPlainObject(rawOverrides)) {
    return {};
  }

  const entries = Object.entries(rawOverrides).slice(0, MAX_OVERRIDES);
  const overrides = {};
  entries.forEach(([id, shares]) => {
    if (typeof id !== 'string' || !id.trim()) {
      return;
    }
    const normalized = normalizeMap(shares, 1, true);
    if (normalized) {
      overrides[id] = normalized;
    }
  });

  return overrides;
};

const sanitizeSliderMap = (raw, maxValue) => {
  if (!isPlainObject(raw)) {
    return null;
  }

  const map = {};
  PARTY_ORDER.forEach(party => {
    const num = Number(raw[party]);
    map[party] = Number.isFinite(num) ? clamp(num, 0, maxValue) : 0;
  });
  return map;
};

export function sanitizeSharedState(rawState) {
  if (!isPlainObject(rawState)) {
    return null;
  }

  const fptpSliders = sanitizeSliderMap(rawState.fptpSliders, 100);
  const prSliders = sanitizeSliderMap(rawState.prSliders, 100);
  if (!fptpSliders || !prSliders) {
    return null;
  }

  return {
    fptpSliders,
    prSliders,
    overrides: sanitizeOverrides(rawState.overrides),
    allianceConfig: sanitizeAlliance(rawState.allianceConfig),
    slidersLocked: rawState.slidersLocked === false ? false : true,
    useRspNationalBase: Boolean(rawState.useRspNationalBase),
  };
}

/**
 * Serialize simulator state to a compact base64url string
 */
export function serializeState({
  fptpSliders,
  prSliders,
  overrides,
  allianceConfig,
  slidersLocked,
  useRspNationalBase,
}) {
  const sanitized = sanitizeSharedState({
    fptpSliders,
    prSliders,
    overrides,
    allianceConfig,
    slidersLocked,
    useRspNationalBase,
  });
  if (!sanitized) {
    return null;
  }

  const state = { v: VERSION };

  // Encode sliders as ordered arrays (full precision)
  state.f = PARTY_ORDER.map(p => sanitized.fptpSliders[p] || 0);
  state.p = PARTY_ORDER.map(p => sanitized.prSliders[p] || 0);

  // Only include non-default values
  if (sanitized.slidersLocked === false) {
    state.l = 0;
  }
  if (sanitized.useRspNationalBase) {
    state.r = 1;
  }

  // Alliance
  if (sanitized.allianceConfig?.enabled && sanitized.allianceConfig.parties?.length === 2) {
    state.a = {
      p: sanitized.allianceConfig.parties,
      h: sanitized.allianceConfig.handicap,
    };
  }

  // Overrides (only if any exist)
  if (sanitized.overrides && Object.keys(sanitized.overrides).length > 0) {
    state.o = {};
    Object.entries(sanitized.overrides).forEach(([id, shares]) => {
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
    while (b64.length % 4) {
      b64 += '=';
    }

    let json;
    if (typeof window !== 'undefined') {
      json = atob(b64);
    } else {
      json = Buffer.from(b64, 'base64').toString('utf-8');
    }

    const compact = JSON.parse(json);
    if (!compact || compact.v !== VERSION) {
      return null;
    }

    const decoded = {};
    if (Array.isArray(compact.f) && compact.f.length === PARTY_ORDER.length) {
      decoded.fptpSliders = Object.fromEntries(
        PARTY_ORDER.map((party, i) => [party, compact.f[i]])
      );
    }
    if (Array.isArray(compact.p) && compact.p.length === PARTY_ORDER.length) {
      decoded.prSliders = Object.fromEntries(PARTY_ORDER.map((party, i) => [party, compact.p[i]]));
    }
    decoded.slidersLocked = compact.l === 0 ? false : true;
    decoded.useRspNationalBase = compact.r === 1;

    if (compact.a && Array.isArray(compact.a.p) && compact.a.p.length === 2) {
      decoded.allianceConfig = {
        enabled: true,
        parties: compact.a.p,
        handicap: compact.a.h,
      };
    }

    if (compact.o && isPlainObject(compact.o)) {
      decoded.overrides = {};
      Object.entries(compact.o).forEach(([id, arr]) => {
        if (Array.isArray(arr) && arr.length === PARTY_ORDER.length) {
          decoded.overrides[id] = Object.fromEntries(
            PARTY_ORDER.map((party, i) => [party, arr[i]])
          );
        }
      });
    }

    return sanitizeSharedState(decoded);
  } catch {
    return null;
  }
}

/**
 * Build a full shareable URL with encoded state
 * @param {Object} state - The simulator state
 * @param {number} year - The election year (default: 2026)
 */
export function buildShareableUrl(state, year = 2026) {
  const encoded = serializeState(state);
  if (!encoded) {
    return null;
  }
  const base =
    typeof window !== 'undefined'
      ? `${window.location.origin}/simulator/${year}`
      : `/simulator/${year}`;
  return `${base}?s=${encoded}`;
}

export function buildShareableUrlFromId(id, year = 2026, origin) {
  const safeId = typeof id === 'string' ? id.trim() : '';
  const resolvedOrigin =
    typeof origin === 'string' && origin.trim()
      ? origin.trim().replace(/\/$/, '')
      : typeof window !== 'undefined'
        ? window.location.origin
        : '';
  const base = resolvedOrigin ? `${resolvedOrigin}/simulator/${year}` : `/simulator/${year}`;
  return `${base}?sid=${encodeURIComponent(safeId)}`;
}

/**
 * Read and deserialize state from current URL params
 * @returns {Object|null} Deserialized state or null
 */
export function readStateFromUrl() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('s');
    if (!encoded) {
      return null;
    }
    return deserializeState(encoded);
  } catch {
    return null;
  }
}
