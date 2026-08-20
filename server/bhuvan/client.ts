const BHUVAN_BASE = "https://bhuvan-app1.nrsc.gov.in/api";

const tokenFor = (envKey: string) => {
  const token = process.env[envKey];
  if (!token) throw new Error(`Missing Bhuvan configuration: ${envKey}`);
  return token;
};

async function getJson(path: string, params: Record<string, string>) {
  const url = new URL(`${BHUVAN_BASE}${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Bhuvan request failed: ${response.status}`);
  const payload: unknown = await response.json();
  return payload === false || payload === null ? [] : payload;
}

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const asRecord = (value: unknown): Record<string, unknown> => value && typeof value === "object" ? value as Record<string, unknown> : {};

export async function getNearbyFacilities(params: { lat: number; lon: number; buffer: number; theme: "hospital" | "postal" | "all" }) {
  const token = tokenFor("BHUVAN_POSTAL_HOSPITAL_TOKEN");
  const payload = await getJson("/api_proximity/curl_hos_pos_prox.php", { ...params, lat: String(params.lat), lon: String(params.lon), buffer: String(params.buffer), theme: params.theme, token });
  const records = Array.isArray(payload) ? payload : [];
  return records.map((value) => {
    const record = asRecord(value);
    return {
      id: String(record.facilityid ?? record.code ?? ""),
      name: String(record.facilityname ?? "Unnamed facility").trim(),
      category: String(record.facilitycategory ?? "Facility").trim(),
      address: String(record.facilityaddress ?? "").trim(),
      latitude: toNumber(record.lat),
      longitude: toNumber(record.lon),
      district: String(record.dname ?? "").trim(),
      phone: String(record.facilityphone ?? record.hpphone ?? "").trim(),
      source: "Bhuvan / NRSC",
    };
  });
}

export async function geocodeVillage(village: string) {
  const token = tokenFor("BHUVAN_VILLAGE_GEOCODING_KEY");
  const payload = await getJson("/api_proximity/curl_village_geocode.php", { village, token });
  return normalizeVillage(payload);
}

export async function reverseGeocodeVillage(lat: number, lon: number) {
  const token = tokenFor("BHUVAN_VILLAGE_REVERSE_GEOCODING_KEY");
  const payload = await getJson("/api_proximity/curl_reverse_village.php", { lat: String(lat), lon: String(lon), token });
  return normalizeVillage(payload);
}

function normalizeVillage(payload: unknown) {
  const records = Array.isArray(payload) ? payload : [];
  return records.map((value) => {
    const record = asRecord(value);
    return {
      village: String(record.name1 ?? "").trim(),
      villageId: String(record.vid ?? "").trim(),
      population: toNumber(record.tot_p),
      households: toNumber(record.no_hh),
      district: String(record.dhq_name ?? "").trim(),
      subDistrict: String(record.thq_name ?? "").trim(),
      source: "Bhuvan / NRSC",
    };
  });
}

export async function getLulcStatistics(params: { year: "0506" | "1112"; statcode?: string; distcode?: string }) {
  const token = tokenFor("BHUVAN_LULC_STATISTICS_KEY");
  const query: Record<string, string> = { year: params.year, token };
  if (params.distcode) query.distcode = params.distcode;
  else if (params.statcode) query.statcode = params.statcode;
  const payload = await getJson("/lulc/curljson.php", query);
  return normalizeLulc(payload);
}

export async function getLulcAoi(geom: string) {
  const token = tokenFor("BHUVAN_LULC_AOI_KEY");
  const payload = await getJson("/lulc/curl_aoi.php", { geom, token });
  return normalizeLulc(payload);
}

function normalizeLulc(payload: unknown) {
  const record = asRecord(payload);
  const records = Array.isArray(payload) ? payload : [record];
  const classes = records.flatMap((value) => {
    const item = asRecord(value);
    const explicitCode = item.lu_code ?? item.code ?? item["LULC Description"];
    if (explicitCode) return [{ code: String(explicitCode).trim(), label: String(item.description ?? item["LULC Description"] ?? explicitCode).trim(), areaSqKm: toNumber(item.area ?? item["Area in Sq. Km"]), percentage: toNumber(item.percentage) }];
    return Object.entries(item).filter(([key]) => /^l\d+$/i.test(key)).map(([key, value]) => ({ code: key, label: key, areaSqKm: toNumber(value), percentage: null }));
  });
  return { totalAreaSqKm: toNumber(record.totalarea), classes, source: "Bhuvan / NRSC" };
}
