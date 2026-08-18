import { FloodIndicators } from "@shared/flood";

export interface FloodDataSourceAdapter {
  readonly name: string;
  getIndicators(): Promise<Partial<FloodIndicators>>;
}

export class BhuvanAdapter implements FloodDataSourceAdapter {
  readonly name = "Bhuvan / NRSC";

  async getIndicators(): Promise<Partial<FloodIndicators>> {
    return {};
  }
}

export class ImdAdapter implements FloodDataSourceAdapter {
  readonly name = "IMD";

  async getIndicators(): Promise<Partial<FloodIndicators>> {
    return {};
  }
}

export function normalizeFloodInputs(inputs: Array<Partial<FloodIndicators>>): FloodIndicators {
  const values = Object.assign({}, ...inputs) as Partial<FloodIndicators>;
  return {
    currentRainfall: values.currentRainfall ?? 0,
    currentInundation: values.currentInundation ?? 0,
    currentWarnings: values.currentWarnings ?? 0,
    forecastRainfall: values.forecastRainfall ?? 0,
    forecastWarnings: values.forecastWarnings ?? 0,
    historicalHazard: values.historicalHazard ?? 0,
    terrainVulnerability: values.terrainVulnerability ?? 0,
    waterBodyExposure: values.waterBodyExposure ?? 0,
    populationExposure: values.populationExposure ?? 0,
  };
}
