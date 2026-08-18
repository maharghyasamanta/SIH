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

export const aiService = {
  predictRisk: (payload: unknown) => apiRequest("/ai/risk-prediction", { method: "POST", body: JSON.stringify(payload) }),
  classifyIncident: (payload: FormData) => apiRequest("/ai/classify-incident", { method: "POST", body: payload, headers: {} }),
  analyzeDamage: (payload: FormData) => apiRequest("/ai/damage-analysis", { method: "POST", body: payload, headers: {} }),
};
