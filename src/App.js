import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AnnualLeaveCalculator from "./pages/AnnualLeaveCalculator";
import RetirementCalculator from "./pages/RetirementCalculator";
import Header from "./components/Header";
import SalaryCalculator from "./pages/SalaryCalculator";
import SalaryRankPage from "./pages/salary-rank/SalaryRankPage";
import BitcoinSimulator from "./pages/BitcoinSimulator"; // ✅ 새로 추가

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/annual-leave" element={<AnnualLeaveCalculator />} />
        <Route path="/retirement" element={<RetirementCalculator />} />
        <Route path="/salary" element={<SalaryCalculator />} />
        <Route path="/salary-rank" element={<SalaryRankPage />} />
        <Route path="/bitcoin-simulator" element={<BitcoinSimulator />} /> {/* ✅ 새로 추가 */}
      </Routes>
    </Router>
  );
}

export default App;
