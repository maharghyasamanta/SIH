import { FloodIndicators } from "@shared/flood";

export interface FloodDataSourceAdapter {
  readonly name: string;
  readonly purpose: string;
  isConfigured(): boolean;
  getIndicators(): Promise<Partial<FloodIndicators>>;
}

abstract class ConfiguredAdapter implements FloodDataSourceAdapter {
  abstract readonly name: string;
  abstract readonly purpose: string;
  abstract readonly requiredEnv: string[];

  isConfigured() {
    return this.requiredEnv.every((key) => Boolean(process.env[key]));
  }

  async getIndicators(): Promise<Partial<FloodIndicators>> {
    return {};
  }
}

export class IndianApiWeatherAdapter extends ConfiguredAdapter {
  readonly name = "IndianAPI Weather";
  readonly purpose = "Current weather and rainfall forecast signals";
  readonly requiredEnv = ["INDIAN_API_WEATHER_KEY"];
}

export class BhuvanAdapter extends ConfiguredAdapter {
  readonly name = "Bhuvan / NRSC";
  readonly purpose = "Village geocoding, LULC, flood hazard, inundation, terrain and water-body context";
  readonly requiredEnv = [
    "BHUVAN_VILLAGE_GEOCODING_KEY",
    "BHUVAN_VILLAGE_REVERSE_GEOCODING_KEY",
    "BHUVAN_LULC_STATISTICS_KEY",
    "BHUVAN_LULC_AOI_KEY",
  ];
}

export class CwcImdAdapter extends ConfiguredAdapter {
  readonly name = "CWC / IMD";
  readonly purpose = "River levels, hydrology and official warnings";
  readonly requiredEnv = ["CWC_IMD_API_KEY"];
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

export function getFloodSourceAdapters(): FloodDataSourceAdapter[] {
  return [new IndianApiWeatherAdapter(), new BhuvanAdapter(), new CwcImdAdapter()];
}
