import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import CalculatorsHub from "./pages/CalculatorsHub";
import AnnualLeaveCalculator from "./pages/AnnualLeaveCalculator";
import RetirementCalculator from "./pages/RetirementCalculator";
import GuidesIndex from "./pages/GuidesIndex";
import GuidePage from "./pages/GuidePage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculators" element={<CalculatorsHub />} />
          <Route path="/calculators/annual-leave" element={<AnnualLeaveCalculator />} />
          <Route path="/calculators/severance-pay" element={<RetirementCalculator />} />
          <Route path="/guides" element={<GuidesIndex />} />
          <Route path="/guides/:slug" element={<GuidePage />} />

          <Route path="/annual-leave" element={<Navigate to="/calculators/annual-leave" replace />} />
          <Route path="/retirement" element={<Navigate to="/calculators/severance-pay" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
