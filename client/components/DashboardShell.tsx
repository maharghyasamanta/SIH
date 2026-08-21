import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Activity, BarChart3, Bell, Building2, ChevronRight, Command, Home, Map, Menu, Package, ShieldCheck, Siren, Users, X } from "lucide-react";
import { DemoAlertButton } from "@/components/DemoAlertButton";
import { NotificationPanel } from "@/components/NotificationPanel";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Overview", href: "/", icon: Home },
  { label: "Live map", href: "/map", icon: Map },
  { label: "Risk analysis", href: "/risk", icon: Activity },
  { label: "Shelters", href: "/shelters", icon: ShieldCheck },
  { label: "Hospitals", href: "/hospitals", icon: Building2 },
  { label: "Report incident", href: "/report", icon: Siren },
  { label: "Alerts", href: "/alerts", icon: Bell },
];

export function DashboardShell({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className={cn("min-h-screen", dark ? "bg-[#0b1117] text-white" : "bg-[#f7f9fb] text-slate-950")}>
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-[248px] -translate-x-full flex-col border-r transition-transform lg:translate-x-0", open && "translate-x-0", dark ? "border-white/8 bg-[#101820]" : "border-slate-200 bg-white")}>
        <div className="flex h-[82px] items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e55252] text-white shadow-[0_6px_18px_rgba(229,82,82,.22)]"><Activity size={19} strokeWidth={2.5} /></span>
            <span><span className={cn("block text-[15px] font-extrabold tracking-tight", dark ? "text-white" : "text-slate-950")}>Disaster<span className="text-[#e55252]">AI</span></span><span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[.22em] text-slate-400">Civic intelligence</span></span>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={20} /></button>
        </div>
        <div className="px-4 pb-5"><div className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-[.15em]", dark ? "bg-[#18242d] text-[#74c5a5]" : "bg-[#f2f7f6] text-[#337e69]")}><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#50b38d]" /> Demo mode · illustrative data</div></div>
        <nav className="flex-1 space-y-1 px-3">
          <p className={cn("mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em]", dark ? "text-slate-500" : "text-slate-400")}>Public access</p>
          {navigation.map((item) => {
            const active = item.href === "/" ? location.pathname === "/" : location.pathname.startsWith(item.href);
            const Icon = item.icon;
            return <Link key={item.href} to={item.href} onClick={() => setOpen(false)} className={cn("group flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-semibold transition", active ? (dark ? "bg-[#24333c] text-white" : "bg-[#f0f4f5] text-slate-950") : (dark ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"))}><span className="flex items-center gap-3"><Icon size={17} strokeWidth={1.8} />{item.label}</span>{active && <span className="h-1.5 w-1.5 rounded-full bg-[#e55252]" />}</Link>;
          })}
          <div className="px-3 py-3"><DemoAlertButton /></div>
          <p className={cn("mb-3 mt-5 px-3 text-[10px] font-bold uppercase tracking-[.18em]", dark ? "text-slate-500" : "text-slate-400")}>Authority workspace</p>
          <Link to="/command-center" onClick={() => setOpen(false)} className={cn("group flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-semibold transition", location.pathname === "/command-center" ? "bg-[#e55252] text-white" : (dark ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"))}><span className="flex items-center gap-3"><Command size={17} strokeWidth={1.8} />Command center</span><ChevronRight size={14} /></Link>
          <Link to="/analytics" onClick={() => setOpen(false)} className={cn("group flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-semibold transition", dark ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-950")}><span className="flex items-center gap-3"><BarChart3 size={17} strokeWidth={1.8} />Analytics</span><ChevronRight size={14} /></Link>
          <Link to="/resources" onClick={() => setOpen(false)} className={cn("group flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-semibold transition", dark ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-950")}><span className="flex items-center gap-3"><Package size={17} strokeWidth={1.8} />Resources</span><ChevronRight size={14} /></Link>
        </nav>
        <div className={cn("m-4 rounded-xl p-4", dark ? "bg-[#18242d]" : "bg-[#f5f7f8]")}><div className="mb-3 flex items-center gap-2"><Users size={15} className={dark ? "text-[#73c6a6]" : "text-[#337e69"} /><span className="text-[11px] font-bold uppercase tracking-[.12em] text-slate-400">India response network</span></div><p className={cn("text-[12px] leading-5", dark ? "text-slate-300" : "text-slate-600")}>Connected to 48 field teams across the India demo network.</p><div className="mt-3 flex -space-x-2"><span className="avatar bg-[#d8a57c]">AR</span><span className="avatar bg-[#719e96]">VS</span><span className="avatar bg-[#8f7cae]">NK</span><span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[9px] font-bold text-slate-600">+45</span></div></div>
      </aside>
      <div className="lg:pl-[248px]">
        <header className={cn("sticky top-0 z-40 flex h-[70px] items-center justify-between border-b px-4 sm:px-8", dark ? "border-white/8 bg-[#0b1117]/95 backdrop-blur" : "border-slate-200 bg-white/95 backdrop-blur")}>
          <button className={cn("rounded-lg p-2 lg:hidden", dark ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100")} onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div className="hidden items-center gap-2 text-[11px] font-semibold text-slate-400 sm:flex"><span className="h-2 w-2 rounded-full bg-[#4fb489]" /> System operational <span className="mx-2 text-slate-300">/</span> Last synced 2 min ago</div>
          <div className="ml-auto flex items-center gap-3"><div className="relative"><button onClick={() => setNotificationsOpen((current) => !current)} aria-label="Open recent disaster notifications" aria-expanded={notificationsOpen} className={cn("relative rounded-lg p-2 transition", dark ? "text-slate-400 hover:bg-white/10 hover:text-white" : "text-slate-500 hover:bg-slate-100")}><Bell size={18} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#e55252]" /></button>{notificationsOpen && <NotificationPanel dark={dark} onClose={() => setNotificationsOpen(false)} />}</div><div className={cn("hidden h-7 w-px sm:block", dark ? "bg-white/10" : "bg-slate-200")} /><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#213842] text-[11px] font-bold text-[#a8d3c4]">AK</span><div className="hidden text-left sm:block"><p className={cn("text-[11px] font-bold", dark ? "text-white" : "text-slate-800")}>Aarav Kapoor</p><p className="text-[10px] text-slate-400">Response lead</p></div></div></div>
        </header>
        {children}
      </div>
    </div>
  );
}
