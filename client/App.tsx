import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/RouteGuards";
import CommandCenter from "./pages/CommandCenter";
import Hospitals from "./pages/Hospitals";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import RiskAnalysis from "./pages/RiskAnalysis";
import SignIn from "./pages/SignIn";

const queryClient = new QueryClient();
const protectedPage = (element: React.ReactNode) => <ProtectedRoute>{element}</ProtectedRoute>;
const adminPage = (element: React.ReactNode) => <ProtectedRoute role="admin">{element}</ProtectedRoute>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={protectedPage(<Index />)} />
          <Route path="/map" element={protectedPage(<Placeholder />)} />
          <Route path="/risk" element={protectedPage(<RiskAnalysis />)} />
          <Route path="/shelters" element={protectedPage(<Placeholder />)} />
          <Route path="/hospitals" element={protectedPage(<Hospitals />)} />
          <Route path="/report" element={protectedPage(<Placeholder />)} />
          <Route path="/alerts" element={protectedPage(<Placeholder />)} />
          <Route path="/command-center" element={adminPage(<CommandCenter />)} />
          <Route path="/analytics" element={adminPage(<Placeholder />)} />
          <Route path="/resources" element={adminPage(<Placeholder />)} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
