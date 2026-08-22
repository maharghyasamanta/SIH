import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Construction, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { RiskMap } from "@/components/RiskMap";

const copy: Record<string, { eyebrow: string; title: string; detail: string; next: string; href: string }> = {
  "/map": { eyebrow: "Geospatial intelligence", title: "Live disaster map", detail: "Explore risk zones, incident markers, shelters, and hospitals across the demo region.", next: "Open command center", href: "/command-center" },
  "/risk": { eyebrow: "AI risk engine", title: "Risk analysis", detail: "Review explainable risk scores, forecast windows, and the signals shaping each recommendation.", next: "Back to overview", href: "/" },
  "/shelters": { eyebrow: "Preparedness network", title: "Nearby shelters", detail: "Compare capacity, occupancy, facilities, and designated shelter status.", next: "View live map", href: "/map" },
  "/hospitals": { eyebrow: "Emergency care", title: "Hospitals", detail: "Find open emergency hospitals and monitor available beds and ICU capacity.", next: "View live map", href: "/map" },
  "/report": { eyebrow: "Citizen response channel", title: "Report an incident", detail: "Submit a verified observation for authorized response teams to review.", next: "Back to overview", href: "/" },
  "/alerts": { eyebrow: "Official information", title: "Alert center", detail: "Review warnings, shelter updates, road closures, and emergency instructions.", next: "Back to overview", href: "/" },
  "/analytics": { eyebrow: "Response performance", title: "Analytics", detail: "Track risk trends, incident volume, shelter occupancy, and response performance.", next: "Open command center", href: "/command-center" },
  "/resources": { eyebrow: "Response capacity", title: "Emergency resources", detail: "Monitor supplies, rescue teams, vehicles, and AI allocation recommendations.", next: "Open command center", href: "/command-center" },
};

export default function Placeholder() {
  const location = useLocation();
  const item = copy[location.pathname] ?? copy["/map"];
  if (location.pathname === "/map") {
    return <DashboardShell><main className="px-5 py-10 sm:px-10 lg:px-14"><div className="mx-auto max-w-[1240px]"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="section-kicker">Geospatial intelligence</p><h1 className="mt-3 text-[36px] font-extrabold tracking-[-.05em] text-slate-950">India live disaster map</h1><p className="mt-3 max-w-[650px] text-[14px] leading-6 text-slate-500">Explore prototype incident points, hazard overlays, risk scores, and emergency facility markers across India.</p></div><div className="flex items-center gap-2 rounded-lg border border-[#f1d8d4] bg-[#fff8f6] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#c34f4e]"><ShieldCheck size={13} /> Demo data clearly labeled</div></div><div className="mt-8"><RiskMap /></div></div></main></DashboardShell>;
  }
  return <DashboardShell><main className="flex min-h-[calc(100vh-70px)] items-center justify-center px-5 py-16"><div className="max-w-[520px] text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf6f0] text-[#337e69]"><Construction size={25} /></div><p className="section-kicker mt-7">{item.eyebrow}</p><h1 className="mt-3 text-[38px] font-extrabold tracking-[-.05em] text-slate-950">{item.title}</h1><p className="mt-4 text-[15px] leading-7 text-slate-500">{item.detail}</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link to={item.href} className="inline-flex items-center gap-2 rounded-lg bg-[#e55252] px-5 py-3 text-[12px] font-extrabold text-white">{item.next} <ArrowUpRight size={15} /></Link><Link to="/" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-[12px] font-extrabold text-slate-600"><ArrowLeft size={15} /> Overview</Link></div><div className="mt-12 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-slate-400"><ShieldCheck size={13} className="text-[#337e69]" /> Demo data clearly labeled</div></div></main></DashboardShell>;
}
