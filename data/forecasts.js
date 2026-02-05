// Election forecast models and projections

export const FORECASTS = {
  '2027': {
    id: 'forecast-2027',
    election: '2027 General Election',
    electionNe: '२०२७ साधारण निर्वाचन',
    model: 'Nepal Votes Ensemble Model',
    lastUpdated: '2025-01-28',
    confidence: 'Medium',
    methodology: 'Combines polling data, historical trends, and demographic analysis',
    methodologyNe: 'मतदान डाटा, ऐतिहासिक प्रवृत्ति, र जनसांख्यिकी विश्लेषणको संयोजन',
    projections: {
      NC: {
        seats: 95,
        range: [85, 105],
        probability: 0.35,
      },
      UML: {
        seats: 88,
        range: [78, 98],
        probability: 0.30,
      },
      Maoist: {
        seats: 35,
        range: [28, 42],
        probability: 0.15,
      },
      RSP: {
        seats: 28,
        range: [20, 36],
        probability: 0.12,
      },
      RPP: {
        seats: 12,
        range: [8, 16],
        probability: 0.05,
      },
      JSPN: {
        seats: 10,
        range: [6, 14],
        probability: 0.02,
      },
      US: {
        seats: 4,
        range: [2, 6],
        probability: 0.01,
      },
      Others: {
        seats: 3,
        range: [0, 6],
        probability: 0.00,
      },
    },
    scenarios: [
      {
        name: 'Status Quo',
        nameNe: 'स्थिति नाता',
        description: 'Current polling trends continue',
        descriptionNe: 'वर्तमान मतदान प्रवृत्ति जारी रहन्छ',
        winner: 'NC',
        seats: {
          NC: 95,
          UML: 88,
          Maoist: 35,
          RSP: 28,
          RPP: 12,
          JSPN: 10,
          US: 4,
          Others: 3,
        },
      },
      {
        name: 'RSP Surge',
        nameNe: 'RSP वृद्धि',
        description: 'RSP gains significantly from youth vote',
        descriptionNe: 'RSP ले युवा मतदानबाट ठूलो मत प्राप्त गर्छ',
        winner: 'RSP',
        seats: {
          NC: 85,
          UML: 80,
          Maoist: 30,
          RSP: 45,
          RPP: 10,
          JSPN: 12,
          US: 6,
          Others: 7,
        },
      },
      {
        name: 'UML Comeback',
        nameNe: 'UML फिर्ती',
        description: 'UML recovers lost ground',
        descriptionNe: 'UML ले हराएको भूमि पुनः प्राप्त गर्छ',
        winner: 'UML',
        seats: {
          NC: 80,
          UML: 105,
          Maoist: 32,
          RSP: 25,
          RPP: 15,
          JSPN: 10,
          US: 5,
          Others: 3,
        },
      },
    ],
  },
}

export function getForecastById(id) {
  return FORECASTS[id]
}

export function getLatestForecast() {
  const years = Object.keys(FORECASTS).sort((a, b) => b - a)
  return FORECASTS[years[0]]
}

export function getForecastWinProbability(party, forecastId = '2027') {
  const forecast = FORECASTS[forecastId]
  if (!forecast || !forecast.projections[party]) {
    return 0
  }
  return forecast.projections[party].probability
}
