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
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import BoardList from "./pages/BoardList";
import BoardDetail from "./pages/BoardDetail";
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
          <Route path="/board" element={<BoardList />} />
          <Route path="/board/:slug" element={<BoardDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/disclaimer" element={<Disclaimer />} />

          <Route path="/annual-leave" element={<Navigate to="/calculators/annual-leave" replace />} />
          <Route path="/retirement" element={<Navigate to="/calculators/severance-pay" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
