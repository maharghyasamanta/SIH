import { useState } from "react";
import { BellRing, CheckCircle2, Send, Users, X } from "lucide-react";
import { emergencyService } from "@/services/api";

export function DemoAlertButton() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("Demo alert: Elevated disaster risk detected in Zone 4. Follow official instructions and move toward designated shelters.");
  const [error, setError] = useState("");
  const [subscriberCount, setSubscriberCount] = useState(0);

  const close = () => { setOpen(false); setSent(false); setError(""); };
  const sendDemo = async () => {
    setError("");
    try {
      const result = await emergencyService.sendDemoAlert(message);
      setSubscriberCount(result.subscribers);
      setSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No signed-in mobile subscribers are available.");
    }
  };

  return <><button onClick={() => setOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#f0c9c5] bg-[#fff8f6] px-4 text-[12px] font-extrabold text-[#c34f4e] transition hover:border-[#e55252] hover:bg-[#faeeee]"><BellRing size={15} /> Send demo alert</button>{open && <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#102129]/40 p-4 backdrop-blur-sm sm:items-center"><div role="dialog" aria-modal="true" aria-labelledby="demo-alert-title" className="w-full max-w-[500px] rounded-2xl bg-white p-5 shadow-2xl sm:p-7">{sent ? <div className="py-8 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f5ef] text-[#337e69]"><CheckCircle2 size={27} /></div><h2 className="mt-5 text-[21px] font-extrabold text-slate-900">Demo alert sent</h2><p className="mt-2 text-[12px] leading-5 text-slate-500">Simulated notification delivered to {subscriberCount} signed-in mobile subscriber{subscriberCount === 1 ? "" : "s"}. No SMS provider was called.</p><button onClick={close} className="mt-6 text-[11px] font-extrabold text-[#337e69]">Return to overview</button></div> : <><div className="flex items-start justify-between"><div><p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#e55252]"><BellRing size={13} /> Simulation mode</p><h2 id="demo-alert-title" className="mt-2 text-[24px] font-extrabold tracking-[-.04em] text-slate-900">Send a demo alert</h2><p className="mt-1 text-[12px] text-slate-500">This sends only to mobile numbers that completed ordinary-user sign-in.</p></div><button onClick={close} className="text-slate-400 hover:text-slate-800" aria-label="Close demo alert"><X size={18} /></button></div><div className="mt-6 rounded-xl border border-slate-200 bg-[#f7f9fb] p-4"><div className="flex items-center gap-2 text-[11px] font-bold text-slate-700"><Users size={15} className="text-[#337e69]" /> Signed-in mobile subscribers <span className="ml-auto rounded-full bg-[#e8f5ef] px-2 py-1 text-[9px] font-extrabold uppercase tracking-[.1em] text-[#337e69]">Server registry</span></div></div><label className="mt-4 block text-[10px] font-extrabold uppercase tracking-[.13em] text-slate-500">Message<textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={280} className="mt-2 min-h-[105px] w-full resize-none rounded-lg border border-slate-200 p-3 text-[12px] font-medium normal-case tracking-normal text-slate-700 outline-none focus:border-[#337e69]" /></label><div className="mt-2 flex justify-end text-[9px] text-slate-400">{message.length}/280</div>{error && <p className="mt-3 rounded-lg bg-[#fff3f1] p-3 text-[10px] leading-4 text-[#c34f4e]">{error} Ask users to sign in with their mobile number before sending.</p>}<button onClick={sendDemo} disabled={message.trim().length < 10} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#e55252] text-[12px] font-extrabold text-white transition hover:bg-[#d94a4d] disabled:cursor-not-allowed disabled:opacity-50"><Send size={15} /> Simulate sending alert</button><p className="mt-3 text-center text-[9px] leading-4 text-slate-400">No MSG91 request is made from this Overview demo action.</p></>}</div></div>}</>;
}
