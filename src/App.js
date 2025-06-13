import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AnnualLeaveCalculator from "./pages/AnnualLeaveCalculator";
import RetirementCalculator from "./pages/RetirementCalculator";
import Header from "./components/Header";
import SalaryCalculator from "./pages/SalaryCalculator";


function App() {
  return (
    <Router>
      <Header /> {/* ✅ 여기에 항상 표시 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/annual-leave" element={<AnnualLeaveCalculator />} />
        <Route path="/retirement" element={<RetirementCalculator />} />
        <Route path="/salary" element={<SalaryCalculator />} />
      </Routes>
    </Router>
  );
}

export default App;
