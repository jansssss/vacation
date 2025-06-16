import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AnnualLeaveCalculator from "./pages/AnnualLeaveCalculator";
import RetirementCalculator from "./pages/RetirementCalculator";
import Header from "./components/Header";
import SalaryCalculator from "./pages/SalaryCalculator";
import SalaryRankPage from "./pages/salary-rank/SalaryRankPage";
import BitcoinSimulator from "./pages/BitcoinSimulator";
import AuthForm from "./components/AuthForm"; // ✅ 추가
import { supabase } from "./lib/supabaseClient"; // ✅ 추가

function App() {
  const [user, setUser] = useState(null);

  // 로그인 상태 확인
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

        {/* ✅ 로그인 확인이 필요한 페이지 */}
        <Route
          path="/bitcoin-simulator"
          element={user ? <BitcoinSimulator user={user} /> : <AuthForm onLogin={setUser} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
