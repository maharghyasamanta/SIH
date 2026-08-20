import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CommandCenter from "./pages/CommandCenter";
import Placeholder from "./pages/Placeholder";
import Hospitals from "./pages/Hospitals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/map" element={<Placeholder />} />
          <Route path="/risk" element={<Placeholder />} />
          <Route path="/shelters" element={<Placeholder />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/report" element={<Placeholder />} />
          <Route path="/alerts" element={<Placeholder />} />
          <Route path="/analytics" element={<Placeholder />} />
          <Route path="/resources" element={<Placeholder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
