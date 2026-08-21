import { RequestHandler } from "express";
import { z } from "zod";
import { classifyInboundKeyword, isMsg91Configured, queueEmergencySms } from "../services/msg91";

const emergencyAlertSchema = z.object({
  recipients: z.array(z.string().trim().regex(/^\+?[1-9]\d{9,14}$/)).min(1).max(1000),
  message: z.string().trim().min(10).max(480),
  alertType: z.enum(["warning", "emergency", "evacuation", "shelter", "weather"]).default("emergency"),
});

export const handleEmergencySms: RequestHandler = async (req, res) => {
  const parsed = emergencyAlertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Provide valid recipients, alert type, and a message under 480 characters." });
  if (!isMsg91Configured()) return res.status(503).json({ error: "SMS provider is not configured. Add the server-side MSG91 flow settings before sending." });
  try {
    const result = await queueEmergencySms(parsed.data.recipients, parsed.data.message, parsed.data.alertType);
    return res.status(202).json({ status: "queued", ...result });
  } catch {
    return res.status(502).json({ error: "SMS provider unavailable. No delivery confirmation was received." });
  }
};

const inboundSchema = z.object({
  message: z.string().trim().max(280).optional(),
  text: z.string().trim().max(280).optional(),
  mobile: z.string().trim().optional(),
  from: z.string().trim().optional(),
}).refine((value) => Boolean(value.message || value.text), { message: "SMS message is required." });

export const handleInboundEmergencySms: RequestHandler = (req, res) => {
  const parsed = inboundSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "SMS message is required." });
  const message = parsed.data.message ?? parsed.data.text ?? "";
  const result = classifyInboundKeyword(message);
  return res.status(200).json({ received: true, sender: parsed.data.mobile ?? parsed.data.from ?? null, ...result });
};
