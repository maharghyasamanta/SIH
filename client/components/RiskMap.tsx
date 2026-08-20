import { useMemo, useState } from "react";
import { Check, Crosshair, Database, Layers3, MapPin, Search, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type IndiaRiskLevel = "Low" | "Moderate" | "High" | "Very High" | "Critical";

type IndiaRegion = { id: string; state: string; context: string; hazard: string; risk: IndiaRiskLevel; score: number; top: string; left: string; color: string };

const regions: IndiaRegion[] = [
  { id: "assam", state: "Assam", context: "Multi-hazard risk context", hazard: "Flooding", risk: "Very High", score: 77, top: "35%", left: "72%", color: "#e98b42" },
  { id: "bihar", state: "Bihar", context: "Multi-hazard risk context", hazard: "Flooding", risk: "High", score: 59, top: "42%", left: "58%", color: "#e4b94b" },
  { id: "kerala", state: "Kerala", context: "Multi-hazard risk context", hazard: "Landslide / flood", risk: "High", score: 52, top: "80%", left: "42%", color: "#e4b94b" },
  { id: "odisha", state: "Odisha", context: "Multi-hazard risk context", hazard: "Cyclone / flood", risk: "Moderate", score: 38, top: "57%", left: "64%", color: "#57a681" },
  { id: "uttarakhand", state: "Uttarakhand", context: "Multi-hazard risk context", hazard: "Landslide", risk: "Very High", score: 71, top: "26%", left: "49%", color: "#e98b42" },
];

const layers = ["Active disasters", "Weather & warnings", "Flood intelligence", "Cyclone tracks", "Earthquake activity", "Landslide susceptibility", "Wildfire hotspots", "Shelters & hospitals", "Disaster risk score"];

const riskFilters: Array<{ label: IndiaRiskLevel; color: string }> = [
  { label: "Critical", color: "#e65353" }, { label: "Very High", color: "#e98b42" }, { label: "High", color: "#e4b94b" }, { label: "Moderate", color: "#57a681" },
];

export function RiskMap({ compact = false }: { compact?: boolean }) {
  const [selectedId, setSelectedId] = useState("assam");
  const [query, setQuery] = useState("");
  const [selectedLayers, setSelectedLayers] = useState(["Active disasters", "Disaster risk score"]);
  const selected = regions.find((region) => region.id === selectedId) ?? regions[0];
  const visibleRegions = useMemo(() => regions.filter((region) => region.state.toLowerCase().includes(query.toLowerCase())), [query]);
  const toggleLayer = (layer: string) => setSelectedLayers((current) => current.includes(layer) ? current.filter((value) => value !== layer) : [...current, layer]);

  return <div className={cn("relative overflow-hidden rounded-2xl border", compact ? "h-[400px] border-white/10" : "h-[640px] border-slate-200")}>
    <div className="india-map-surface absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 620" role="img" aria-label="Illustrative India multi-hazard disaster intelligence map">
        <path d="M360 56 L420 75 L454 112 L495 122 L525 158 L559 170 L574 214 L614 246 L631 291 L610 329 L637 374 L620 414 L589 438 L574 486 L547 526 L519 565 L496 540 L481 490 L454 454 L433 411 L409 372 L384 338 L360 309 L332 273 L300 245 L278 205 L292 168 L313 143 L321 103 Z" fill="rgba(205,221,214,.78)" stroke="#99aea3" strokeWidth="3" />
        <path d="M624 220 L671 196 L722 204 L749 233 L731 257 L692 258 L663 275 Z" fill="rgba(205,221,214,.78)" stroke="#99aea3" strokeWidth="3" />
        <path d="M462 136 L514 155 L540 206 L514 236 L470 220 L437 181 Z" fill="rgba(228,185,75,.22)" stroke="rgba(196,156,54,.55)" strokeWidth="2" />
        <path d="M395 90 L431 104 L451 137 L423 161 L388 142 Z" fill="rgba(233,139,66,.24)" stroke="rgba(211,112,47,.55)" strokeWidth="2" />
        <path d="M566 206 L613 224 L620 265 L592 280 L560 259 Z" fill="rgba(233,139,66,.24)" stroke="rgba(211,112,47,.55)" strokeWidth="2" />
        <path d="M475 434 L522 453 L542 507 L515 538 L486 499 Z" fill="rgba(228,185,75,.22)" stroke="rgba(196,156,54,.55)" strokeWidth="2" />
        <path d="M538 294 C561 300, 571 337, 555 375 C543 399, 535 419, 533 445" fill="none" stroke="rgba(84,151,179,.6)" strokeWidth="5" />
        <path d="M438 90 C455 126, 454 171, 479 210" fill="none" stroke="rgba(84,151,179,.45)" strokeWidth="4" />
        <text x="421" y="277" fill="#657c70" fontSize="12" fontWeight="700" letterSpacing="2">INDIA</text><text x="676" y="237" fill="#657c70" fontSize="10" fontWeight="700" letterSpacing="1">NORTH EAST</text>
      </svg>
      {visibleRegions.map((region) => <button key={region.id} onClick={() => setSelectedId(region.id)} className={cn("map-marker absolute z-10", selectedId === region.id && "is-selected")} style={{ top: region.top, left: region.left, ["--marker-color" as string]: region.color }} aria-label={`Select ${region.state}`}><span className="marker-ring" /><span className="marker-dot" /></button>)}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-white/60 bg-white/85 px-3 py-2 text-[10px] font-bold uppercase tracking-[.11em] text-slate-500 shadow-sm backdrop-blur"><Database size={13} className="text-[#337e69]" /> Prototype map · no verified live feed</div>
    </div>
    <div className="absolute left-4 top-4 z-20 w-[calc(100%-2rem)] sm:left-5 sm:w-auto"><div className="relative w-full sm:w-[255px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search state or district" className="h-10 w-full rounded-lg border border-slate-200 bg-white/95 pl-9 pr-3 text-[12px] font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#337e69]" /></div></div>
    <div className="absolute right-4 top-4 z-20 hidden w-[220px] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur lg:block"><p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.14em] text-slate-500"><Layers3 size={13} /> Disaster layers</p><div className="mt-2 max-h-[220px] space-y-1 overflow-y-auto pr-1">{layers.map((layer) => <button key={layer} onClick={() => toggleLayer(layer)} className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-[10px] font-semibold text-slate-600 hover:bg-slate-100"><span className={cn("flex h-3.5 w-3.5 items-center justify-center rounded border", selectedLayers.includes(layer) ? "border-[#337e69] bg-[#337e69] text-white" : "border-slate-300 bg-white")}>{selectedLayers.includes(layer) && <Check size={9} strokeWidth={3} />}</span>{layer}</button>)}</div></div>
    <div className={cn("absolute bottom-4 right-4 z-20 w-[calc(100%-2rem)] max-w-[325px] rounded-xl border border-slate-200 bg-white/95 p-4 shadow-[0_12px_40px_rgba(25,42,50,.15)] backdrop-blur", compact ? "block" : "sm:right-5")}><div className="flex items-start justify-between"><div><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-slate-400"><MapPin size={11} /> {selected.context}</p><h3 className="mt-1 text-[16px] font-extrabold tracking-tight text-slate-900">{selected.state}</h3><p className="mt-1 text-[11px] font-semibold text-slate-500">Primary hazard context: {selected.hazard}</p></div><span className="rounded-full px-2 py-1 text-[9px] font-extrabold uppercase" style={{ backgroundColor: `${selected.color}18`, color: selected.color }}>{selected.risk}</span></div><div className="mt-4 grid grid-cols-2 gap-3 border-y border-slate-100 py-3"><div><p className="text-[10px] text-slate-400">Prototype score</p><p className="mt-0.5 text-[18px] font-extrabold text-slate-900">{selected.score}<span className="text-[10px] font-medium text-slate-400"> / 100</span></p></div><div><p className="text-[10px] text-slate-400">Live event status</p><p className="mt-1 text-[11px] font-extrabold text-slate-500">Not connected</p></div></div><p className="mt-3 flex items-start gap-1.5 text-[10px] leading-4 text-slate-500"><ShieldAlert size={12} className="mt-0.5 shrink-0 text-[#e98b42]" /> Risk context is illustrative until official hazard, weather, and incident feeds are configured.</p></div>
    <div className="absolute left-4 top-[62px] z-20 flex max-w-[calc(100%-2rem)] flex-wrap gap-1.5 sm:left-5">{riskFilters.map((filter) => <span key={filter.label} className="flex items-center gap-1.5 rounded-full border border-white/70 bg-white/80 px-2 py-1 text-[9px] font-bold text-slate-600"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: filter.color }} />{filter.label}</span>)}</div>
  </div>;
}
