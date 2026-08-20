import { RequestHandler } from "express";
import { FloodDataSummary } from "@shared/flood";
import { getFloodSourceAdapters, normalizeFloodInputs } from "../flood/adapters";
import { calculateFloodRisk } from "../flood/risk-engine";

export const handleFloodIntelligence: RequestHandler = (_req, res) => {
  const adapters = getFloodSourceAdapters();
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
    sources: adapters.map((adapter) => ({
      name: adapter.name,
      status: adapter.isConfigured() ? "configured" : "not_configured",
      purpose: adapter.purpose,
    })),
    updatedAt: null,
    risk: calculateFloodRisk(indicators),
    currentEvents: [],
  };

  res.status(200).json(response);
};
