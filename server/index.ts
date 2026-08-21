import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleFloodIntelligence } from "./routes/flood-intelligence";
import { handleFacilities, handleLulcAoi, handleLulcStatistics, handleVillageGeocode, handleVillageReverseGeocode } from "./routes/bhuvan";
import { handleEmergencySms, handleInboundEmergencySms } from "./routes/emergency";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/v1/flood-intelligence/summary", handleFloodIntelligence);
  app.get("/api/v1/bhuvan/facilities", handleFacilities);
  app.get("/api/v1/bhuvan/village/geocode", handleVillageGeocode);
  app.get("/api/v1/bhuvan/village/reverse-geocode", handleVillageReverseGeocode);
  app.get("/api/v1/bhuvan/lulc/statistics", handleLulcStatistics);
  app.get("/api/v1/bhuvan/lulc/aoi", handleLulcAoi);
  app.post("/api/v1/emergency/sms", handleEmergencySms);
  app.post("/api/v1/emergency/sms/inbound", handleInboundEmergencySms);

  return app;
}
