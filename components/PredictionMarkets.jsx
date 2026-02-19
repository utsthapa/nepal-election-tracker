'use client';

import { ExternalLink, Activity, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const PARTY_COLORS = {
  RSP: '#3b82f6',
  NC: '#22c55e',
  UML: '#ef4444',
  Maoist: '#991b1b',
  RPP: '#8b5cf6',
  JSPN: '#ec4899',
  Others: '#6b7280',
};

function getPartyColor(name) {
  const upper = name?.toUpperCase() || '';
  if (upper.includes('RSP') || upper.includes('SWATANTRA')) return PARTY_COLORS.RSP;
  if (upper.includes('CONGRESS') || upper.includes('NC')) return PARTY_COLORS.NC;
  if (upper.includes('UML') || upper.includes('CPN-UML')) return PARTY_COLORS.UML;
  if (upper.includes('MAOIST')) return PARTY_COLORS.Maoist;
  if (upper.includes('RPP') || upper.includes('PRAJATANTRA')) return PARTY_COLORS.RPP;
  if (upper.includes('JSPN') || upper.includes('JANATA')) return PARTY_COLORS.JSPN;
  return PARTY_COLORS.Others;
}

function cleanName(name) {
  return name
    .replace('Will ', '')
    .replace(' win the 2026 Nepal House of Representatives election?', '')
    .replace(' win the most seats in the 2026 Nepal House of Representatives election?', '')
    .replace(' win the most seats in the Nepal House of Representatives election?', '')
    .replace(' become the next Prime Minister of Nepal?', '')
    .replace(' be the next Prime Minister of Nepal?', '');
}

export default function PredictionMarkets({ type = 'combined' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        let url;
        if (type === 'kalshi') url = '/api/markets/kalshi';
        else if (type === 'polymarket') url = '/api/markets/polymarket';
        else if (type === 'pm') url = '/api/markets/polymarket-pm';
        else url = '/api/markets/kalshi'; // default

        const res = await fetch(url, { headers: { Accept: 'application/json' } });

        if (res.ok && mounted) {
          const json = await res.json();
          setData(Array.isArray(json) ? json[0] : json);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [type]);

  const outcomes =
    data?.markets
      ?.map(m => {
        let prob = 0;
        if (m.outcomePrices) {
          try {
            const prices = JSON.parse(m.outcomePrices);
            prob = parseFloat(prices[0]) || 0;
          } catch (e) {
            prob = 0;
          }
        } else if (m.last_price !== undefined) {
          prob = m.last_price / 100;
        }
        return {
          name: m.groupItemTitle || cleanName(m.question) || cleanName(m.title),
          probability: prob,
          color: getPartyColor(m.groupItemTitle || m.question || m.title),
        };
      })
      .filter(o => o.probability > 0)
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5) || [];

  const getTitle = () => {
    if (type === 'kalshi') return 'Kalshi';
    if (type === 'polymarket') return 'Polymarket';
    if (type === 'pm') return 'Next PM';
    return 'Markets';
  };

  const getUrl = () => {
    if (type === 'kalshi') return 'https://kalshi.com/markets/nepal';
    if (type === 'polymarket')
      return 'https://polymarket.com/event/nepal-house-of-representatives-election-winner';
    if (type === 'pm') return 'https://polymarket.com/event/next-prime-minister-of-nepal';
    return '#';
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-red-600" />
          <p className="text-xs font-bold tracking-wider uppercase text-red-600">{getTitle()}</p>
        </div>
        <a
          href={getUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-red-600"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {outcomes.length > 0 ? (
        <div className="space-y-2">
          {outcomes.map((outcome, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-900">{outcome.name}</span>
                <span className="font-bold" style={{ color: outcome.color }}>
                  {(outcome.probability * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${outcome.probability * 100}%`, backgroundColor: outcome.color }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 text-center py-4">No data</div>
      )}
    </div>
  );
}
