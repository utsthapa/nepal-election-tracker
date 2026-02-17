'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  MapPin,
  BookOpen,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';
import { useState, useMemo } from 'react';

import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { PROVINCES } from '../../data/constituencies';
import {
  DISTRICT_DEMOGRAPHICS,
  PROVINCE_DEMOGRAPHICS,
  AGE_GROUP_LABELS
} from '../../data/demographics';
import {
  getYouthIndex,
  getDependencyRatio,
  getAgeGroupColor
} from '../../utils/demographicUtils';

// Data sources with descriptions
const DATA_SOURCES = [
  {
    name: 'National Population and Housing Census 2021',
    organization: 'Central Bureau of Statistics (CBS) / National Statistics Office (NSO)',
    description: 'Official decennial census providing district-level population data, age distribution, literacy, and other demographic indicators.',
    url: 'https://censusnepal.cbs.gov.np/results/files/result-folder/Final_Population_compostion_12_2.pdf',
    dataUsed: ['Population by district', 'Age groups', 'Literacy rates', 'Urban/rural distribution']
  },
  {
    name: 'Census Dataset Downloads',
    organization: 'National Statistics Office (NSO)',
    description: 'Downloadable census tables in Excel/CSV format for detailed demographic analysis.',
    url: 'https://censusnepal.cbs.gov.np/results/downloads/census-dataset',
    dataUsed: ['Detailed age breakdowns', 'Gender distribution', 'Household data']
  },
  {
    name: 'NSO Open Data Portal',
    organization: 'National Statistics Office (NSO)',
    description: 'Machine-readable datasets including population by district.',
    url: 'https://data.nsonepal.gov.np/dataset/population-census-2021',
    dataUsed: ['Total population by district', 'Male/female population']
  },
  {
    name: 'Election Commission of Nepal',
    organization: 'Government of Nepal',
    description: 'Official electoral data including constituency boundaries and voter information.',
    url: 'https://election.gov.np/en/page/district-wise-constituency-map',
    dataUsed: ['Constituency-district mapping', '2022 election results']
  }
];

// Methodology explanation
const METHODOLOGY = {
  title: 'Estimation Methodology',
  sections: [
    {
      heading: 'Data Granularity Challenge',
      content: 'The Census 2021 provides demographic data at the DISTRICT level, while electoral constituencies are SUB-DISTRICT units. Nepal has 77 districts but 165 FPTP constituencies, meaning most districts contain multiple constituencies.'
    },
    {
      heading: 'Proportional Allocation Method',
      content: 'We estimate constituency demographics by allocating district-level data proportionally based on the number of constituencies per district. For example, if Kathmandu district has 10 constituencies, each is assigned approximately 1/10th of the district\'s population and inherits the district\'s demographic percentages (age distribution, literacy rate, etc.).'
    },
    {
      heading: 'Assumptions & Limitations',
      content: 'This method assumes demographic characteristics are uniformly distributed within a district. In reality, urban constituencies may have higher literacy and different age profiles than rural ones within the same district. Constituency boundaries also don\'t always align perfectly with administrative units.'
    },
    {
      heading: 'Confidence Levels',
      content: 'We indicate "High" confidence for single-constituency districts (direct match) and "Medium" confidence for multi-constituency districts (proportional estimate). This transparency helps users understand data reliability.'
    },
    {
      heading: 'Age Group Definitions',
      content: 'Age groups follow standard demographic categories: Children (0-14), Youth (15-29), Young Adults (30-44), Middle-aged (45-59), and Elderly (60+). Voting age population is calculated as 18+ (approximately 80% of the 15-29 group plus all older groups).'
    }
  ]
};

export default function DemographicsPage() {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSource, setExpandedSource] = useState(null);
  const [showMethodology, setShowMethodology] = useState(false);

  // Get all districts with their data
  const districts = useMemo(() => {
    return Object.entries(DISTRICT_DEMOGRAPHICS).map(([name, data]) => ({
      name,
      ...data,
      youthIndex: getYouthIndex(data.ageGroups),
      dependencyRatio: getDependencyRatio(data.ageGroups)
    })).sort((a, b) => b.population - a.population);
  }, []);

  // Filter districts by search
  const filteredDistricts = useMemo(() => {
    if (!searchTerm) {return districts;}
    const term = searchTerm.toLowerCase();
    return districts.filter(d => d.name.toLowerCase().includes(term));
  }, [districts, searchTerm]);

  // National totals
  const nationalStats = useMemo(() => {
    const total = districts.reduce((acc, d) => ({
      population: acc.population + d.population,
      male: acc.male + d.male,
      female: acc.female + d.female
    }), { population: 0, male: 0, female: 0 });

    return {
      ...total,
      districts: districts.length,
      constituencies: 165
    };
  }, [districts]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-foreground">Demographics</h1>
          </div>
          <p className="text-muted">
            Population and age distribution data for Nepal&apos;s districts and constituencies
          </p>
        </div>

        {/* National Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <p className="text-xs uppercase tracking-wider text-muted mb-1">
              Total Population
            </p>
            <p className="text-2xl font-bold text-foreground">
              {(nationalStats.population / 1000000).toFixed(2)}M
            </p>
            <p className="text-xs text-muted">Census 2021</p>
          </div>
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <p className="text-xs uppercase tracking-wider text-muted mb-1">
              Districts
            </p>
            <p className="text-2xl font-bold text-foreground">{nationalStats.districts}</p>
            <p className="text-xs text-muted">with demographic data</p>
          </div>
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <p className="text-xs uppercase tracking-wider text-muted mb-1">
              FPTP Constituencies
            </p>
            <p className="text-2xl font-bold text-foreground">{nationalStats.constituencies}</p>
            <p className="text-xs text-muted">estimated demographics</p>
          </div>
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <p className="text-xs uppercase tracking-wider text-muted mb-1">
              Gender Ratio
            </p>
            <p className="text-2xl font-bold text-foreground">
              {((nationalStats.male / nationalStats.female) * 100).toFixed(0)}
            </p>
            <p className="text-xs text-muted">males per 100 females</p>
          </div>
        </div>

        {/* Data Sources Section */}
        <div className="bg-surface border border-neutral rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-semibold text-foreground">Data Sources</h2>
          </div>
          <p className="text-sm text-muted mb-4">
            All demographic data is sourced from official Government of Nepal publications. Click each source for details.
          </p>
          <div className="space-y-3">
            {DATA_SOURCES.map((source, idx) => (
              <div key={idx} className="border border-neutral rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSource(expandedSource === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 hover:bg-neutral/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{source.name}</p>
                      <p className="text-xs text-muted">{source.organization}</p>
                    </div>
                  </div>
                  {expandedSource === idx ? (
                    <ChevronUp className="w-5 h-5 text-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted" />
                  )}
                </button>
                {expandedSource === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4 border-t border-neutral"
                  >
                    <p className="text-sm text-foreground/80 mt-3 mb-3">{source.description}</p>
                    <div className="mb-3">
                      <p className="text-xs text-muted mb-1">Data used:</p>
                      <div className="flex flex-wrap gap-2">
                        {source.dataUsed.map((item, i) => (
                          <span key={i} className="px-2 py-1 bg-neutral rounded text-xs text-foreground/80">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View source
                    </a>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Methodology Section */}
        <div className="bg-surface border border-neutral rounded-xl p-6 mb-8">
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-semibold text-foreground">{METHODOLOGY.title}</h2>
            </div>
            {showMethodology ? (
              <ChevronUp className="w-5 h-5 text-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted" />
            )}
          </button>
          {showMethodology && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-4 space-y-4"
            >
              {METHODOLOGY.sections.map((section, idx) => (
                <div key={idx} className="border-l-2 border-yellow-400/30 pl-4">
                  <h3 className="text-sm font-medium text-yellow-400 mb-1">{section.heading}</h3>
                  <p className="text-sm text-foreground/80">{section.content}</p>
                </div>
              ))}
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-xs text-yellow-900">
                  <strong>Transparency Note:</strong> These are estimates based on the best available public data.
                  Actual constituency-level demographics may differ. We encourage verification with official sources for critical analysis.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Province Summary */}
        <div className="bg-surface border border-neutral rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-foreground">Province Demographics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(PROVINCE_DEMOGRAPHICS).map(([id, data]) => (
              <div key={id} className="bg-neutral/30 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  {PROVINCES[id]?.name || `Province ${id}`}
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">Population</span>
                    <span className="text-foreground/80 font-mono">
                      {(data.population / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Median Age</span>
                    <span className="text-foreground/80 font-mono">{data.medianAge} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Literacy</span>
                    <span className="text-foreground/80 font-mono">{(data.literacyRate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Urban</span>
                    <span className="text-foreground/80 font-mono">{(data.urbanPopulation * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* District Browser */}
        <div className="bg-surface border border-neutral rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-foreground">District Demographics</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 bg-neutral border border-neutral rounded-lg text-sm text-foreground placeholder-gray-500 focus:outline-none focus:border-gray-500 w-48"
              />
            </div>
          </div>

          {/* Age legend */}
          <div className="flex items-center gap-4 mb-4 text-xs text-muted">
            <span>Age bars:</span>
            {Object.entries(AGE_GROUP_LABELS).map(([key]) => (
              <span key={key} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getAgeGroupColor(key) }}
                />
                {key}
              </span>
            ))}
          </div>

          {/* District table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral">
                  <th className="text-left py-3 px-2 text-muted font-medium">District</th>
                  <th className="text-right py-3 px-2 text-muted font-medium">Population</th>
                  <th className="text-right py-3 px-2 text-muted font-medium">Med. Age</th>
                  <th className="text-right py-3 px-2 text-muted font-medium">Youth %</th>
                  <th className="text-right py-3 px-2 text-muted font-medium">Literacy</th>
                  <th className="text-center py-3 px-2 text-muted font-medium">Age Distribution</th>
                </tr>
              </thead>
              <tbody>
                {filteredDistricts.map((district) => (
                  <tr
                    key={district.name}
                    className="border-b border-neutral/50 hover:bg-neutral/30 cursor-pointer"
                    onClick={() => setSelectedDistrict(district.name === selectedDistrict ? null : district.name)}
                  >
                    <td className="py-3 px-2">
                      <span className="text-foreground font-medium">{district.name}</span>
                    </td>
                    <td className="py-3 px-2 text-right text-foreground/80 font-mono">
                      {district.population.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right text-foreground/80 font-mono">
                      {district.medianAge}
                    </td>
                    <td className="py-3 px-2 text-right font-mono">
                      <span className={district.youthIndex > 0.55 ? 'text-green-400' : 'text-foreground/80'}>
                        {(district.youthIndex * 100).toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-mono">
                      <span className={district.literacyRate > 0.8 ? 'text-blue-400' : 'text-foreground/80'}>
                        {(district.literacyRate * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex justify-center">
                        <div className="flex h-4 rounded overflow-hidden bg-neutral/50 w-32">
                          {Object.entries(district.ageGroups).map(([group, pct]) => (
                            <div
                              key={group}
                              style={{
                                width: `${pct * 100}%`,
                                backgroundColor: getAgeGroupColor(group)
                              }}
                              title={`${AGE_GROUP_LABELS[group]}: ${(pct * 100).toFixed(2)}%`}
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDistricts.length === 0 && (
            <div className="text-center py-8 text-muted">
              No districts found matching &quot;{searchTerm}&quot;
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-8 p-4 bg-neutral/30 rounded-lg">
          <p className="text-xs text-muted text-center">
            Data last updated: Census 2021 (published 2023). Constituency estimates use proportional allocation methodology.
            For official data, please refer to the <a href="https://censusnepal.cbs.gov.np" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">National Statistics Office</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
