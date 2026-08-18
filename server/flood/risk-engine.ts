import { FloodIndicators, FloodRiskLevel, FloodRiskResult } from "@shared/flood";

const clamp = (value: number) => Math.round(Math.min(100, Math.max(0, value)));

export function riskLevel(score: number): FloodRiskLevel {
  if (score <= 20) return "Low";
  if (score <= 40) return "Moderate";
  if (score <= 60) return "High";
  if (score <= 80) return "Very High";
  return "Critical";
}

export function calculateFloodRisk(indicators: FloodIndicators): FloodRiskResult {
  const currentRisk = clamp(indicators.currentRainfall * 0.4 + indicators.currentInundation * 0.4 + indicators.currentWarnings * 0.2);
  const forecastRisk = clamp(indicators.forecastRainfall * 0.65 + indicators.forecastWarnings * 0.35);
  const historicalRisk = clamp(indicators.historicalHazard * 0.4 + indicators.terrainVulnerability * 0.25 + indicators.waterBodyExposure * 0.2 + indicators.populationExposure * 0.15);
  const score = clamp(currentRisk * 0.45 + forecastRisk * 0.3 + historicalRisk * 0.25);

  const contributingFactors = [
    { label: "Current inundation", value: indicators.currentInundation },
    { label: "Current rainfall", value: indicators.currentRainfall },
    { label: "Rainfall forecast", value: indicators.forecastRainfall },
    { label: "Historical flood hazard", value: indicators.historicalHazard },
    { label: "Terrain vulnerability", value: indicators.terrainVulnerability },
    { label: "Population exposure", value: indicators.populationExposure },
  ].map((factor) => ({ ...factor, level: riskLevel(factor.value) }));

  const highestFactors = [...contributingFactors].sort((a, b) => b.value - a.value).slice(0, 3).map((factor) => factor.label.toLowerCase());
  const explanation = `Flood risk is ${riskLevel(score).toLowerCase()} because ${highestFactors.join(", ")} are elevated in the normalized input data.`;

  return { score, level: riskLevel(score), currentRisk, forecastRisk, historicalRisk, explanation, contributingFactors, modelLabel: "AI-Assisted Flood Risk Score — Prototype" };
}
