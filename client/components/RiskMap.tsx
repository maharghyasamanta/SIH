import { useEffect, useMemo, useState } from "react";
import indiaMap from "@svg-maps/india";
import { Check, Database, Layers3, MapPin, Search, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type IndiaRiskLevel = "Low" | "Moderate" | "High" | "Very High" | "Critical";
export type DisasterMapPeriod = "current" | "last7";
export type IndiaDisasterEvent = { id: string; state: string; district: string; hazard: string; risk: IndiaRiskLevel; score: number; top: string; left: string; color: string; updated: string; source: string; date: string; status: "Active" | "Resolved" | "Monitoring" };

export const indiaDisasterEvents: IndiaDisasterEvent[] = [
  { id: "assam-flood", state: "Assam", district: "Dibrugarh", hazard: "Flood", risk: "Very High", score: 77, top: "34%", left: "75%", color: "#e98b42", updated: "Demo timestamp · 18 min ago", source: "Prototype flood module", date: "Today", status: "Active" },
  { id: "odisha-cyclone", state: "Odisha", district: "Puri coast", hazard: "Cyclone watch", risk: "High", score: 64, top: "57%", left: "66%", color: "#d4a63d", updated: "Demo timestamp · 1 hr ago", source: "Prototype weather module", date: "Today", status: "Monitoring" },
  { id: "uttarakhand-landslide", state: "Uttarakhand", district: "Chamoli", hazard: "Landslide", risk: "Very High", score: 71, top: "24%", left: "51%", color: "#e98b42", updated: "Demo timestamp · 3 hrs ago", source: "Prototype hazard module", date: "Yesterday", status: "Active" },
  { id: "kerala-flood", state: "Kerala", district: "Idukki", hazard: "Flash flood", risk: "High", score: 58, top: "81%", left: "41%", color: "#e4b94b", updated: "Demo timestamp · 8 hrs ago", source: "Prototype hazard module", date: "Yesterday", status: "Monitoring" },
  { id: "gujarat-heatwave", state: "Gujarat", district: "Ahmedabad", hazard: "Extreme heat", risk: "Moderate", score: 42, top: "50%", left: "25%", color: "#57a681", updated: "Demo timestamp · 2 days ago", source: "Prototype weather module", date: "2 days ago", status: "Resolved" },
  { id: "sikkim-landslide", state: "Sikkim", district: "Gangtok", hazard: "Landslide", risk: "High", score: 55, top: "29%", left: "69%", color: "#e4b94b", updated: "Demo timestamp · 4 days ago", source: "Prototype hazard module", date: "4 days ago", status: "Resolved" },
  { id: "delhi-earthquake", state: "Delhi", district: "New Delhi", hazard: "Earthquake", risk: "High", score: 61, top: "34%", left: "49%", color: "#e65353", updated: "Demo timestamp · 5 hrs ago", source: "Prototype seismic module", date: "Today", status: "Monitoring" },
  { id: "maharashtra-wildfire", state: "Maharashtra", district: "Nashik", hazard: "Wildfire", risk: "High", score: 63, top: "63%", left: "35%", color: "#e98b42", updated: "Demo timestamp · 6 hrs ago", source: "Prototype wildfire module", date: "Today", status: "Active" },
  { id: "andhra-urban-incident", state: "Andhra Pradesh", district: "Visakhapatnam", hazard: "Urban incident", risk: "Moderate", score: 46, top: "65%", left: "61%", color: "#57a681", updated: "Demo timestamp · 1 day ago", source: "Prototype incident module", date: "Yesterday", status: "Monitoring" },
];

const layers = ["Active disasters", "Weather & warnings", "Flood intelligence", "Cyclone tracks", "Earthquake activity", "Landslide susceptibility", "Wildfire hotspots", "Shelters & hospitals", "Disaster risk score"];
const riskFilters: Array<{ label: IndiaRiskLevel; color: string }> = [
  { label: "Critical", color: "#e65353" }, { label: "Very High", color: "#e98b42" }, { label: "High", color: "#e4b94b" }, { label: "Moderate", color: "#57a681" },
];
const layerFilters: Record<string, (event: IndiaDisasterEvent) => boolean> = {
  "Active disasters": (event) => event.status === "Active" || event.status === "Monitoring",
  "Weather & warnings": (event) => event.hazard.includes("Cyclone") || event.hazard.includes("heat"),
  "Flood intelligence": (event) => event.hazard.includes("flood"),
  "Cyclone tracks": (event) => event.hazard.includes("Cyclone"),
  "Earthquake activity": (event) => event.hazard.includes("Earthquake"),
  "Landslide susceptibility": (event) => event.hazard.includes("Landslide"),
  "Wildfire hotspots": (event) => event.hazard.includes("Wildfire"),
  "Disaster risk score": () => true,
};
const demoFacilities = [
  { id: "guwahati-hospital", label: "Guwahati emergency hospital", top: "39%", left: "72%" },
  { id: "shillong-shelter", label: "Shillong relief shelter", top: "43%", left: "70%" },
  { id: "delhi-hospital", label: "New Delhi emergency hospital", top: "34%", left: "50%" },
  { id: "mumbai-shelter", label: "Mumbai relief shelter", top: "65%", left: "31%" },
];

export function RiskMap({ compact = false, period = "current" }: { compact?: boolean; period?: DisasterMapPeriod }) {
  const [selectedId, setSelectedId] = useState("assam-flood");
  const [query, setQuery] = useState("");
  const [selectedLayers, setSelectedLayers] = useState(["Active disasters", "Disaster risk score"]);
  const [mapPeriod, setMapPeriod] = useState<DisasterMapPeriod>(period);
  useEffect(() => setMapPeriod(period), [period]);
  const selected = indiaDisasterEvents.find((event) => event.id === selectedId) ?? indiaDisasterEvents[0];
  const visibleEvents = useMemo(() => indiaDisasterEvents.filter((event) => {
    const matchesPeriod = mapPeriod === "last7" || event.status === "Active" || event.status === "Monitoring";
    const matchesSearch = `${event.state} ${event.district} ${event.hazard}`.toLowerCase().includes(query.toLowerCase());
    const matchesLayer = selectedLayers.some((layer) => layerFilters[layer]?.(event));
    return matchesPeriod && matchesSearch && matchesLayer;
  }), [mapPeriod, query, selectedLayers]);
  const visibleFacilities = selectedLayers.includes("Shelters & hospitals") ? demoFacilities : [];
  const showRiskFilters = selectedLayers.includes("Disaster risk score");
  const toggleLayer = (layer: string) => setSelectedLayers((current) => current.includes(layer) ? current.filter((value) => value !== layer) : [...current, layer]);

  return <div className={cn("relative overflow-hidden rounded-2xl border", compact ? "h-[400px] border-white/10" : "h-[640px] border-slate-200")}>
    <div className="india-map-surface absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" viewBox={indiaMap.viewBox} preserveAspectRatio="xMidYMid meet" role="img" aria-label="India disaster intelligence map with prototype current disaster markers">
        {indiaMap.locations.map((location) => <path key={location.id} d={location.path} fill="rgba(205,221,214,.8)" stroke="#80998c" strokeWidth="1.2" strokeLinejoin="round" />)}
        <text x="292" y="335" fill="#557064" fontSize="15" fontWeight="800" letterSpacing="3">INDIA</text><text x="527" y="258" fill="#557064" fontSize="10" fontWeight="700" letterSpacing="1.5">NORTH EAST</text><text x="86" y="400" fill="#789084" fontSize="9" fontWeight="700" letterSpacing="1">ARABIAN SEA</text><text x="478" y="466" fill="#789084" fontSize="9" fontWeight="700" letterSpacing="1">BAY OF BENGAL</text>
      </svg>
      {visibleEvents.map((event) => <button key={event.id} onClick={() => setSelectedId(event.id)} className={cn("map-marker absolute z-10", selectedId === event.id && "is-selected")} style={{ top: event.top, left: event.left, ["--marker-color" as string]: event.color }} aria-label={`Select ${event.hazard} in ${event.state}`}><span className="marker-ring" /><span className="marker-dot" /></button>)}
      {visibleFacilities.map((facility) => <span key={facility.id} className="facility-marker absolute z-10" style={{ top: facility.top, left: facility.left }} aria-label={facility.label} title={facility.label}><span /></span>)}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-white/60 bg-white/85 px-3 py-2 text-[10px] font-bold uppercase tracking-[.11em] text-slate-500 shadow-sm backdrop-blur"><Database size={13} className="text-[#337e69]" /> Prototype layers · source feeds not connected</div>
    </div>
    <div className="absolute left-4 top-4 z-20 w-[calc(100%-2rem)] sm:left-5 sm:w-auto"><div className="relative w-full sm:w-[255px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search state, district, hazard" className="h-10 w-full rounded-lg border border-slate-200 bg-white/95 pl-9 pr-3 text-[12px] font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#337e69]" /></div><div className="mt-2 flex w-fit rounded-lg border border-slate-200 bg-white/95 p-1 shadow-sm"><button onClick={() => setMapPeriod("current")} className={cn("rounded-md px-3 py-2 text-[10px] font-extrabold", mapPeriod === "current" ? "bg-slate-900 text-white" : "text-slate-500")}>Current</button><button onClick={() => setMapPeriod("last7")} className={cn("rounded-md px-3 py-2 text-[10px] font-extrabold", mapPeriod === "last7" ? "bg-slate-900 text-white" : "text-slate-500")}>Last 7 days</button></div></div>
    <div className="absolute right-4 top-4 z-20 hidden w-[220px] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur lg:block"><p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.14em] text-slate-500"><Layers3 size={13} /> Disaster layers</p><div className="mt-2 max-h-[220px] space-y-1 overflow-y-auto pr-1">{layers.map((layer) => <button key={layer} onClick={() => toggleLayer(layer)} aria-pressed={selectedLayers.includes(layer)} className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-[10px] font-semibold text-slate-600 hover:bg-slate-100"><span className={cn("flex h-3.5 w-3.5 items-center justify-center rounded border", selectedLayers.includes(layer) ? "border-[#337e69] bg-[#337e69] text-white" : "border-slate-300 bg-white")}>{selectedLayers.includes(layer) && <Check size={9} strokeWidth={3} />}</span>{layer}</button>)}</div></div>
    <div className={cn("absolute bottom-16 right-4 z-20 w-[calc(100%-2rem)] max-w-[335px] rounded-xl border border-slate-200 bg-white/95 p-4 shadow-[0_12px_40px_rgba(25,42,50,.15)] backdrop-blur sm:bottom-4", compact ? "block" : "sm:right-5")}><div className="flex items-start justify-between"><div><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-slate-400"><MapPin size={11} /> {selected.hazard} · {selected.district}</p><h3 className="mt-1 text-[16px] font-extrabold tracking-tight text-slate-900">{selected.state}</h3><p className="mt-1 text-[11px] font-semibold text-slate-500">{selected.status} · {selected.date}</p></div><span className="rounded-full px-2 py-1 text-[9px] font-extrabold uppercase" style={{ backgroundColor: `${selected.color}18`, color: selected.color }}>{selected.risk}</span></div><div className="mt-4 grid grid-cols-2 gap-3 border-y border-slate-100 py-3"><div><p className="text-[10px] text-slate-400">Prototype score</p><p className="mt-0.5 text-[18px] font-extrabold text-slate-900">{selected.score}<span className="text-[10px] font-medium text-slate-400"> / 100</span></p></div><div><p className="text-[10px] text-slate-400">Last updated</p><p className="mt-1 text-[10px] font-extrabold text-slate-500">{selected.updated.replace("Demo timestamp · ", "")}</p></div></div><p className="mt-3 flex items-start gap-1.5 text-[10px] leading-4 text-slate-500"><ShieldAlert size={12} className="mt-0.5 shrink-0 text-[#e98b42]" /> {selected.source}. Verify against official emergency instructions.</p></div>
    {showRiskFilters && <div className="absolute left-4 top-[98px] z-20 flex max-w-[calc(100%-2rem)] flex-wrap gap-1.5 sm:left-5">{riskFilters.map((filter) => <span key={filter.label} className="flex items-center gap-1.5 rounded-full border border-white/70 bg-white/80 px-2 py-1 text-[9px] font-bold text-slate-600"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: filter.color }} />{filter.label}</span>)}</div>}
  </div>;
}
