const MSG91_URL = process.env.MSG91_API_URL ?? "https://control.msg91.com/api/v5/flow";

export function isMsg91Configured() {
  return Boolean(process.env.MSG91_AUTH_KEY && process.env.MSG91_FLOW_ID && process.env.MSG91_SENDER_ID);
}

export async function queueEmergencySms(recipients: string[], message: string, alertType: string) {
  if (!isMsg91Configured()) throw new Error("MSG91 is not configured");

  const response = await fetch(MSG91_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      authkey: process.env.MSG91_AUTH_KEY!,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      template_id: process.env.MSG91_FLOW_ID,
      sender: process.env.MSG91_SENDER_ID,
      short_url: "0",
      recipients: recipients.map((mobile) => ({ mobiles: mobile.replace(/^\+/, ""), alert_type: alertType, message })),
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) throw new Error(`MSG91 request failed: ${response.status}`);
  return { queued: true, recipients: recipients.length };
}

export function classifyInboundKeyword(message: string) {
  const keyword = message.trim().split(/\s+/)[0]?.toUpperCase();
  if (keyword === "HELP") return { keyword, action: "request_assistance", reply: "DisasterAI: Help request received. Share your location and immediate need with the official response team." };
  if (keyword === "SAVE") return { keyword, action: "request_shelter", reply: "DisasterAI: Shelter assistance request received. Follow official shelter instructions and share your location." };
  if (keyword === "RESCUE") return { keyword, action: "request_rescue", reply: "DisasterAI: Rescue request received. Share your location and number of people needing help." };
  return { keyword: keyword ?? "UNKNOWN", action: "unrecognized", reply: "DisasterAI: Reply HELP, SAVE, or RESCUE for emergency assistance options." };
}
