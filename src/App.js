import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AnnualLeaveCalculator from "./pages/AnnualLeaveCalculator";
import RetirementCalculator from "./pages/RetirementCalculator";
import Header from "./components/Header";
import SalaryCalculator from "./pages/SalaryCalculator";
import SalaryRankPage from "./pages/salary-rank/SalaryRankPage";
import BitcoinSimulator from "./pages/BitcoinSimulator";
import XrpXlmCompare from "./pages/XrpXlmCompare"; // ✅ 새 컴포넌트 import
import AuthForm from "./components/AuthForm";
import { supabase } from "./lib/supabaseClient";
// ✅ 관리자 승인 페이지 추가
import ChargeAdmin from "./pages/ChargeAdmin";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/annual-leave" element={<AnnualLeaveCalculator />} />
        <Route path="/retirement" element={<RetirementCalculator />} />
        <Route path="/salary" element={<SalaryCalculator />} />
        <Route path="/salary-rank" element={<SalaryRankPage />} />
        <Route path="/xrp-xlm-compare" element={<XrpXlmCompare />} /> {/* ✅ 새 라우트 추가 */}
        
        {/* 로그인 필요 페이지 */}
        <Route
          path="/bitcoin-simulator"
          element={user ? <BitcoinSimulator user={user} /> : <AuthForm onLogin={setUser} />}
        />
        <Route
          path="/charge-admin"
          element={user ? <ChargeAdmin user={user} /> : <AuthForm onLogin={setUser} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
