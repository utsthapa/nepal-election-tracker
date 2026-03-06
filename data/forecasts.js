// Election forecast models and projections
// No real published forecasting model output is available at this time.
// This will be populated when a verified forecast becomes available.

export const FORECASTS = {};

export const FORECASTS_ARE_ILLUSTRATIVE = true;

const FORECAST_YEARS_DESC = Object.keys(FORECASTS).sort((a, b) => b - a);

export function getForecastById(id) {
  return FORECASTS[id];
}

export function getLatestForecast() {
  return FORECASTS[FORECAST_YEARS_DESC[0]];
}

export function getForecastWinProbability(party, forecastId = '2027') {
  const forecast = FORECASTS[forecastId];
  if (!forecast || !forecast.projections[party]) {
    return 0;
  }
  return forecast.projections[party].probability;
}
