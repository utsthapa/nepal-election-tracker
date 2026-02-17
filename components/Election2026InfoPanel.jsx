import { Users, MapPin, Trophy, ChevronDown, ChevronUp, Crown, Flag } from 'lucide-react';
import { useState } from 'react';

import electionData from '../nepal_2026_election_data.json';

const partyColors = {
  'Nepali Congress': '#22c55e',
  'CPN-UML': '#ef4444',
  'Rastriya Swatantra Party': '#3b82f6',
  'Nepali Communist Party': '#dc2626',
  'Rastriya Prajatantra Party': '#8b5cf6',
  'Janamat Party': '#14b8a6',
  'Janata Samajbadi Party': '#ec4899',
  'Loktantrik Samajbadi Party': '#a855f7',
  'Nagarik Unmukti Party': '#06b6d4',
  'CPN (Unified Socialist)': '#f97316',
  'CPN-Maoist Centre': '#991b1b',
};

const getPartyColor = (partyName) => {
  return partyColors[partyName] || '#6b7280';
};

export function Election2026InfoPanel() {
  const [expandedParty, setExpandedParty] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const { election_year, election_date, total_candidates, total_parties, parties, key_battlegrounds, summary } = electionData;

  const majorParties = parties.filter(p => p.seats_contested >= 160);

  const toggleParty = (partyName) => {
    setExpandedParty(expandedParty === partyName ? null : partyName);
  };

  return (
    <div className="bg-white rounded-lg border border-[rgb(219,211,196)] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-white" />
          <div>
            <h2 className="text-xl font-bold text-white">{election_year} General Election</h2>
            <p className="text-blue-100 text-sm">{new Date(election_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b border-[rgb(219,211,196)]">
        <div className="text-center">
          <p className="text-2xl font-bold text-[rgb(24,26,36)]">{total_candidates.toLocaleString()}</p>
          <p className="text-xs text-[rgb(100,110,130)] uppercase tracking-wider">Total Candidates</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[rgb(24,26,36)]">{total_parties}</p>
          <p className="text-xs text-[rgb(100,110,130)] uppercase tracking-wider">Political Parties</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[rgb(24,26,36)]">{summary.party_candidates.toLocaleString()}</p>
          <p className="text-xs text-[rgb(100,110,130)] uppercase tracking-wider">Party Candidates</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[rgb(24,26,36)]">{summary.independent_candidates.toLocaleString()}</p>
          <p className="text-xs text-[rgb(100,110,130)] uppercase tracking-wider">Independents</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[rgb(219,211,196)]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-[rgb(100,110,130)] hover:text-[rgb(24,26,36)] hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Flag className="w-4 h-4" />
            Major Parties
          </div>
        </button>
        <button
          onClick={() => setActiveTab('battlegrounds')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'battlegrounds'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-[rgb(100,110,130)] hover:text-[rgb(24,26,36)] hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" />
            Key Battlegrounds
          </div>
        </button>
        <button
          onClick={() => setActiveTab('candidates')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'candidates'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-[rgb(100,110,130)] hover:text-[rgb(24,26,36)] hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            Candidates
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[rgb(100,110,130)] uppercase tracking-wider mb-3">
              Major Parties ({majorParties.length})
            </h3>
            {majorParties.map((party) => (
              <div
                key={party.name}
                className="border border-[rgb(219,211,196)] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleParty(party.name)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getPartyColor(party.name) }}
                    />
                    <div className="text-left">
                      <p className="font-semibold text-[rgb(24,26,36)]">{party.name}</p>
                      <p className="text-xs text-[rgb(100,110,130)]">{party.seats_contested} constituencies</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {party.pm_candidate && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        PM: {party.pm_candidate}
                      </span>
                    )}
                    {expandedParty === party.name ? (
                      <ChevronUp className="w-5 h-5 text-[rgb(100,110,130)]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[rgb(100,110,130)]" />
                    )}
                  </div>
                </button>

                {expandedParty === party.name && (
                  <div className="px-4 pb-4 border-t border-[rgb(219,211,196)] bg-gray-50">
                    <div className="pt-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-[rgb(100,110,130)]">Leader</p>
                          <p className="font-medium text-[rgb(24,26,36)]">{party.leader}</p>
                          <p className="text-xs text-[rgb(100,110,130)]">{party.leader_seat}</p>
                        </div>
                        <div>
                          <p className="text-[rgb(100,110,130)]">PM Candidate</p>
                          <p className="font-medium text-[rgb(24,26,36)]">{party.pm_candidate || 'Not declared'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white rounded p-2 border border-[rgb(219,211,196)]">
                          <p className="text-lg font-bold text-[rgb(24,26,36)]">{party.male_candidates}</p>
                          <p className="text-xs text-[rgb(100,110,130)]">Male</p>
                        </div>
                        <div className="bg-white rounded p-2 border border-[rgb(219,211,196)]">
                          <p className="text-lg font-bold text-[rgb(24,26,36)]">{party.female_candidates}</p>
                          <p className="text-xs text-[rgb(100,110,130)]">Female</p>
                        </div>
                        <div className="bg-white rounded p-2 border border-[rgb(219,211,196)]">
                          <p className="text-lg font-bold text-[rgb(24,26,36)]">{party.seats_contested}</p>
                          <p className="text-xs text-[rgb(100,110,130)]">Total</p>
                        </div>
                      </div>

                      {party.key_candidates && party.key_candidates.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-[rgb(100,110,130)] mb-2">Key Candidates</p>
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {party.key_candidates.slice(0, 10).map((candidate, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-sm bg-white px-3 py-2 rounded border border-[rgb(219,211,196)]"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-[rgb(24,26,36)] font-medium">{candidate.name}</span>
                                  {candidate.position && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                      {candidate.position}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-[rgb(100,110,130)]">{candidate.constituency}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {party.notable && (
                        <p className="text-xs text-[rgb(100,110,130)] italic">{party.notable}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'battlegrounds' && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[rgb(100,110,130)] uppercase tracking-wider mb-3">
              Key Battleground Constituencies
            </h3>
            {key_battlegrounds.map((battle, idx) => (
              <div
                key={idx}
                className="border border-[rgb(219,211,196)] rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <h4 className="font-bold text-[rgb(24,26,36)]">{battle.constituency}</h4>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    {battle.significance}
                  </span>
                </div>
                <div className="space-y-1">
                  {battle.candidates.map((candidate, cidx) => (
                    <div
                      key={cidx}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getPartyColor(candidate.party) }}
                      />
                      <span className="font-medium text-[rgb(24,26,36)]">{candidate.name}</span>
                      <span className="text-[rgb(100,110,130)]">({candidate.party})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-3xl font-bold text-blue-600">{summary.women_candidates}</p>
                <p className="text-sm text-blue-700">Women Candidates</p>
                <p className="text-xs text-blue-500">{((summary.women_candidates / total_candidates) * 100).toFixed(1)}% of total</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-3xl font-bold text-green-600">{summary.candidates_under_35}</p>
                <p className="text-sm text-green-700">Candidates Under 35</p>
                <p className="text-xs text-green-500">{((summary.candidates_under_35 / total_candidates) * 100).toFixed(1)}% of total</p>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-[rgb(100,110,130)] uppercase tracking-wider">
              Age Distribution
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Under 35', count: summary.candidates_under_35, color: 'bg-green-500' },
                { label: '36-50 years', count: summary.candidates_36_to_50, color: 'bg-blue-500' },
                { label: '51-65 years', count: summary.candidates_51_to_65, color: 'bg-amber-500' },
                { label: 'Above 65', count: summary.candidates_above_65, color: 'bg-red-500' },
              ].map((age) => (
                <div key={age.label} className="flex items-center gap-3">
                  <span className="text-sm text-[rgb(100,110,130)] w-24">{age.label}</span>
                  <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${age.color} flex items-center justify-end pr-2`}
                      style={{ width: `${(age.count / total_candidates) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">{age.count}</span>
                    </div>
                  </div>
                  <span className="text-xs text-[rgb(100,110,130)] w-12 text-right">
                    {((age.count / total_candidates) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Only 15% of candidates are under 35 years old, despite the Gen Z movement that led to this election.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Election2026InfoPanel;
