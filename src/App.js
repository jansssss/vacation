import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
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
import AdminLogin from "./pages/admin/AdminLogin";
import AdminGuides from "./pages/admin/AdminGuides";
import AdminBoard from "./pages/admin/AdminBoard";
import AdminGuideEditor from "./pages/admin/AdminGuideEditor";
import AdminBoardEditor from "./pages/admin/AdminBoardEditor";
import NetSalaryCalculator from "./pages/NetSalaryCalculator";
import RetirementPensionCalculator from "./pages/RetirementPensionCalculator";
import NetSalaryLanding from "./pages/landing/NetSalaryLanding";
import AnnualLeaveLanding from "./pages/landing/AnnualLeaveLanding";
import RetirementLanding from "./pages/landing/RetirementLanding";
import RetirementPensionLanding from "./pages/landing/RetirementPensionLanding";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Admin Routes (without Layout) */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/guides"
            element={
              <PrivateRoute>
                <AdminGuides />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/guides/new"
            element={
              <PrivateRoute>
                <AdminGuideEditor />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/guides/edit/:id"
            element={
              <PrivateRoute>
                <AdminGuideEditor />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/board"
            element={
              <PrivateRoute>
                <AdminBoard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/board/new"
            element={
              <PrivateRoute>
                <AdminBoardEditor />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/board/edit/:id"
            element={
              <PrivateRoute>
                <AdminBoardEditor />
              </PrivateRoute>
            }
          />

          {/* Public Routes (with Layout) */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/calculators" element={<CalculatorsHub />} />
                  <Route path="/calculators/annual-leave" element={<AnnualLeaveCalculator />} />
                  <Route path="/calculators/severance-pay" element={<RetirementCalculator />} />
                  <Route path="/calculators/retirement-pension" element={<RetirementPensionCalculator />} />
                  <Route path="/calculators/net-salary" element={<NetSalaryCalculator />} />
                  <Route path="/net-salary/:bucket" element={<NetSalaryLanding />} />
                  <Route path="/annual-leave/join-month/:month" element={<AnnualLeaveLanding />} />
                  <Route path="/retirement/tenure/:tenure" element={<RetirementLanding />} />
                  <Route path="/retirement-pension/scenario/:scenario" element={<RetirementPensionLanding />} />
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
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
