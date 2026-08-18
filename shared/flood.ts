export type FloodRiskLevel = "Low" | "Moderate" | "High" | "Very High" | "Critical";

export type FloodSource = "BHUVĀN" | "IMD" | "Prototype";

export interface FloodIndicators {
  currentRainfall: number;
  currentInundation: number;
  currentWarnings: number;
  forecastRainfall: number;
  forecastWarnings: number;
  historicalHazard: number;
  terrainVulnerability: number;
  waterBodyExposure: number;
  populationExposure: number;
}

export interface FloodRiskResult {
  score: number;
  level: FloodRiskLevel;
  currentRisk: number;
  forecastRisk: number;
  historicalRisk: number;
  explanation: string;
  contributingFactors: Array<{ label: string; value: number; level: FloodRiskLevel }>;
  modelLabel: "AI-Assisted Flood Risk Score — Prototype";
}

export interface FloodDataSummary {
  mode: "prototype" | "live";
  sources: Array<{ name: string; status: "configured" | "not_configured"; purpose: string }>;
  updatedAt: string | null;
  risk: FloodRiskResult;
  currentEvents: Array<{
    id: string;
    state: string;
    district: string;
    location: string;
    risk: FloodRiskLevel;
    rainfall: FloodRiskLevel;
    inundationDetected: boolean;
    warningActive: boolean;
    source: string;
    updatedAt: string;
  }>;
}
