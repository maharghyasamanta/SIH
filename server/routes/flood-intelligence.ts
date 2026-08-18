import { RequestHandler } from "express";
import { FloodDataSummary } from "@shared/flood";
import { normalizeFloodInputs } from "../flood/adapters";
import { calculateFloodRisk } from "../flood/risk-engine";

export const handleFloodIntelligence: RequestHandler = (_req, res) => {
  const indicators = normalizeFloodInputs([
    {
      currentRainfall: 0,
      currentInundation: 0,
      currentWarnings: 0,
      forecastRainfall: 0,
      forecastWarnings: 0,
      historicalHazard: 68,
      terrainVulnerability: 55,
      waterBodyExposure: 62,
      populationExposure: 58,
    },
  ]);

  const response: FloodDataSummary = {
    mode: "prototype",
    sources: [
      { name: "Bhuvan / NRSC", status: "not_configured", purpose: "Flood hazard, inundation, vulnerability, terrain and water-body layers" },
      { name: "IMD", status: "not_configured", purpose: "Rainfall observations, QPF and official weather warnings" },
    ],
    updatedAt: null,
    risk: calculateFloodRisk(indicators),
    currentEvents: [],
  };

  res.status(200).json(response);
};
