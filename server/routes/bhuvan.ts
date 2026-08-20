import { RequestHandler } from "express";
import { z } from "zod";
import { geocodeVillage, getLulcAoi, getLulcStatistics, getNearbyFacilities, reverseGeocodeVillage } from "../bhuvan/client";

const coordinates = z.object({ lat: z.coerce.number().finite().min(-90).max(90), lon: z.coerce.number().finite().min(-180).max(180) });
const sendBoundaryError = (res: Parameters<RequestHandler>[1]) => res.status(400).json({ error: "Invalid location or query parameters." });
const sendUpstreamError = (res: Parameters<RequestHandler>[1]) => res.status(503).json({ error: "Bhuvan service unavailable. Showing the latest available data." });

export const handleFacilities: RequestHandler = async (req, res) => {
  const parsed = coordinates.extend({ buffer: z.coerce.number().int().min(1).max(50000).default(5000), theme: z.enum(["hospital", "postal", "all"]).default("hospital") }).safeParse(req.query);
  if (!parsed.success) return sendBoundaryError(res);
  try { return res.json({ facilities: await getNearbyFacilities(parsed.data) }); } catch { return sendUpstreamError(res); }
};

export const handleVillageGeocode: RequestHandler = async (req, res) => {
  const parsed = z.object({ village: z.string().trim().min(2).max(120) }).safeParse(req.query);
  if (!parsed.success) return sendBoundaryError(res);
  try { return res.json({ results: await geocodeVillage(parsed.data.village) }); } catch { return sendUpstreamError(res); }
};

export const handleVillageReverseGeocode: RequestHandler = async (req, res) => {
  const parsed = coordinates.safeParse(req.query);
  if (!parsed.success) return sendBoundaryError(res);
  try { return res.json({ results: await reverseGeocodeVillage(parsed.data.lat, parsed.data.lon) }); } catch { return sendUpstreamError(res); }
};

export const handleLulcStatistics: RequestHandler = async (req, res) => {
  const parsed = z.object({ year: z.enum(["0506", "1112"]), statcode: z.string().trim().optional(), distcode: z.string().trim().optional() }).refine((value) => Boolean(value.statcode || value.distcode)).safeParse(req.query);
  if (!parsed.success) return sendBoundaryError(res);
  try { return res.json(await getLulcStatistics(parsed.data)); } catch { return sendUpstreamError(res); }
};

export const handleLulcAoi: RequestHandler = async (req, res) => {
  const parsed = z.object({ geom: z.string().trim().min(20).max(20000).refine((value) => value.toUpperCase().startsWith("POLYGON((") && value.endsWith("))")) }).safeParse(req.query);
  if (!parsed.success) return sendBoundaryError(res);
  try { return res.json(await getLulcAoi(parsed.data.geom)); } catch { return sendUpstreamError(res); }
};
