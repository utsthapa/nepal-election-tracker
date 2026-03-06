import { useState, useEffect, useCallback, useRef } from 'react';

import { API_CONFIG } from '../lib/config';

const POLL_INTERVAL = API_CONFIG.RESULT_REFRESH_MS || 30000;

export function useLiveResults({ enabled = true, interval = POLL_INTERVAL } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch('/api/results');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    fetchResults();
    intervalRef.current = setInterval(fetchResults, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, fetchResults]);

  return { data, error, loading, lastUpdated, refetch: fetchResults };
}
