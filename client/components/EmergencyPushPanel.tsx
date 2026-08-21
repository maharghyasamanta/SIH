import { useState } from "react";
import { AlertTriangle, CheckCircle2, MessageSquare, Send, Users, X } from "lucide-react";
import { emergencyService } from "@/services/api";

export function EmergencyPushPanel({ onClose }: { onClose?: () => void }) {
  const [recipientsInput, setRecipientsInput] = useState("");
  const [message, setMessage] = useState("Emergency alert: Elevated disaster risk detected in Zone 4. Follow official instructions and move toward designated shelters.");
  const [alertType, setAlertType] = useState<"warning" | "emergency" | "evacuation" | "shelter" | "weather">("emergency");
  const [status, setStatus] = useState<"idle" | "sending" | "queued" | "error">("idle");
  const [error, setError] = useState("");

  const recipients = recipientsInput.split(/[\s,;]+/).map((value) => value.trim()).filter(Boolean);

  const sendAlert = async () => {
    setStatus("sending");
    setError("");
    try {
      await emergencyService.queueSms({ recipients, message, alertType });
      setStatus("queued");
    } catch (requestError) {
      setStatus("error");
      setError(requestError instanceof Error ? requestError.message : "SMS provider unavailable.");
    }
  };

  return <div className="rounded-2xl border border-[#e55252]/30 bg-[#1b2026] p-5 shadow-[0_12px_35px_rgba(0,0,0,.16)] sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#ef7470]"><AlertTriangle size={14} /> Emergency push</p><h2 className="mt-2 text-[18px] font-extrabold text-white">Send disaster alert by SMS</h2><p className="mt-1 text-[11px] leading-5 text-slate-400">Notify subscribed responders and residents with an official emergency message.</p></div>{onClose && <button onClick={onClose} className="text-slate-500 hover:text-white" aria-label="Close emergency push"><X size={17} /></button>}</div>{status === "queued" ? <div className="mt-6 rounded-xl border border-[#75c9a6]/30 bg-[#17372f] p-4"><div className="flex items-center gap-2 text-[12px] font-extrabold text-[#9bd3bc]"><CheckCircle2 size={16} /> Alert queued for SMS delivery</div><p className="mt-2 text-[10px] leading-4 text-slate-400">The server accepted the alert for {recipients.length} subscribed recipients.</p><button onClick={() => setStatus("idle")} className="mt-4 text-[10px] font-extrabold text-[#75c9a6]">Send another alert</button></div> : <><label className="mt-5 block text-[10px] font-extrabold uppercase tracking-[.13em] text-slate-400">Recipients<input value={recipientsInput} onChange={(event) => setRecipientsInput(event.target.value)} placeholder="+919876543210, +919812345678" className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#11171c] px-3 text-[11px] font-medium normal-case tracking-normal text-slate-200 outline-none placeholder:text-slate-600 focus:border-[#e55252]" /><span className="mt-1 block text-[9px] font-medium normal-case tracking-normal text-slate-500">Use country code. Separate numbers with commas or spaces.</span></label><div className="mt-4 grid gap-3 sm:grid-cols-[170px_1fr]"><label className="text-[10px] font-extrabold uppercase tracking-[.13em] text-slate-400">Alert type<select value={alertType} onChange={(event) => setAlertType(event.target.value as typeof alertType)} className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#11171c] px-3 text-[11px] font-semibold normal-case tracking-normal text-slate-200 outline-none focus:border-[#e55252]"><option value="emergency">Emergency</option><option value="warning">Warning</option><option value="evacuation">Evacuation</option><option value="shelter">Shelter update</option><option value="weather">Weather warning</option></select></label><div className="flex items-end gap-2 rounded-lg border border-white/10 bg-[#11171c] px-3 py-2.5 text-[11px] text-slate-400"><Users size={15} className="text-[#75c9a6]" /><span><strong className="text-slate-200">{recipients.length} recipients ready</strong><br />Numbers are sent through the server only</span></div></div><label className="mt-4 block text-[10px] font-extrabold uppercase tracking-[.13em] text-slate-400">Message <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={480} className="mt-2 min-h-[95px] w-full resize-none rounded-lg border border-white/10 bg-[#11171c] p-3 text-[12px] font-medium normal-case tracking-normal text-slate-200 outline-none focus:border-[#e55252]" /></label><div className="mt-2 flex justify-between text-[9px] text-slate-500"><span>Replies: HELP · SAVE · RESCUE</span><span>{message.length}/480</span></div>{status === "error" && <p className="mt-3 rounded-lg bg-[#4a2628] p-3 text-[10px] leading-4 text-[#ffaaa5]">{error}</p>}<button onClick={sendAlert} disabled={status === "sending" || message.trim().length < 10 || recipients.length === 0} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#e55252] text-[11px] font-extrabold text-white transition hover:bg-[#d94a4d] disabled:cursor-not-allowed disabled:opacity-50"><Send size={14} /> {status === "sending" ? "Queueing alert" : "Send emergency SMS"}</button><p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[9px] text-slate-500"><MessageSquare size={11} /> Delivery requires MSG91 flow configuration on the server.</p></>}</div>;
}
