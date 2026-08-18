export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

export type RiskZone = {
  id: string;
  name: string;
  type: string;
  risk: RiskLevel;
  score: number;
  population: string;
  area: string;
  color: string;
  coordinates: { top: string; left: string };
};

export const riskZones: RiskZone[] = [
  {
    id: "zone-4",
    name: "Zone 4 · Riverside",
    type: "Urban flood",
    risk: "Critical",
    score: 87,
    population: "12,840",
    area: "14.8 km²",
    color: "#e65353",
    coordinates: { top: "37%", left: "63%" },
  },
  {
    id: "zone-7",
    name: "Zone 7 · Industrial",
    type: "Infrastructure disruption",
    risk: "High",
    score: 72,
    population: "4,620",
    area: "8.2 km²",
    color: "#e98b42",
    coordinates: { top: "55%", left: "29%" },
  },
  {
    id: "zone-2",
    name: "Zone 2 · Old Town",
    type: "Waterlogging",
    risk: "Moderate",
    score: 58,
    population: "2,150",
    area: "4.6 km²",
    color: "#e4b94b",
    coordinates: { top: "25%", left: "30%" },
  },
  {
    id: "zone-9",
    name: "Zone 9 · North Ridge",
    type: "Landslide watch",
    risk: "Low",
    score: 31,
    population: "840",
    area: "2.1 km²",
    color: "#57a681",
    coordinates: { top: "19%", left: "76%" },
  },
];

export const shelters = [
  { id: "SHEL-009", name: "Riverside Community Hall", distance: "2.4 km", capacity: 500, occupied: 312, facilities: ["Water", "Medical", "Electricity"], risk: "Low" as RiskLevel },
  { id: "SHEL-014", name: "Central Sports Complex", distance: "3.1 km", capacity: 1200, occupied: 684, facilities: ["Water", "Food", "Accessible"], risk: "Low" as RiskLevel },
  { id: "SHEL-021", name: "St. Mary’s School", distance: "4.8 km", capacity: 380, occupied: 264, facilities: ["Medical", "Food", "Power"], risk: "Moderate" as RiskLevel },
];

export const hospitals = [
  { id: "HOSP-014", name: "City Emergency Hospital", distance: "3.8 km", beds: 42, icu: 8, status: "OPEN", contact: "+91 1800 240 112" },
  { id: "HOSP-006", name: "District Medical Centre", distance: "5.2 km", beds: 19, icu: 3, status: "LIMITED", contact: "+91 1800 240 118" },
  { id: "HOSP-019", name: "Northside Trauma Unit", distance: "7.1 km", beds: 64, icu: 12, status: "OPEN", contact: "+91 1800 240 121" },
];

export const alerts = [
  { title: "Critical flood risk detected in Zone 4", detail: "Follow official instructions and move toward designated emergency shelters.", type: "Emergency", time: "10 min ago", priority: "Critical" },
  { title: "Shelter capacity update", detail: "Central Sports Complex has 516 spaces available.", type: "Shelter update", time: "28 min ago", priority: "Warning" },
  { title: "Heavy rainfall expected", detail: "Rainfall intensity may increase over the next 3 hours.", type: "Weather warning", time: "42 min ago", priority: "High" },
];

export const resources = [
  { label: "Medical supplies", available: 4820, required: 7000, unit: "kits", priority: "Critical" },
  { label: "Drinking water", available: 13600, required: 18000, unit: "units", priority: "High" },
  { label: "Rescue teams", available: 18, required: 24, unit: "teams", priority: "High" },
  { label: "Ambulances", available: 31, required: 36, unit: "vehicles", priority: "Moderate" },
];

export const riskTrend = [42, 48, 44, 57, 61, 69, 66, 78, 87];
