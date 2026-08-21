import { useEffect, useMemo, useState } from "react";
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
];

const layers = ["Active disasters", "Weather & warnings", "Flood intelligence", "Cyclone tracks", "Earthquake activity", "Landslide susceptibility", "Wildfire hotspots", "Shelters & hospitals", "Disaster risk score"];
const riskFilters: Array<{ label: IndiaRiskLevel; color: string }> = [
  { label: "Critical", color: "#e65353" }, { label: "Very High", color: "#e98b42" }, { label: "High", color: "#e4b94b" }, { label: "Moderate", color: "#57a681" },
];

export function RiskMap({ compact = false, period = "current" }: { compact?: boolean; period?: DisasterMapPeriod }) {
  const [selectedId, setSelectedId] = useState("assam-flood");
  const [query, setQuery] = useState("");
  const [selectedLayers, setSelectedLayers] = useState(["Active disasters", "Disaster risk score"]);
  const [mapPeriod, setMapPeriod] = useState<DisasterMapPeriod>(period);
  useEffect(() => setMapPeriod(period), [period]);
  const selected = indiaDisasterEvents.find((event) => event.id === selectedId) ?? indiaDisasterEvents[0];
  const visibleEvents = useMemo(() => indiaDisasterEvents.filter((event) => (mapPeriod === "current" ? event.status === "Active" || event.status === "Monitoring" : true) && `${event.state} ${event.district} ${event.hazard}`.toLowerCase().includes(query.toLowerCase())), [mapPeriod, query]);
  const toggleLayer = (layer: string) => setSelectedLayers((current) => current.includes(layer) ? current.filter((value) => value !== layer) : [...current, layer]);

  return <div className={cn("relative overflow-hidden rounded-2xl border", compact ? "h-[400px] border-white/10" : "h-[640px] border-slate-200")}>
    <div className="india-map-surface absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" viewBox="240 20 560 570" preserveAspectRatio="xMidYMid meet" role="img" aria-label="India disaster intelligence map with prototype current disaster markers">
        <path d="M307 70 L350 52 L395 64 L426 87 L464 95 L493 120 L526 127 L550 150 L586 166 L604 195 L632 215 L639 245 L670 263 L686 291 L672 321 L685 352 L670 378 L644 397 L635 431 L613 450 L602 484 L577 509 L557 545 L536 568 L514 544 L499 509 L476 483 L454 448 L438 412 L417 378 L397 348 L374 320 L344 296 L322 269 L294 247 L274 216 L267 181 L281 150 L291 117 Z" fill="rgba(205,221,214,.8)" stroke="#80998c" strokeWidth="3" strokeLinejoin="round" />
        <path d="M639 216 L675 191 L716 197 L748 217 L780 243 L770 265 L739 271 L708 259 L678 273 L658 254 Z" fill="rgba(205,221,214,.8)" stroke="#80998c" strokeWidth="3" strokeLinejoin="round" />
        <path d="M422 87 L461 95 L486 120 L466 145 L433 140 L401 116 Z" fill="rgba(233,139,66,.18)" stroke="rgba(211,112,47,.46)" strokeWidth="2" />
        <path d="M478 146 L522 156 L544 193 L530 226 L488 220 L460 185 Z" fill="rgba(228,185,75,.16)" stroke="rgba(196,156,54,.46)" strokeWidth="2" />
        <path d="M570 216 L616 225 L631 258 L610 280 L572 266 L551 241 Z" fill="rgba(233,139,66,.16)" stroke="rgba(211,112,47,.46)" strokeWidth="2" />
        <path d="M486 430 L524 440 L550 478 L540 523 L516 550 L493 516 L478 478 Z" fill="rgba(228,185,75,.16)" stroke="rgba(196,156,54,.46)" strokeWidth="2" />
        <path d="M546 289 C568 306 574 336 562 365 C550 394 538 420 535 451" fill="none" stroke="rgba(84,151,179,.65)" strokeWidth="5" strokeLinecap="round" />
        <path d="M423 89 C442 121 446 160 466 190" fill="none" stroke="rgba(84,151,179,.42)" strokeWidth="4" strokeLinecap="round" />
        <path d="M300 240 L390 300 L472 392 M376 97 L440 210 L535 278 M605 195 L570 290 L590 410" fill="none" stroke="rgba(122,147,136,.3)" strokeWidth="1.5" strokeDasharray="6 6" />
        <text x="426" y="294" fill="#557064" fontSize="15" fontWeight="800" letterSpacing="3">INDIA</text><text x="676" y="232" fill="#557064" fontSize="10" fontWeight="700" letterSpacing="1.5">NORTH EAST</text><text x="295" y="354" fill="#789084" fontSize="9" fontWeight="700" letterSpacing="1">ARABIAN SEA</text><text x="628" y="395" fill="#789084" fontSize="9" fontWeight="700" letterSpacing="1">BAY OF BENGAL</text>
      </svg>
      {visibleEvents.map((event) => <button key={event.id} onClick={() => setSelectedId(event.id)} className={cn("map-marker absolute z-10", selectedId === event.id && "is-selected")} style={{ top: event.top, left: event.left, ["--marker-color" as string]: event.color }} aria-label={`Select ${event.hazard} in ${event.state}`}><span className="marker-ring" /><span className="marker-dot" /></button>)}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-white/60 bg-white/85 px-3 py-2 text-[10px] font-bold uppercase tracking-[.11em] text-slate-500 shadow-sm backdrop-blur"><Database size={13} className="text-[#337e69]" /> Prototype events · source feeds not connected</div>
    </div>
    <div className="absolute left-4 top-4 z-20 w-[calc(100%-2rem)] sm:left-5 sm:w-auto"><div className="relative w-full sm:w-[255px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search state, district, hazard" className="h-10 w-full rounded-lg border border-slate-200 bg-white/95 pl-9 pr-3 text-[12px] font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#337e69]" /></div><div className="mt-2 flex w-fit rounded-lg border border-slate-200 bg-white/95 p-1 shadow-sm"><button onClick={() => setMapPeriod("current")} className={cn("rounded-md px-3 py-2 text-[10px] font-extrabold", mapPeriod === "current" ? "bg-slate-900 text-white" : "text-slate-500")}>Current</button><button onClick={() => setMapPeriod("last7")} className={cn("rounded-md px-3 py-2 text-[10px] font-extrabold", mapPeriod === "last7" ? "bg-slate-900 text-white" : "text-slate-500")}>Last 7 days</button></div></div>
    <div className="absolute right-4 top-4 z-20 hidden w-[220px] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur lg:block"><p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.14em] text-slate-500"><Layers3 size={13} /> Disaster layers</p><div className="mt-2 max-h-[220px] space-y-1 overflow-y-auto pr-1">{layers.map((layer) => <button key={layer} onClick={() => toggleLayer(layer)} className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-[10px] font-semibold text-slate-600 hover:bg-slate-100"><span className={cn("flex h-3.5 w-3.5 items-center justify-center rounded border", selectedLayers.includes(layer) ? "border-[#337e69] bg-[#337e69] text-white" : "border-slate-300 bg-white")}>{selectedLayers.includes(layer) && <Check size={9} strokeWidth={3} />}</span>{layer}</button>)}</div></div>
    <div className={cn("absolute bottom-16 right-4 z-20 w-[calc(100%-2rem)] max-w-[335px] rounded-xl border border-slate-200 bg-white/95 p-4 shadow-[0_12px_40px_rgba(25,42,50,.15)] backdrop-blur sm:bottom-4", compact ? "block" : "sm:right-5")}><div className="flex items-start justify-between"><div><p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-slate-400"><MapPin size={11} /> {selected.hazard} · {selected.district}</p><h3 className="mt-1 text-[16px] font-extrabold tracking-tight text-slate-900">{selected.state}</h3><p className="mt-1 text-[11px] font-semibold text-slate-500">{selected.status} · {selected.date}</p></div><span className="rounded-full px-2 py-1 text-[9px] font-extrabold uppercase" style={{ backgroundColor: `${selected.color}18`, color: selected.color }}>{selected.risk}</span></div><div className="mt-4 grid grid-cols-2 gap-3 border-y border-slate-100 py-3"><div><p className="text-[10px] text-slate-400">Prototype score</p><p className="mt-0.5 text-[18px] font-extrabold text-slate-900">{selected.score}<span className="text-[10px] font-medium text-slate-400"> / 100</span></p></div><div><p className="text-[10px] text-slate-400">Last updated</p><p className="mt-1 text-[10px] font-extrabold text-slate-500">{selected.updated.replace("Demo timestamp · ", "")}</p></div></div><p className="mt-3 flex items-start gap-1.5 text-[10px] leading-4 text-slate-500"><ShieldAlert size={12} className="mt-0.5 shrink-0 text-[#e98b42]" /> {selected.source}. Verify against official emergency instructions.</p></div>
    <div className="absolute left-4 top-[98px] z-20 flex max-w-[calc(100%-2rem)] flex-wrap gap-1.5 sm:left-5">{riskFilters.map((filter) => <span key={filter.label} className="flex items-center gap-1.5 rounded-full border border-white/70 bg-white/80 px-2 py-1 text-[9px] font-bold text-slate-600"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: filter.color }} />{filter.label}</span>)}</div>
  </div>;
}
