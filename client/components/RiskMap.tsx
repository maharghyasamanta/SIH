import { useMemo, useState } from "react";
import { Crosshair, Layers3, MapPin, Search, X } from "lucide-react";
import { riskZones, type RiskLevel } from "@/data/demo";
import { cn } from "@/lib/utils";

const filters: Array<{ label: RiskLevel; color: string }> = [
  { label: "Critical", color: "#e65353" },
  { label: "High", color: "#e98b42" },
  { label: "Moderate", color: "#e4b94b" },
  { label: "Low", color: "#57a681" },
];

export function RiskMap({ compact = false }: { compact?: boolean }) {
  const [activeRisk, setActiveRisk] = useState<RiskLevel | "All">("All");
  const [selectedId, setSelectedId] = useState("zone-4");
  const [query, setQuery] = useState("");
  const selectedZone = riskZones.find((zone) => zone.id === selectedId) ?? riskZones[0];
  const visibleZones = useMemo(() => riskZones.filter((zone) => (activeRisk === "All" || zone.risk === activeRisk) && zone.name.toLowerCase().includes(query.toLowerCase())), [activeRisk, query]);

  return <div className={cn("relative overflow-hidden rounded-2xl border", compact ? "h-[380px] border-white/10" : "h-[620px] border-slate-200")}>
    <div className="map-surface absolute inset-0">
      <div className="map-water water-one" /><div className="map-water water-two" /><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" />
      <div className="map-label label-one">RIVERSIDE</div><div className="map-label label-two">OLD TOWN</div><div className="map-label label-three">NORTH RIDGE</div><div className="map-label label-four">INDUSTRIAL BELT</div>
      {visibleZones.map((zone) => <button key={zone.id} onClick={() => setSelectedId(zone.id)} className={cn("map-marker absolute z-10", selectedId === zone.id && "is-selected")} style={{ top: zone.coordinates.top, left: zone.coordinates.left, ["--marker-color" as string]: zone.color }} aria-label={`Select ${zone.name}`}><span className="marker-ring" /><span className="marker-dot" /></button>)}
      <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-lg border border-white/60 bg-white/85 px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-slate-500 shadow-sm backdrop-blur"><Crosshair size={13} className="text-[#337e69]" /> Demo Region · 17.4° N, 78.4° E</div>
    </div>
    <div className="absolute left-4 right-4 top-4 flex flex-col gap-3 sm:left-5 sm:right-5 sm:flex-row sm:items-start sm:justify-between"><div className="relative w-full max-w-[260px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search zone or location" className="h-10 w-full rounded-lg border border-slate-200 bg-white/95 pl-9 pr-3 text-[12px] font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#337e69]" /></div><div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white/95 p-1 shadow-sm"><button onClick={() => setActiveRisk("All")} className={cn("rounded-md px-3 py-2 text-[10px] font-bold", activeRisk === "All" ? "bg-slate-900 text-white" : "text-slate-500")}>All</button>{filters.map((filter) => <button key={filter.label} onClick={() => setActiveRisk(filter.label)} className={cn("flex items-center gap-1.5 rounded-md px-2 py-2 text-[10px] font-bold", activeRisk === filter.label ? "bg-slate-100 text-slate-900" : "text-slate-500")}><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: filter.color }} />{filter.label}</button>)}</div></div>
    {!compact && <div className="absolute bottom-5 right-5 flex flex-col gap-1 rounded-lg border border-slate-200 bg-white/95 p-1 shadow-sm"><button className="flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-900"><Layers3 size={15} /></button><button className="flex h-8 w-8 items-center justify-center border-t border-slate-100 text-slate-500 hover:text-slate-900"><Crosshair size={15} /></button></div>}
    <div className={cn("absolute bottom-5 right-5 w-[calc(100%-2rem)] max-w-[310px] rounded-xl border border-slate-200 bg-white/95 p-4 shadow-[0_12px_40px_rgba(25,42,50,.15)] backdrop-blur", compact ? "block" : "sm:right-14")}><div className="flex items-start justify-between"><div><div className="mb-1 flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: selectedZone.color }} /><span className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">{selectedZone.type}</span></div><h3 className="text-[15px] font-extrabold tracking-tight text-slate-900">{selectedZone.name}</h3></div><button onClick={() => setSelectedId("")} className="text-slate-400 hover:text-slate-900"><X size={15} /></button></div><div className="mt-4 grid grid-cols-2 gap-3 border-y border-slate-100 py-3"><div><p className="text-[10px] font-medium text-slate-400">Risk score</p><p className="mt-0.5 text-[17px] font-extrabold text-slate-900">{selectedZone.score}<span className="text-[11px] text-slate-400">/100</span></p></div><div><p className="text-[10px] font-medium text-slate-400">At risk</p><p className="mt-0.5 text-[17px] font-extrabold text-slate-900">{selectedZone.population}</p></div></div><div className="flex items-center justify-between"><span className="rounded-full px-2 py-1 text-[10px] font-extrabold uppercase" style={{ backgroundColor: `${selectedZone.color}18`, color: selectedZone.color }}>{selectedZone.risk} risk</span><span className="flex items-center gap-1 text-[11px] font-semibold text-[#337e69]"><MapPin size={12} /> 2.4 km to shelter</span></div></div>
  </div>;
}
