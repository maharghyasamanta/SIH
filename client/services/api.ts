import type { FloodDataSummary } from "@shared/flood";

const API_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const isMultipart = options?.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(isMultipart ? {} : { "Content-Type": "application/json" }),
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Service unavailable: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const disasterService = {
  getRiskZones: () => apiRequest("/risk-zones"),
  getAlerts: () => apiRequest("/alerts"),
  getShelters: () => apiRequest("/shelters"),
  getHospitals: () => apiRequest("/hospitals"),
};

export const floodIntelligenceService = {
  getSummary: () => apiRequest<FloodDataSummary>("/flood-intelligence/summary"),
};

const query = (params: Record<string, string | number>) => new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)])).toString();

export const bhuvanService = {
  getFacilities: (params: { lat: number; lon: number; buffer?: number; theme?: "hospital" | "postal" | "all" }) => apiRequest(`/bhuvan/facilities?${query({ buffer: 5000, theme: "hospital", ...params })}`),
  geocodeVillage: (village: string) => apiRequest(`/bhuvan/village/geocode?${query({ village })}`),
  reverseGeocodeVillage: (params: { lat: number; lon: number }) => apiRequest(`/bhuvan/village/reverse-geocode?${query(params)}`),
  getLulcStatistics: (params: { year: "0506" | "1112"; statcode?: string; distcode?: string }) => apiRequest(`/bhuvan/lulc/statistics?${query(params as Record<string, string>)}`),
  getLulcAoi: (geom: string) => apiRequest(`/bhuvan/lulc/aoi?${query({ geom })}`),
};

export const aiService = {
  predictRisk: (payload: unknown) => apiRequest("/ai/risk-prediction", { method: "POST", body: JSON.stringify(payload) }),
  classifyIncident: (payload: FormData) => apiRequest("/ai/classify-incident", { method: "POST", body: payload, headers: {} }),
  analyzeDamage: (payload: FormData) => apiRequest("/ai/damage-analysis", { method: "POST", body: payload, headers: {} }),
};
